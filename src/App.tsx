import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Documentaries from './pages/Documentaries'
import DigitizingServices from './pages/DigitizingServices'
import GuidedSession from './pages/GuidedSession'
import GivingBack from './pages/GivingBack'

// Guided Session's booking/payment wizard, the client portal, and the admin
// dashboard are built (see src/pages/GuidedSessionBook.tsx, GuidedSessionSuccess.tsx,
// Portal.tsx, Admin.tsx) but intentionally not routed here for now — the site is
// inquiry-only across all three service lines until online booking/payment and
// virtual interviews are ready to launch. Re-add their routes to re-enable.

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/documentaries" element={<Documentaries />} />
              <Route path="/digitizing-services" element={<DigitizingServices />} />
              <Route path="/guided-session" element={<GuidedSession />} />
              <Route path="/giving-back" element={<GivingBack />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
