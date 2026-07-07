import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface PickupRequest {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  media_types: string[] | null
  media_count: string | null
  preferred_time_slot: string | null
  status: string
  created_at: string
}

export default function PickupRequestsTab() {
  const [rows, setRows] = useState<PickupRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-ink/60">Loading…</p>
  if (rows.length === 0) return <p className="text-ink/60">No Digitizing Services pickup requests yet.</p>

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-ink/10 bg-white/50 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">{r.name}</h3>
            <span className="text-xs uppercase tracking-wide text-clay">{r.status}</span>
          </div>
          <p className="mt-1 text-sm text-ink/70">
            {r.email} {r.phone && `· ${r.phone}`} {r.location && `· ${r.location}`}
          </p>
          {r.media_types && <p className="mt-1 text-sm text-ink/60">Media: {r.media_types.join(', ')}</p>}
          {r.media_count && <p className="text-sm text-ink/60">Volume: {r.media_count}</p>}
          {r.preferred_time_slot && (
            <p className="text-sm text-ink/60">Preferred time: {r.preferred_time_slot}</p>
          )}
          <p className="mt-2 text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
