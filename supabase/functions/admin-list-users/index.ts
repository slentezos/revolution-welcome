import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ListBody {
  page?: number;
  page_size?: number;
  search?: string;
  stuck_only?: boolean;
  step?: string;
}

const STUCK_STEPS = ["payment", "pricing", "quiz", "quiz_initial", "quiz_50", "quiz_40"];

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

    // Role check: admin / superadmin / moderator
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const roleSet = new Set((roles ?? []).map((r: any) => r.role));
    if (
      !roleSet.has("admin") &&
      !roleSet.has("superadmin") &&
      !roleSet.has("moderator")
    ) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: ListBody = {};
    try {
      body = (await req.json()) as ListBody;
    } catch {
      // empty body OK
    }
    const page = Math.max(1, body.page ?? 1);
    const pageSize = Math.min(200, Math.max(1, body.page_size ?? 50));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build profiles query — server-side filtering & pagination
    let q = admin
      .from("profiles")
      .select(
        "user_id, phone, first_name, last_name, created_at, updated_at, birth_date, gender, postal_code, city_name, region_name, onboarding_step, account_status",
        { count: "exact" }
      );

    if (body.search && body.search.trim()) {
      const s = body.search.trim().replace(/[%_]/g, "");
      const like = `%${s}%`;
      q = q.or(
        `first_name.ilike.${like},last_name.ilike.${like},phone.ilike.${like},postal_code.ilike.${like},city_name.ilike.${like}`
      );
    }
    if (body.stuck_only) {
      const cutoff = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
      q = q.lt("updated_at", cutoff);
      q = q.in("onboarding_step", STUCK_STEPS);
    }
    if (body.step && body.step !== "all") {
      // step filter is applied client-side after derivation, but we can prefilter common ones
      // For tunnel steps that map directly to onboarding_step contains a substring,
      // we let the client refine — DB only narrows when exact match.
      // Keep simple: skip server filter for derived steps.
    }

    q = q.order("updated_at", { ascending: false }).range(from, to);

    const { data: profiles, error: profilesError, count } = await q;
    if (profilesError) throw profilesError;

    const userIds = (profiles ?? []).map((p: any) => p.user_id);

    // Fetch auth metadata (email, last_sign_in_at) for these users
    // Note: auth.admin.listUsers can't filter by id list; loop getUserById in parallel.
    const authResults = await Promise.all(
      userIds.map((uid) => admin.auth.admin.getUserById(uid))
    );
    const authByUser = new Map<string, any>();
    authResults.forEach((r, i) => {
      if (r.data?.user) authByUser.set(userIds[i], r.data.user);
    });

    // If search term looks like an email, also try to find user_ids by auth email
    // (since profiles.email isn't stored, we can't ilike at DB level).
    let extraEmailRows: any[] = [];
    if (body.search && body.search.includes("@")) {
      const { data: u } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
      const term = body.search.toLowerCase();
      const matches = (u?.users ?? []).filter((x) => x.email?.toLowerCase().includes(term));
      const matchIds = matches.map((m) => m.id).filter((id) => !authByUser.has(id));
      if (matchIds.length) {
        const { data: extraProfiles } = await admin
          .from("profiles")
          .select(
            "user_id, phone, first_name, last_name, created_at, updated_at, birth_date, gender, postal_code, city_name, region_name, onboarding_step, account_status"
          )
          .in("user_id", matchIds);
        extraEmailRows = extraProfiles ?? [];
        matches.forEach((m) => authByUser.set(m.id, m));
      }
    }

    const allProfiles = [...(profiles ?? []), ...extraEmailRows];
    const finalIds = allProfiles.map((p: any) => p.user_id);

    // Media counts (only for current page)
    const { data: media } = await admin
      .from("profile_media")
      .select("user_id, media_type, file_path, created_at")
      .in("user_id", finalIds.length ? finalIds : ["00000000-0000-0000-0000-000000000000"]);
    const mediaByUser = new Map<string, any[]>();
    (media ?? []).forEach((m: any) => {
      const arr = mediaByUser.get(m.user_id) ?? [];
      arr.push(m);
      mediaByUser.set(m.user_id, arr);
    });

    const rows = allProfiles.map((p: any) => {
      const u = authByUser.get(p.user_id);
      return {
        id: p.user_id,
        email: u?.email ?? "",
        phone: p.phone ?? u?.phone ?? "",
        first_name: p.first_name ?? "",
        last_name: p.last_name ?? "",
        created_at: u?.created_at ?? p.created_at,
        updated_at: p.updated_at ?? u?.updated_at ?? p.created_at,
        last_sign_in_at: u?.last_sign_in_at ?? null,
        birth_date: p.birth_date ?? null,
        gender: p.gender ?? null,
        postal_code: p.postal_code ?? null,
        city_name: p.city_name ?? null,
        region_name: p.region_name ?? null,
        onboarding_step: p.onboarding_step ?? null,
        account_status: p.account_status ?? null,
        quiz_count: 0,
        media: (mediaByUser.get(p.user_id) ?? []).map((m: any) => ({
          media_type: m.media_type,
          file_path: m.file_path,
          created_at: m.created_at,
        })),
      };
    });

    return new Response(
      JSON.stringify({
        users: rows,
        total_count: count ?? rows.length,
        page,
        page_size: pageSize,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
