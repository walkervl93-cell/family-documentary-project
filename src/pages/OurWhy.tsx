import MediaPlaceholder from '../components/MediaPlaceholder'
import YouTubeEmbed from '../components/YouTubeEmbed'
import Gallery from '../components/Gallery'
import ConsultBookingForm from '../components/ConsultBookingForm'
import { MEDIA, YOUTUBE } from '../data/content'

export default function OurWhy() {
  return (
    <>
      {/* Portrait hero rather than video: this page is the origin story, and
          a still of Victoria working carries it better than a reel. */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        {MEDIA.ourWhyHeroImage ? (
          <img
            src={MEDIA.ourWhyHeroImage}
            alt=""
            className="h-[46vh] w-full rounded-3xl object-cover sm:h-[58vh]"
          />
        ) : (
          <MediaPlaceholder
            label="Our Why hero photo (Nadyia shoot)"
            className="h-[46vh] w-full sm:h-[58vh]"
          />
        )}
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">Our Why</p>
        <h1 className="text-4xl leading-tight sm:text-5xl">
          It started with our own family
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed">
          {/* TODO: Victoria's origin story, first paragraph. Who in your own
              family you set out to record, and what made you pick up a camera
              in the first place. */}
          [ORIGIN STORY, PARAGRAPH ONE: the family member you first set out to
          record, and what made you start.]
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <YouTubeEmbed
          id={YOUTUBE.nadyiaShoot}
          title="Behind the scenes"
          placeholder="Nadyia shoot video"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <p className="font-serif text-xl leading-relaxed">
          {/* TODO: second origin paragraph, leading into the veterans work. */}
          [ORIGIN STORY, PARAGRAPH TWO: how it grew past your own family, and
          what drew you to recording veterans in particular.]
        </p>
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
