-- Create profiles table for storing user profile data and tracking onboarding progress
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT,
    last_name TEXT,
    gender TEXT,
    looking_for TEXT,
    birth_date DATE,
    onboarding_step TEXT NOT NULL DEFAULT 'media_upload',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for storing user photos and videos
CREATE TABLE public.profile_media (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'portrait', 'silhouette', 'misc')),
    file_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_responses table for storing personality test answers
CREATE TABLE public.quiz_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(profile_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for profile_media
CREATE POLICY "Users can view their own media"
ON public.profile_media FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own media"
ON public.profile_media FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
ON public.profile_media FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for quiz_responses
CREATE POLICY "Users can view their own quiz responses"
ON public.quiz_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz responses"
ON public.quiz_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz responses"
ON public.quiz_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for profile media
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-media', 'profile-media', true);

-- Storage policies for profile media bucket
CREATE POLICY "Users can view all profile media"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-media');

CREATE POLICY "Authenticated users can upload their own media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();