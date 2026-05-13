import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSection } from "../core/useAdminSection";

/* ---------- 2026 Executive palette ---------- */
const SURFACE = "#0E1626";
const SURFACE_2 = "#131C30";
const BORDER = "#1E2A44";
const GOLD = "#C9A961";
const GOLD_SOFT = "#A88E4F";
const NAVY = "#0A1120";
const TEXT = "#F1F5F9";
const MUTED = "#8B97AE";
const DANGER = "#F87171";
const FONT = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

type Scope = "france" | "paris" | "idf" | "expansion";

type FunnelStep = { step: string; count: number };
type ScopeBlock = {
  kpis: {
    inscrits: number; validated: number; mrr: number; conversionPct: number;
    men: number; women: number; menPct: number; womenPct: number;
    goldReady: number; conciergeLive: number;
    moderationQueueSize: number; oldestPendingMinutes: number; churnRisk: number;
  };
  funnel: FunnelStep[];
  revenue: { mrr: number; target: number; series: { month: string; mrr: number }[] };
};

type Analytics = {
  byScope: Record<Scope, ScopeBlock>;
  expansion: {
    launchTarget: number;
    departments: { code: string; name: string; preregs: number; profiles: number; total: number; pctOfTarget: number; launchTarget: number }[];
  };
  idf: {
    topZones: { label: string; men: number; women: number; total: number; dominantPct: number }[];
    imbalanceAlerts: { label: string; men: number; women: number; total: number; dominantPct: number }[];
  };
  recentActivity: { type: string; label: string; location: string; at: string }[];
  meta: { totalUsers: number; totalLeads: number; generatedAt: string };
};

const SCOPE_LABEL: Record<Scope, string> = {
  france: "France Global",
  paris: "Paris Intra-muros",
  idf: "Île-de-France",
  expansion: "Zones d'Expansion",
};

const fmt = (n: number) => n.toLocaleString("fr-FR");
const fmtEur = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmtAgo = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
};

