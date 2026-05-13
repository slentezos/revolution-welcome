
CREATE OR REPLACE FUNCTION public.is_admin_or_higher(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','superadmin','moderator')
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin_or_higher(uuid) FROM public, anon, authenticated;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS anonymized_at timestamptz;

CREATE TABLE IF NOT EXISTS public.admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role public.app_role NOT NULL,
  token text NOT NULL UNIQUE,
  invited_by uuid NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmins view invites" ON public.admin_invites;
DROP POLICY IF EXISTS "Superadmins insert invites" ON public.admin_invites;
DROP POLICY IF EXISTS "Superadmins delete invites" ON public.admin_invites;

CREATE POLICY "Superadmins view invites" ON public.admin_invites
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmins insert invites" ON public.admin_invites
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'superadmin') AND invited_by = auth.uid());
CREATE POLICY "Superadmins delete invites" ON public.admin_invites
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  target_user_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmins read audit" ON public.admin_audit_log;
CREATE POLICY "Superadmins read audit" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'superadmin'::public.app_role
FROM auth.users u
WHERE u.email = 'solentebaptiste@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
