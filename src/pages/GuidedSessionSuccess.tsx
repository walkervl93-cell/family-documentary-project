import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { getBookingStatus } from '../lib/functions'
import { supabase } from '../lib/supabase'

export default function GuidedSessionSuccess() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('booking_id')
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<'checking' | 'confirmed' | 'pending' | 'error'>('checking')
  const [clientEmail, setClientEmail] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    if (!bookingId || !sessionId) {
      setStatus('error')
      return
    }

    let attempts = 0
    let cancelled = false

    async function poll() {
      try {
        const result = await getBookingStatus(bookingId!, sessionId!)
        if (cancelled) return
        setClientEmail(result.clientEmail)
        if (result.status !== 'pending_payment') {
          setStatus('confirmed')
          return
        }
        attempts += 1
        if (attempts < 10) {
          setTimeout(poll, 2000)
        } else {
          setStatus('pending')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    poll()

    return () => {
      cancelled = true
    }
  }, [bookingId, sessionId])

  async function sendMagicLink() {
    if (!clientEmail) return
    await supabase.auth.signInWithOtp({
      email: clientEmail,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    })
    setMagicLinkSent(true)
  }

  return (
    <PageHero
      title={
        status === 'confirmed'
          ? 'You\'re Booked!'
          : status === 'error'
            ? 'We couldn\'t confirm your booking'
            : 'Confirming your booking…'
      }
      subtitle={
        status === 'confirmed'
          ? "Payment received — your Guided Session is confirmed. We've sent prep instructions and a portal link to your email."
          : status === 'pending'
            ? "Payment is still processing. This can take a minute — refresh shortly, or reach out if it doesn't update."
            : status === 'error'
              ? "We couldn't find that booking. If you were charged, please call 804-432-4773 and we'll sort it out."
              : 'Just a moment while we confirm your payment with Stripe.'
      }
    >
      {status === 'confirmed' && (
        <div className="mt-8">
          {!magicLinkSent ? (
            <button className="btn-primary" onClick={sendMagicLink}>
              Send Me My Portal Link
            </button>
          ) : (
            <p className="text-cream/80">
              Check {clientEmail} for a magic sign-in link to your client portal.
            </p>
          )}
        </div>
      )}
      <div className="mt-6">
        <Link to="/" className="text-sm text-cream/70 underline">
          Back to home
        </Link>
      </div>
    </PageHero>
  )
}
