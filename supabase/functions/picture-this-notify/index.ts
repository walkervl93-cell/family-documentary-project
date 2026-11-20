// Emails the studio when someone signs up on the hidden /picture-this
// holiday landing page.
//
// Same shape as booking-notify and intake-notify: takes only a row id and
// reads the details with the service role. The page has no login, so this has
// to be callable anonymously; taking the lead's details from the caller would
// make it an open relay for sending mail from the studio's own address.

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
const STUDIO_EMAIL = Deno.env.get('STUDIO_EMAIL') ?? 'info@familydocumentaryproject.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BEST_TIME: Record<string, string> = {
  morning: 'Morning',
  midday: 'Midday',
  evening: 'Evening',
}

const INTERVIEWEE: Record<string, string> = {
  self: 'Themselves',
  family_member: 'A family member',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { leadId } = await req.json()
    if (!leadId) throw new Error('Missing leadId')

    const { data: lead, error } = await supabaseAdmin
      .from('picture_this_leads')
      .select('id, full_name, phone, email, best_time, interviewee, source, created_at')
      .eq('id', leadId)
      .single()
    if (error || !lead) throw new Error('Lead not found')

    const lines = [
      'Picture This: new interest sign-up',
      '',
      `Name: ${lead.full_name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      '',
      `Best time to call: ${BEST_TIME[lead.best_time] ?? lead.best_time}`,
      `Who'd be interviewed: ${INTERVIEWEE[lead.interviewee] ?? lead.interviewee}`,
      '',
      `Came from: ${lead.source || 'no tag on the link'}`,
      `Signed up: ${new Date(lead.created_at).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'full',
        timeStyle: 'short',
      })}`,
    ].join('\n')

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    })

    await client.send({
      from: SMTP_USER,
      to: STUDIO_EMAIL,
      subject: `Picture This lead: ${lead.full_name} (${BEST_TIME[lead.best_time] ?? lead.best_time})`,
      content: lines,
      // So hitting reply goes to the person who signed up.
      replyTo: lead.email,
    })

    await client.close()

    // Stamped so it's possible to tell which leads were mailed out and which
    // arrived while SMTP was down.
    await supabaseAdmin
      .from('picture_this_leads')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', lead.id)

    return new Response(JSON.stringify({ sent: 1 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
