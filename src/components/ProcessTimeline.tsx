import { useState } from 'react'

interface Step {
  step: string
  copy: string
}

/**
 * The process as a vertical timeline: one continuous rule down the centre,
 * step number to its left, name to its right, and the detail arriving to the
 * left of the number when a step is active.
 *
 * The rule is drawn once by the list rather than in slices per row, which is
 * what lets it sit exactly on the centre line: the two halves of each row are
 * equal columns, so their boundary is the middle of the container whatever
 * the content does.
 *
 * The expansion is a 0fr to 1fr grid row, not a height, because height cannot
 * be transitioned from auto. The row genuinely grows, which is the point: the
 * steps above and below are pushed along the line to make room rather than a
 * card floating over them.
 *
 * Hover drives it on a pointer and tap on a touch screen, where hover either
 * does not exist or sticks until you tap elsewhere.
 */
export default function ProcessTimeline({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <ol className="relative mx-auto w-full max-w-5xl">
      {/* One rule for the whole list, on the column boundary. */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-cream/25"
      />

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
            className="relative grid cursor-pointer grid-cols-2 items-center"
            tabIndex={0}
            aria-expanded={on}
          >
            {/* Left half: the detail, then the number hard against the rule. */}
            <div className="flex items-center justify-end gap-5 pr-6 sm:gap-8 sm:pr-8">
              <div
                className="grid justify-items-end transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
                style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p
                    className={`max-w-md py-4 text-right font-serif text-lg leading-relaxed text-cream/85 transition-all duration-500 ease-out motion-reduce:transition-none ${
                      on ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                  >
                    {s.copy}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 py-2.5 text-base tabular-nums transition-all duration-500 ${
                  on
                    ? 'text-navy-soft drop-shadow-[0_0_14px_rgba(158,195,232,0.65)]'
                    : 'text-cream/40'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Right half: the name. */}
            <h2
              className={`origin-left py-2.5 pl-6 font-serif leading-tight transition-all duration-500 ease-out motion-reduce:transition-none sm:pl-8 ${
                on
                  ? 'text-4xl text-cream drop-shadow-[0_0_26px_rgba(246,242,233,0.45)] sm:text-5xl'
                  : 'text-2xl text-cream/65 sm:text-3xl'
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
