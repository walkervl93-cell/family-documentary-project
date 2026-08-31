import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router doesn't do either of the two things a browser does for you on a
 * normal page load: it won't scroll to an #anchor, and it won't reset the
 * scroll position when you move to a new page. So links like
 * "/#book-consult" from the header appear to do nothing at all. This puts
 * both behaviours back.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const target = document.getElementById(hash.slice(1))
    if (!target) {
      window.scrollTo(0, 0)
      return
    }

    // The header is sticky, so scrolling the section flush to the top of the
    // viewport would tuck its heading underneath it.
    const header = document.querySelector('header')
    const offset = header ? header.getBoundingClientRect().height : 0
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset - 8,
      behavior: 'smooth',
    })
    // `key` changes even when the same link is clicked twice, so a second
    // click on "Book a Consult" scrolls again rather than sitting still.
  }, [pathname, hash, key])

  return null
}
