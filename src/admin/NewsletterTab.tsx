import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Subscriber {
  id: string
  email: string
  phone: string | null
  source: string | null
  unsubscribed_at: string | null
  created_at: string
}

/**
 * The mailing list, built around what actually happens with it: the addresses
 * get pasted into the BCC field of an email. So the first thing on the page is
 * a button that puts every active address on the clipboard, comma separated
 * and ready to paste, rather than a table to copy out by hand.
 */
export default function NewsletterTab() {
  const [rows, setRows] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows(data ?? [])
        setLoading(false)
      })
  }, [])

  const active = rows.filter((r) => !r.unsubscribed_at)

  async function copyEmails() {
    const list = active.map((r) => r.email).join(', ')
    try {
      await navigator.clipboard.writeText(list)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard access needs a secure context and a user gesture, and it
      // can still be refused. Falling back to a prompt means the addresses
      // are always reachable, even when the copy itself isn't.
      window.prompt('Copy the addresses below:', list)
    }
  }

  function downloadCsv() {
    const header = 'email,phone,signed_up,source,status\n'
    const body = rows
      .map((r) =>
        [
          r.email,
          r.phone ?? '',
          new Date(r.created_at).toLocaleDateString(),
          r.source ?? '',
          r.unsubscribed_at ? 'unsubscribed' : 'active',
        ]
          // Quote every field and double any quotes inside it, so an address
          // or source containing a comma can't shift the columns.
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n')

    const url = URL.createObjectURL(new Blob([header + body], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `tfdp-newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function toggleUnsubscribe(row: Subscriber) {
    const next = row.unsubscribed_at ? null : new Date().toISOString()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: next })
      .eq('id', row.id)
    if (error) {
      window.alert(error.message)
      return
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, unsubscribed_at: next } : r)))
  }

  if (loading) return <p className="text-ink/60">Loading…</p>
  if (rows.length === 0) return <p className="text-ink/60">No subscribers yet.</p>

  return (
    <div>
      <div className="mb-6 rounded-xl border border-ink/10 bg-white/50 p-5">
        <p className="text-sm text-ink/70">
          <strong className="text-ink">{active.length}</strong> active{' '}
          {active.length === 1 ? 'subscriber' : 'subscribers'}
          {rows.length !== active.length && ` · ${rows.length - active.length} unsubscribed`}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={copyEmails} className="btn-primary">
            {copied ? 'Copied!' : 'Copy All Emails for BCC'}
          </button>
          <button onClick={downloadCsv} className="btn-secondary">
            Download CSV
          </button>
        </div>
        <p className="mt-3 text-xs text-ink/50">
          Copy puts every active address on your clipboard, separated by commas. Paste it straight
          into the BCC field. Unsubscribed people are left out.
        </p>
      </div>

      <div className="grid gap-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 px-4 py-3 ${
              r.unsubscribed_at ? 'bg-ink/5 text-ink/40' : 'bg-white/50'
            }`}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.email}</p>
              <p className="text-xs text-ink/50">
                {new Date(r.created_at).toLocaleDateString()}
                {r.phone && ` · ${r.phone}`}
                {r.source && ` · from ${r.source}`}
              </p>
            </div>
            <button
              onClick={() => toggleUnsubscribe(r)}
              className="shrink-0 text-xs text-ink/50 underline hover:text-clay"
            >
              {r.unsubscribed_at ? 'Resubscribe' : 'Unsubscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
