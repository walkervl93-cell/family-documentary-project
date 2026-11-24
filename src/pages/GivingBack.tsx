import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SlideshowBackground from '../components/SlideshowBackground'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { BRAND, GIVING_BACK_COPY, GIVING_BACK_CTA, MEDIA } from '../data/content'

function isUsPhone(v: string) {
  const d = v.replace(/\D/g, '')
  return d.length === 10 || (d.length === 11 && d.startsWith('1'))
}
function isEmail(v: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
}

/**
 * Giving Back: the monthly pop-up, and a form for communities who want one.
 *
 * Built like the holiday promo page, with two differences the brief called
 * for: the site header stays, and the explanatory copy sits above the card
 * rather than inside it, so the offer reads before the form does.
 */
export default function GivingBack() {
  const [params] = useSearchParams()

  const [fullName, setFullName] = useState('')
  const [community, setCommunity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const complete =
    fullName.trim() !== '' && community.trim() !== '' && isUsPhone(phone) && isEmail(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!complete) return

    // A bot that fills the hidden field gets the same screen a person does,
    // so it has no signal to retry against.
    if (website) {
      setDone(true)
      return
    }

    if (!isSupabaseConfigured) {
      setError(`Something went wrong. Please call ${BRAND.phone} and we'll help.`)
      return
    }

    setSubmitting(true)
    const { error: rpcError } = await supabase.rpc('submit_community_event_lead', {
      p_full_name: fullName,
      p_community: community,
      p_phone: phone,
      p_email: email,
      p_notes: notes || null,
      p_source: params.get('src'),
    })
    setSubmitting(false)

    if (rpcError) {
      setError(rpcError.message)
      return
    }
    setDone(true)
  }

  const field =
    'w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/50 focus:border-cream focus:outline-none focus:ring-2 focus:ring-cream/30'

  return (
    // The footer carries a 6rem top margin for the cream pages, which on this
    // dark one showed as a band of body background between the two. The extra
    // bottom padding plus the matching negative margin runs the ink straight
    // into the footer.
    <div className="relative -mb-24 flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-ink px-4 pb-[10rem] pt-16">
      <SlideshowBackground images={MEDIA.givingBackSlideshow} />
      <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />

      <div className="relative w-full max-w-2xl">
        {/* Outside the card on purpose: the offer should land before the
            form asks for anything. */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-navy-soft">
            Giving Back
          </p>
          <h1 className="font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Bring a pop-up to your community
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/80">
            {GIVING_BACK_COPY}
          </p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-ink/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {done ? (
            <div className="py-6 text-center">
              <h2 className="font-serif text-2xl text-cream">Thank you!</h2>
              <p className="mx-auto mt-3 max-w-sm text-cream/80">
                We'll be in touch to find a date that works for your community.
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-cream/70">{GIVING_BACK_CTA}</p>
              <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-3.5">
                <div>
                  <label htmlFor="gb-name" className="mb-1 block text-xs text-cream/80">
                    Your name
                  </label>
                  <input
                    id="gb-name"
                    required
                    autoComplete="name"
                    className={field}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="gb-community" className="mb-1 block text-xs text-cream/80">
                    Community
                  </label>
                  <input
                    id="gb-community"
                    required
                    className={field}
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
                  <div>
                    <label htmlFor="gb-phone" className="mb-1 block text-xs text-cream/80">
                      Phone
                    </label>
                    <input
                      id="gb-phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      className={field}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="gb-email" className="mb-1 block text-xs text-cream/80">
                      Email
                    </label>
                    <input
                      id="gb-email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      className={field}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gb-notes" className="mb-1 block text-xs text-cream/80">
                    Anything we should know (optional)
                  </label>
                  <textarea
                    id="gb-notes"
                    rows={2}
                    className={field}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div
                  className="absolute left-[-9999px] h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="gb-website">Website</label>
                  <input
                    id="gb-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {error && (
                  <p role="alert" className="rounded-xl bg-navy/20 p-3 text-sm text-cream">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !complete}
                  className="mt-1 w-full rounded-full bg-navy px-8 py-3 text-sm font-medium uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? 'Sending…' : 'Request a Pop-Up'}
                </button>
                {!complete && (
                  <p className="-mt-1 text-center text-xs text-cream/50">
                    Name, community, phone and email are required.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
