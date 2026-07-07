// Server-side source of truth for Guided Session pricing (mirrors src/data/content.ts).
// Keep in sync manually — Edge Functions run in Deno and don't share the Vite build.

export const PACKAGES: Record<string, { name: string; cents: number }> = {
  base: { name: 'Guided Interview Session', cents: 40000 },
}

export const ADDONS: Record<string, { name: string; cents: number }> = {
  mail_in_digitizing: { name: 'Mail-In Digitizing', cents: 15000 },
  extra_runtime: { name: 'Extra Runtime / Second Session', cents: 20000 },
  rush_editing: { name: 'Rush Editing Turnaround', cents: 15000 },
}
