-- Sign-ups from the Giving Back page: communities asking us to bring a
-- pop-up to them.
--
-- Same shape as submit_picture_this_lead(): a SECURITY DEFINER function
-- rather than an insert policy, so an anonymous visitor can add a row and
-- can never read one, and the input is validated server side.

create table if not exists community_event_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  community text not null,
  phone text not null,
  email text not null,
  notes text,
  source text,
  notified_at timestamptz
);

create index if not exists community_event_leads_created_at_idx
  on community_event_leads (created_at desc);

alter table community_event_leads enable row level security;

drop policy if exists "admins read community event leads" on community_event_leads;
create policy "admins read community event leads" on community_event_leads
  for select using (is_admin());

drop function if exists submit_community_event_lead(text, text, text, text, text, text);

create function submit_community_event_lead(
  p_full_name text,
  p_community text,
  p_phone text,
  p_email text,
  p_notes text default null,
  p_source text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_digits text;
begin
  if coalesce(btrim(p_full_name), '') = '' then
    raise exception 'Please enter your name.';
  end if;
  if coalesce(btrim(p_community), '') = '' then
    raise exception 'Please tell us which community you are with.';
  end if;
  if coalesce(btrim(p_email), '') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please enter a valid email address.';
  end if;

  -- Digit count, not format: people write numbers every which way and
  -- rejecting a real one over punctuation loses the lead.
  v_digits := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if length(v_digits) not in (10, 11) or (length(v_digits) = 11 and left(v_digits, 1) <> '1') then
    raise exception 'Please enter a valid US phone number.';
  end if;

  insert into community_event_leads (full_name, community, phone, email, notes, source)
  values (
    left(btrim(p_full_name), 200),
    left(btrim(p_community), 200),
    left(btrim(p_phone), 50),
    left(btrim(p_email), 320),
    left(btrim(p_notes), 2000),
    left(btrim(p_source), 100)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function submit_community_event_lead(text, text, text, text, text, text) from public;
grant execute on function submit_community_event_lead(text, text, text, text, text, text) to anon, authenticated;
