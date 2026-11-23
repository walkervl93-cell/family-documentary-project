import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import AutoVideo from '../components/AutoVideo'
import YouTubeEmbed from '../components/YouTubeEmbed'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { BRAND, HOME_INTRO, WHAT_WE_OFFER, DOCUMENTARY_STYLES, MEDIA, YOUTUBE } from '../data/content'

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow={BRAND.mission}
        title={BRAND.tagline}
        subtitle={BRAND.description}
        videoSrc={MEDIA.homeHeroVideo}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#newsletter" className="btn-primary">
            Sign Up for the Newsletter
          </a>
          <Link
            to="/our-process"
            className="btn-secondary border-cream/40 text-cream hover:border-cream"
          >
            Explore the Process
          </Link>
        </div>
      </PageHero>

      {/* The hero reel, as a YouTube embed. Muted at the start because no
          browser will autoplay sound; the viewer unmutes from the player. */}
      <section className="mx-auto max-w-5xl px-6 pt-12">
        <YouTubeEmbed
          id={YOUTUBE.homeHero}
          title="The Family Documentary Project"
          autoplay
          eager
          placeholder="Home hero video (YouTube)"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl">We Create a Documentary That Fits Your Needs</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-ink/70">{WHAT_WE_OFFER}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOCUMENTARY_STYLES.map((style) => (
            <div key={style.id} className="rounded-2xl border border-ink/10 bg-white/50 p-6">
              {/* Left as local files on purpose: these are silent looping
                  teasers, and four YouTube players here would cost more in
                  script than the clips cost in video. */}
              <AutoVideo
                className="aspect-video w-full rounded-xl object-cover"
                src={MEDIA[style.videoKey as keyof typeof MEDIA] as string}
              />
              <h3 className="mt-4 text-lg">{style.name}</h3>
              <p className="mt-3 text-sm text-ink/70">{style.copy}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center font-serif text-lg leading-relaxed sm:text-xl">
          {HOME_INTRO}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <YouTubeEmbed id={YOUTUBE.homeFeature}
          title="A Family Documentary Project film"
          placeholder="Feature video" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.homeGallery} />
      </section>

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
    </>
  )
}
