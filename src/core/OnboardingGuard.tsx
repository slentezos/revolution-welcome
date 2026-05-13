import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlobalLoading } from "@/components/system/GlobalLoading";

/**
 * If the authenticated user has already completed onboarding,
 * redirect them to /dashboard. Otherwise render the onboarding flow.
 * Unauthenticated users are allowed through (Onboarding handles its own preview mode).
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "completed" | "allow">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) setStatus("allow");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_step")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      setStatus(profile?.onboarding_step === "completed" ? "completed" : "allow");
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === "checking") return <GlobalLoading />;
  if (status === "completed") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
