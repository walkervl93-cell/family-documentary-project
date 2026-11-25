import { useState } from 'react'

interface Item {
  q: string
  a: string
}

/**
 * The questions families actually ask, as a hover list.
 *
 * The answer uses the same motion as the process timeline: a grid row going
 * 0fr to 1fr, because height cannot be transitioned from auto. The row really
 * grows, so the questions below are pushed down the list rather than having a
 * card float over them.
 *
 * Hover drives it on a pointer, tap on a touch screen where hover either does
 * not exist or sticks until you tap elsewhere, and focus on a keyboard.
 */
export default function QuestionList({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(0)

  return (
    <ul>
      {items.map((item, i) => {
        const on = active === i
        return (
          <li
            key={item.q}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive((cur) => (cur === i ? null : i))}
            tabIndex={0}
            aria-expanded={on}
            className="cursor-pointer border-b border-dashed border-cream/15 py-5 first:pt-0"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-2.5 h-1.5 w-1.5 shrink-0 transition-colors duration-500 ${
                  on ? 'bg-navy-soft' : 'bg-cream/30'
                }`}
              />
              <h3
                className={`font-serif leading-snug transition-all duration-500 ease-out motion-reduce:transition-none ${
                  on
                    ? 'text-2xl text-cream drop-shadow-[0_0_22px_rgba(246,242,233,0.35)] sm:text-[1.75rem]'
                    : 'text-xl text-cream/55'
                }`}
              >
                {item.q}
              </h3>
            </div>

            <div
              className="grid pl-[1.125rem] transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-prose pt-3 text-base leading-relaxed text-cream/75 transition-all duration-500 ease-out motion-reduce:transition-none ${
                    on ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
