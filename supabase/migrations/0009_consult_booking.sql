-- Consult-first booking flow: clients book a free consult (phone or video)
-- for either the in-person Documentaries tier or the virtual Guided Session
-- tier. No payment happens at booking time — an admin sends a payment
-- request (Stripe-hosted Checkout link) after the consult call.

create type booking_service_type as enum ('documentary', 'guided_session');
create type consult_type as enum ('phone', 'video');

alter table bookings
  add column service_type booking_service_type not null default 'guided_session',
  add column consult_type consult_type not null default 'video',
  add column payment_link_url text,
  add column payment_amount numeric(10, 2);

alter table bookings
  alter column status set default 'consult_scheduled';

alter table bookings
  alter column package_type drop not null;

-- Clients aren't authenticated yet when booking a consult, so allow anyone
-- to flip a slot from open to booked (but not touch anything else about it).
create policy "availability_book_own_slot" on availability_slots
  for update using (is_booked = false)
  with check (is_booked = true);
