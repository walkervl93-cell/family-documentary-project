import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import ScrollManager from './components/ScrollManager'
import Footer from './components/Footer'
import Home from './pages/Home'
import Documentaries from './pages/Documentaries'
import DigitizingServices from './pages/DigitizingServices'
import Audio from './pages/Audio'
import GivingBack from './pages/GivingBack'
import Intake from './pages/Intake'
import Portal from './pages/Portal'
import Admin from './pages/Admin'
import PictureThis, { PICTURE_THIS_SLUG } from './pages/PictureThis'

/** The ordinary site: header, page, footer. */
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          {/* Standalone: no nav, no footer, nothing but the page itself. A
              campaign landing page is its own thing, and the site's chrome
              would only offer ways to click away from it. */}
          <Route path={`/${PICTURE_THIS_SLUG}`} element={<PictureThis />} />

          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/documentaries" element={<Documentaries />} />
            <Route path="/digitizing-services" element={<DigitizingServices />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/giving-back" element={<GivingBack />} />
            {/* Shared as a direct link only: deliberately absent from the
                nav and the footer, and the page marks itself noindex. */}
            <Route path="/intake" element={<Intake />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
