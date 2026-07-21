# the family documentary project

Website rebuild for The Family Documentary Project — Vite + React + TypeScript + Tailwind,
Supabase (Postgres/Auth/Storage), Stripe, built to replace the existing WordPress site.

## Stack

- Frontend: Vite + React + TypeScript + Tailwind CSS v4
- Backend: Supabase (Postgres, Auth via magic link, Storage)
- Payments: Stripe Checkout (Guided Session tier only)
- Edge Functions: `supabase/functions/*` (Deno) — Stripe checkout session creation,
  webhook handling, booking status lookup

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Fill in `.env` with your Supabase project URL/anon key and Stripe publishable key.

## Supabase setup

```bash
supabase link --project-ref <your-project-ref>
supabase db push          # applies supabase/migrations/*.sql
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy booking-status
```

Set these as Edge Function secrets (`supabase secrets set ...`), not client env vars:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (from the Stripe CLI or Dashboard webhook endpoint)
- `SUPABASE_SERVICE_ROLE_KEY`

Point a Stripe webhook endpoint at the deployed `stripe-webhook` function URL, listening
for `checkout.session.completed`.

## Site map

Live routes (site is inquiry-only right now — no online booking or payment anywhere):

- `/` — Home
- `/documentaries` — full production tier, inquiry-only
- `/digitizing-services` — pickup-based digitizing, no geographic restriction
- `/guided-session` — remote tier marketing page + inquiry form
- `/giving-back` — existing community program page

Built but not routed — ready to re-enable in `src/App.tsx` when online booking/payment/
virtual interviews are ready to launch:

- `src/pages/GuidedSessionBook.tsx` / `GuidedSessionSuccess.tsx` — booking wizard, Stripe
  Checkout, webhook-confirmed booking
- `src/pages/Portal.tsx` — magic-link client portal
- `src/pages/Admin.tsx` — admin dashboard (inquiries, pickup requests, Guided Session
  bookings)

## What's stubbed for a follow-up session

- Client portal raw-footage upload (chunked/resumable) and mail-in tracking UI
- Deliverable review / revision request flow
- Admin availability-slot management UI (slots currently need to be inserted directly
  in Supabase or via a script)
- Automated confirmation/status emails via Resend (currently manual, triggered by the
  business owner per the product requirement that email timing stay human-controlled)

## Deploying to Hostinger (static build)

This is a static single-page app once built — no Node server needed on Hostinger.

```bash
npm install
npm run build
```

This produces a `dist/` folder. In Hostinger's File Manager, upload the **contents** of
`dist/` (not the `dist` folder itself) into `public_html` — you should end up with
`public_html/index.html`, `public_html/assets/...`, etc.

`dist/` already includes a `.htaccess` file (copied from `public/.htaccess`) that rewrites
unknown paths to `index.html`, so React Router's client-side routes (e.g. `/documentaries`)
work on direct visit and on page refresh under Apache.

Note: values in `.env` (Supabase URL/keys, Stripe publishable key) are baked into the built
JS at build time — rebuild and re-upload whenever those change.
