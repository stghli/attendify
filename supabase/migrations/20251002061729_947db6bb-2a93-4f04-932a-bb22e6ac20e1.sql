-- Deactivate old access codes, keep only 9768 active
UPDATE public.access_codes
SET is_active = false, updated_at = now()
WHERE code IN ('1234', '5678');