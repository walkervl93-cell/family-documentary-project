-- Distinguishes which service line an inquiry came from, now that Guided
-- Session is inquiry-only too (no online booking/payment yet).

create type inquiry_service as enum ('documentary', 'guided_session');

alter table inquiries
  add column service inquiry_service not null default 'documentary';
