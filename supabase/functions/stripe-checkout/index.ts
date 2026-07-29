// Supabase Edge Function: creates a booking (pending_payment) + intake form, then
// a Stripe Checkout Session. Booking is NOT confirmed here — only the webhook
// (stripe-webhook function) flips status to "booked" on payment success.

import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

// Server-side source of truth for Guided Session pricing (mirrors src/data/content.ts).
// Keep in sync manually — this Edge Function runs in Deno and doesn't share the Vite build.
const PACKAGES: Record<string, { name: string; cents: number }> = {
  base: { name: 'Guided Interview Session', cents: 60000 },
}

const ADDONS: Record<string, { name: string; cents: number }> = {
  mail_in_digitizing: { name: 'Mail-In Digitizing', cents: 15000 },
  extra_runtime: { name: 'Extra Runtime / Second Session', cents: 20000 },
  rush_editing: { name: 'Rush Editing Turnaround', cents: 15000 },
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const {
      packageType,
      addons = [],
      slotId,
      scheduledAt,
      clientEmail,
      origin,
      intake,
    }: {
      packageType: string
      addons: string[]
      slotId: string
      scheduledAt: string
      clientEmail: string
      origin: string
      intake: {
        storytellerName: string
        relationship: string
        bestContact?: string
        topics?: string
        sensitiveTopics?: string
        preferredLanguage?: string
      }
    } = body

    const pkg = PACKAGES[packageType]
    if (!pkg) throw new Error('Unknown package type')
    if (!clientEmail || !slotId || !scheduledAt) throw new Error('Missing required fields')

    const { data: slot, error: slotError } = await supabaseAdmin
      .from('availability_slots')
      .select('id, is_booked')
      .eq('id', slotId)
      .single()
    if (slotError || !slot) throw new Error('Slot not found')
    if (slot.is_booked) throw new Error('That time slot has already been booked')

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        client_email: clientEmail,
        package_type: packageType,
        addons,
        scheduled_at: scheduledAt,
        slot_id: slotId,
        status: 'pending_payment',
      })
      .select()
      .single()
    if (bookingError || !booking) throw new Error(bookingError?.message || 'Could not create booking')

    const { error: intakeError } = await supabaseAdmin.from('intake_forms').insert({
      booking_id: booking.id,
      storyteller_name: intake.storytellerName,
      relationship: intake.relationship,
      best_contact: intake.bestContact ?? null,
      topics: intake.topics ?? null,
      sensitive_topics: intake.sensitiveTopics ?? null,
      preferred_language: intake.preferredLanguage ?? null,
    })
    if (intakeError) throw new Error(intakeError.message)

    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: pkg.name },
          unit_amount: pkg.cents,
        },
        quantity: 1,
      },
      ...addons.map((id: string) => {
        const addon = ADDONS[id]
        if (!addon) throw new Error(`Unknown addon: ${id}`)
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: addon.name },
            unit_amount: addon.cents,
          },
          quantity: 1,
        }
      }),
    ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: clientEmail,
      line_items: lineItems,
      success_url: `${origin}/guided-session/success?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guided-session/book?canceled=1`,
      metadata: { booking_id: booking.id },
    })

    await supabaseAdmin
      .from('bookings')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', booking.id)

    return new Response(JSON.stringify({ url: session.url, bookingId: booking.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
