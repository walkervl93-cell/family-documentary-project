import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

const MEDIA_TYPE_OPTIONS = ['Photos', 'Slides', 'Film reels', 'VHS / home video', 'Audio recordings']

export default function PickupRequestForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [mediaTypes, setMediaTypes] = useState<string[]>([])

  function toggleMediaType(type: string) {
    setMediaTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = new FormData(e.currentTarget)
    const { error } = await supabase.from('pickup_requests').insert({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || '') || null,
      location: String(form.get('location') || '') || null,
      media_types: mediaTypes.length ? mediaTypes : null,
      media_count: String(form.get('media_count') || '') || null,
      preferred_time_slot: String(form.get('preferred_time_slot') || '') || null,
    })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <p className="rounded-lg bg-moss/10 p-6 text-moss">
        Thanks — we've got your pickup request. We'll follow up to schedule a time to come to you.
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
        <input name="location" placeholder="City / area we'd be picking up from" className="input" />
      </div>
      <div>
        <p className="mb-2 text-sm text-ink/70">What would you like digitized?</p>
        <div className="flex flex-wrap gap-2">
          {MEDIA_TYPE_OPTIONS.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => toggleMediaType(type)}
              className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
                mediaTypes.includes(type)
                  ? 'border-clay bg-clay text-cream'
                  : 'border-ink/20 text-ink/70 hover:border-ink'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <input name="media_count" placeholder="Roughly how much media? (e.g. 3 boxes, 10 tapes)" className="input" />
      <input name="preferred_time_slot" placeholder="Preferred day/time for pickup" className="input" />
      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-fit">
        {status === 'submitting' ? 'Sending…' : 'Request Pickup'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-clay">Something went wrong — please try again or call us directly.</p>
      )}
    </form>
  )
}
