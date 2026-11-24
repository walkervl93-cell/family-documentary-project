import YouTubeEmbed from '../components/YouTubeEmbed'
import Gallery from '../components/Gallery'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { MEDIA, YOUTUBE, OUR_WHY_TITLE, OUR_WHY_BEFORE, OUR_WHY_AFTER } from '../data/content'

export default function OurWhy() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-navy">Our Why</p>
        <h1 className="text-center text-4xl leading-tight sm:text-5xl">{OUR_WHY_TITLE}</h1>
        <div className="mt-8 grid gap-6 text-left">
          {OUR_WHY_BEFORE.map((para) => (
            <p key={para} className="font-serif text-xl leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <YouTubeEmbed
          id={YOUTUBE.ourWhyFeature}
          title="A Family Documentary Project film"
          placeholder="Feature video"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-6 text-left">
          {OUR_WHY_AFTER.map((para) => (
            <p key={para} className="font-serif text-xl leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* The thesis the story above is about. On YouTube rather than the
          copy in public/videos: that one is a silenced 640x360 cut made for
          use as a muted background, and this is meant to be watched. */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-navy">
          The senior thesis
        </p>
        <h2 className="mb-6 text-center font-serif text-3xl">A Fading Fraternity</h2>
        <YouTubeEmbed
          id={YOUTUBE.fadingFraternity}
          title="A Fading Fraternity"
          placeholder="A Fading Fraternity"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.documentariesGallery} />
      </section>

      <section id="book-consult" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Book a Free Consult</h2>
        <div className="mt-8">
          <ConsultBookingForm serviceType="documentary" />
        </div>
      </section>
    </>
  )
}
