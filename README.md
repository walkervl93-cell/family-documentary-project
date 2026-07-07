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

- `/` — Home
- `/documentaries` — full production tier, inquiry-only
- `/digitizing-services` — pickup-based digitizing, no geographic restriction
- `/guided-session` — new remote tier marketing page
- `/guided-session/book` — booking wizard (package → schedule → intake → Stripe Checkout)
- `/guided-session/success` — post-checkout confirmation (polls booking status; webhook is
  the source of truth, not this page)
- `/giving-back` — existing community program page
- `/portal` — magic-link client portal (Guided Session clients)
- `/admin` — admin dashboard (inquiries, pickup requests, Guided Session bookings)

## What's stubbed for a follow-up session

- Client portal raw-footage upload (chunked/resumable) and mail-in tracking UI
- Deliverable review / revision request flow
- Admin availability-slot management UI (slots currently need to be inserted directly
  in Supabase or via a script)
- Automated confirmation/status emails via Resend (currently manual, triggered by the
  business owner per the product requirement that email timing stay human-controlled)
