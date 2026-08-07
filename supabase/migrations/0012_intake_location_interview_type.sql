-- All three in-person offerings (Documentary, Digitizing, Audio) now collect
-- where to meet the family and, where relevant, whether they want an audio
-- or video interview — captured at consult-booking time rather than as
-- separate service lines.

create type interview_type as enum ('audio', 'video');

alter table intake_forms
  add column location text,
  add column interview_type interview_type;

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
  p_preferred_language text,
  p_location text default null,
  p_interview_type interview_type default null
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
    booking_id, storyteller_name, relationship, best_contact, topics, sensitive_topics,
    preferred_language, location, interview_type
  )
  values (
    v_booking_id, p_storyteller_name, p_relationship, p_best_contact, p_topics, p_sensitive_topics,
    p_preferred_language, p_location, p_interview_type
  );

  return v_booking_id;
end;
$$;

grant execute on function book_consult(
  uuid, text, booking_service_type, consult_type, text, text, text, text, text, text, text, interview_type
) to anon, authenticated;