export function CommandCenterView() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("france");
  const { setSection } = useAdminSection();

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke("admin-analytics");
        if (error) throw error;
        if (!cancel) { setData(res as Analytics); setError(null); }
      } catch (e: any) {
        if (!cancel) setError(e.message ?? "Erreur de chargement");
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { cancel = true; clearInterval(id); };
  }, []);

  const block = data?.byScope?.[scope];

  const exportFunnelCsv = () => {
    if (!block) return;
    const header = ["Étape", "Volume", "Conversion %"];
    const rows = block.funnel.map((s, i) => {
      const prev = i === 0 ? s.count : block.funnel[i - 1].count;
      const conv = prev > 0 ? ((s.count / prev) * 100).toFixed(1) : "—";
      return [s.step, s.count, conv];
    });
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `matrix-${scope}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (error) {
    return (
      <div className="rounded-lg border p-6 text-base"
        style={{ background: SURFACE, borderColor: BORDER, color: DANGER, fontFamily: FONT }}>
        Erreur d'analyse : {error}
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ fontFamily: FONT, color: TEXT }}>
      {/* Header bar: scope toggle + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
        style={{ background: SURFACE, borderColor: BORDER }}>
        <ScopeToggle value={scope} onChange={setScope} />
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm" style={{ color: MUTED }}>
            <span className="inline-flex h-1.5 w-1.5 rounded-full mr-1.5 align-middle animate-pulse" style={{ background: GOLD }} />
            Live · 60s
          </span>
          <button onClick={exportFunnelCsv} disabled={!block}
            className="h-9 px-3.5 rounded-md text-sm font-semibold tracking-tight transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}>
            Export Matrix CSV
          </button>
          <button onClick={() => setSection("moderation")}
            className="h-9 px-3.5 rounded-md text-sm font-semibold tracking-tight border transition-colors hover:bg-white/[0.04]"
            style={{ borderColor: GOLD_SOFT, color: GOLD }}>
            Modération
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi label="MRR estimée" value={block ? fmtEur(block.kpis.mrr) : "—"}
          sub={block ? `Objectif ${fmtEur(block.revenue.target)}` : ""} />
        <Kpi label="Vélocité du Tunnel" value={block ? `${block.kpis.conversionPct}%` : "—"}
          sub="Inscrits → Validés" />
        <Kpi label="Stock Gold-Ready" value={block ? fmt(block.kpis.goldReady) : "—"}
          sub="Photos · Quiz · Tél." />
        <Kpi label="Concierge Live" value={block ? fmt(block.kpis.conciergeLive) : "—"}
          sub="Quiz en cours" />
        <Kpi label="Risque Churn" value={block ? fmt(block.kpis.churnRisk) : "—"}
          sub="Inactifs > 7 jours"
          tone={block && block.kpis.churnRisk > 0 ? "warn" : undefined} />
      </div>

      {/* Funnel + Revenue */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Panel title="Tunnel de Conversion" subtitle={`Vélocité étape par étape · ${SCOPE_LABEL[scope]}`} className="xl:col-span-3">
          <FunnelWidget steps={block?.funnel ?? []} />
        </Panel>
        <Panel title="Revenue Projector" subtitle={`MRR vs objectif ${block ? fmtEur(block.revenue.target) : "—"}`} className="xl:col-span-2">
          <RevenueChart series={block?.revenue.series ?? []} target={block?.revenue.target ?? 100000} />
        </Panel>
      </div>

      {/* Paris/IDF Liquidity + Expansion Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Paris / IDF · Match Engine" subtitle="Indice de Saturation & top zones d'activité">
          <IdfWidget data={data?.idf} />
        </Panel>
        <Panel title="Indice de Densité Régionale" subtitle="Scouting d'expansion · Seuil de Lancement">
          <ExpansionWidget data={data?.expansion} />
        </Panel>
      </div>

      {/* Operational pulse + Activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Pouls Opérationnel" subtitle={`File de modération & SLA · ${SCOPE_LABEL[scope]}`}>
          <VelocityWidget kpis={block?.kpis} />
        </Panel>
        <Panel title="Flux d'Activité Récent" subtitle="Événements des 15 dernières minutes">
          <ActivityFeed events={data?.recentActivity ?? []} />
        </Panel>
      </div>

      <div className="text-xs text-right" style={{ color: MUTED }}>
        {data?.meta && `Données générées le ${new Date(data.meta.generatedAt).toLocaleString("fr-FR")} · ${fmt(data.meta.totalLeads)} pré-inscriptions · ${fmt(data.meta.totalUsers)} comptes`}
      </div>
    </div>
  );
}

/* ===================== Sub-components ===================== */

function ScopeToggle({ value, onChange }: { value: Scope; onChange: (s: Scope) => void }) {
  const items: Scope[] = ["france", "paris", "idf", "expansion"];
  return (
    <div className="flex flex-wrap gap-1 p-1 rounded-md border" style={{ borderColor: BORDER, background: SURFACE_2 }}>
      {items.map((s) => {
        const active = value === s;
        return (
          <button key={s} onClick={() => onChange(s)}
            className="h-8 px-3 rounded text-sm font-medium tracking-tight transition-all"
            style={{
              background: active ? GOLD : "transparent",
              color: active ? NAVY : MUTED,
              boxShadow: active ? "0 1px 0 rgba(0,0,0,0.2)" : "none",
            }}>
            {SCOPE_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}

function Panel({ title, subtitle, children, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`rounded-lg border p-4 ${className}`}
      style={{ background: SURFACE, borderColor: BORDER, boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset" }}>
      <header className="mb-3.5">
        <h2 className="text-base font-semibold tracking-tight" style={{ color: GOLD }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: MUTED }}>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warn" }) {
  return (
    <div className="rounded-lg border p-3.5" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="text-[11px] uppercase tracking-[0.12em] mb-1.5" style={{ color: MUTED }}>{label}</div>
      <div className="text-2xl font-semibold tabular-nums tracking-tight"
        style={{ color: tone === "warn" ? DANGER : TEXT }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: MUTED }}>{sub}</div>}
    </div>
  );
}

function FunnelWidget({ steps }: { steps: FunnelStep[] }) {
  const top = steps[0]?.count ?? 0;
  if (!steps.length) return <Skeleton h={260} />;
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const widthPct = top > 0 ? Math.max(6, (s.count / top) * 100) : 6;
        const prev = i === 0 ? s.count : steps[i - 1].count;
        const dropPct = prev > 0 && i > 0 ? Math.round(((prev - s.count) / prev) * 100) : 0;
        const convPct = prev > 0 ? Math.round((s.count / prev) * 100) : 100;
        return (
          <div key={s.step} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span style={{ color: TEXT }}>
                <span style={{ color: MUTED }} className="tabular-nums mr-2">{String(i + 1).padStart(2, "0")}</span>
                {s.step}
              </span>
              <span className="tabular-nums" style={{ color: MUTED }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{fmt(s.count)}</span>
                {i > 0 && <span className="ml-2.5">conv. {convPct}%</span>}
                {i > 0 && dropPct > 0 && (
                  <span className="ml-2.5" style={{ color: dropPct > 40 ? DANGER : MUTED }}>−{dropPct}%</span>
                )}
              </span>
            </div>
            <div className="h-5 rounded overflow-hidden" style={{ background: SURFACE_2 }}>
              <div className="h-full transition-all duration-700 ease-out"
                style={{ width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD}99)` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart({ series, target }: { series: { month: string; mrr: number }[]; target: number }) {
  if (!series.length) return <Skeleton h={220} />;
  const monthlyTarget = target / 6;
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={BORDER} />
          <XAxis dataKey="month" stroke={MUTED} fontSize={11} tickLine={false} axisLine={{ stroke: BORDER }} />
          <YAxis stroke={MUTED} fontSize={11} tickLine={false} axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 12 }}
            formatter={(v: any) => fmtEur(Number(v))} />
          <ReferenceLine y={monthlyTarget} stroke={GOLD_SOFT} strokeDasharray="3 3"
            label={{ value: "Cible/mois", fill: GOLD_SOFT, fontSize: 10, position: "right" }} />
          <Line type="monotone" dataKey="mrr" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD, r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function IdfWidget({ data }: { data?: Analytics["idf"] }) {
  if (!data) return <Skeleton h={260} />;
  const totalMen = data.topZones.reduce((s, z) => s + z.men, 0);
  const totalWomen = data.topZones.reduce((s, z) => s + z.women, 0);
  const total = totalMen + totalWomen;
  const menPct = total ? Math.round((totalMen / total) * 100) : 50;
  const balanced = total > 0 && Math.abs(menPct - 50) <= 15;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between text-sm mb-1.5">
          <span style={{ color: TEXT }}>Ratio H / F · IDF</span>
          <span className="tabular-nums" style={{ color: MUTED }}>
            <span style={{ color: TEXT, fontWeight: 600 }}>{menPct}%</span> H ·{" "}
            <span style={{ color: TEXT, fontWeight: 600 }}>{100 - menPct}%</span> F ·{" "}
            <span style={{ color: balanced ? GOLD : DANGER }}>{balanced ? "Équilibré" : "Saturation"}</span>
          </span>
        </div>
        <div className="flex h-4 rounded overflow-hidden border" style={{ borderColor: BORDER }}>
          <div style={{ width: `${menPct}%`, background: "#3B82F6" }} />
          <div style={{ width: `${100 - menPct}%`, background: "#EC4899" }} />
        </div>
      </div>

      <div>
        <div className="text-sm mb-2" style={{ color: TEXT }}>
          Top 3 Arrondissements / Villes <span style={{ color: MUTED }}>(par activité)</span>
        </div>
        {data.topZones.length === 0 ? (
          <Empty>Aucune zone IDF active.</Empty>
        ) : (
          <div className="space-y-1.5">
            {data.topZones.map((z, i) => (
              <div key={z.label} className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                style={{ borderColor: BORDER, background: SURFACE_2 }}>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-xs" style={{ color: GOLD }}>#{i + 1}</span>
                  <span style={{ color: TEXT, fontWeight: 600 }}>{z.label}</span>
                </div>
                <div className="tabular-nums text-xs" style={{ color: MUTED }}>
                  {z.total} profils · {z.men}H / {z.women}F
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-sm mb-2" style={{ color: TEXT }}>
          Market Imbalance <span style={{ color: MUTED }}>(dominance ≥ 65%)</span>
        </div>
        {data.imbalanceAlerts.length === 0 ? (
          <Empty>Aucun déséquilibre détecté.</Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {data.imbalanceAlerts.map((a) => (
              <div key={a.label} className="flex items-center justify-between rounded border px-2.5 py-1.5 text-sm"
                style={{ borderColor: GOLD_SOFT, background: SURFACE_2 }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{a.label}</span>
                <span className="tabular-nums text-xs" style={{ color: MUTED }}>
                  {a.men}H / {a.women}F · <span style={{ color: GOLD }}>{a.dominantPct}%</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpansionWidget({ data }: { data?: Analytics["expansion"] }) {
  if (!data) return <Skeleton h={260} />;
  if (!data.departments.length) {
    return <Empty>Aucune pré-inscription hors IDF pour le moment.</Empty>;
  }
  return (
    <div className="space-y-2.5">
      <div className="text-xs" style={{ color: MUTED }}>
        Seuil de Lancement : <span style={{ color: TEXT, fontWeight: 600 }}>{data.launchTarget}</span> profils par département
      </div>
      {data.departments.map((d, i) => {
        const ready = d.pctOfTarget >= 100;
        return (
          <div key={d.code} className="rounded border px-3 py-2.5"
            style={{ borderColor: ready ? GOLD : BORDER, background: SURFACE_2 }}>
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className="tabular-nums text-xs" style={{ color: GOLD }}>#{i + 1}</span>
                <span style={{ color: TEXT, fontWeight: 600 }}>{d.name}</span>
                <span className="text-xs tabular-nums" style={{ color: MUTED }}>· {d.code}</span>
              </div>
              <div className="tabular-nums text-xs" style={{ color: MUTED }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{d.total}</span>/{d.launchTarget} ·{" "}
                <span style={{ color: ready ? GOLD : TEXT }}>{d.pctOfTarget}%</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: NAVY }}>
              <div className="h-full transition-all duration-700"
                style={{ width: `${d.pctOfTarget}%`,
                  background: ready ? GOLD : `linear-gradient(90deg, ${GOLD_SOFT}, ${GOLD})` }} />
            </div>
            <div className="text-xs mt-1.5" style={{ color: MUTED }}>
              {d.preregs} pré-inscriptions · {d.profiles} profils ·{" "}
              {ready ? <span style={{ color: GOLD }}>Prêt au lancement</span>
                     : <span>{d.launchTarget - d.total} profils restants</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VelocityWidget({ kpis }: { kpis?: ScopeBlock["kpis"] }) {
  if (!kpis) return <Skeleton h={220} />;
  const aged = kpis.oldestPendingMinutes > 60;
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <MiniStat label="File de modération" value={fmt(kpis.moderationQueueSize)} />
        <MiniStat label="Plus ancien en attente"
          value={kpis.oldestPendingMinutes ? `${kpis.oldestPendingMinutes} min` : "—"}
          tone={aged ? "warn" : undefined} accent={!aged} />
        <MiniStat label="Concierge Live" value={fmt(kpis.conciergeLive)} accent />
        <MiniStat label="Inactifs > 7j" value={fmt(kpis.churnRisk)}
          tone={kpis.churnRisk > 0 ? "warn" : undefined} />
      </div>
      <div className="rounded border p-3 text-sm leading-relaxed"
        style={{ borderColor: aged ? GOLD : BORDER, background: SURFACE_2, color: aged ? GOLD : MUTED }}>
        {aged
          ? `Alerte SLA : un actif attend depuis ${kpis.oldestPendingMinutes} min — au-delà du seuil de 60 min.`
          : "SLA de modération respecté (< 60 min)."}
      </div>
    </div>
  );
}

function ActivityFeed({ events }: { events: Analytics["recentActivity"] }) {
  if (!events.length) return <Empty>Aucune activité récente.</Empty>;
  const dot: Record<string, string> = {
    lead: "#3B82F6", quiz: "#A78BFA", media: "#22D3EE", validated: GOLD,
  };
  const verb: Record<string, string> = {
    lead: "Nouvelle pré-inscription",
    quiz: "Quiz · réponse",
    media: "Média uploadé",
    validated: "Paiement validé",
  };
  return (
    <ul className="divide-y" style={{ borderColor: BORDER }}>
      {events.map((e, i) => (
        <li key={i} className="flex items-center justify-between py-2.5 text-sm"
          style={{ borderColor: BORDER, borderTopWidth: i === 0 ? 0 : 1 } as any}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-2 w-2 rounded-full shrink-0"
              style={{ background: dot[e.type] ?? GOLD }} />
            <span style={{ color: TEXT }} className="truncate">
              {verb[e.type] ?? e.label}
              <span style={{ color: MUTED }}> · {e.location}</span>
            </span>
          </div>
          <span className="tabular-nums text-xs shrink-0 ml-3" style={{ color: MUTED }}>
            {fmtAgo(e.at)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function MiniStat({ label, value, accent, tone }: { label: string; value: string; accent?: boolean; tone?: "warn" }) {
  const color = tone === "warn" ? DANGER : accent ? GOLD : TEXT;
  return (
    <div className="rounded border p-3" style={{ background: SURFACE_2, borderColor: BORDER }}>
      <div className="text-[11px] uppercase tracking-[0.1em] mb-1" style={{ color: MUTED }}>{label}</div>
      <div className="text-xl font-semibold tabular-nums tracking-tight" style={{ color }}>{value}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border p-3 text-sm" style={{ borderColor: BORDER, color: MUTED }}>
      {children}
    </div>
  );
}

function Skeleton({ h }: { h: number }) {
  return <div className="rounded animate-pulse" style={{ height: h, background: SURFACE_2 }} />;
}
