
-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  first_name text,
  last_name text,
  birth_date date,
  gender text,
  looking_for text,
  phone text,
  postal_code text,
  city_name text,
  region_name text,
  onboarding_step text NOT NULL DEFAULT 'profile',
  account_status text NOT NULL DEFAULT 'pending_review' CHECK (account_status IN ('pending_review','active','suspended')),
  -- Secondary residence
  secondary_postal_code text,
  secondary_city_name text,
  secondary_region_name text,
  last_secondary_update timestamptz,
  active_location text NOT NULL DEFAULT 'primary' CHECK (active_location IN ('primary','secondary')),
  last_location_switch timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Profile media
CREATE TABLE public.profile_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  media_type text NOT NULL,
  file_path text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own media" ON public.profile_media FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own media" ON public.profile_media FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own media" ON public.profile_media FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own media" ON public.profile_media FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Quiz responses
CREATE TABLE public.quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  question_id text NOT NULL,
  answer_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own quiz" ON public.quiz_responses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own quiz" ON public.quiz_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own quiz" ON public.quiz_responses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own quiz" ON public.quiz_responses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Waitlist leads
CREATE TABLE public.waitlist_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  phone_preference text CHECK (phone_preference IN ('sms','call')),
  postal_code text NOT NULL,
  city_name text NOT NULL,
  region_name text NOT NULL,
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead','pending_review','active')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read waitlist" ON public.waitlist_leads FOR SELECT TO anon, authenticated USING (true);
