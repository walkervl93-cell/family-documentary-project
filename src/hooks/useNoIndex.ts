import { useEffect } from 'react'

/**
 * Keeps a page out of search results for as long as it's mounted.
 *
 * This site is a single-page app, so there's one index.html shared by every
 * route and no per-page <head> to put a tag in. The tag is added on mount and
 * taken away again on unmount, so navigating on to a normal page doesn't
 * leave it behind and quietly deindex the whole site.
 *
 * Deliberately no matching robots.txt rule: a Disallow would stop crawlers
 * fetching the page at all, and a tag nobody fetches is a tag nobody obeys.
 * Letting them read it and find "noindex" is what actually keeps the page out
 * of results.
 */
export default function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])
}
