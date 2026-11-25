import { useState } from 'react'
import MediaPlaceholder from './MediaPlaceholder'

/**
 * A YouTube player sized to its container.
 *
 * Pass the video id, not the whole URL. An empty id renders the placeholder
 * instead, so the page can be built and shipped before the videos exist.
 *
 * By default this renders a facade: the video's own still with our play
 * button over it, and the real player is only created once someone clicks.
 * Two reasons. It keeps about a megabyte of player script out of the initial
 * page load, which is most of the delay before anything appears. And YouTube
 * no longer honours modestbranding, so its title bar and "Watch on YouTube"
 * overlay cannot be turned off on a live player; with a facade they are
 * simply not there until the viewer has chosen to watch.
 *
 * On autoplay with sound: browsers refuse it. Chrome, Safari and Firefox all
 * block an unmuted video from starting on its own, and YouTube's player
 * enforces the same rule, so autoplay without mute does not start at all.
 *
 * Never loop an unlisted video through the URL. Looping that way needs
 * `playlist=ID`, YouTube will not serve an unlisted video through a playlist,
 * and the embed answers "This video is unavailable" while the same id plays
 * fine elsewhere. Splash.tsx loops through the player API instead.
 */
export default function YouTubeEmbed({
  id,
  title,
  className = 'aspect-video w-full',
  autoplay = false,
  controls = true,
  eager = false,
  placeholder = 'YouTube video',
}: {
  id: string
  title: string
  className?: string
  /** Skips the facade and starts muted playback straight away. */
  autoplay?: boolean
  controls?: boolean
  /** Above the fold: fetch immediately rather than waiting for the viewport. */
  eager?: boolean
  placeholder?: string
}) {
  const [playing, setPlaying] = useState(autoplay)
  // maxresdefault does not exist for every upload, so fall back to hqdefault.
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
  const [noThumb, setNoThumb] = useState(false)

  // When YouTube holds no still for an id at all, it does not 404: it answers
  // 200 with its grey play-button placeholder, 120x90, which object-cover then
  // blows up into a grey slab across the section. onError never fires, so the
  // size is the only tell. A still that small is never a real frame.
  function checkRealFrame(e: React.SyntheticEvent<HTMLImageElement>) {
    if (e.currentTarget.naturalWidth > 160) return
    if (thumb.includes('maxresdefault')) {
      setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
      return
    }
    // hqdefault is a placeholder too: the video is private, still processing
    // or gone. Our own labelled card is better than YouTube's grey one.
    setNoThumb(true)
  }

  if (!id) return <MediaPlaceholder label={placeholder} className={className} />

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${title}`}
        className={`${className} group relative overflow-hidden rounded-3xl bg-ink`}
      >
        {!noThumb && (
          <img
            src={thumb}
            alt=""
            loading={eager ? 'eager' : 'lazy'}
            onLoad={checkRealFrame}
            onError={() => {
              if (thumb.includes('maxresdefault')) {
                setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
              } else {
                setNoThumb(true)
              }
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy/90 transition-transform group-hover:scale-110">
          {/* Our own play button, not YouTube's mark. */}
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-cream" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    )
  }

  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
    iv_load_policy: '3',
    controls: controls ? '1' : '0',
    // Only reached once the viewer has pressed play, which is also the user
    // gesture that lets playback start at all.
    autoplay: '1',
  })
  if (autoplay) params.set('mute', '1')

  return (
    <iframe
      className={`${className} rounded-3xl border-0`}
      src={`https://www.youtube.com/embed/${id}?${params}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
