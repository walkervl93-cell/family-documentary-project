import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { GUIDED_SESSION_STATUSES } from '../data/content'
import type { BookingStatus } from '../lib/database.types'

interface Booking {
  id: string
  client_email: string
  package_type: string
  addons: string[]
  status: string
  scheduled_at: string
  call_link: string | null
  amount_paid: number | null
}

interface Intake {
  storyteller_name: string
  relationship: string
  best_contact: string | null
  topics: string | null
  sensitive_topics: string | null
  preferred_language: string | null
}

function BookingRow({ booking, onUpdated }: { booking: Booking; onUpdated: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [intake, setIntake] = useState<Intake | null>(null)
  const [callLink, setCallLink] = useState(booking.call_link ?? '')
  const [status, setStatus] = useState(booking.status as BookingStatus)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function loadIntake() {
    if (intake) return
    const { data } = await supabase
      .from('intake_forms')
      .select('storyteller_name, relationship, best_contact, topics, sensitive_topics, preferred_language')
      .eq('booking_id', booking.id)
      .single()
    setIntake(data ?? null)
  }

  async function save() {
    setSaving(true)
    await supabase.from('bookings').update({ status, call_link: callLink || null }).eq('id', booking.id)
    setSaving(false)
    onUpdated()
  }

  async function uploadDeliverable(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const path = `${booking.id}/${Date.now()}-${file.name}`
      const { error: uploadErr } = await supabase.storage.from('deliverables').upload(path, file)
      if (uploadErr) throw uploadErr

      const { data: existing } = await supabase
        .from('deliverables')
        .select('version')
        .eq('booking_id', booking.id)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { error: insertErr } = await supabase.from('deliverables').insert({
        booking_id: booking.id,
        file_url: path,
        version: (existing?.version ?? 0) + 1,
        revision_requested: false,
      })
      if (insertErr) throw insertErr

      onUpdated()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white/50 p-5">
      <button
        className="flex w-full flex-wrap items-baseline justify-between gap-2 text-left"
        onClick={() => {
          setExpanded((e) => !e)
          if (!expanded) loadIntake()
        }}
      >
        <span className="font-medium">{booking.client_email}</span>
        <span className="text-xs uppercase tracking-wide text-clay">{booking.status}</span>
      </button>
      <p className="mt-1 text-sm text-ink/70">
        {new Date(booking.scheduled_at).toLocaleString()} ·{' '}
        {booking.amount_paid != null ? `$${booking.amount_paid}` : 'unpaid'}
      </p>
      {booking.addons.length > 0 && (
        <p className="text-xs text-ink/50">Add-ons: {booking.addons.join(', ')}</p>
      )}

      {expanded && (
        <div className="mt-4 grid gap-4 border-t border-ink/10 pt-4">
          {intake ? (
            <div className="text-sm text-ink/80">
              <p>
                <strong>Storyteller:</strong> {intake.storyteller_name} ({intake.relationship})
              </p>
              {intake.best_contact && <p>Contact: {intake.best_contact}</p>}
              {intake.topics && <p>Topics: {intake.topics}</p>}
              {intake.sensitive_topics && <p>Avoid: {intake.sensitive_topics}</p>}
              {intake.preferred_language && <p>Language: {intake.preferred_language}</p>}
            </div>
          ) : (
            <p className="text-sm text-ink/50">Loading intake…</p>
          )}

          <label className="text-sm">
            Call link
            <input
              className="input mt-1"
              value={callLink}
              onChange={(e) => setCallLink(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="text-sm">
            Status
            <select
              className="input mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
            >
              {GUIDED_SESSION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary w-fit" disabled={saving} onClick={save}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          <label className="text-sm">
            Upload finished film (creates the next version, viewable in the client's portal)
            <input
              className="input mt-1"
              type="file"
              accept="video/mp4,video/quicktime,video/x-m4v"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadDeliverable(file)
                e.target.value = ''
              }}
            />
          </label>
          {uploading && <p className="text-sm text-ink/50">Uploading…</p>}
          {uploadError && <p className="text-sm text-clay">{uploadError}</p>}

          <p className="text-xs text-ink/40">
            Status-change emails are sent manually from here in a follow-up build — no automatic
            emails are triggered by status changes.
          </p>
        </div>
      )}
    </div>
  )
}

export default function GuidedSessionBookingsTab() {
  const [rows, setRows] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('bookings')
      .select('id, client_email, package_type, addons, status, scheduled_at, call_link, amount_paid')
      .neq('status', 'pending_payment')
      .order('scheduled_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p className="text-ink/60">Loading…</p>
  if (rows.length === 0) return <p className="text-ink/60">No confirmed Guided Session bookings yet.</p>

  return (
    <div className="grid gap-4">
      {rows.map((b) => (
        <BookingRow key={b.id} booking={b} onUpdated={load} />
      ))}
    </div>
  )
}
