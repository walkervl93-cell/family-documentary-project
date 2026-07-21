import InquiryForm from '../components/InquiryForm'
import { GUIDED_SESSION_PACKAGES, GUIDED_SESSION_ADDONS } from '../data/content'

export default function GuidedSession() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-clay">
          New · Remote · $400 – $900
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">Guided Session</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
          A live video-call interview from anywhere. A trained TFDP interviewer guides your
          family member through their story in real time, while you film on your own device.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-3xl">How It Works</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            {
              step: '1. Tell Us About Your Story',
              copy: 'Reach out with a bit about your family and who you\'d like to feature, and we\'ll follow up to schedule your session.',
            },
            {
              step: '2. Set Up Your Device',
              copy: 'On the day of the call, set up a phone or tablet on a tripod pointed at your family member — no film crew needed.',
            },
            {
              step: '3. Live Interview',
              copy: 'A trained TFDP interviewer joins the video call and guides the conversation with questions and follow-ups in real time, while you record locally.',
            },
            {
              step: '4. Send Us the Footage',
              copy: 'Send us the raw footage, or ship your device, tapes, or drive to us as a mail-in add-on — a different logistics path from our in-person pickup service.',
            },
            {
              step: '5. We Edit',
              copy: 'Our editing team crafts your footage into a short-form documentary, 10–20 minutes long.',
            },
            {
              step: '6. Delivery',
              copy: 'Your finished film is delivered to you, with one round of revisions included.',
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-ink/10 bg-white/50 p-8">
              <h3 className="text-lg">{s.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-moss/30 bg-moss/5 p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-moss">A note on mail-in</p>
          <p className="mt-2 text-ink/80">
            Our Documentaries and Digitizing Services stay pickup-only — we come to you. The
            Guided Session's mail-in add-on is a separate, distinct path for this remote tier
            only, for clients who'd rather ship us their device or tapes than upload large files.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-3xl">Packages & Add-Ons</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-clay/40 bg-white/60 p-8">
            <h3 className="text-lg">{GUIDED_SESSION_PACKAGES[0].name}</h3>
            <p className="mt-1 text-2xl font-serif text-clay">${GUIDED_SESSION_PACKAGES[0].price}</p>
            <p className="mt-3 text-sm text-ink/70">{GUIDED_SESSION_PACKAGES[0].description}</p>
          </div>
          <div className="grid gap-4">
            {GUIDED_SESSION_ADDONS.map((a) => (
              <div key={a.id} className="rounded-xl border border-ink/10 bg-white/40 p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-medium">{a.name}</h4>
                  <span className="text-sm text-clay">+${a.price}</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl">Ask About a Guided Session</h2>
        <p className="mt-3 text-center text-ink/70">
          Online scheduling and payment are coming soon — for now, tell us a bit about your family
          and we'll follow up to set up your session.
        </p>
        <div className="mt-8">
          <InquiryForm
            service="guided_session"
            timelinePlaceholder="When would you like to schedule your session? (rough timeline)"
            messagePlaceholder="Tell us about your family and who you'd like to feature"
          />
        </div>
      </section>
    </>
  )
}
