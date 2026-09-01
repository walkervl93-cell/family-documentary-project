import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { BRAND } from '../data/content'
import logo from '../assets/logo.png'

const links = [
  { to: '/documentaries', label: 'The Documentary' },
  { to: '/digitizing-services', label: 'Digitizing' },
  { to: '/audio', label: 'Audio' },
  { to: '/giving-back', label: 'Giving Back' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  // Tapping a link navigates without unmounting the header, so the panel
  // would otherwise stay open over the page you just asked for.
  useEffect(() => setOpen(false), [pathname, hash])

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <NavLink to="/" aria-label={BRAND.name}>
          <img src={logo} alt={BRAND.name} className="h-8 w-auto md:h-11" />
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Both buttons stay on phones, just tighter — they're the two
              things a visitor is most likely to want. */}
          <Link
            to="/#book-consult"
            className="whitespace-nowrap rounded-full bg-clay px-2.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-cream hover:bg-ink sm:px-4 sm:py-2 sm:text-xs"
          >
            Book a Consult
          </Link>
          <a
            href={BRAND.phoneHref}
            className="whitespace-nowrap rounded-full bg-ink px-2.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-cream hover:bg-clay sm:px-4 sm:py-2 sm:text-xs"
          >
            {BRAND.phone}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="-mr-1 flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink hover:bg-ink/5 md:hidden"
          >
            {/* Three bars that fold into an X, rather than swapping glyphs, so
                the button doesn't jump as it changes state. */}
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-ink/10 px-4 py-2 text-sm uppercase tracking-wide md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `border-b border-ink/5 py-3 last:border-0 ${isActive ? 'text-clay' : 'text-ink/80'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a href={BRAND.appUrl} target="_blank" rel="noreferrer" className="py-3 text-ink/80">
            Get the App
          </a>
        </nav>
      )}
    </header>
  )
}
