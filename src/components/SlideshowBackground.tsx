import { useEffect, useState } from 'react'

/**
 * A full-bleed background that cross-dissolves through a set of images.
 *
 * Every image is rendered at once and only opacity changes, so a dissolve
 * never waits on a download part-way through the loop. They are preloaded
 * eagerly for the same reason: a lazy image in a fading stack would pop in
 * halfway through its own fade.
 */
export default function SlideshowBackground({
  images,
  intervalMs = 5000,
}: {
  images: string[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
