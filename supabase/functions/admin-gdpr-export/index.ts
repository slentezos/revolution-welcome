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

    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const roleSet = new Set((roles ?? []).map((r: any) => r.role));
    if (!roleSet.has("admin") && !roleSet.has("superadmin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id } = (await req.json()) as { user_id: string };
    if (!user_id) throw new Error("Missing user_id");

    const [profileRes, mediaRes, quizRes, authRes] = await Promise.all([
      admin.from("profiles").select("*").eq("user_id", user_id).maybeSingle(),
      admin.from("profile_media").select("*").eq("user_id", user_id),
      admin.from("quiz_responses").select("*").eq("user_id", user_id),
      admin.auth.admin.getUserById(user_id),
    ]);

    const exportPayload = {
      generated_at: new Date().toISOString(),
      generated_by: userData.user.email,
      subject_user_id: user_id,
      auth: authRes.data?.user
        ? {
            id: authRes.data.user.id,
            email: authRes.data.user.email,
            phone: authRes.data.user.phone,
            created_at: authRes.data.user.created_at,
            last_sign_in_at: authRes.data.user.last_sign_in_at,
          }
        : null,
      profile: profileRes.data,
      media: mediaRes.data ?? [],
      quiz_responses: quizRes.data ?? [],
    };

    await admin.from("admin_audit_log").insert({
      actor_id: userData.user.id,
      action: "gdpr_export",
      target_user_id: user_id,
      payload: { count_media: mediaRes.data?.length ?? 0, count_quiz: quizRes.data?.length ?? 0 },
    });

    return new Response(JSON.stringify(exportPayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
