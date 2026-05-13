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

    const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (usersError) throw usersError;

    const { data: profiles } = await admin.from("profiles").select("user_id, phone, first_name, last_name, created_at");
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

    const rows = usersData.users.map((u) => {
      const p: any = profileMap.get(u.id) ?? {};
      return {
        id: u.id,
        email: u.email ?? "",
        phone: p.phone ?? u.phone ?? "",
        first_name: p.first_name ?? "",
        last_name: p.last_name ?? "",
        created_at: u.created_at,
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
