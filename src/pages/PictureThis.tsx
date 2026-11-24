import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import useNoIndex from '../hooks/useNoIndex'
import { BRAND } from '../data/content'

/** Change this to move the page; App.tsx reads it for the route. */
export const PICTURE_THIS_SLUG = 'picture-this'

/** Swap these two files to change the background. Paths stay the same. */
const BG_VIDEO = '/media/picture-this-bg.mp4'
const BG_POSTER = '/media/picture-this-poster.jpg'

const BEST_TIMES = [
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'evening', label: 'Evening' },
] as const

const INTERVIEWEES = [
  { value: 'self', label: 'Myself' },
  { value: 'family_member', label: 'A family member' },
] as const

type BestTime = (typeof BEST_TIMES)[number]['value']
type Interviewee = (typeof INTERVIEWEES)[number]['value']

type Errors = Partial<Record<'fullName' | 'phone' | 'email' | 'bestTime' | 'interviewee', string>>

/** 10 digits, or 11 starting with a US country code. Punctuation ignored, so
 *  (804) 432-4773 and 8044324773 are both fine. */
function isUsPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

function isEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

export default function PictureThis() {
  useNoIndex()
  const [params] = useSearchParams()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [bestTime, setBestTime] = useState<BestTime | null>(null)
  const [interviewee, setInterviewee] = useState<Interviewee | null>(null)
  // Honeypot: hidden from people, irresistible to form-filling bots. A bot
  // that types in it gets a thank-you and no database row.
  const [website, setWebsite] = useState('')

  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function validate(): Errors {
    const next: Errors = {}
    if (!fullName.trim()) next.fullName = 'Please tell us your name.'
    if (!phone.trim()) next.phone = 'Please add a phone number.'
    else if (!isUsPhone(phone)) next.phone = "That doesn't look like a 10-digit US number."
    if (!email.trim()) next.email = 'Please add an email address.'
    else if (!isEmail(email)) next.email = 'Please check that address.'
    if (!bestTime) next.bestTime = 'Pick a time that suits you.'
    if (!interviewee) next.interviewee = 'Let us know who we would be interviewing.'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // Silent success: a bot gets the same screen a person does, so it has no
    // signal to retry against.
    if (website) {
      setDone(true)
      return
    }

    if (!isSupabaseConfigured) {
      setSubmitError(`Something went wrong. Please call or text ${BRAND.phone} and we'll help.`)
      return
    }

    setSubmitting(true)
    const { data: leadId, error } = await supabase.rpc('submit_picture_this_lead', {
      p_full_name: fullName,
      p_phone: phone,
      p_email: email,
      p_best_time: bestTime!,
      p_interviewee: interviewee!,
      p_source: params.get('src'),
    })
    setSubmitting(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    // The lead is saved by now, so a mail failure must not look like a failed
    // sign-up. It's logged and the row is left without its notified_at stamp.
    if (leadId) {
      supabase.functions
        .invoke('picture-this-notify', { body: { leadId } })
        .catch((err) => console.error('Picture This notification failed to send', err))
    }

    setDone(true)
  }

  const complete =
    fullName.trim() !== '' &&
    isUsPhone(phone) &&
    isEmail(email) &&
    bestTime !== null &&
    interviewee !== null

  const fieldClass =
    'w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/50 focus:border-cream focus:outline-none focus:ring-2 focus:ring-cream/30'

  function pillClass(active: boolean) {
    return `rounded-full border px-3.5 py-2 text-sm transition-colors ${
      active
        ? 'border-navy bg-navy text-cream'
        : 'border-white/30 text-cream/90 hover:border-cream'
    }`
  }

  return (
    // Fixed to the viewport: the page itself never scrolls. dvh rather than
    // vh so the card isn't pushed under a phone browser's address bar.
    <div className="fixed inset-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-ink px-4 py-3 sm:py-6">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={BG_VIDEO}
        poster={BG_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Keeps the text readable whatever the footage is doing underneath. */}
      <div className="absolute inset-0 bg-ink/65" aria-hidden="true" />

      {/* The card, not the page, takes any overflow. On a short screen with
          the keyboard up the fields stay reachable without the background
          ever moving. */}
      <div className="relative max-h-full w-[90%] max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-white/20 bg-ink/40 p-4 shadow-2xl backdrop-blur-xl sm:w-full sm:p-8">
        {done ? (
          <div className="py-6 text-center">
            <h1 className="font-serif text-2xl leading-tight text-cream sm:text-3xl">Thank you!</h1>
            <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-cream/80">
              We'll reach out at your preferred time to chat about your family's story.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-center font-serif text-xl leading-tight text-cream sm:text-3xl">
              Preserve Their Story This Holiday Season
            </h1>
            <p className="mt-1.5 text-center text-sm text-cream/80 sm:text-base">
              Legacy short films from your family photos.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-3 sm:mt-5 sm:gap-3.5">
              <div>
                <label htmlFor="pt-name" className="mb-1 block text-xs text-cream/80">
                  Full name
                </label>
                <input
                  id="pt-name"
                  required
                  className={fieldClass}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="mt-1 text-xs text-navy-soft">{errors.fullName}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
              <div>
                <label htmlFor="pt-phone" className="mb-1 block text-xs text-cream/80">
                  Phone
                </label>
                <input
                  id="pt-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  className={fieldClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-navy-soft">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="pt-email" className="mb-1 block text-xs text-cream/80">
                  Email
                </label>
                <input
                  id="pt-email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  className={fieldClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs text-navy-soft">{errors.email}</p>}
              </div>
              </div>

              <fieldset>
                <legend className="mb-1.5 text-xs text-cream/80">Best time to call</legend>
                <div className="flex flex-wrap gap-2">
                  {BEST_TIMES.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => setBestTime(t.value)}
                      aria-pressed={bestTime === t.value}
                      className={pillClass(bestTime === t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {errors.bestTime && <p className="mt-1 text-xs text-navy-soft">{errors.bestTime}</p>}
              </fieldset>

              <fieldset>
                <legend className="mb-1.5 text-xs text-cream/80">Who would be interviewed</legend>
                <div className="flex flex-wrap gap-2">
                  {INTERVIEWEES.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => setInterviewee(t.value)}
                      aria-pressed={interviewee === t.value}
                      className={pillClass(interviewee === t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {errors.interviewee && (
                  <p className="mt-1 text-xs text-navy-soft">{errors.interviewee}</p>
                )}
              </fieldset>

              {/* Honeypot. Off-screen rather than display:none, which some
                  bots know to skip, and hidden from screen readers and from
                  tabbing so nobody reaches it by accident. */}
              <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="pt-website">Website</label>
                <input
                  id="pt-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {submitError && (
                <p role="alert" className="rounded-xl bg-navy/20 p-3 text-sm text-cream">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !complete}
                className="mt-1 w-full rounded-full bg-navy px-8 py-3 text-sm font-medium uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? 'Sending…' : 'Count Me In'}
              </button>
              {/* A disabled button with no explanation just reads as broken,
                  so say why it is off. */}
              {!complete && (
                <p className="-mt-1 text-center text-xs text-cream/50">
                  All fields are required.
                </p>
              )}
            </form>
          </>
        )}

        <p className="mt-3 text-center text-xs leading-relaxed text-cream/60 sm:mt-4">
          Questions? Call or text{' '}
          <a href={BRAND.phoneHref} className="underline hover:text-cream">
            {BRAND.phone}
          </a>{' '}
          ·{' '}
          <a href={`mailto:${BRAND.email}`} className="underline hover:text-cream">
            {BRAND.email}
          </a>
        </p>
      </div>
    </div>
  )
}
