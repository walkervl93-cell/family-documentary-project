// Supabase Edge Function: Stripe webhook. This is the SINGLE source of truth for
// confirming a Guided Session booking — the client-side success redirect never
// confirms payment on its own. Idempotent via the stripe_events table.

import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret)
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err}`, { status: 400 })
  }

  // Idempotency: record the event id first; if it already exists, we've handled it.
  const { error: insertError } = await supabaseAdmin
    .from('stripe_events')
    .insert({ id: event.id })
  if (insertError) {
    // unique_violation means we've already processed this event
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.booking_id
    if (bookingId) {
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('slot_id')
        .eq('id', bookingId)
        .single()

      await supabaseAdmin
        .from('bookings')
        .update({
          status: 'booked',
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          amount_paid: session.amount_total != null ? session.amount_total / 100 : null,
        })
        .eq('id', bookingId)

      if (booking?.slot_id) {
        await supabaseAdmin
          .from('availability_slots')
          .update({ is_booked: true })
          .eq('id', booking.slot_id)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
