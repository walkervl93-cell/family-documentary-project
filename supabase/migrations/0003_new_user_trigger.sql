-- Auto-create a profile row whenever a new auth user is created (magic link signup)

create function handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name)
  values (new.id, 'client', new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
