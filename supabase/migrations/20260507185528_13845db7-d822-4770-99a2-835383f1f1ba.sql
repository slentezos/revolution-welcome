ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS other_city_1 text,
  ADD COLUMN IF NOT EXISTS other_postal_code_1 text,
  ADD COLUMN IF NOT EXISTS other_city_2 text,
  ADD COLUMN IF NOT EXISTS other_postal_code_2 text;