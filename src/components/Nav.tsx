import { NavLink } from 'react-router-dom'
import { BRAND } from '../data/content'

const links = [
  { to: '/documentaries', label: 'Documentaries' },
  { to: '/digitizing-services', label: 'Digitizing Services' },
  { to: '/guided-session', label: 'Guided Session' },
  { to: '/giving-back', label: 'Giving Back' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-serif text-lg tracking-tight lowercase">
          {BRAND.name}
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
        </nav>
        <a
          href={BRAND.phoneHref}
          className="rounded-full bg-ink px-4 py-2 text-xs font-medium uppercase tracking-wide text-cream hover:bg-clay"
        >
          {BRAND.phone}
        </a>
      </div>
      <nav className="flex flex-wrap gap-4 border-t border-ink/10 px-6 py-2 text-xs uppercase tracking-wide md:hidden">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className="text-ink/80 hover:text-clay">
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
