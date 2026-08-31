// Sends two emails after a consult is booked: an alert to the studio inbox
// and a confirmation to the client. Called by the booking form once
// book_consult succeeds.
//
// Deliberately takes only a bookingId and reads every detail from the
// database with the service role, rather than trusting anything the caller
// sends. The function has to be callable without a login (clients aren't
// signed in when they book), so the worst an abuser can do is re-send a
// notification for a booking that already exists and whose UUID they'd have
// to guess.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const SMTP_HOST = Deno.env.get('SMTP_HOST') ?? 'smtp.titan.email'
const SMTP_PORT = Number(Deno.env.get('SMTP_PORT') ?? '465')
const SMTP_USER = Deno.env.get('SMTP_USER')!
const SMTP_PASS = Deno.env.get('SMTP_PASS')!
const STUDIO_EMAIL = Deno.env.get('STUDIO_EMAIL') ?? SMTP_USER
const STUDIO_PHONE = '804-432-4773'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SERVICE_LABELS: Record<string, string> = {
  documentary: 'The Documentary',
  audio: 'Audio',
  guided_session: 'Guided Session (retired)',
}

// Times are stored in UTC; show them in the studio's own timezone so nobody
// has to convert.
function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { bookingId } = await req.json()
    if (!bookingId) throw new Error('Missing bookingId')

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, client_email, service_type, consult_type, scheduled_at')
      .eq('id', bookingId)
      .single()
    if (bookingError || !booking) throw new Error('Booking not found')

    const { data: intake } = await supabaseAdmin
      .from('intake_forms')
      .select(
        'storyteller_name, relationship, best_contact, topics, sensitive_topics, preferred_language, location, interview_type',
      )
      .eq('booking_id', bookingId)
      .single()

    const when = formatWhen(booking.scheduled_at)
    const service = SERVICE_LABELS[booking.service_type] ?? booking.service_type

    const studioLines = [
      `${service}`,
      `${booking.consult_type === 'phone' ? 'Phone' : 'Video'} consult on ${when}`,
      '',
      `Client email: ${booking.client_email}`,
      `Phone: ${intake?.best_contact || 'not given'}`,
      `Location: ${intake?.location || 'not given'}`,
      `Interview style: ${intake?.interview_type || 'not specified'}`,
      '',
      `Storyteller: ${intake?.storyteller_name || 'not given'}`,
      `Relationship: ${intake?.relationship || 'not given'}`,
      `Preferred language: ${intake?.preferred_language || 'not given'}`,
      '',
      `Topics they want covered:`,
      intake?.topics || 'none given',
      '',
      `Topics to avoid:`,
      intake?.sensitive_topics || 'none given',
    ].join('\n')

    const clientLines = [
      `Hi there,`,
      '',
      `Your free consult with The Family Documentary Project is booked for:`,
      '',
      when,
      `${booking.consult_type === 'phone' ? 'Phone call' : 'Video call'}`,
      '',
      booking.consult_type === 'phone'
        ? `We'll call you at the number you gave us. There's nothing to set up beforehand.`
        : `We'll send you a link for the video call before we meet. There's nothing to set up beforehand.`,
      '',
      `This is just a conversation about your family's story, with no payment due and no commitment. If you'd like to move forward afterward, we'll follow up with next steps.`,
      '',
      `Need to change the time or have a question before then? Reply to this email or call ${STUDIO_PHONE} and ask for Victoria.`,
      '',
      `Victoria`,
      `The Family Documentary Project`,
    ].join('\n')

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    })

    // Send both, but don't let one failure hide the other or fail the request:
    // the booking itself is already saved either way.
    const results = await Promise.allSettled([
      client.send({
        from: SMTP_USER,
        to: STUDIO_EMAIL,
        subject: `New consult booking: ${intake?.storyteller_name || booking.client_email}`,
        content: studioLines,
        replyTo: booking.client_email,
      }),
      client.send({
        from: SMTP_USER,
        to: booking.client_email,
        subject: 'Your consult with The Family Documentary Project',
        content: clientLines,
      }),
    ])

    await client.close()

    const failures = results
      .map((r, i) => (r.status === 'rejected' ? `${i === 0 ? 'studio' : 'client'}: ${r.reason}` : null))
      .filter(Boolean)

    return new Response(
      JSON.stringify({ sent: results.filter((r) => r.status === 'fulfilled').length, failures }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
