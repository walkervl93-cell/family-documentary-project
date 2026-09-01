import { useState } from 'react'
import Gallery from '../components/Gallery'
import AutoVideo from '../components/AutoVideo'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { DOCUMENTARY_PROCESS, MEDIA } from '../data/content'

export default function Documentaries() {
  // These clips live in public/videos/ and are swapped by hand, so drop the
  // whole section rather than showing a broken player if one isn't there yet.
  const [heroMissing, setHeroMissing] = useState(false)
  const [processVideoMissing, setProcessVideoMissing] = useState(false)

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">
          Full Production
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">The Documentary</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
          An in-home, multi-hour production with our full crew. Whether you want an audio or video
          interview, we will create a complete documentary painting the picture of your loved
          ones' lives.
        </p>
      </section>

      {MEDIA.documentariesNewHeroVideo && !heroMissing && (
        <section className="mx-auto max-w-6xl px-6 pb-10">
          <AutoVideo
            className="w-full rounded-2xl"
            src={MEDIA.documentariesNewHeroVideo}
            controls
            onError={() => setHeroMissing(true)}
          />
        </section>
      )}

      <section id="process" className="mx-auto max-w-6xl px-6 py-20">
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

        {MEDIA.documentariesProcessVideo && !processVideoMissing && (
          <div className="mt-12">
            <AutoVideo
              className="w-full rounded-2xl"
              src={MEDIA.documentariesProcessVideo}
              controls
              onError={() => setProcessVideoMissing(true)}
            />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.documentariesGallery} />
      </section>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Book a Free Consult</h2>
        <p className="mt-3 text-center text-ink/70">
          Start with a free phone or video consult to talk through your family's story and next
          steps. If it's a good fit, we'll follow up afterward.
        </p>
        <div className="mt-8">
          <ConsultBookingForm serviceType="documentary" />
        </div>
      </section>
    </>
  )
}
