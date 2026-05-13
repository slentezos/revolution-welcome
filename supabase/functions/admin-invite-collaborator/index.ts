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

    const { email, role, origin } = (await req.json()) as {
      email: string;
      role: "admin" | "moderator";
      origin?: string;
    };
    if (!email || !["admin", "moderator"].includes(role)) {
      throw new Error("Invalid email or role");
    }

    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

    const { data: invite, error } = await admin
      .from("admin_invites")
      .insert({
        email: email.toLowerCase().trim(),
        role,
        token,
        invited_by: userData.user.id,
      })
      .select()
      .single();
    if (error) throw error;

    await admin.from("admin_audit_log").insert({
      actor_id: userData.user.id,
      action: "invite_collaborator",
      payload: { email, role, invite_id: invite.id },
    });

    const baseUrl = origin ?? "";
    const accept_url = `${baseUrl}/portal-secret-admin/accept-invite?token=${token}`;

    return new Response(JSON.stringify({ ok: true, invite, accept_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
