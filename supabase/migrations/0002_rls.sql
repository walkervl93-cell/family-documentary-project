-- Row Level Security

alter table profiles enable row level security;
alter table inquiries enable row level security;
alter table pickup_requests enable row level security;
alter table availability_slots enable row level security;
alter table bookings enable row level security;
alter table intake_forms enable row level security;
alter table media_uploads enable row level security;
alter table deliverables enable row level security;
alter table stripe_events enable row level security;

create function is_admin() returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: users see/update their own row; admins see all
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

-- inquiries: public can insert (lead capture form), only admins can read/update
create policy "inquiries_insert_public" on inquiries
  for insert with check (true);

create policy "inquiries_select_admin" on inquiries
  for select using (is_admin());

create policy "inquiries_update_admin" on inquiries
  for update using (is_admin());

-- pickup_requests: same pattern
create policy "pickup_requests_insert_public" on pickup_requests
  for insert with check (true);

create policy "pickup_requests_select_admin" on pickup_requests
  for select using (is_admin());

create policy "pickup_requests_update_admin" on pickup_requests
  for update using (is_admin());

-- availability_slots: anyone can read open slots to build the picker; only admins manage
create policy "availability_select_all" on availability_slots
  for select using (true);

create policy "availability_insert_admin" on availability_slots
  for insert with check (is_admin());

create policy "availability_update_admin" on availability_slots
  for update using (is_admin());

create policy "availability_delete_admin" on availability_slots
  for delete using (is_admin());

-- bookings: clients see their own; admins see all. Inserts/updates go through
-- the server (service role) for payment-confirmed writes, but allow clients to
-- insert their own pending_payment row and read/request reschedule on it.
create policy "bookings_select_own_or_admin" on bookings
  for select using (client_id = auth.uid() or is_admin());

create policy "bookings_insert_own" on bookings
  for insert with check (client_id = auth.uid() or client_id is null);

create policy "bookings_update_admin" on bookings
  for update using (is_admin());

-- intake_forms: tied to booking ownership
create policy "intake_forms_select_own_or_admin" on intake_forms
  for select using (
    is_admin() or exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "intake_forms_insert_own" on intake_forms
  for insert with check (
    exists (
      select 1 from bookings b where b.id = booking_id and (b.client_id = auth.uid() or b.client_id is null)
    )
  );

create policy "intake_forms_update_admin" on intake_forms
  for update using (is_admin());

-- media_uploads: client can insert/view their own booking's uploads; admin sees all
create policy "media_uploads_select_own_or_admin" on media_uploads
  for select using (
    is_admin() or exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "media_uploads_insert_own" on media_uploads
  for insert with check (
    exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "media_uploads_update_admin" on media_uploads
  for update using (is_admin());

-- deliverables: client can view and request revision on their own; admin manages
create policy "deliverables_select_own_or_admin" on deliverables
  for select using (
    is_admin() or exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "deliverables_update_own_or_admin" on deliverables
  for update using (
    is_admin() or exists (
      select 1 from bookings b where b.id = booking_id and b.client_id = auth.uid()
    )
  );

create policy "deliverables_insert_admin" on deliverables
  for insert with check (is_admin());

-- stripe_events: server-only (service role bypasses RLS); no client policies needed
