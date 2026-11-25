import { useState } from 'react'

interface Step {
  step: string
  copy: string
}

/**
 * The process as a vertical timeline: a continuous rule with the step number
 * on its left and the name on its right, and the detail arriving to the left
 * of the number when a step is active.
 *
 * The expansion is done with a 0fr to 1fr grid row rather than a height,
 * because height cannot be transitioned from auto. The row genuinely grows,
 * which is the point: the steps above and below are pushed along the line to
 * make room rather than the card floating over them.
 *
 * Hover drives it on a pointer, and tap on a touch screen, where hover either
 * does not exist or sticks until you tap elsewhere.
 */
export default function ProcessTimeline({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <ol className="mx-auto w-full max-w-4xl">
      {steps.map((s, i) => {
        const on = active === i
        return (
          <li
            key={s.step}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((cur) => (cur === i ? null : cur))}
            onClick={() => setActive((cur) => (cur === i ? null : i))}
            // No vertical gap between rows: each carries its own slice of the
            // rule, and they meet to form one continuous line.
            className="grid cursor-pointer grid-cols-[1fr_2.5rem_1px_1fr] items-center gap-x-4 sm:gap-x-8"
            tabIndex={0}
            aria-expanded={on}
          >
            {/* The detail, arriving from the right so it reads as coming off
                the line rather than flying in from nowhere. */}
            <div
              className="grid justify-items-end transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-sm py-4 text-right font-serif text-base leading-relaxed text-cream/80 transition-all duration-500 ease-out motion-reduce:transition-none ${
                    on ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                  }`}
                >
                  {s.copy}
                </p>
              </div>
            </div>

            <span
              className={`py-3 text-right text-sm tabular-nums transition-colors duration-500 ${
                on ? 'text-navy-soft' : 'text-cream/40'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <span
              aria-hidden="true"
              className={`h-full w-px transition-colors duration-500 ${
                on ? 'bg-navy-soft/70' : 'bg-cream/25'
              }`}
            />

            <h2
              className={`origin-left py-3 font-serif leading-tight transition-all duration-500 ease-out motion-reduce:transition-none ${
                on ? 'text-3xl text-cream sm:text-4xl' : 'text-xl text-cream/70'
              }`}
            >
              {s.step}
            </h2>
          </li>
        )
      })}
    </ol>
  )
}
