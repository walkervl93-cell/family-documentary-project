import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS, SERVICE_TYPE_LABELS } from '../data/content'
import type { BookingServiceType, ConsultType } from '../lib/database.types'

interface Booking {
  id: string
  service_type: BookingServiceType
  consult_type: ConsultType
  status: string
  scheduled_at: string
  call_link: string | null
  payment_link_url: string | null
  payment_amount: number | null
}

function StatusTracker({ status }: { status: string }) {
  const currentIndex = BOOKING_STATUSES.indexOf(status as (typeof BOOKING_STATUSES)[number])
  return (
    <ol className="flex flex-wrap gap-2">
      {BOOKING_STATUSES.map((s, i) => (
        <li
          key={s}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${
            i <= currentIndex ? 'border-clay bg-clay text-cream' : 'border-ink/15 text-ink/40'
          }`}
        >
          {BOOKING_STATUS_LABELS[s]}
        </li>
      ))}
    </ol>
  )
}

const DELIVERABLE_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 // 24h — long enough for a TV cast session

interface Deliverable {
  id: string
  file_url: string
  version: number
  revision_requested: boolean
}

function DeliverableViewer({ bookingId }: { bookingId: string }) {
  const [deliverable, setDeliverable] = useState<Deliverable | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestingRevision, setRequestingRevision] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data } = await supabase
        .from('deliverables')
        .select('id, file_url, version, revision_requested')
        .eq('booking_id', bookingId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cancelled) return
      setDeliverable(data ?? null)

      if (data?.file_url) {
        const { data: signed } = await supabase.storage
          .from('deliverables')
          .createSignedUrl(data.file_url, DELIVERABLE_SIGNED_URL_TTL_SECONDS)
        if (!cancelled) setVideoUrl(signed?.signedUrl ?? null)
      }
      if (!cancelled) setLoading(false)
    }
    load()

    return () => {
      cancelled = true
    }
  }, [bookingId])

  async function requestRevision() {
    if (!deliverable) return
    setRequestingRevision(true)
    await supabase
      .from('deliverables')
      .update({ revision_requested: true })
      .eq('id', deliverable.id)
    setDeliverable({ ...deliverable, revision_requested: true })
    setRequestingRevision(false)
  }

  if (loading) return <p className="mt-6 text-sm text-ink/50">Checking for your finished film…</p>

  if (!deliverable || !videoUrl) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-ink/20 p-4 text-sm text-ink/60">
        Your finished film will appear here once it's ready.
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-xl border border-ink/10 bg-ink/5 p-4">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-ink/60">
        Your Film, v{deliverable.version}
      </p>
      {/* A plain <video> with a direct signed URL lets the browser's native
          AirPlay / Chromecast controls fetch it straight from Storage. */}
      <video className="w-full rounded-lg" src={videoUrl} controls playsInline />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={videoUrl} download className="btn-secondary">
          Download
        </a>
        {deliverable.revision_requested ? (
          <span className="text-sm text-moss">Revision requested. We'll follow up.</span>
        ) : (
          <button
            className="text-sm text-clay underline disabled:opacity-50"
            disabled={requestingRevision}
            onClick={requestRevision}
          >
            {requestingRevision ? 'Sending…' : 'Request a revision'}
          </button>
        )}
      </div>
    </div>
  )
}

function RescheduleForm({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [requestedTime, setRequestedTime] = useState('')
  const [reason, setReason] = useState('')
  const [sent, setSent] = useState(false)

  async function submit() {
    await supabase.from('reschedule_requests').insert({
      booking_id: bookingId,
      requested_time: requestedTime || null,
      reason,
    })
    setSent(true)
  }

  if (sent) {
    return <p className="mt-3 text-sm text-moss">Reschedule request sent. We'll follow up by email.</p>
  }

  return open ? (
    <div className="mt-3 grid gap-2">
      <input
        type="datetime-local"
        className="input"
        value={requestedTime}
        onChange={(e) => setRequestedTime(e.target.value)}
      />
      <textarea
        className="input"
        rows={2}
        placeholder="Reason / preferred alternative"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button className="btn-secondary w-fit" onClick={submit}>
        Submit Reschedule Request
      </button>
    </div>
  ) : (
    <button className="mt-3 text-sm text-clay underline" onClick={() => setOpen(true)}>
      Request a reschedule
    </button>
  )
}

export default function PortalDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      await supabase.rpc('claim_bookings')
      const { data } = await supabase
        .from('bookings')
        .select(
          'id, service_type, consult_type, status, scheduled_at, call_link, payment_link_url, payment_amount',
        )
        .order('scheduled_at', { ascending: false })
      setBookings(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (loading) return <p className="px-6 py-24 text-center text-ink/60">Loading your bookings…</p>

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl">Your Portal</h1>
        <button onClick={signOut} className="text-sm text-ink/60 underline">
          Sign out
        </button>
      </div>

      {bookings.length === 0 && (
        <p className="rounded-lg bg-ink/5 p-6 text-ink/70">No bookings found for your account yet.</p>
      )}

      <div className="grid gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-ink/10 bg-white/50 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg">{SERVICE_TYPE_LABELS[b.service_type]}</h2>
              <span className="text-sm text-ink/60">
                {new Date(b.scheduled_at).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{b.consult_type} consult</p>

            <div className="mt-4">
              <StatusTracker status={b.status} />
            </div>

            {b.status === 'payment_requested' && b.payment_link_url && (
              <div className="mt-4 rounded-xl border border-clay/30 bg-clay/5 p-4">
                <p className="text-sm text-ink/80">
                  Ready to move forward? Pay ${b.payment_amount} to confirm your booking.
                </p>
                <a href={b.payment_link_url} target="_blank" rel="noreferrer" className="btn-primary mt-3">
                  Pay Now
                </a>
              </div>
            )}

            {(() => {
              const preInterview = b.status === 'consult_scheduled' || b.status === 'payment_requested'
              // The free consult itself needs a link when it's a video call.
              // Once past that stage, a Guided Session's actual paid interview
              // is always virtual (that's what makes it a Guided Session), so
              // it needs a link too — a Documentaries interview happens
              // in-person, so no link applies there.
              const needsCallLink =
                (preInterview && b.consult_type === 'video') ||
                (!preInterview && b.service_type === 'guided_session')
              if (!needsCallLink) return null
              return (
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  {b.call_link ? (
                    <a href={b.call_link} target="_blank" rel="noreferrer" className="btn-secondary">
                      Join Call
                    </a>
                  ) : (
                    <span className="text-ink/50">Call link will appear here closer to your session.</span>
                  )}
                </div>
              )
            })()}

            <RescheduleForm bookingId={b.id} />

            {b.status === 'ready_for_review' || b.status === 'delivered' ? (
              <DeliverableViewer bookingId={b.id} />
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-ink/20 p-4 text-sm text-ink/60">
                Footage upload and mail-in tracking are coming to the portal in a follow-up build.
                For now, reach out to 804-432-4773 to coordinate sending your raw footage.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
