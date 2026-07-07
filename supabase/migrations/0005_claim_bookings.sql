-- Links a newly-authenticated client to any bookings made with their email
-- before they ever created an account (magic-link signup happens post-payment).

create function claim_bookings() returns void
language plpgsql security definer as $$
begin
  update bookings
  set client_id = auth.uid()
  where client_email = auth.jwt() ->> 'email'
    and client_id is null;
end;
$$;

grant execute on function claim_bookings() to authenticated;
