import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = new FormData(e.currentTarget)
    const { error } = await supabase.from('inquiries').insert({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || '') || null,
      location: String(form.get('location') || '') || null,
      timeline: String(form.get('timeline') || '') || null,
      message: String(form.get('message') || '') || null,
    })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <p className="rounded-lg bg-moss/10 p-6 text-moss">
        Thank you — we've received your inquiry and will reach out soon. Feel free to call
        804-432-4773 and ask for Victoria in the meantime.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="phone" placeholder="Phone" className="input" />
        <input name="location" placeholder="City / area" className="input" />
      </div>
      <input name="timeline" placeholder="When are you hoping to film? (rough timeline)" className="input" />
      <textarea
        name="message"
        placeholder="Tell us about your family and who you'd like to feature"
        rows={5}
        className="input"
      />
      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-fit">
        {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-clay">Something went wrong — please try again or call us directly.</p>
      )}
    </form>
  )
}
