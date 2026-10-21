// Sends two emails after someone signs up at /intake: the full submission to
// the studio inbox, and a short confirmation to the client.
//
// Like booking-notify, this takes only an id and reads every detail from the
// database with the service role. The page has no login, so the function has
// to be callable anonymously; taking the payload from the caller instead
// would turn it into an open relay that anyone could use to send mail from
// the studio's own address.

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
const STUDIO_PHONE = '804-432-4773'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FamilyContact {
  name?: string
  contact?: string
}

// interview_date is a plain date with no time or zone, so format it from its
// parts. Running it through Date() would shift it a day for anyone behind
// UTC.
function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { signupId } = await req.json()
    if (!signupId) throw new Error('Missing signupId')

    const { data: signup, error } = await supabaseAdmin
      .from('intake_signups')
      .select('id, full_name, interview_date, email, phone, family_contacts, created_at')
      .eq('id', signupId)
      .single()
    if (error || !signup) throw new Error('Sign-up not found')

    const when = formatDate(signup.interview_date)
    const contacts = (signup.family_contacts ?? []) as FamilyContact[]

    const studioLines = [
      `New interview sign-up`,
      '',
      `Name: ${signup.full_name}`,
      `Interview date: ${when}`,
      `Email: ${signup.email}`,
      `Phone: ${signup.phone}`,
      '',
      `Family members to receive the finished film:`,
      contacts.length > 0
        ? contacts.map((c) => `  - ${c.name || '(no name)'} — ${c.contact || '(no contact)'}`).join('\n')
        : '  none given',
    ].join('\n')

    const clientLines = [
      `Hi ${signup.full_name.split(' ')[0]},`,
      '',
      `Thank you for signing up for a family documentary interview with The Family Documentary Project.`,
      '',
      `We have you down for ${when}.`,
      '',
      contacts.length > 0
        ? `You also listed ${contacts.length} family ${contacts.length === 1 ? 'member' : 'members'} to receive the finished film. We'll be in touch about that closer to the time.`
        : `If you'd like family members to receive the finished film, just reply to this email with their names and contact details.`,
      '',
      `We'll follow up shortly with next steps and what to have ready. In the meantime, start setting aside any photographs you'd like to talk about — they're usually where the best stories come from.`,
      '',
      `Any questions before then? Reply to this email or call ${STUDIO_PHONE} and ask for Victoria.`,
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

    // Send both, but don't let one failure hide the other: the sign-up is
    // already saved either way.
    const results = await Promise.allSettled([
      client.send({
        from: SMTP_USER,
        to: STUDIO_EMAIL,
        subject: `New interview sign-up: ${signup.full_name} (${when})`,
        content: studioLines,
        replyTo: signup.email,
      }),
      client.send({
        from: SMTP_USER,
        to: signup.email,
        subject: 'Your interview with The Family Documentary Project',
        content: clientLines,
      }),
    ])

    await client.close()

    const failures = results
      .map((r, i) => (r.status === 'rejected' ? `${i === 0 ? 'studio' : 'client'}: ${r.reason}` : null))
      .filter(Boolean)

    // Stamped so the admin can tell at a glance which sign-ups were mailed
    // out and which arrived while SMTP was down.
    if (failures.length === 0) {
      await supabaseAdmin
        .from('intake_signups')
        .update({ notified_at: new Date().toISOString() })
        .eq('id', signup.id)
    }

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
