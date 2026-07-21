import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  timeline: string | null
  message: string | null
  status: string
  service: string
  created_at: string
}

const SERVICE_LABELS: Record<string, string> = {
  documentary: 'Documentaries',
  guided_session: 'Guided Session',
}

export default function InquiriesTab() {
  const [rows, setRows] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-ink/60">Loading…</p>
  if (rows.length === 0) return <p className="text-ink/60">No inquiries yet.</p>

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-ink/10 bg-white/50 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">{r.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-ink/50">
                {SERVICE_LABELS[r.service] ?? r.service}
              </span>
              <span className="text-xs uppercase tracking-wide text-clay">{r.status}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-ink/70">
            {r.email} {r.phone && `· ${r.phone}`} {r.location && `· ${r.location}`}
          </p>
          {r.timeline && <p className="mt-1 text-sm text-ink/60">Timeline: {r.timeline}</p>}
          {r.message && <p className="mt-2 text-sm text-ink/80">{r.message}</p>}
          <p className="mt-2 text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
