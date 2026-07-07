import PageHero from '../components/PageHero'
import Gallery from '../components/Gallery'
import { GIVING_BACK_COPY, GIVING_BACK_CTA, MEDIA, BRAND } from '../data/content'

export default function GivingBack() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Giving Back"
        subtitle="For every project we book, we host one free pop-up event at a partnering retirement community."
        videoSrc={MEDIA.givingBackHeroVideo}
      />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-serif text-2xl leading-relaxed">{GIVING_BACK_COPY}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Gallery images={MEDIA.givingBackGallery} />
      </section>

      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-3xl">Partner With Us</h2>
        <p className="mt-4 text-ink/70">{GIVING_BACK_CTA}</p>
        <a href={`mailto:${BRAND.email}`} className="btn-primary mt-8 inline-flex">
          Reach Out
        </a>
      </section>
    </>
  )
}
