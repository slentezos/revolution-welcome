
-- Waitlist leads table for non-IDF users
CREATE TABLE public.waitlist_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  phone_preference text CHECK (phone_preference IN ('sms', 'call')),
  postal_code text NOT NULL,
  city_name text NOT NULL,
  region_name text NOT NULL,
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'pending_review', 'active')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for waitlist (no auth required)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow reading own entry by email (for duplicate check)
CREATE POLICY "Anyone can read waitlist" ON public.waitlist_leads
  FOR SELECT TO anon, authenticated
  USING (true);

-- Add location and status columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS city_name text,
  ADD COLUMN IF NOT EXISTS region_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'pending_review' CHECK (account_status IN ('pending_review', 'active', 'suspended'));
