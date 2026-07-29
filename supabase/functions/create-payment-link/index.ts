// Admin-only Edge Function: after a free consult call, an admin sets an amount
// here and this creates a Stripe Checkout Session (a one-time payment link) for
// that booking. Reuses the existing stripe-webhook handler — it already flips
// bookings to "booked" on checkout.session.completed via metadata.booking_id,
// regardless of whether the session came from here or (previously) the old
// at-booking checkout flow.

import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    // Verify the caller is an admin by respecting RLS with their own JWT —
    // this only lets them read their own profile row, which is all we need.
    const supabaseAsCaller = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const {
      data: { user },
    } = await supabaseAsCaller.auth.getUser()
    if (!user) throw new Error('Not signed in')

    const { data: profile } = await supabaseAsCaller
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') throw new Error('Admin access required')

    const { bookingId, amountCents, description, origin } = await req.json()
    if (!bookingId || !amountCents || amountCents <= 0) {
      throw new Error('Missing or invalid bookingId/amountCents')
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, client_email')
      .eq('id', bookingId)
      .single()
    if (bookingError || !booking) throw new Error('Booking not found')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.client_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: description || 'The Family Documentary Project' },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/portal`,
      cancel_url: `${origin}/portal`,
      metadata: { booking_id: booking.id },
    })

    await supabaseAdmin
      .from('bookings')
      .update({
        stripe_checkout_session_id: session.id,
        payment_link_url: session.url,
        payment_amount: amountCents / 100,
        status: 'payment_requested',
      })
      .eq('id', booking.id)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
