import { useEffect, useRef, useState } from 'react'

/**
 * A muted, looping video that downloads before it is reached and plays once
 * it is actually on screen.
 *
 * Two separate observers, which is the point. A plain `autoPlay` attribute
 * makes the browser fetch every video on the page at once, so several clips
 * compete for the same connection and each one stutters. But loading only at
 * the moment a clip becomes visible is the opposite mistake: the download
 * starts from nothing exactly when the viewer is already looking at it, which
 * is what made these take seconds to move.
 *
 * So: start fetching a long way out, a screenful and a half, and start
 * playing only when it is genuinely in view. By the time the viewer arrives
 * it has buffered, and nothing off screen is burning bandwidth playing to
 * an empty room.
 */
export default function AutoVideo({
  src,
  className,
  controls = false,
  /** Above the fold: fetch immediately instead of waiting for an observer. */
  eager = false,
  onError,
}: {
  src: string
  className?: string
  controls?: boolean
  eager?: boolean
  onError?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(eager)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Without IntersectionObserver (very old browsers) just load everything.
    // A slow page beats a page with no video on it at all.
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    // Far out: begin fetching.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          loader.disconnect()
        }
      },
      { rootMargin: '1500px' },
    )

    // On screen: play. Off screen: pause.
    const player = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser declines to autoplay (a data-saver
          // setting, say). The controls are there for that case, so there is
          // nothing to handle beyond not throwing.
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin: '0px', threshold: 0.1 },
    )

    if (!eager) loader.observe(el)
    player.observe(el)
    return () => {
      loader.disconnect()
      player.disconnect()
    }
  }, [eager])

  // Every clip has a still of its own first frame in public/posters/, named
  // after the file. It shows instantly while the video itself is still
  // arriving, so a section never opens as a black rectangle.
  const poster = src.startsWith('/videos/')
    ? src.replace('/videos/', '/posters/').replace(/\.mp4$/, '-poster.jpg')
    : undefined

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={shouldLoad ? src : undefined}
      controls={controls}
      muted
      loop
      playsInline
      // Only meaningful once src is set, and by then we have decided this one
      // is worth fetching, so buffer it properly rather than on demand.
      preload={shouldLoad ? 'auto' : 'none'}
      onError={onError}
    />
  )
}
