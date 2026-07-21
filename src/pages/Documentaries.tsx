import Gallery from '../components/Gallery'
import InquiryForm from '../components/InquiryForm'
import { DOCUMENTARY_PROCESS, MEDIA } from '../data/content'

export default function Documentaries() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">
          Full Production · $4,000 – $8,000
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Documentaries</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
          An in-home, multi-hour production with our full crew — resulting in a complete
          documentary of your family's story.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <video className="w-full rounded-2xl" src={MEDIA.documentariesHeroVideo} controls playsInline />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl">Our Process</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {DOCUMENTARY_PROCESS.map((step, i) => (
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

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.documentariesGallery} />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Start Your Documentary</h2>
        <p className="mt-3 text-center text-ink/70">
          This is an inquiry-only process — tell us a bit about your family and we'll follow up to
          talk through timing, pricing, and next steps.
        </p>
        <div className="mt-8">
          <InquiryForm />
        </div>
      </section>
    </>
  )
}
