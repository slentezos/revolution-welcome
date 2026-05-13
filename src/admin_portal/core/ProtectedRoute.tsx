import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AuthState = "checking" | "authorized" | "unauthorized";

/**
 * Gates the Admin Portal:
 *  1. Verifies a Supabase session exists.
 *  2. Verifies the user has the 'admin' role in public.user_roles.
 *
 * On failure: discreet toast + redirect to "/".
 * Uses the shared supabase client so an admin already signed in on the
 * public site is recognized without a second login.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("checking");

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (!mounted) return;
        toast.error("Accès restreint.", {
          description: "Vous devez être connecté pour accéder à cette section.",
        });
        setState("unauthorized");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!mounted) return;

      if (error || !data) {
        toast.error("Accès non autorisé.", {
          description: "Votre compte ne dispose pas des privilèges requis.",
        });
        setState("unauthorized");
        return;
      }

      setState("authorized");
    };

    verify();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user && mounted) setState("unauthorized");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === "checking") {
    return (
      <div
        className="min-h-screen grid place-items-center text-base"
        style={{ background: "#070B14", color: "#94A3B8" }}
      >
        Vérification des accès…
      </div>
    );
  }

  if (state === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
