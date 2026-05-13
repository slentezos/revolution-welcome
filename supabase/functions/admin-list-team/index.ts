import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const roleSet = new Set((callerRoles ?? []).map((r: any) => r.role));
    if (!roleSet.has("superadmin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roles } = await admin
      .from("user_roles")
      .select("user_id, role, created_at")
      .in("role", ["admin", "superadmin", "moderator"]);

    const byUser = new Map<string, { roles: string[]; created_at: string }>();
    (roles ?? []).forEach((r: any) => {
      const cur = byUser.get(r.user_id) ?? { roles: [], created_at: r.created_at };
      cur.roles.push(r.role);
      byUser.set(r.user_id, cur);
    });

    const auths = await Promise.all(
      [...byUser.keys()].map((uid) => admin.auth.admin.getUserById(uid))
    );

    const team = [...byUser.entries()].map(([uid, info], i) => {
      const u = auths[i].data?.user;
      const highest = info.roles.includes("superadmin")
        ? "superadmin"
        : info.roles.includes("admin")
          ? "admin"
          : "moderator";
      return {
        id: uid,
        email: u?.email ?? "—",
        role: highest,
        roles: info.roles,
        last_sign_in_at: u?.last_sign_in_at ?? null,
        created_at: info.created_at,
      };
    });

    const { data: invites } = await admin
      .from("admin_invites")
      .select("id, email, role, expires_at, accepted_at, created_at")
      .order("created_at", { ascending: false });

    return new Response(JSON.stringify({ team, invites: invites ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
