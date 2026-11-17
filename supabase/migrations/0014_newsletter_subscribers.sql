-- Newsletter subscribers, collected from the bar in the site footer.
--
-- Writes go through subscribe_newsletter() for the same reason as
-- submit_intake() and book_consult(): nobody is signed in when they sign up,
-- so a direct insert can't pass row-level security, and an insert policy open
-- enough to allow one would let anyone write arbitrary rows.

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  -- Stored lowercase so "Vic@Example.com" and "vic@example.com" can't both
  -- end up on the list and get the same mail twice.
  email text not null unique,
  phone text,
  -- Which page they signed up from, so it's possible to tell later which
  -- parts of the site actually bring people in.
  source text,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_at_idx
  on newsletter_subscribers (created_at desc);

alter table newsletter_subscribers enable row level security;

drop policy if exists "admins read newsletter subscribers" on newsletter_subscribers;
create policy "admins read newsletter subscribers" on newsletter_subscribers
  for select using (is_admin());

drop policy if exists "admins update newsletter subscribers" on newsletter_subscribers;
create policy "admins update newsletter subscribers" on newsletter_subscribers
  for update using (is_admin()) with check (is_admin());

drop function if exists subscribe_newsletter(text, text, text);

create function subscribe_newsletter(
  p_email text,
  p_phone text default null,
  p_source text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := lower(btrim(coalesce(p_email, '')));

  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please enter a valid email address.';
  end if;

  -- Signing up twice is a normal thing for a person to do, and the second
  -- time shouldn't look like an error. Re-subscribing also clears an earlier
  -- unsubscribe, which is what someone re-entering their address means by it.
  insert into newsletter_subscribers (email, phone, source)
  values (left(v_email, 320), left(btrim(p_phone), 50), left(btrim(p_source), 100))
  on conflict (email) do update
    set phone = coalesce(nullif(excluded.phone, ''), newsletter_subscribers.phone),
        unsubscribed_at = null;
end;
$$;

revoke all on function subscribe_newsletter(text, text, text) from public;
grant execute on function subscribe_newsletter(text, text, text) to anon, authenticated;
