/**
 * Stands in for media that hasn't been supplied yet.
 *
 * Deliberately visible rather than an empty gap: a blank space reads as a
 * broken layout, and a labelled box makes it obvious at a glance which slots
 * are still waiting on a file.
 */
export default function MediaPlaceholder({
  label,
  className = 'aspect-video w-full',
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-ink/5 p-6 text-center ${className}`}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-ink/40">{label}</span>
    </div>
  )
}
