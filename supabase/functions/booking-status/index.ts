// Lets the post-checkout success page poll booking status without requiring the
// client to be signed in yet. Requires both booking_id and the matching Stripe
// checkout session_id, so a guessed booking_id alone isn't enough to read status.

import { createClient } from 'npm:@supabase/supabase-js@2'

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

  const url = new URL(req.url)
  const bookingId = url.searchParams.get('booking_id')
  const sessionId = url.searchParams.get('session_id')

  if (!bookingId || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing booking_id or session_id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('id, status, scheduled_at, call_link, client_email, stripe_checkout_session_id')
    .eq('id', bookingId)
    .single()

  if (error || !booking || booking.stripe_checkout_session_id !== sessionId) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({
      status: booking.status,
      scheduledAt: booking.scheduled_at,
      callLink: booking.call_link,
      clientEmail: booking.client_email,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
