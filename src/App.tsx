import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import ScrollManager from './components/ScrollManager'
import Footer from './components/Footer'
import Splash from './pages/Splash'
import Home from './pages/Home'
import OurWhy from './pages/OurWhy'
import OurProcess from './pages/OurProcess'
import GivingBack from './pages/GivingBack'
import Intake from './pages/Intake'
import Portal from './pages/Portal'
import Admin from './pages/Admin'
import PictureThis, { PICTURE_THIS_SLUG } from './pages/PictureThis'

function SiteLayout() {
  // Giving Back ends on its own sign-up card over a full-bleed slideshow. A
  // second sign-up form immediately under it competes with the one the page
  // exists for, so that page keeps the header and drops the footer.
  const { pathname } = useLocation()
  const hideFooter = pathname === '/giving-back'

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          {/* Standalone, no site chrome. */}
          <Route path="/" element={<Splash />} />
          <Route path={`/${PICTURE_THIS_SLUG}`} element={<PictureThis />} />

          <Route element={<SiteLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/our-why" element={<OurWhy />} />
            <Route path="/our-process" element={<OurProcess />} />
            <Route path="/giving-back" element={<GivingBack />} />
            {/* Direct link only: absent from nav and footer, marks itself
                noindex. */}
            <Route path="/intake" element={<Intake />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Retired pages. These URLs are in the old site's history and in
              emails already sent, so they redirect rather than 404. */}
          <Route path="/documentaries" element={<Navigate to="/our-why" replace />} />
          <Route path="/digitizing-services" element={<Navigate to="/our-process" replace />} />
          <Route path="/audio" element={<Navigate to="/our-process" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
