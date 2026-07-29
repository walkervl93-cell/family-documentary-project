-- New service line: Audio — a lighter-weight, in-person recording session
-- (mic'd conversation over photos/videos, edited into a Ken Burns-style
-- film) positioned as a more accessible alternative to the full
-- Documentaries production. Uses the same consult-first booking flow.

alter type booking_service_type add value if not exists 'audio';
