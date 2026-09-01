import { useEffect, useRef, useState } from 'react'

/**
 * A muted, looping video that only downloads once it's near the viewport, and
 * pauses again when it scrolls away.
 *
 * A plain `autoPlay` attribute makes the browser fetch every video on the page
 * the moment it loads, so five clips on the home page all compete for the same
 * connection and each one stutters. Deferring the `src` until the element is
 * close to being seen means a visitor only ever pays for what they actually
 * reach.
 */
export default function AutoVideo({
  src,
  className,
  controls = false,
  onError,
}: {
  src: string
  className?: string
  controls?: boolean
  onError?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Without IntersectionObserver (very old browsers) just load everything —
    // a slow page beats a page with no video on it at all.
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          // play() rejects if the browser declines to autoplay (a data-saver
          // setting, say). The controls are there for that case, so there's
          // nothing to handle beyond not throwing.
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      // Start fetching a little before it's on screen so it's ready by the
      // time the visitor gets there.
      { rootMargin: '300px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={shouldLoad ? src : undefined}
      controls={controls}
      muted
      loop
      playsInline
      preload="none"
      onError={onError}
    />
  )
}
