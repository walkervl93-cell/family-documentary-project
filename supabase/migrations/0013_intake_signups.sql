-- Intake sign-ups from /intake: a client books an interview directly, with
-- no account and no payment.
--
-- Writes go through submit_intake() rather than a plain insert, for the same
-- reason book_consult() exists: the person filling this in is not signed in,
-- so a direct insert can't satisfy row-level security, and an insert policy
-- permissive enough to allow it would let anyone write arbitrary rows. The
-- function validates and runs trusted; the table itself stays closed.

create table if not exists intake_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  interview_date date not null,
  email text not null,
  phone text not null,
  -- [{ name, contact }, ...]. A free-form list whose length varies per
  -- submission, so a column per contact would be the wrong shape.
  family_contacts jsonb not null default '[]'::jsonb,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists intake_signups_created_at_idx
  on intake_signups (created_at desc);

alter table intake_signups enable row level security;

-- No insert/update/delete policy on purpose: every write goes through
-- submit_intake() or the service role. Admins can read what came in.
drop policy if exists "admins read intake signups" on intake_signups;
create policy "admins read intake signups" on intake_signups
  for select using (is_admin());

drop function if exists submit_intake(text, date, text, text, jsonb);

create function submit_intake(
  p_full_name text,
  p_interview_date date,
  p_email text,
  p_phone text,
  p_family_contacts jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_contacts jsonb;
begin
  -- Validate here rather than trusting the browser: this function is
  -- reachable by anyone with the page's URL and the anon key.
  if coalesce(btrim(p_full_name), '') = '' then
    raise exception 'Please enter your full name.';
  end if;
  if p_interview_date is null then
    raise exception 'Please choose a date for the interview.';
  end if;
  if coalesce(btrim(p_email), '') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please enter a valid email address.';
  end if;
  if coalesce(btrim(p_phone), '') = '' then
    raise exception 'Please enter a phone number.';
  end if;

  -- Keep only well-formed entries, and cap the list so a scripted submission
  -- can't push an unbounded blob into the row.
  v_contacts := coalesce(p_family_contacts, '[]'::jsonb);
  if jsonb_typeof(v_contacts) <> 'array' then
    v_contacts := '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(entry), '[]'::jsonb)
  into v_contacts
  from (
    select jsonb_build_object(
             'name', left(btrim(c->>'name'), 200),
             'contact', left(btrim(c->>'contact'), 200)
           ) as entry
    from jsonb_array_elements(v_contacts) as c
    where coalesce(btrim(c->>'name'), '') <> ''
       or coalesce(btrim(c->>'contact'), '') <> ''
    limit 20
  ) kept;

  insert into intake_signups (full_name, interview_date, email, phone, family_contacts)
  values (
    left(btrim(p_full_name), 200),
    p_interview_date,
    left(btrim(p_email), 320),
    left(btrim(p_phone), 50),
    v_contacts
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function submit_intake(text, date, text, text, jsonb) from public;
grant execute on function submit_intake(text, date, text, text, jsonb) to anon, authenticated;
