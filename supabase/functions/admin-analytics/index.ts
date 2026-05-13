import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Miami zip codes (Miami-Dade core)
const MIAMI_ZIPS = new Set([
  "33101","33125","33126","33127","33128","33129","33130","33131","33132",
  "33133","33134","33135","33136","33137","33138","33139","33140","33141",
  "33142","33143","33144","33145","33146","33147","33149","33150","33155",
  "33156","33158","33161","33162","33165","33166","33168","33169","33170",
  "33172","33173","33174","33175","33176","33177","33178","33179","33180",
  "33181","33182","33183","33184","33185","33186","33187","33189","33190","33193","33194","33196",
]);

const isMiami = (p: any) => {
  const zip = p.postal_code ?? "";
  const city = (p.city_name ?? "").toLowerCase();
  return MIAMI_ZIPS.has(zip) || city.includes("miami");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller is an admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userRes } = await admin.auth.getUser(token);
    const callerId = userRes?.user?.id;
    if (!callerId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", callerId).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: authUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const users = authUsers?.users ?? [];

    const { data: profiles = [] } = await admin.from("profiles").select("*");
    const { data: media = [] } = await admin.from("profile_media").select("user_id");
    const { data: quizzes = [] } = await admin.from("quiz_responses").select("user_id, created_at");

    const mediaByUser = new Map<string, number>();
    (media ?? []).forEach((m: any) => mediaByUser.set(m.user_id, (mediaByUser.get(m.user_id) ?? 0) + 1));
    const quizByUser = new Map<string, number>();
    (quizzes ?? []).forEach((q: any) => quizByUser.set(q.user_id, (quizByUser.get(q.user_id) ?? 0) + 1));

    const now = Date.now();
    const DAY = 24 * 3600 * 1000;

    // ===== FUNNEL =====
    const inscrits = users.length;
    const tutorial = (profiles ?? []).filter((p: any) => p.onboarding_step && p.onboarding_step !== "profile").length;
    const paiement = (profiles ?? []).filter((p: any) => ["paid","quiz","media","review","validated","active"].includes(p.onboarding_step ?? "")).length;
    const quizStarted = (profiles ?? []).filter((p: any) => (quizByUser.get(p.user_id) ?? 0) > 0).length;
    const mediaUploaded = (profiles ?? []).filter((p: any) => (mediaByUser.get(p.user_id) ?? 0) > 0).length;
    const validated = (profiles ?? []).filter((p: any) => p.account_status === "active" || p.account_status === "validated").length;

    const funnel = [
      { step: "Inscrits", count: inscrits },
      { step: "Tutorial Terminés", count: tutorial },
      { step: "Paiement Optionnel", count: paiement },
      { step: "Quiz démarré", count: quizStarted },
      { step: "Médias Uploadés", count: mediaUploaded },
      { step: "Profils Validés", count: validated },
    ];

    // ===== REVENUE =====
    // Assumption: 89€ Concierge per validated profile (membership).
    const ARPU = 89;
    const TARGET = 100_000;
    const mrr = validated * ARPU;
    // Build last 6 months MRR projection from validated profile creation dates
    const months: { month: string; mrr: number; target: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("fr-FR", { month: "short" });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const cohort = (profiles ?? []).filter((p: any) => {
        const t = new Date(p.created_at).getTime();
        return t < monthEnd && (p.account_status === "active" || p.account_status === "validated" || t < monthStart + 30 * DAY);
      }).length;
      months.push({ month: label, mrr: Math.max(cohort * ARPU, i === 0 ? mrr : 0), target: TARGET / 6 * (6 - i) });
    }

    // ===== MIAMI =====
    const miamiProfiles = (profiles ?? []).filter(isMiami);
    const miamiMen = miamiProfiles.filter((p: any) => p.gender === "male" || p.gender === "homme").length;
    const miamiWomen = miamiProfiles.filter((p: any) => p.gender === "female" || p.gender === "femme").length;
    const zipBuckets = new Map<string, { m: number; f: number }>();
    miamiProfiles.forEach((p: any) => {
      const z = p.postal_code ?? "—";
      const b = zipBuckets.get(z) ?? { m: 0, f: 0 };
      if (p.gender === "male" || p.gender === "homme") b.m++;
      else if (p.gender === "female" || p.gender === "femme") b.f++;
      zipBuckets.set(z, b);
    });
    const densityAlerts = Array.from(zipBuckets.entries())
      .map(([zip, b]) => {
        const total = b.m + b.f;
        const ratio = total > 0 ? Math.max(b.m, b.f) / total : 0;
        return { zip, men: b.m, women: b.f, total, dominantPct: Math.round(ratio * 100) };
      })
      .filter((z) => z.total >= 3 && z.dominantPct >= 60)
      .sort((a, b) => b.dominantPct - a.dominantPct);

    const goldReady = (profiles ?? []).filter((p: any) =>
      (mediaByUser.get(p.user_id) ?? 0) >= 1 &&
      (quizByUser.get(p.user_id) ?? 0) >= 10 &&
      !!p.phone
    ).length;
    const miamiGoldReady = miamiProfiles.filter((p: any) =>
      (mediaByUser.get(p.user_id) ?? 0) >= 1 &&
      (quizByUser.get(p.user_id) ?? 0) >= 10 &&
      !!p.phone
    ).length;

    // ===== VELOCITY =====
    const conciergeLive = (profiles ?? []).filter((p: any) => {
      const c = quizByUser.get(p.user_id) ?? 0;
      return c > 0 && c < 50;
    }).length;

    const moderationQueue = (profiles ?? []).filter((p: any) => p.account_status === "pending_review");
    const oldestPending = moderationQueue.reduce<number | null>((acc, p: any) => {
      const t = new Date(p.updated_at ?? p.created_at).getTime();
      return acc === null || t < acc ? t : acc;
    }, null);
    const oldestPendingMinutes = oldestPending ? Math.round((now - oldestPending) / 60000) : 0;

    const churnRisk = users.filter((u: any) => {
      const last = u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : 0;
      return last && now - last > 7 * DAY;
    }).length;

    return new Response(
      JSON.stringify({
        funnel,
        revenue: { mrr, target: TARGET, arpu: ARPU, series: months },
        miami: {
          total: miamiProfiles.length,
          men: miamiMen,
          women: miamiWomen,
          goldReady: miamiGoldReady,
          densityAlerts,
        },
        velocity: {
          conciergeLive,
          moderationQueueSize: moderationQueue.length,
          oldestPendingMinutes,
          churnRisk,
          goldReadyTotal: goldReady,
        },
        meta: { totalUsers: inscrits, generatedAt: new Date().toISOString() },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
