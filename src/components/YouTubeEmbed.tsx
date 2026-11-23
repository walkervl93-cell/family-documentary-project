import MediaPlaceholder from './MediaPlaceholder'

/**
 * A YouTube player sized to its container.
 *
 * Pass the video id, not the whole URL. An empty id renders the placeholder
 * instead, so the page can be built and shipped before the videos exist.
 *
 * Served from youtube.com rather than youtube-nocookie.com. The no-cookie
 * domain is the more private option, but it is also stricter about which
 * videos it will serve, and unlisted ones are among those it sometimes
 * refuses outright with "Video unavailable".
 *
 * On autoplay with sound: browsers refuse it. Chrome, Safari and Firefox all
 * block an unmuted video from starting on its own, and YouTube's own player
 * enforces the same rule, so `autoplay=1` without `mute=1` simply does not
 * start. We therefore autoplay muted and let the viewer unmute with the
 * player's own control. There is no setting that changes this.
 */
export default function YouTubeEmbed({
  id,
  title,
  className = 'aspect-video w-full',
  autoplay = false,
  loop = false,
  controls = true,
  placeholder = 'YouTube video',
}: {
  id: string
  title: string
  className?: string
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  placeholder?: string
}) {
  if (!id) return <MediaPlaceholder label={placeholder} className={className} />

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    controls: controls ? '1' : '0',
  })
  if (autoplay) {
    params.set('autoplay', '1')
    params.set('mute', '1')
  }
  if (loop) {
    params.set('loop', '1')
    // A looping embed needs its own id in the playlist or it plays once.
    params.set('playlist', id)
  }

  return (
    <iframe
      className={`${className} rounded-2xl border-0`}
      src={`https://www.youtube.com/embed/${id}?${params}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading="lazy"
    />
  )
}
