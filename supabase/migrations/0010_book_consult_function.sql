-- Books a free consult atomically: claims the slot, creates the booking,
-- and records the intake form in one step. Runs as SECURITY DEFINER (same
-- trusted pattern as claim_bookings/handle_new_user elsewhere in this
-- project) so it isn't subject to the RLS checks that block a pre-auth
-- browser client from reading rows it doesn't own yet — those checks made
-- sense when a privileged edge function did this work (the old
-- payment-at-booking flow), but the consult-first flow does it straight
-- from the browser, so the write path needs to be trusted instead.
-- Also makes the whole operation atomic: if anything fails, the slot never
-- ends up stuck as "booked" with no matching booking behind it.

create or replace function book_consult(
  p_slot_id uuid,
  p_client_email text,
  p_service_type booking_service_type,
  p_consult_type consult_type,
  p_storyteller_name text,
  p_relationship text,
  p_best_contact text,
  p_topics text,
  p_sensitive_topics text,
  p_preferred_language text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id uuid;
  v_scheduled_at timestamptz;
begin
  update availability_slots
  set is_booked = true
  where id = p_slot_id and is_booked = false
  returning start_time into v_scheduled_at;

  if v_scheduled_at is null then
    raise exception 'That time was just booked by someone else — please pick another.';
  end if;

  insert into bookings (client_email, service_type, consult_type, scheduled_at, slot_id)
  values (p_client_email, p_service_type, p_consult_type, v_scheduled_at, p_slot_id)
  returning id into v_booking_id;

  insert into intake_forms (
    booking_id, storyteller_name, relationship, best_contact, topics, sensitive_topics, preferred_language
  )
  values (
    v_booking_id, p_storyteller_name, p_relationship, p_best_contact, p_topics, p_sensitive_topics, p_preferred_language
  );

  return v_booking_id;
end;
$$;

grant execute on function book_consult(
  uuid, text, booking_service_type, consult_type, text, text, text, text, text, text
) to anon, authenticated;
