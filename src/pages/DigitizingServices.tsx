import Gallery from '../components/Gallery'
import AutoVideo from '../components/AutoVideo'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { DIGITIZING_INTRO, DIGITIZING_DIFFERENTIATOR, DIGITIZING_SERVICES, MEDIA } from '../data/content'

export default function DigitizingServices() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">In-Person</p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Digitizing</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
          Organization, digitization, archive, then interview.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <AutoVideo className="w-full rounded-2xl" src={MEDIA.digitizingHeroVideo} controls />
      </section>

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
        <AutoVideo className="w-full rounded-2xl" src={MEDIA.memorialVideoExample} controls />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.digitizingGallery} />
      </section>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Book a Consult</h2>
        <p className="mt-3 text-center text-ink/70">
          Tell us where you're located, what you'd like preserved, and the style of interview.
          We'll discuss your project and answer any questions you might have via phone or video
          call.
        </p>
        <div className="mt-8">
          <ConsultBookingForm serviceType="documentary" />
        </div>
      </section>
    </>
  )
}
