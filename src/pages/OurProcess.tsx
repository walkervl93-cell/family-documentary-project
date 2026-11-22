import MediaPlaceholder from '../components/MediaPlaceholder'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { DOCUMENTARY_PROCESS, WHAT_TO_EXPECT, MEDIA } from '../data/content'

export default function OurProcess() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">
          How we work
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Our Process</h1>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed">
          We make one thing: a documentary about a person. We research a life before we film it.
          We light a room properly because the person in it deserves to be seen well. We digitize
          photographs because a story is easier to believe when you can see it. None of these are
          add-ons. They are what it takes to capture someone's story properly.
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
          What changes is the shape. Some people want to sit down across from you and talk. Some
          need to be moving, walking the house, holding things, pointing at what's on the wall.
          Neither one is better. The story arrives on its own terms, and our job is to be ready
          when it does.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        {MEDIA.processSetupImage ? (
          <img
            src={MEDIA.processSetupImage}
            alt=""
            className="aspect-[21/9] w-full rounded-3xl object-cover"
          />
        ) : (
          <MediaPlaceholder
            label="Set-up in a client's home"
            className="aspect-[21/9] w-full"
          />
        )}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {DOCUMENTARY_PROCESS.map((step, i) => (
            <div key={step.step} className="rounded-2xl border border-ink/10 bg-white/50 p-8">
              <span className="text-sm font-medium uppercase tracking-wide text-clay">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 text-xl">{step.step}</h2>
              <p className="mt-3 text-ink/70">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-sand/30">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-3xl">What to Expect</h2>
          <dl className="mt-10 grid gap-7">
            {WHAT_TO_EXPECT.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-2 text-ink/70">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Book a Free Consult</h2>
        <p className="mt-3 text-center text-ink/70">
          A short call, phone or video. Nothing to prepare, and nothing booked at the end of it
          unless you want it to be.
        </p>
        <div className="mt-8">
          <ConsultBookingForm serviceType="documentary" />
        </div>
      </section>
    </>
  )
}
