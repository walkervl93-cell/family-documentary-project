import { useEffect, useRef, useState } from 'react'

/**
 * A single-row photo carousel. Scrolls by swipe or trackpad on its own, with
 * arrow buttons for anyone on a mouse, and snaps so a photo never comes to
 * rest half out of frame.
 *
 * Replaces the old square grid, which grew taller with every photo added; a
 * strip stays the same height whether it holds five images or fifty.
 */
export default function Gallery({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Dim the arrows at the ends rather than leaving one that visibly does
  // nothing.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    function update() {
      if (!el) return
      setAtStart(el.scrollLeft <= 1)
      // A pixel of slack: fractional widths mean scrollLeft rarely lands
      // exactly on the maximum.
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [images])

  function scrollBy(direction: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    // Move most of a screenful, keeping a sliver of the previous photo visible
    // so it reads as a continuous strip rather than separate pages.
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (images.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-64 flex-none snap-start rounded-lg object-cover sm:w-80"
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photos"
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-lg text-ink shadow-md transition-opacity hover:bg-cream disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="More photos"
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-lg text-ink shadow-md transition-opacity hover:bg-cream disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        ›
      </button>
    </div>
  )
}
