import type { ReactNode } from 'react'

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  videoSrc,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  videoSrc?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      {videoSrc && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
        {eyebrow && (
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">{eyebrow}</p>
        )}
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/80">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
