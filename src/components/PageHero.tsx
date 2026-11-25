import type { ReactNode } from 'react'
import AutoVideo from './AutoVideo'

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  videoSrc,
  compact = false,
  light = false,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  videoSrc?: string
  /** Tighter top and bottom, for a hero with something right underneath it. */
  compact?: boolean
  /** White ground with dark type, instead of the dark block. */
  light?: boolean
  children?: ReactNode
}) {
  return (
    <section
      className={`relative overflow-hidden ${
        light ? 'bg-white text-ink' : 'bg-ink text-cream'
      }`}
    >
      {videoSrc && (
        <AutoVideo
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src={videoSrc}
        />
      )}
      <div
        className={`relative mx-auto max-w-4xl px-6 text-center ${compact ? 'py-16' : 'py-28'}`}
      >
        {eyebrow && (
          <p
            className={`mb-3 text-xs font-medium uppercase tracking-[0.2em] ${
              // navy-soft is mixed for contrast against ink; on white it is
              // the full navy that carries.
              light ? 'text-navy' : 'text-navy-soft'
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        {subtitle && (
          <p
            className={`mx-auto mt-5 max-w-2xl text-lg ${light ? 'text-ink/70' : 'text-cream/80'}`}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
