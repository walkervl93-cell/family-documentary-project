import ProcessTimeline from '../components/ProcessTimeline'
import QuestionList from '../components/QuestionList'
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
        {/* Centred over the eyebrow, so the top of the page reads as one
            stack: drawing, label, title, paragraph. The SVG is cropped to
            the drawing itself, so this width is all picture, no blank paper. */}
        {MEDIA.processSetupImage ? (
          <img
            src={MEDIA.processSetupImage}
            alt="A documentary set-up in a living room: a lantern softbox, a panel light, three cameras on tripods and two armchairs"
            className="mx-auto mb-8 w-56 sm:w-64"
          />
        ) : null}
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
          {/* The steps give nothing away until you point at one, so say so. */}
          <p className="mb-10 text-center text-[0.7rem] uppercase tracking-[0.2em] text-cream/45">
            Hover to read more
          </p>
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

      {/* Questions on the left, a scanned print on the right. The answers
          open on hover with the same motion as the timeline above, so the
          two halves of the page move the same way. */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-navy-soft">
            Before you book
          </p>
          <h2 className="text-center text-3xl sm:text-4xl">What to Expect</h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
            <QuestionList items={WHAT_TO_EXPECT} />

            {/* Sticky so the photograph stays put while the list is read;
                the list is much the taller column. */}
            <div className="lg:sticky lg:top-28">
              <img
                src={MEDIA.expectImage}
                alt="A scanned family photograph"
                loading="lazy"
                className="w-full rounded-2xl object-cover shadow-2xl shadow-black/40"
              />
            </div>
          </div>
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
