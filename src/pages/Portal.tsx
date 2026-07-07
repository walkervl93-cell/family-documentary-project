import { useAuth } from '../context/AuthContext'
import PortalLogin from '../portal/PortalLogin'
import PortalDashboard from '../portal/PortalDashboard'

export default function Portal() {
  const { session, loading } = useAuth()

  if (loading) return <p className="px-6 py-24 text-center text-ink/60">Loading…</p>

  return session ? <PortalDashboard /> : <PortalLogin />
}
