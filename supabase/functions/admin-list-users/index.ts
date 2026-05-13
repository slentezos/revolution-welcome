import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (usersError) throw usersError;

    const { data: profiles } = await admin
      .from("profiles")
      .select(
        "user_id, phone, first_name, last_name, created_at, updated_at, birth_date, gender, postal_code, city_name, region_name, onboarding_step, account_status"
      );
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

    // Quiz response counts per user
    const { data: quiz } = await admin.from("quiz_responses").select("user_id");
    const quizCounts = new Map<string, number>();
    (quiz ?? []).forEach((q: any) => {
      quizCounts.set(q.user_id, (quizCounts.get(q.user_id) ?? 0) + 1);
    });

    // Media counts
    const { data: media } = await admin
      .from("profile_media")
      .select("user_id, media_type, file_path, created_at");
    const mediaByUser = new Map<string, any[]>();
    (media ?? []).forEach((m: any) => {
      const arr = mediaByUser.get(m.user_id) ?? [];
      arr.push(m);
      mediaByUser.set(m.user_id, arr);
    });

    const rows = usersData.users.map((u) => {
      const p: any = profileMap.get(u.id) ?? {};
      const userMedia = mediaByUser.get(u.id) ?? [];
      return {
        id: u.id,
        email: u.email ?? "",
        phone: p.phone ?? u.phone ?? "",
        first_name: p.first_name ?? "",
        last_name: p.last_name ?? "",
        created_at: u.created_at,
        updated_at: p.updated_at ?? u.updated_at ?? u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        birth_date: p.birth_date ?? null,
        gender: p.gender ?? null,
        postal_code: p.postal_code ?? null,
        city_name: p.city_name ?? null,
        region_name: p.region_name ?? null,
        onboarding_step: p.onboarding_step ?? null,
        account_status: p.account_status ?? null,
        quiz_count: quizCounts.get(u.id) ?? 0,
        media: userMedia.map((m) => ({
          media_type: m.media_type,
          file_path: m.file_path,
          created_at: m.created_at,
        })),
      };
    });

    return new Response(JSON.stringify({ users: rows, total: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
