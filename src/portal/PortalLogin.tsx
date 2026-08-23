import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function PortalLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-center text-3xl">Client Portal</h1>
      <p className="mt-3 text-center text-ink/70">
        Enter the email you used to book your consult and we'll send you a sign-in link. No
        password needed.
      </p>
      {sent ? (
        <p className="mt-8 rounded-lg bg-moss/10 p-6 text-center text-moss">
          Check {email} for your sign-in link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-primary">
            Send Sign-In Link
          </button>
          {error && <p className="text-sm text-clay">{error}</p>}
        </form>
      )}
    </div>
  )
}
