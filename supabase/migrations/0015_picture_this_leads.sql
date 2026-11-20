-- Interest sign-ups from the hidden /picture-this holiday landing page.
--
-- As with book_consult(), submit_intake() and subscribe_newsletter(): writes
-- go through a SECURITY DEFINER function rather than a table policy. Nobody
-- is signed in on that page, so a plain insert can't satisfy row-level
-- security, and the function validates before writing. The table itself has
-- no insert policy at all, so anonymous callers can add a lead and can never
-- read one back.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'picture_this_best_time') then
    create type picture_this_best_time as enum ('morning', 'midday', 'evening');
  end if;
  if not exists (select 1 from pg_type where typname = 'picture_this_interviewee') then
    create type picture_this_interviewee as enum ('self', 'family_member');
  end if;
end
$$;

create table if not exists picture_this_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  best_time picture_this_best_time not null,
  interviewee picture_this_interviewee not null,
  -- From the ?src= parameter, so each email or post can carry its own tag and
  -- you can see which one actually sent people.
  source text,
  notified_at timestamptz
);

create index if not exists picture_this_leads_created_at_idx
  on picture_this_leads (created_at desc);

alter table picture_this_leads enable row level security;

drop policy if exists "admins read picture this leads" on picture_this_leads;
create policy "admins read picture this leads" on picture_this_leads
  for select using (is_admin());

drop function if exists submit_picture_this_lead(text, text, text, picture_this_best_time, picture_this_interviewee, text);

create function submit_picture_this_lead(
  p_full_name text,
  p_phone text,
  p_email text,
  p_best_time picture_this_best_time,
  p_interviewee picture_this_interviewee,
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
    raise exception 'Please enter your full name.';
  end if;

  if coalesce(btrim(p_email), '') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please enter a valid email address.';
  end if;

  -- Count digits rather than match a format: people write numbers as
  -- (804) 432-4773, 804.432.4773 or 8044324773, and all of them are fine.
  -- 10 digits, or 11 starting with a US country code.
  v_digits := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if length(v_digits) not in (10, 11) or (length(v_digits) = 11 and left(v_digits, 1) <> '1') then
    raise exception 'Please enter a valid US phone number.';
  end if;

  insert into picture_this_leads (full_name, phone, email, best_time, interviewee, source)
  values (
    left(btrim(p_full_name), 200),
    left(btrim(p_phone), 50),
    left(btrim(p_email), 320),
    p_best_time,
    p_interviewee,
    left(btrim(p_source), 100)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function submit_picture_this_lead(text, text, text, picture_this_best_time, picture_this_interviewee, text) from public;
grant execute on function submit_picture_this_lead(text, text, text, picture_this_best_time, picture_this_interviewee, text) to anon, authenticated;
