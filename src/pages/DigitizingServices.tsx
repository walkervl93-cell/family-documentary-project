import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import PickupRequestForm from '../components/PickupRequestForm'
import { DIGITIZING_INTRO, DIGITIZING_DIFFERENTIATOR, DIGITIZING_SERVICES, MEDIA } from '../data/content'

export default function DigitizingServices() {
  return (
    <>
      <PageHero
        eyebrow="Pickup Service"
        title="Digitizing Services"
        subtitle="Organization, digitization, and memorial videos — we come to you, wherever you are."
        videoSrc={MEDIA.digitizingHeroVideo}
      />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed">{DIGITIZING_INTRO}</p>
        <div className="mt-8 rounded-2xl border border-clay/30 bg-clay/5 p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-clay">What sets us apart</p>
          <p className="mt-2 text-ink/80">{DIGITIZING_DIFFERENTIATOR}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {DIGITIZING_SERVICES.map((service) => (
            <div key={service.name} className="rounded-2xl border border-ink/10 bg-white/50 p-8">
              <h3 className="text-xl">{service.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <video className="w-full rounded-2xl" src={MEDIA.memorialVideoExample} controls playsInline />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.digitizingGallery} />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Request a Pickup</h2>
        <p className="mt-3 text-center text-ink/70">
          Tell us where you're located and what you'd like preserved — we'll come to you to pick
          up your materials.
        </p>
        <div className="mt-8">
          <PickupRequestForm />
        </div>
      </section>
    </>
  )
}
