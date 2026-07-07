create type reschedule_status as enum ('pending', 'approved', 'denied');

create table reschedule_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  requested_time timestamptz,
  reason text,
  status reschedule_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table reschedule_requests enable row level security;

create policy "reschedule_select_own_or_admin" on reschedule_requests
  for select using (
    is_admin() or exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "reschedule_insert_own" on reschedule_requests
  for insert with check (
    exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "reschedule_update_admin" on reschedule_requests
  for update using (is_admin());
