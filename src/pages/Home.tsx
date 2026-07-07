import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import InquiryForm from '../components/InquiryForm'
import { BRAND, HOME_INTRO, WHAT_WE_OFFER, MEDIA } from '../data/content'

const SERVICES = [
  {
    name: 'Documentaries',
    price: '$4,000 – $8,000',
    copy: 'A full in-home production — our crew spends the day capturing your family’s story on camera and crafts it into a complete documentary.',
    to: '/documentaries',
  },
  {
    name: 'Digitizing Services',
    price: 'Pricing per project',
    copy: 'Organization, digitization, and memorial videos. We come to you, so your originals never leave your hands.',
    to: '/digitizing-services',
  },
  {
    name: 'Guided Session',
    price: '$400 – $900',
    copy: 'Book a live video-call interview from anywhere. A trained interviewer guides the conversation while you film on your own device.',
    to: '/guided-session',
  },
]

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow={BRAND.mission}
        title={`${BRAND.name} — ${BRAND.tagline}`}
        subtitle={BRAND.description}
        videoSrc={MEDIA.homeHeroVideo}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/documentaries" className="btn-primary">
            Start a Documentary
          </Link>
          <Link to="/guided-session" className="btn-secondary border-cream/40 text-cream hover:border-cream">
            Book a Guided Session
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed sm:text-3xl">{HOME_INTRO}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <video className="w-full rounded-2xl" src={MEDIA.generationalClip} controls playsInline />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl">What We Offer</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-ink/70">{WHAT_WE_OFFER}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.name}
              to={s.to}
              className="group rounded-2xl border border-ink/10 bg-white/50 p-8 transition-colors hover:border-clay"
            >
              <h3 className="text-xl">{s.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-wide text-clay">{s.price}</p>
              <p className="mt-4 text-sm text-ink/70">{s.copy}</p>
              <span className="mt-6 inline-block text-sm font-medium text-ink group-hover:text-clay">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Gallery images={MEDIA.homeGallery} />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-center text-3xl">Let's Connect</h2>
        <p className="mt-3 text-center text-ink/70">
          Have a question, or ready to start telling your family's story?
        </p>
        <div className="mt-8">
          <InquiryForm />
        </div>
      </section>
    </>
  )
}
