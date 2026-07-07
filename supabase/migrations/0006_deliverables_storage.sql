-- Private bucket for finished films. Objects are stored at `${booking_id}/filename.mp4`
-- so ownership can be checked by matching the first path segment to a booking.

insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;

create policy "deliverables_storage_select_own_or_admin" on storage.objects
  for select using (
    bucket_id = 'deliverables' and (
      is_admin() or exists (
        select 1 from bookings b
        where b.id::text = split_part(name, '/', 1)
          and b.client_id = auth.uid()
      )
    )
  );

create policy "deliverables_storage_insert_admin" on storage.objects
  for insert with check (bucket_id = 'deliverables' and is_admin());

create policy "deliverables_storage_update_admin" on storage.objects
  for update using (bucket_id = 'deliverables' and is_admin());

create policy "deliverables_storage_delete_admin" on storage.objects
  for delete using (bucket_id = 'deliverables' and is_admin());
