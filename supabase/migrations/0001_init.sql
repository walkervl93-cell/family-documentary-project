-- TFDP initial schema

create extension if not exists "pgcrypto";

-- profiles: extends auth.users
create type profile_role as enum ('client', 'admin', 'interviewer');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role profile_role not null default 'client',
  name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Documentaries leads
create type inquiry_status as enum ('new', 'contacted', 'booked', 'closed');

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  location text,
  timeline text,
  message text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Digitizing Services pickup requests
create type pickup_status as enum ('new', 'scheduled', 'completed', 'closed');

create table pickup_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  location text,
  media_types text[],
  media_count text,
  preferred_time_slot text,
  status pickup_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Guided Session interviewer availability
create table availability_slots (
  id uuid primary key default gen_random_uuid(),
  interviewer_id uuid references profiles (id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now()
);

create index availability_slots_time_idx on availability_slots (start_time) where not is_booked;

-- Guided Session bookings
create type booking_status as enum (
  'pending_payment',
  'booked',
  'interview_completed',
  'media_received',
  'in_editing',
  'ready_for_review',
  'delivered',
  'canceled'
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users (id) on delete set null,
  client_email text not null,
  package_type text not null default 'base',
  addons jsonb not null default '[]'::jsonb,
  status booking_status not null default 'pending_payment',
  scheduled_at timestamptz not null,
  interviewer_id uuid references profiles (id) on delete set null,
  slot_id uuid references availability_slots (id) on delete set null,
  call_link text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text unique,
  amount_paid numeric(10, 2),
  created_at timestamptz not null default now()
);

create index bookings_client_id_idx on bookings (client_id);
create index bookings_status_idx on bookings (status);

-- Guided Session client intake
create table intake_forms (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  storyteller_name text not null,
  relationship text not null,
  best_contact text,
  topics text,
  sensitive_topics text,
  preferred_language text,
  created_at timestamptz not null default now()
);

create unique index intake_forms_booking_id_idx on intake_forms (booking_id);

-- Raw footage / mail-in media tracking
create type media_source as enum ('upload', 'mail-in');

create table media_uploads (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  file_url text,
  file_type text,
  source media_source not null,
  shipping_tracking_number text,
  uploaded_at timestamptz not null default now()
);

create index media_uploads_booking_id_idx on media_uploads (booking_id);

-- Final deliverables
create table deliverables (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  file_url text not null,
  version integer not null default 1,
  revision_requested boolean not null default false,
  delivered_at timestamptz not null default now()
);

create index deliverables_booking_id_idx on deliverables (booking_id);

-- Stripe webhook idempotency
create table stripe_events (
  id text primary key,
  processed_at timestamptz not null default now()
);
