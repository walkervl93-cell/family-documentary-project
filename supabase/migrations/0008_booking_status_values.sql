-- New statuses for the consult-first flow: a booking now starts as a free
-- consult call, then moves to payment_requested once an admin sends a
-- payment link after the call, before reaching the existing "booked" status.
-- ALTER TYPE ... ADD VALUE must not be combined with other statements that
-- use the new value in the same transaction, so this migration only adds
-- the enum values; everything that uses them lives in the next migration.

alter type booking_status add value if not exists 'consult_scheduled';
alter type booking_status add value if not exists 'payment_requested';
