import { useState } from 'react'
import { useAdminGuard } from '../admin/useAdminGuard'
import PortalLogin from '../portal/PortalLogin'
import InquiriesTab from '../admin/InquiriesTab'
import PickupRequestsTab from '../admin/PickupRequestsTab'
import InterviewBookingsTab from '../admin/InterviewBookingsTab'
import { supabase } from '../lib/supabase'

const TABS = [
  { id: 'interviews', label: 'Interview Bookings (Consults)' },
  { id: 'pickups', label: 'Digitizing Pickup Requests' },
  { id: 'inquiries', label: 'General Contact Messages' },
] as const

export default function Admin() {
  const { session, checking, isAdmin } = useAdminGuard()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('interviews')

  if (checking) return <p className="px-6 py-24 text-center text-ink/60">Loading…</p>
  if (!session) return <PortalLogin />
  if (!isAdmin) {
    return (
      <p className="px-6 py-24 text-center text-ink/60">
        This account doesn't have admin access. Sign in with an admin email, or contact the site
        owner to be granted the admin role.
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-ink/60 underline">
          Sign out
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-sm ${
              tab === t.id ? 'border-clay bg-clay text-cream' : 'border-ink/20 text-ink/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'interviews' && <InterviewBookingsTab />}
      {tab === 'pickups' && <PickupRequestsTab />}
      {tab === 'inquiries' && <InquiriesTab />}
    </div>
  )
}
