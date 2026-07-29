import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { BookingServiceType, ConsultType } from '../lib/database.types'

interface Slot {
  id: string
  start_time: string
  end_time: string
}

const STEPS = ['Schedule', 'Your Story', 'Confirm'] as const

export default function ConsultBookingForm({ serviceType }: { serviceType: BookingServiceType }) {
  const [step, setStep] = useState(0)

  const [consultType, setConsultType] = useState<ConsultType>('video')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [storytellerName, setStorytellerName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [topics, setTopics] = useState('')
  const [sensitiveTopics, setSensitiveTopics] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    async function loadSlots() {
      setSlotsLoading(true)
      const { data } = await supabase
        .from('availability_slots')
        .select('id, start_time, end_time')
        .eq('is_booked', false)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(60)
      setSlots(data ?? [])
      setSlotsLoading(false)
    }
    loadSlots()
  }, [])

  const slotsByDay = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const day = new Date(slot.start_time).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
    acc[day] = acc[day] ?? []
    acc[day].push(slot)
    return acc
  }, {})

  async function handleSubmit() {
    if (!selectedSlot || !clientEmail || !storytellerName || !relationship) {
      setError('Please complete all required fields before continuing.')
      return
    }
    setSubmitting(true)
    setError(null)

    const { error: slotError } = await supabase
      .from('availability_slots')
      .update({ is_booked: true })
      .eq('id', selectedSlot.id)
      .eq('is_booked', false)
      .select()
      .single()

    if (slotError) {
      setError('That time was just booked by someone else — please pick another.')
      setSubmitting(false)
      setStep(0)
      return
    }

    // A plain client isn't signed in yet at this point, so it can't read back
    // the row it just inserted (bookings are only readable by their owner or
    // an admin) — asking Postgrest to return it via .select() would roll the
    // whole insert back. Generate the id ourselves instead.
    const bookingId = crypto.randomUUID()
    const { error: bookingError } = await supabase.from('bookings').insert({
      id: bookingId,
      client_email: clientEmail,
      service_type: serviceType,
      consult_type: consultType,
      scheduled_at: selectedSlot.start_time,
      slot_id: selectedSlot.id,
    })

    if (bookingError) {
      setError(bookingError.message)
      setSubmitting(false)
      return
    }

    const { error: intakeError } = await supabase.from('intake_forms').insert({
      booking_id: bookingId,
      storyteller_name: storytellerName,
      relationship,
      best_contact: clientPhone || null,
      topics: topics || null,
      sensitive_topics: sensitiveTopics || null,
      preferred_language: preferredLanguage || null,
    })

    if (intakeError) {
      setError(intakeError.message)
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setDone(true)
  }

  async function sendMagicLink() {
    await supabase.auth.signInWithOtp({
      email: clientEmail,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    })
    setMagicLinkSent(true)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-moss/30 bg-moss/5 p-8 text-center">
        <h3 className="text-xl">Consult Booked</h3>
        <p className="mt-2 text-ink/70">
          We'll see you{' '}
          {new Date(selectedSlot!.start_time).toLocaleString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}{' '}
          — a free {consultType} consult, no payment due yet. If we're a good fit, we'll follow up
          with next steps and pricing after the call.
        </p>
        {!magicLinkSent ? (
          <button className="btn-primary mt-6" onClick={sendMagicLink}>
            Send Me My Portal Link
          </button>
        ) : (
          <p className="mt-6 text-sm text-moss">
            Check {clientEmail} for a magic sign-in link to your client portal.
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-3 text-xs uppercase tracking-wide">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-full border px-3 py-1.5 ${
              i === step ? 'border-clay bg-clay text-cream' : 'border-ink/20 text-ink/50'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-ink/60">
              Phone or video?
            </p>
            <div className="flex gap-2">
              {(['video', 'phone'] as ConsultType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setConsultType(type)}
                  className={`rounded-full border px-4 py-2 text-sm capitalize ${
                    consultType === type
                      ? 'border-clay bg-clay text-cream'
                      : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  {type} call
                </button>
              ))}
            </div>
          </div>

          {slotsLoading && <p className="text-ink/60">Loading available times…</p>}
          {!slotsLoading && slots.length === 0 && (
            <p className="rounded-lg bg-ink/5 p-4 text-sm text-ink/70">
              No open times right now — please call 804-432-4773 and we'll find a time together.
            </p>
          )}
          {Object.entries(slotsByDay).map(([day, daySlots]) => (
            <div key={day}>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-ink/60">{day}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selectedSlot?.id === slot.id
                        ? 'border-clay bg-clay text-cream'
                        : 'border-ink/20 hover:border-ink'
                    }`}
                  >
                    {new Date(slot.start_time).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-primary w-fit" disabled={!selectedSlot} onClick={() => setStep(1)}>
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4">
          <input
            className="input"
            type="email"
            required
            placeholder="Your email (for confirmation & portal access)"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Your phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
          <input
            className="input"
            required
            placeholder="Storyteller's name"
            value={storytellerName}
            onChange={(e) => setStorytellerName(e.target.value)}
          />
          <input
            className="input"
            required
            placeholder="Their relationship to you"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Topics or themes you'd like covered"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Any sensitive topics we should avoid"
            value={sensitiveTopics}
            onChange={(e) => setSensitiveTopics(e.target.value)}
          />
          <input
            className="input"
            placeholder="Preferred language"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
          />
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!clientEmail || !storytellerName || !relationship}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedSlot && (
        <div className="grid gap-6">
          <div className="rounded-2xl border border-ink/10 bg-white/50 p-6 text-sm">
            <p>
              <strong className="capitalize">{consultType} consult</strong> for {storytellerName} (
              {relationship})
            </p>
            <p className="mt-1 text-ink/70">
              {new Date(selectedSlot.start_time).toLocaleString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            <p className="mt-3 text-ink/70">
              This is a free consult — there's no payment due now. If you'd like to move forward
              afterward, we'll follow up with pricing and next steps.
            </p>
          </div>
          {error && <p className="text-sm text-clay">{error}</p>}
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Booking…' : 'Book Free Consult'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
