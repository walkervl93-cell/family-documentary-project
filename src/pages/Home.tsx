import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import AutoVideo from '../components/AutoVideo'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { BRAND, HOME_INTRO, WHAT_WE_OFFER, DOCUMENTARY_STYLES, MEDIA } from '../data/content'

export default function Home() {
  // The style-card clips are dropped into public/videos/ by hand, so a path
  // may point at a file that isn't there yet — fall back to the placeholder
  // rather than rendering a broken player.
  const [missingClips, setMissingClips] = useState<Record<string, boolean>>({})

  return (
    <>
      <PageHero
        eyebrow={BRAND.mission}
        title={BRAND.tagline}
        subtitle={BRAND.description}
        videoSrc={MEDIA.homeHeroVideo}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#book-consult" className="btn-primary">
            Book a Call
          </a>
          <Link
            to="/documentaries#process"
            className="btn-secondary border-cream/40 text-cream hover:border-cream"
          >
            Explore the Process
          </Link>
        </div>
      </PageHero>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-center text-3xl">Let's Connect</h2>
        <p className="mt-3 text-center text-ink/70">
          Ready to start telling your family's story? Book a free consult below. No payment
          required.
        </p>
        <div className="mt-8">
          <ConsultBookingForm serviceType="documentary" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-lg leading-relaxed sm:text-xl">{HOME_INTRO}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <AutoVideo className="w-full rounded-2xl" src={MEDIA.generationalClip} controls />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl">We Create a Documentary That Fits Your Needs</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-ink/70">{WHAT_WE_OFFER}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOCUMENTARY_STYLES.map((style) => {
            const videoSrc = MEDIA[style.videoKey as keyof typeof MEDIA] as string
            return (
              <div key={style.id} className="rounded-2xl border border-ink/10 bg-white/50 p-6">
                {videoSrc && !missingClips[style.id] ? (
                  <AutoVideo
                    className="aspect-video w-full rounded-xl object-cover"
                    src={videoSrc}
                    onError={() => setMissingClips((prev) => ({ ...prev, [style.id]: true }))}
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-ink/5 text-xs uppercase tracking-wide text-ink/40">
                    Example coming soon
                  </div>
                )}
                <h3 className="mt-4 text-lg">{style.name}</h3>
                <p className="mt-3 text-sm text-ink/70">{style.copy}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 pb-24">
        <h2 className="text-center text-3xl lowercase">generational storytelling</h2>
        <div className="mt-12">
          <Gallery images={MEDIA.homeGallery} />
        </div>
      </section>
    </>
  )
}
