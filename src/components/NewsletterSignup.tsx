import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * The newsletter bar that sits in the footer of every page: a line of text, a
 * single field, and a Subscribe button beside it.
 *
 * A phone field is offered but never required. Most people will give an email
 * and move on, and a second required field on a one-line form costs more
 * sign-ups than the phone numbers are worth.
 */
export default function NewsletterSignup() {
  const { pathname } = useLocation()

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [showPhone, setShowPhone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isSupabaseConfigured) {
      setError('Sign-up is unavailable right now. Please try again later.')
      return
    }

    setSubmitting(true)
    const { error: rpcError } = await supabase.rpc('subscribe_newsletter', {
      p_email: email,
      p_phone: phone || null,
      p_source: pathname,
    })
    setSubmitting(false)

    if (rpcError) {
      setError(rpcError.message)
      return
    }
    setDone(true)
  }

  return (
    <div id="newsletter" className="border-t border-cream/15 py-10 scroll-mt-24">
      {done ? (
        <div>
          <p className="font-serif text-xl">You're on the list.</p>
          <p className="mt-2 max-w-xl text-sm text-cream/70">
            Look out for specials, and tips on interviewing your own grandparents. We don't share
            your details with anyone.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="font-serif text-xl">Sign up for the newsletter</p>
            <p className="max-w-md text-sm text-cream/60">
              Specials and deals, and tips on how to interview your grandparents yourself.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 max-w-2xl">
            <div className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Underlined rather than boxed: the brief asked for a line
                  // with the button beside it.
                  className="w-full border-0 border-b border-cream/40 bg-transparent px-0 py-2 text-cream placeholder:text-cream/40 focus:border-cream focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-full bg-navy px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-ink disabled:opacity-50"
              >
                {submitting ? 'Signing up…' : 'Subscribe'}
              </button>
            </div>

            {showPhone ? (
              <div className="mt-4 max-w-xs">
                <label htmlFor="newsletter-phone" className="mb-1 block text-xs text-cream/60">
                  Phone (optional)
                </label>
                <input
                  id="newsletter-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-0 border-b border-cream/40 bg-transparent px-0 py-2 text-cream focus:border-cream focus:outline-none"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhone(true)}
                className="mt-3 text-xs text-cream/50 underline hover:text-cream/80"
              >
                Add a phone number too
              </button>
            )}

            {error && (
              <p role="alert" className="mt-3 text-sm text-navy">
                {error}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}
