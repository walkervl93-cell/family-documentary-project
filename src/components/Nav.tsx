import { NavLink, Link } from 'react-router-dom'
import { BRAND } from '../data/content'
import logo from '../assets/logo.png'

const links = [
  { to: '/documentaries', label: 'The Documentary' },
  { to: '/digitizing-services', label: 'Digitizing' },
  { to: '/audio', label: 'Audio' },
  { to: '/giving-back', label: 'Giving Back' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
        <NavLink to="/" aria-label={BRAND.name}>
          <img src={logo} alt={BRAND.name} className="h-9 w-auto md:h-11" />
        </NavLink>
        <nav className="hidden items-center gap-6 text-sm uppercase tracking-wide md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors hover:text-clay ${isActive ? 'text-clay' : 'text-ink/80'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {/* Outbound: the app teaser lives on its own host, so a plain anchor
              rather than a router link. */}
          <a
            href={BRAND.appUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink/80 transition-colors hover:text-clay"
          >
            Get the App
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/#book-consult"
            className="rounded-full bg-clay px-4 py-2 text-xs font-medium uppercase tracking-wide text-cream hover:bg-ink"
          >
            Book a Consult
          </Link>
          <a
            href={BRAND.phoneHref}
            className="rounded-full bg-ink px-4 py-2 text-xs font-medium uppercase tracking-wide text-cream hover:bg-clay"
          >
            {BRAND.phone}
          </a>
        </div>
      </div>
      <nav className="flex flex-wrap gap-4 border-t border-ink/10 px-6 py-2 text-xs uppercase tracking-wide md:hidden">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className="text-ink/80 hover:text-clay">
            {l.label}
          </NavLink>
        ))}
        <a
          href={BRAND.appUrl}
          target="_blank"
          rel="noreferrer"
          className="text-ink/80 hover:text-clay"
        >
          Get the App
        </a>
      </nav>
    </header>
  )
}
