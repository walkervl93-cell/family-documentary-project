import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MEDIA } from '../data/content'
import logo from '../assets/logo.png'

/** Set once the visitor has clicked through, so the splash doesn't reappear
 *  on every navigation back to the site root in the same tab. */
export const SPLASH_SEEN_KEY = 'tfdp-splash-seen'

/**
 * The full-screen teaser a first-time visitor lands on, with one way forward.
 *
 * On sound: no browser will autoplay an unmuted video, so it starts muted
 * with a visible unmute control. Clicking that control counts as a user
 * gesture, which both turns the sound on here and, in Chrome, makes it more
 * likely the home page hero can start with sound too.
 */
export default function Splash() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  function toggleSound() {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
    if (!el.muted) el.play().catch(() => {})
  }

  function enter() {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {
      // Private browsing can refuse storage. The splash simply shows again.
    }
    navigate('/home')
  }

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-6">
      {MEDIA.splashVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={MEDIA.splashVideo}
          poster={MEDIA.splashPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-ink">
          <span className="text-xs uppercase tracking-[0.3em] text-cream/30">
            Baba's teaser video
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink/50" aria-hidden="true" />

      <div className="relative flex flex-col items-center text-center">
        <img src={logo} alt="" className="mb-10 h-16 w-auto invert sm:h-20" />
        <button
          onClick={enter}
          className="rounded-full bg-clay px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream hover:text-ink"
        >
          Enter Site
        </button>
      </div>

      {MEDIA.splashVideo && (
        <button
          onClick={toggleSound}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="absolute bottom-6 right-6 rounded-full border border-cream/30 px-4 py-2 text-xs uppercase tracking-wide text-cream/80 backdrop-blur hover:border-cream hover:text-cream"
        >
          {muted ? 'Sound on' : 'Sound off'}
        </button>
      )}
    </div>
  )
}
