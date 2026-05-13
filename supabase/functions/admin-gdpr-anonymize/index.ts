import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MASTER_EMAIL = "solentebaptiste@gmail.com";

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

    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const roleSet = new Set((roles ?? []).map((r: any) => r.role));
    if (!roleSet.has("superadmin")) {
      return new Response(JSON.stringify({ error: "Forbidden — superadmin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id, confirm_email } = (await req.json()) as {
      user_id: string;
      confirm_email: string;
    };
    if (!user_id || !confirm_email) throw new Error("Missing user_id or confirm_email");

    const target = await admin.auth.admin.getUserById(user_id);
    if (!target.data?.user) throw new Error("User not found");
    if (target.data.user.email === MASTER_EMAIL) {
      return new Response(JSON.stringify({ error: "Master account is protected" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if ((target.data.user.email ?? "").toLowerCase() !== confirm_email.toLowerCase()) {
      return new Response(JSON.stringify({ error: "Email confirmation mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonEmail = `anon_${crypto.randomUUID()}@deleted.local`;

    // Scramble auth identity
    await admin.auth.admin.updateUserById(user_id, {
      email: anonEmail,
      phone: undefined,
      user_metadata: { anonymized: true },
    });

    // Wipe profile PII
    await admin
      .from("profiles")
      .update({
        first_name: null,
        last_name: null,
        phone: null,
        birth_date: null,
        postal_code: null,
        city_name: null,
        region_name: null,
        secondary_postal_code: null,
        secondary_city_name: null,
        secondary_region_name: null,
        other_city_1: null,
        other_postal_code_1: null,
        other_city_2: null,
        other_postal_code_2: null,
        nationality: null,
        account_status: "anonymized",
        anonymized_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    // Best-effort delete media files in storage (bucket: profile-media if exists)
    const { data: mediaRows } = await admin
      .from("profile_media")
      .select("file_path")
      .eq("user_id", user_id);
    const paths = (mediaRows ?? []).map((m: any) => m.file_path).filter(Boolean);
    if (paths.length) {
      try {
        await admin.storage.from("profile-media").remove(paths);
      } catch (_) {
        // ignore — bucket may not exist
      }
    }
    await admin.from("profile_media").delete().eq("user_id", user_id);

    // Sign out all sessions
    try {
      await admin.auth.admin.signOut(user_id);
    } catch (_) {
      // ignore
    }

    await admin.from("admin_audit_log").insert({
      actor_id: userData.user.id,
      action: "gdpr_anonymize",
      target_user_id: user_id,
      payload: { former_email: target.data.user.email, media_removed: paths.length },
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
