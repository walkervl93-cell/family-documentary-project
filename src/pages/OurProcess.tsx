import MediaPlaceholder from '../components/MediaPlaceholder'
import ProcessTimeline from '../components/ProcessTimeline'
import YouTubeEmbed from '../components/YouTubeEmbed'
import ConsultBookingForm from '../components/ConsultBookingForm'
import {
  DOCUMENTARY_PROCESS,
  OUR_PROCESS_INTRO,
  WHAT_TO_EXPECT,
  MEDIA,
  YOUTUBE,
} from '../data/content'

export default function OurProcess() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-navy">
          How we work
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Our Process</h1>
        <div className="mx-auto mt-6 grid max-w-2xl gap-5">
          {OUR_PROCESS_INTRO.map((para) => (
            <p key={para} className="font-serif text-xl leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="media-wide pb-12">
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

      {/* One screen, no inner scrolling: the whole process is meant to be
          taken in at once. The scanned album stays as the backdrop. */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink py-16">
        <img
          src={MEDIA.processBackdrop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />

        <div className="media-wide relative">
          <ProcessTimeline steps={DOCUMENTARY_PROCESS} />
        </div>
      </section>

      <section className="media-wide pb-20 pt-32 sm:pt-48">
        <YouTubeEmbed
          id={YOUTUBE.ourProcessFeature}
          title="A Family Documentary Project film"
          placeholder="Feature video"
        />
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
