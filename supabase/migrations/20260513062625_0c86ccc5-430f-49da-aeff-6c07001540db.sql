ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS publication_date date,
  ADD COLUMN IF NOT EXISTS read_time_minutes integer,
  ADD COLUMN IF NOT EXISTS author_avatar_url text,
  ADD COLUMN IF NOT EXISTS category text;