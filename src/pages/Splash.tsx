import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MEDIA, YOUTUBE } from '../data/content'
import logo from '../assets/logo.png'

/** Set once the visitor has clicked through, so the splash doesn't reappear
 *  on every navigation back to the site root in the same tab. */
export const SPLASH_SEEN_KEY = 'tfdp-splash-seen'

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

/** Loads YouTube's player script once, however many callers ask for it. */
function loadIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise((resolve) => {
    const existing = document.getElementById('yt-iframe-api')
    if (!existing) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
  })
}

/**
 * The full-screen teaser a first-time visitor lands on, with one way forward.
 *
 * Looping is done through the player API rather than the `loop=1&playlist=ID`
 * URL trick. That trick builds an implicit playlist, and YouTube will not
 * serve an UNLISTED video through a playlist: the embed answers "This video
 * is unavailable" while the very same id plays fine elsewhere on the site.
 * Restarting the player ourselves when it ends has no such restriction.
 *
 * On sound: no browser autoplays an unmuted video, so it starts muted with a
 * visible control. Clicking that counts as a user gesture, which both turns
 * the sound on here and makes Chrome likelier to allow sound on the home
 * page afterwards.
 */
export default function Splash() {
  const navigate = useNavigate()
  const localRef = useRef<HTMLVideoElement>(null)
  const ytHostRef = useRef<HTMLDivElement>(null)
  const ytPlayerRef = useRef<any>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!YOUTUBE.splashTeaser || !ytHostRef.current) return
    let cancelled = false

    loadIframeApi().then(() => {
      if (cancelled || !ytHostRef.current) return
      ytPlayerRef.current = new window.YT.Player(ytHostRef.current, {
        videoId: YOUTUBE.splashTeaser,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute()
            e.target.playVideo()
          },
          // 0 is ENDED. Restarting here is what replaces loop=1.
          onStateChange: (e: any) => {
            if (e.data === 0) e.target.seekTo(0, true)
          },
        },
      })
    })

    return () => {
      cancelled = true
      ytPlayerRef.current?.destroy?.()
      ytPlayerRef.current = null
    }
  }, [])

  function toggleSound() {
    const yt = ytPlayerRef.current
    if (yt) {
      if (muted) {
        yt.unMute()
        yt.setVolume(100)
      } else {
        yt.mute()
      }
      setMuted(!muted)
      return
    }
    const el = localRef.current
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

  const hasVideo = Boolean(YOUTUBE.splashTeaser || MEDIA.splashVideo)

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-6">
      {YOUTUBE.splashTeaser ? (
        // Scaled well past the viewport on purpose. YouTube ignores
        // modestbranding now, and anchors its title and "Watch on YouTube"
        // buttons to the player's own corners, so oversizing pushes that
        // chrome off screen. pointer-events-none keeps it unclickable, which
        // also stops the overlay appearing on hover.
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-150"
          aria-hidden="true"
        >
          <div ref={ytHostRef} className="h-full w-full" />
        </div>
      ) : MEDIA.splashVideo ? (
        <video
          ref={localRef}
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
            Splash teaser video
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink/50" aria-hidden="true" />

      <div className="relative flex flex-col items-center text-center">
        <img src={logo} alt="" className="mb-10 h-16 w-auto invert sm:h-20" />
        <button
          onClick={enter}
          className="rounded-full bg-navy px-4 py-2 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-cream hover:text-ink"
        >
          Enter Site
        </button>
      </div>

      {hasVideo && (
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
