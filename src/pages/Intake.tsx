import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import useNoIndex from '../hooks/useNoIndex'
import { BRAND } from '../data/content'

interface FamilyContact {
  name: string
  contact: string
}

const emptyContact: FamilyContact = { name: '', contact: '' }

/**
 * Sign-up page for a family documentary interview, sent to clients and
 * activities teams as a direct link. Not in the nav or the footer, and
 * deliberately kept out of search results.
 *
 * Most of the people filling this in are seniors, so: one field per line,
 * visible labels rather than placeholders (a placeholder vanishes the moment
 * you start typing, which is exactly when you most want to check what the
 * field was), large tap targets, and no multi-step flow to get lost in.
 */
export default function Intake() {
  useNoIndex()

  const [fullName, setFullName] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [family, setFamily] = useState<FamilyContact[]>([{ ...emptyContact }])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function updateContact(index: number, field: keyof FamilyContact, value: string) {
    setFamily((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  function removeContact(index: number) {
    setFamily((prev) => (prev.length === 1 ? [{ ...emptyContact }] : prev.filter((_, i) => i !== index)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isSupabaseConfigured) {
      setError(
        `Sorry, the form isn't available right now. Please call ${BRAND.phone} and we'll sign you up over the phone.`,
      )
      return
    }

    setSubmitting(true)

    // Blank rows are expected: the section starts with one showing, and most
    // people will leave it alone.
    const contacts = family
      .map((c) => ({ name: c.name.trim(), contact: c.contact.trim() }))
      .filter((c) => c.name !== '' || c.contact !== '')

    const { data: signupId, error: rpcError } = await supabase.rpc('submit_intake', {
      p_full_name: fullName,
      p_interview_date: interviewDate,
      p_email: email,
      p_phone: phone,
      p_family_contacts: contacts,
    })

    if (rpcError) {
      setError(rpcError.message)
      setSubmitting(false)
      return
    }

    // The sign-up is saved at this point, so a mail failure mustn't look like
    // a failed submission. It's logged, and the row is left without its
    // notified_at stamp for the studio to catch.
    if (signupId) {
      supabase.functions
        .invoke('intake-notify', { body: { signupId } })
        .catch((err) => console.error('Intake notification failed to send', err))
    }

    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-4xl leading-tight sm:text-5xl">You're signed up!</h1>
        <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-ink/70">
          You'll get a confirmation shortly with next steps.
        </p>
        <p className="mt-10 text-lg text-ink/60">
          Questions in the meantime? Call{' '}
          <a className="font-medium text-navy underline" href={BRAND.phoneHref}>
            {BRAND.phone}
          </a>
          .
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-center text-4xl leading-tight sm:text-5xl">Sign Up for Your Interview</h1>
      <p className="mx-auto mt-5 max-w-xl text-center text-xl leading-relaxed text-ink/70">
        Tell us a little about you and when you'd like to meet. We'll bring the crew to you, sit
        down with your photographs, and turn the conversation into a short film for your family.
      </p>

      <form onSubmit={handleSubmit} className="mt-12 grid gap-8">
        <div>
          <label htmlFor="full-name" className="mb-2 block text-lg font-medium">
            Your full name
          </label>
          <input
            id="full-name"
            className="input-lg"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="interview-date" className="mb-2 block text-lg font-medium">
            Date of interview
          </label>
          <input
            id="interview-date"
            className="input-lg"
            type="date"
            required
            // Nobody can be interviewed in the past, and the picker opening on
            // today saves a senior scrolling back through months.
            min={new Date().toISOString().slice(0, 10)}
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
          <p className="mt-2 text-base text-ink/60">
            Not sure yet? Pick your best guess and we'll confirm when we call.
          </p>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-lg font-medium">
            Your email
          </label>
          <input
            id="email"
            className="input-lg"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-lg font-medium">
            Your phone number
          </label>
          <input
            id="phone"
            className="input-lg"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <fieldset className="rounded-2xl border border-ink/10 bg-white/50 p-6 sm:p-8">
          <legend className="px-2 text-lg font-medium">
            Family members who should receive the finished film
          </legend>
          <p className="text-base text-ink/60">Optional. You can add more later.</p>

          <div className="mt-6 grid gap-6">
            {family.map((contact, i) => (
              <div key={i} className="grid gap-3">
                <div>
                  <label htmlFor={`family-name-${i}`} className="mb-2 block text-base font-medium">
                    Name
                  </label>
                  <input
                    id={`family-name-${i}`}
                    className="input-lg"
                    value={contact.name}
                    onChange={(e) => updateContact(i, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`family-contact-${i}`}
                    className="mb-2 block text-base font-medium"
                  >
                    Email or phone
                  </label>
                  <input
                    id={`family-contact-${i}`}
                    className="input-lg"
                    value={contact.contact}
                    onChange={(e) => updateContact(i, 'contact', e.target.value)}
                  />
                </div>
                {/* Only worth showing once there's more than one row — with a
                    single empty row there's nothing to remove. */}
                {family.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(i)}
                    className="justify-self-start py-2 text-base text-navy underline"
                  >
                    Remove {contact.name.trim() || 'this person'}
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFamily((prev) => [...prev, { ...emptyContact }])}
            className="mt-6 w-full rounded-full border border-ink/25 px-6 py-4 text-lg font-medium text-ink hover:border-ink sm:w-auto"
          >
            + Add another family member
          </button>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl bg-navy/10 p-4 text-lg text-navy">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-navy px-8 py-5 text-xl font-medium text-cream transition-colors hover:bg-ink disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Sign Me Up'}
        </button>

        <p className="text-center text-base text-ink/60">
          Prefer to do this over the phone? Call{' '}
          <a className="font-medium text-navy underline" href={BRAND.phoneHref}>
            {BRAND.phone}
          </a>
          .
        </p>
      </form>
    </section>
  )
}
