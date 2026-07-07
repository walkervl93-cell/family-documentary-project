import { BRAND, CLOSING_CTA } from '../data/content'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="max-w-2xl font-serif text-xl leading-relaxed">{CLOSING_CTA}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-cream/70">
          <div className="lowercase">{BRAND.name} — {BRAND.tagline}</div>
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${BRAND.email}`} className="hover:text-cream">
              {BRAND.email}
            </a>
            <a href={BRAND.phoneHref} className="hover:text-cream">
              {BRAND.phone}
            </a>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="hover:text-cream">
              Instagram
            </a>
            <a href={BRAND.facebook} target="_blank" rel="noreferrer" className="hover:text-cream">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
