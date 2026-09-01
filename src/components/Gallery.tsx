import { useState } from 'react'

/**
 * A single row of photos that scrolls on its own, forever, and pauses when the
 * pointer is over it.
 *
 * The images are rendered twice. The track animates from 0 to -50% of its own
 * width, which is exactly one full copy, so the moment it snaps back the frame
 * on screen is identical and the seam can't be seen. That's also why the
 * duration scales with the number of photos: a fixed duration would make a
 * fourteen-photo strip race past while a seven-photo one crawled.
 */
export default function Gallery({ images }: { images: string[] }) {
  // A photo that 404s would otherwise leave a broken-image icon riding round
  // the loop. Drop it from both copies instead, so the strip just closes up.
  const [broken, setBroken] = useState<Record<string, true>>({})
  const shown = images.filter((src) => !broken[src])

  if (shown.length === 0) return null

  const seconds = shown.length * 6

  return (
    <div className="gallery-strip overflow-hidden">
      <div className="gallery-track flex gap-3" style={{ animationDuration: `${seconds}s` }}>
        {[...shown, ...shown].map((src, i) => (
          <img
            // The second pass reuses the same sources, so the index has to be
            // part of the key.
            key={`${src}-${i}`}
            src={src}
            alt=""
            // The first copy has to be eager: it's what's on screen at the
            // start, and a lazy image inside a moving track can be skipped
            // over before the browser gets round to fetching it.
            loading={i < shown.length ? 'eager' : 'lazy'}
            onError={() => setBroken((prev) => ({ ...prev, [src]: true }))}
            className="aspect-[4/3] w-64 flex-none rounded-lg object-cover sm:w-80"
          />
        ))}
      </div>
    </div>
  )
}
