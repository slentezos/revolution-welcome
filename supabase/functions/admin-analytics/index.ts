import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============ FRENCH GEOGRAPHIC HELPERS ============
const IDF_DEPTS = new Set(["75", "77", "78", "91", "92", "93", "94", "95"]);

const DEPT_NAME: Record<string, string> = {
  "06": "Alpes-Maritimes", "13": "Bouches-du-Rhône", "31": "Haute-Garonne",
  "33": "Gironde", "34": "Hérault", "35": "Ille-et-Vilaine",
  "44": "Loire-Atlantique", "59": "Nord", "67": "Bas-Rhin",
  "69": "Rhône", "06000": "Nice", "13001": "Marseille",
};

const cityFromPostal = (zip: string): string => {
  if (!zip) return "—";
  if (zip.startsWith("75")) {
    const arr = parseInt(zip.slice(2), 10);
    if (arr >= 1 && arr <= 20) return `Paris ${arr}${arr === 1 ? "er" : "e"}`;
  }
  return zip;
};

const deptCode = (zip: string) => (zip || "").slice(0, 2);

type Scope = "france" | "paris" | "idf" | "expansion";

const inScope = (zip: string, scope: Scope): boolean => {
  if (!zip) return scope === "france";
  const d = deptCode(zip);
  switch (scope) {
    case "france": return true;
    case "paris": return d === "75";
    case "idf": return IDF_DEPTS.has(d);
    case "expansion": return !IDF_DEPTS.has(d);
  }
};

