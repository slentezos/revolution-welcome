import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "superadmin" | "admin" | "moderator" | null;

export type AdminAction =
  | "view_finops"
  | "export_csv"
  | "refund_user"
  | "anonymize_user"
  | "manage_team";

const PERMISSIONS: Record<Exclude<AdminRole, null>, AdminAction[]> = {
  superadmin: [
    "view_finops",
    "export_csv",
    "refund_user",
    "anonymize_user",
    "manage_team",
  ],
  admin: ["view_finops", "export_csv", "refund_user"],
  moderator: [],
};

let cachedRole: { userId: string; role: AdminRole } | null = null;

/**
 * Returns the current admin user's effective role.
 * Cache is in-memory and lives for the page session.
 */
export function useAdminRole() {
  const [role, setRole] = useState<AdminRole>(cachedRole?.role ?? null);
  const [loading, setLoading] = useState(!cachedRole);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) {
        if (mounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }
      if (cachedRole?.userId === uid) {
        if (mounted) {
          setRole(cachedRole.role);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", uid);
      const roles = (data ?? []).map((r: any) => r.role as string);
      let resolved: AdminRole = null;
      if (roles.includes("superadmin")) resolved = "superadmin";
      else if (roles.includes("admin")) resolved = "admin";
      else if (roles.includes("moderator")) resolved = "moderator";
      cachedRole = { userId: uid, role: resolved };
      if (mounted) {
        setRole(resolved);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const can = (action: AdminAction): boolean => {
    if (!role) return false;
    return PERMISSIONS[role].includes(action);
  };

  return {
    role,
    loading,
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin" || role === "superadmin",
    isModerator: role === "moderator",
    can,
  };
}
