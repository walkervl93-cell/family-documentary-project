import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Documentaries from './pages/Documentaries'
import DigitizingServices from './pages/DigitizingServices'
import GuidedSession from './pages/GuidedSession'
import GivingBack from './pages/GivingBack'
import Portal from './pages/Portal'
import Admin from './pages/Admin'

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
              <Route path="/portal" element={<Portal />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
