import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { supabase } from '../lib/supabase'
import { createCheckoutSession } from '../lib/functions'
import { GUIDED_SESSION_PACKAGES, GUIDED_SESSION_ADDONS } from '../data/content'

interface Slot {
  id: string
  start_time: string
  end_time: string
}

const STEPS = ['Package', 'Schedule', 'Your Story', 'Review & Pay'] as const

export default function GuidedSessionBook() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)

  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [clientEmail, setClientEmail] = useState('')
  const [storytellerName, setStorytellerName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [bestContact, setBestContact] = useState('')
  const [topics, setTopics] = useState('')
  const [sensitiveTopics, setSensitiveTopics] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pkg = GUIDED_SESSION_PACKAGES[0]
  const total =
    pkg.price + selectedAddons.reduce((sum, id) => sum + (GUIDED_SESSION_ADDONS.find((a) => a.id === id)?.price ?? 0), 0)

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

  const wasCanceled = searchParams.get('canceled') === '1'

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

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

  async function handlePay() {
    if (!selectedSlot || !clientEmail || !storytellerName || !relationship) {
      setError('Please complete all required fields before continuing.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { url } = await createCheckoutSession({
        packageType: 'base',
        addons: selectedAddons,
        slotId: selectedSlot.id,
        scheduledAt: selectedSlot.start_time,
        clientEmail,
        origin: window.location.origin,
        intake: {
          storytellerName,
          relationship,
          bestContact,
          topics,
          sensitiveTopics,
          preferredLanguage,
        },
      })
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong starting checkout.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero title="Book a Guided Session" subtitle="A few quick steps and you're on the calendar." />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <ol className="mb-10 flex flex-wrap gap-3 text-xs uppercase tracking-wide">
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

        {wasCanceled && (
          <p className="mb-6 rounded-lg bg-clay/10 p-4 text-sm text-clay">
            Checkout was canceled — your selections below are still here whenever you're ready.
          </p>
        )}

        {step === 0 && (
          <div className="grid gap-6">
            <div className="rounded-2xl border border-clay/40 bg-white/60 p-6">
              <h3 className="text-lg">{pkg.name}</h3>
              <p className="mt-1 text-xl font-serif text-clay">${pkg.price}</p>
              <p className="mt-2 text-sm text-ink/70">{pkg.description}</p>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-medium uppercase tracking-wide text-ink/60">
                Optional add-ons
              </p>
              {GUIDED_SESSION_ADDONS.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                    selectedAddons.includes(a.id) ? 'border-clay bg-clay/5' : 'border-ink/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-baseline justify-between gap-2 font-medium">
                      {a.name} <span className="text-clay">+${a.price}</span>
                    </span>
                    <span className="text-xs text-ink/60">{a.description}</span>
                  </span>
                </label>
              ))}
            </div>
            <button className="btn-primary w-fit" onClick={() => setStep(1)}>
              Continue — ${total}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-6">
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
            <div className="flex gap-3">
              <button className="btn-secondary" onClick={() => setStep(0)}>
                Back
              </button>
              <button className="btn-primary" disabled={!selectedSlot} onClick={() => setStep(2)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
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
            <input
              className="input"
              placeholder="Best contact info for them"
              value={bestContact}
              onChange={(e) => setBestContact(e.target.value)}
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
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn-primary"
                disabled={!clientEmail || !storytellerName || !relationship}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedSlot && (
          <div className="grid gap-6">
            <div className="rounded-2xl border border-ink/10 bg-white/50 p-6 text-sm">
              <p>
                <strong>{pkg.name}</strong> for {storytellerName} ({relationship})
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
              {selectedAddons.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-ink/70">
                  {selectedAddons.map((id) => (
                    <li key={id}>{GUIDED_SESSION_ADDONS.find((a) => a.id === id)?.name}</li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-lg font-serif text-clay">Total: ${total}</p>
            </div>
            {error && <p className="text-sm text-clay">{error}</p>}
            <div className="flex gap-3">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary" disabled={submitting} onClick={handlePay}>
                {submitting ? 'Redirecting to payment…' : `Pay $${total} & Confirm`}
              </button>
            </div>
            <p className="text-xs text-ink/50">
              Your booking is confirmed only after payment completes — you won't be charged until
              then.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
