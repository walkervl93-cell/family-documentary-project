import PageHero from '../components/PageHero'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { AUDIO_INTRO, AUDIO_PROCESS, MEDIA } from '../data/content'

export default function Audio() {
  return (
    <>
      <PageHero
        eyebrow="New · In-Person"
        title="Audio"
        subtitle="Their story, in their voice. A more accessible way to preserve your family's history — recorded, edited, and set to your own photos and videos."
      >
        <div className="mt-8">
          <a href="#book-consult" className="btn-primary">
            Book a Free Consult
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed">{AUDIO_INTRO}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <video className="w-full rounded-2xl" src={MEDIA.documentariesHeroVideo} controls playsInline />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl">How It Works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {AUDIO_PROCESS.map((step, i) => (
            <div key={step.step} className="rounded-2xl border border-ink/10 bg-white/50 p-8">
              <span className="text-sm font-medium uppercase tracking-wide text-clay">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-xl">{step.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-moss/30 bg-moss/5 p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-moss">
            A lighter way to preserve a story
          </p>
          <p className="mt-2 text-ink/80">
            It's a lighter lift than a full documentary — no production crew, no full-day set,
            just a sit-down conversation and the photos and videos you already have. That means
            we can pass the savings on to you, and bring this kind of preservation to more
            families.
          </p>
        </div>
      </section>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Book a Free Consult</h2>
        <p className="mt-3 text-center text-ink/70">
          No payment required — we'll talk through your family's story and figure out next steps
          together.
        </p>
        <div className="mt-8">
          <ConsultBookingForm serviceType="audio" />
        </div>
      </section>
    </>
  )
}