const isMale = (g?: string) => g === "male" || g === "homme";
const isFemale = (g?: string) => g === "female" || g === "femme";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userRes } = await admin.auth.getUser(token);
    const callerId = userRes?.user?.id;
    if (!callerId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await admin.from("user_roles")
      .select("role").eq("user_id", callerId).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: authUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const users = authUsers?.users ?? [];
    const { data: profiles = [] } = await admin.from("profiles").select("*");
    const { data: media = [] } = await admin.from("profile_media").select("user_id, created_at");
    const { data: quizzes = [] } = await admin.from("quiz_responses").select("user_id, created_at");
    const { data: leads = [] } = await admin.from("waitlist_leads").select("*");

    const mediaByUser = new Map<string, number>();
    (media ?? []).forEach((m: any) => mediaByUser.set(m.user_id, (mediaByUser.get(m.user_id) ?? 0) + 1));
    const quizByUser = new Map<string, number>();
    (quizzes ?? []).forEach((q: any) => quizByUser.set(q.user_id, (quizByUser.get(q.user_id) ?? 0) + 1));

    const now = Date.now();
    const DAY = 24 * 3600 * 1000;
    const ARPU = 89;
    const TARGET = 100_000;

    // ============ PER-SCOPE BLOCKS ============
    const scopes: Scope[] = ["france", "paris", "idf", "expansion"];

    const byScope = Object.fromEntries(scopes.map((scope) => {
      const sp = (profiles ?? []).filter((p: any) => inScope(p.postal_code ?? "", scope));
      const sl = (leads ?? []).filter((l: any) => inScope(l.postal_code ?? "", scope));

      const inscrits = sp.length + sl.length;
      const tutorial = sp.filter((p: any) => p.onboarding_step && p.onboarding_step !== "profile").length;
      const paiement = sp.filter((p: any) => ["paid","quiz","media","review","validated","active"].includes(p.onboarding_step ?? "")).length;
      const quizStarted = sp.filter((p: any) => (quizByUser.get(p.user_id) ?? 0) > 0).length;
      const mediaUp = sp.filter((p: any) => (mediaByUser.get(p.user_id) ?? 0) > 0).length;
      const validated = sp.filter((p: any) => p.account_status === "active" || p.account_status === "validated").length;

      const funnel = [
        { step: "Pré-inscrits", count: inscrits },
        { step: "Tutoriel terminé", count: tutorial },
        { step: "Paiement", count: paiement },
        { step: "Quiz démarré", count: quizStarted },
        { step: "Médias uploadés", count: mediaUp },
        { step: "Profils validés", count: validated },
      ];

      const men = sp.filter((p: any) => isMale(p.gender)).length;
      const women = sp.filter((p: any) => isFemale(p.gender)).length;
      const total = men + women;
      const menPct = total ? Math.round((men / total) * 100) : 50;

      const goldReady = sp.filter((p: any) =>
        (mediaByUser.get(p.user_id) ?? 0) >= 1 &&
        (quizByUser.get(p.user_id) ?? 0) >= 10 &&
        !!p.phone
      ).length;

      const conciergeLive = sp.filter((p: any) => {
        const c = quizByUser.get(p.user_id) ?? 0;
        return c > 0 && c < 50;
      }).length;

      const moderationQueue = sp.filter((p: any) => p.account_status === "pending_review");
      const oldestPending = moderationQueue.reduce<number | null>((acc, p: any) => {
        const t = new Date(p.updated_at ?? p.created_at).getTime();
        return acc === null || t < acc ? t : acc;
      }, null);
      const oldestPendingMinutes = oldestPending ? Math.round((now - oldestPending) / 60000) : 0;

      const scopedUserIds = new Set(sp.map((p: any) => p.user_id));
      const churnRisk = users.filter((u: any) => {
        if (!scopedUserIds.has(u.id)) return false;
        const last = u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : 0;
        return last && now - last > 7 * DAY;
      }).length;

      const mrr = validated * ARPU;
      const series: { month: string; mrr: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString("fr-FR", { month: "short" });
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
        const cohort = sp.filter((p: any) => {
          const t = new Date(p.created_at).getTime();
          return t < monthEnd && (p.account_status === "active" || p.account_status === "validated");
        }).length;
        series.push({ month: label, mrr: Math.max(cohort * ARPU, i === 0 ? mrr : 0) });
      }

      return [scope, {
        kpis: {
          inscrits, validated, mrr,
          conversionPct: inscrits ? Math.round((validated / inscrits) * 1000) / 10 : 0,
          men, women, menPct, womenPct: 100 - menPct,
          goldReady, conciergeLive,
          moderationQueueSize: moderationQueue.length,
          oldestPendingMinutes, churnRisk,
        },
        funnel,
        revenue: { mrr, target: TARGET, series },
      }];
    }));

    // ============ EXPANSION SCOUTING ============
    const LAUNCH_TARGET = 50;
    const deptBuckets = new Map<string, { code: string; preregs: number; profiles: number }>();
    [...(leads ?? []).map((l: any) => ({ zip: l.postal_code, kind: "lead" })),
     ...(profiles ?? []).map((p: any) => ({ zip: p.postal_code, kind: "profile" }))]
      .forEach((r) => {
        const d = deptCode(r.zip ?? "");
        if (!d || IDF_DEPTS.has(d)) return;
        const b = deptBuckets.get(d) ?? { code: d, preregs: 0, profiles: 0 };
        if (r.kind === "lead") b.preregs++; else b.profiles++;
        deptBuckets.set(d, b);
      });

    const expansionDepts = Array.from(deptBuckets.values())
      .map((b) => {
        const total = b.preregs + b.profiles;
        return {
          code: b.code,
          name: DEPT_NAME[b.code] ?? `Département ${b.code}`,
          preregs: b.preregs,
          profiles: b.profiles,
          total,
          pctOfTarget: Math.min(100, Math.round((total / LAUNCH_TARGET) * 100)),
          launchTarget: LAUNCH_TARGET,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // ============ PARIS / IDF TOP ZONES ============
    const idfProfiles = (profiles ?? []).filter((p: any) => IDF_DEPTS.has(deptCode(p.postal_code ?? "")));
    const zoneBuckets = new Map<string, { label: string; men: number; women: number }>();
    idfProfiles.forEach((p: any) => {
      const label = cityFromPostal(p.postal_code ?? "") || (p.city_name ?? "—");
      const b = zoneBuckets.get(label) ?? { label, men: 0, women: 0 };
      if (isMale(p.gender)) b.men++;
      else if (isFemale(p.gender)) b.women++;
      zoneBuckets.set(label, b);
    });

    const idfZones = Array.from(zoneBuckets.values())
      .map((z) => {
        const total = z.men + z.women;
        const dominantPct = total ? Math.round((Math.max(z.men, z.women) / total) * 100) : 0;
        return { ...z, total, dominantPct };
      })
      .sort((a, b) => b.total - a.total);

    const topIdfZones = idfZones.slice(0, 3);
    const imbalanceAlerts = idfZones.filter((z) => z.total >= 3 && z.dominantPct >= 65).slice(0, 6);

    // ============ RECENT ACTIVITY (last 15 min, fallback to last 10) ============
    const FIFTEEN = 15 * 60 * 1000;
    const profileLoc = new Map<string, string>();
    (profiles ?? []).forEach((p: any) => {
      profileLoc.set(p.user_id, cityFromPostal(p.postal_code ?? "") || (p.city_name ?? "France"));
    });

    type Event = { type: string; label: string; location: string; at: string; ts: number };
    const events: Event[] = [];

    (leads ?? []).forEach((l: any) => {
      events.push({
        type: "lead", label: "Nouvelle pré-inscription",
        location: cityFromPostal(l.postal_code ?? "") || (l.city_name ?? "France"),
        at: l.created_at, ts: new Date(l.created_at).getTime(),
      });
    });
    (profiles ?? []).forEach((p: any) => {
      if (p.account_status === "active" || p.account_status === "validated") {
        events.push({
          type: "validated", label: "Profil validé",
          location: cityFromPostal(p.postal_code ?? "") || (p.city_name ?? "France"),
          at: p.updated_at ?? p.created_at, ts: new Date(p.updated_at ?? p.created_at).getTime(),
        });
      }
    });
    (quizzes ?? []).forEach((q: any) => {
      events.push({
        type: "quiz", label: "Réponse quiz",
        location: profileLoc.get(q.user_id) ?? "France",
        at: q.created_at, ts: new Date(q.created_at).getTime(),
      });
    });
    (media ?? []).forEach((m: any) => {
      events.push({
        type: "media", label: "Média uploadé",
        location: profileLoc.get(m.user_id) ?? "France",
        at: m.created_at, ts: new Date(m.created_at).getTime(),
      });
    });

    const recentWindow = events.filter((e) => now - e.ts <= FIFTEEN);
    const recent = (recentWindow.length ? recentWindow : events)
      .sort((a, b) => b.ts - a.ts).slice(0, 12);

    return new Response(JSON.stringify({
      byScope,
      expansion: { launchTarget: LAUNCH_TARGET, departments: expansionDepts },
      idf: { topZones: topIdfZones, imbalanceAlerts },
      recentActivity: recent,
      meta: {
        totalUsers: users.length,
        totalLeads: (leads ?? []).length,
        generatedAt: new Date().toISOString(),
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
