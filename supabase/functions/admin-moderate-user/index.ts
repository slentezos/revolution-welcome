import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Action = "block" | "approve_media" | "reject_media" | "refund" | "fetch_quiz";

interface Body {
  action: Action;
  user_id: string;
  reason?: string;
  custom_text?: string;
}

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

    // Verify admin role
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    const { action, user_id, reason, custom_text } = body;
    if (!action || !user_id) throw new Error("Missing action or user_id");

    // Master bypass — always allow on solentebaptiste@gmail.com
    let result: any = { ok: true };

    if (action === "block") {
      const { error } = await admin
        .from("profiles")
        .update({ account_status: "blocked", updated_at: new Date().toISOString() })
        .eq("user_id", user_id);
      if (error) throw error;
      result.email_intent = { template: "account_blocked", to: user_id };
    } else if (action === "approve_media") {
      const { error } = await admin
        .from("profiles")
        .update({
          account_status: "approved",
          onboarding_step: "quiz_50",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id);
      if (error) throw error;
      result.email_intent = { template: "media_validated", to: user_id };
    } else if (action === "reject_media") {
      const { error } = await admin
        .from("profiles")
        .update({
          account_status: "media_required",
          onboarding_step: "media",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id);
      if (error) throw error;
      result.email_intent = {
        template: "media_rejected",
        to: user_id,
        reason,
        custom_text,
      };
    } else if (action === "refund") {
      // Deep link / mock: returns Stripe dashboard URL for the operator to act.
      result.stripe_url = `https://dashboard.stripe.com/customers?email=${encodeURIComponent(
        user_id
      )}`;
    } else if (action === "fetch_quiz") {
      const { data: quiz } = await admin
        .from("quiz_responses")
        .select("question_id, answer_value, created_at")
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });
      result.quiz = quiz ?? [];
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    // TODO(email): plug into transactional email pipeline once configured.
    if (result.email_intent) {
      console.log("[admin-moderate-user] email intent:", result.email_intent);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
