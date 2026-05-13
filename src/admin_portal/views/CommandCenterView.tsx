import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { adminSupabase } from "../lib/supabase";
import { useAdminSection } from "../core/useAdminSection";

const SURFACE = "#0F1828";
const SURFACE_2 = "#13203A";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";
const NAVY = "#0E1626";
const TEXT = "#F8FAFC";
const MUTED = "#94A3B8";
const DANGER = "#F87171";

type FunnelStep = { step: string; count: number };
type Analytics = {
  funnel: FunnelStep[];
  revenue: { mrr: number; target: number; arpu: number; series: { month: string; mrr: number; target: number }[] };
  miami: {
    total: number; men: number; women: number; goldReady: number;
    densityAlerts: { zip: string; men: number; women: number; total: number; dominantPct: number }[];
  };
  velocity: {
    conciergeLive: number; moderationQueueSize: number;
    oldestPendingMinutes: number; churnRisk: number; goldReadyTotal: number;
  };
  meta: { totalUsers: number; generatedAt: string };
};

const fmt = (n: number) => n.toLocaleString("fr-FR");
const fmtEur = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function CommandCenterView() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setSection } = useAdminSection();

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      try {
        const { data: res, error } = await adminSupabase.functions.invoke("admin-analytics");
        if (error) throw error;
        if (!cancel) setData(res as Analytics);
      } catch (e: any) {
        if (!cancel) setError(e.message ?? "Erreur de chargement");
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { cancel = true; clearInterval(id); };
  }, []);

  const exportFunnelCsv = () => {
    if (!data) return;
    const header = ["Étape", "Volume", "Conversion %"];
    const rows = data.funnel.map((s, i) => {
      const prev = i === 0 ? s.count : data.funnel[i - 1].count;
      const conv = prev > 0 ? ((s.count / prev) * 100).toFixed(1) : "—";
      return [s.step, s.count, conv];
    });
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `funnel-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (error) {
    return (
      <div className="rounded-xl border p-6" style={{ background: SURFACE, borderColor: BORDER, color: DANGER }}>
        Erreur d'analyse : {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
        style={{ background: SURFACE, borderColor: BORDER }}>
        <div className="flex items-center gap-3 text-base" style={{ color: MUTED }}>
          <span className="inline-flex h-2 w-2 rounded-full animate-pulse" style={{ background: GOLD }} />
          <span>Données temps réel · rafraîchissement 60s</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportFunnelCsv}
            disabled={!data}
            className="h-10 px-4 rounded-md font-semibold text-base transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Exporter Matrix CSV
          </button>
          <button
            onClick={() => setSection("moderation")}
            className="h-10 px-4 rounded-md font-semibold text-base border transition-colors hover:bg-white/[0.04]"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            Accéder à la Modération
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="MRR estimée" value={data ? fmtEur(data.revenue.mrr) : "—"}
          sub={data ? `Objectif ${fmtEur(data.revenue.target)}` : ""} />
        <Kpi label="Actifs Gold-Ready" value={data ? fmt(data.velocity.goldReadyTotal) : "—"}
          sub="Photos + Quiz + Téléphone" />
        <Kpi label="Concierge Live" value={data ? fmt(data.velocity.conciergeLive) : "—"}
          sub="Quiz 50/40 en cours" />
        <Kpi label="Risque de Churn" value={data ? fmt(data.velocity.churnRisk) : "—"}
          sub="Inactifs > 7 jours" tone={data && data.velocity.churnRisk > 0 ? "warn" : undefined} />
      </div>

      {/* Funnel + Revenue side-by-side on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Panel title="Tunnel de Conversion" subtitle="Vélocité de Conversion étape par étape" className="xl:col-span-3">
          <FunnelWidget steps={data?.funnel ?? []} />
        </Panel>
        <Panel title="Revenue Projector" subtitle={`MRR vs objectif ${data ? fmtEur(data.revenue.target) : "100 000 €"}`} className="xl:col-span-2">
          <RevenueChart series={data?.revenue.series ?? []} target={data?.revenue.target ?? 100000} />
        </Panel>
      </div>

      {/* Miami + Velocity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Miami · Indice de Liquidité" subtitle="Marketplace Balance · Phase d'expansion">
          <MiamiWidget miami={data?.miami} />
        </Panel>
        <Panel title="Vélocité Opérationnelle" subtitle="File de modération & rétention">
          <VelocityWidget v={data?.velocity} />
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Sub components ---------- */

function Panel({ title, subtitle, children, className = "" }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`rounded-xl border p-5 ${className}`} style={{ background: SURFACE, borderColor: BORDER }}>
      <header className="mb-4">
        <h2 className="text-xl font-semibold" style={{ color: GOLD }}>{title}</h2>
        {subtitle && <p className="text-base mt-0.5" style={{ color: MUTED }}>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "warn" }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="text-base uppercase tracking-wider mb-2" style={{ color: MUTED }}>{label}</div>
      <div className="text-3xl font-semibold tabular-nums" style={{ color: tone === "warn" ? DANGER : GOLD }}>
        {value}
      </div>
      {sub && <div className="text-base mt-1" style={{ color: MUTED }}>{sub}</div>}
    </div>
  );
}

function FunnelWidget({ steps }: { steps: FunnelStep[] }) {
  const top = steps[0]?.count ?? 0;
  if (!steps.length) return <Skeleton h={280} />;
  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const widthPct = top > 0 ? Math.max(8, (s.count / top) * 100) : 8;
        const prev = i === 0 ? s.count : steps[i - 1].count;
        const dropPct = prev > 0 && i > 0 ? Math.round(((prev - s.count) / prev) * 100) : 0;
        const convPct = prev > 0 ? Math.round((s.count / prev) * 100) : 100;
        return (
          <div key={s.step} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-base">
              <span style={{ color: TEXT }}>{i + 1}. {s.step}</span>
              <span className="tabular-nums" style={{ color: MUTED }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{fmt(s.count)}</span>
                {i > 0 && <span className="ml-3">conv. {convPct}%</span>}
                {i > 0 && dropPct > 0 && <span className="ml-3" style={{ color: dropPct > 40 ? DANGER : MUTED }}>−{dropPct}%</span>}
              </span>
            </div>
            <div className="h-7 rounded-md overflow-hidden" style={{ background: SURFACE_2 }}>
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD}cc 100%)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart({ series, target }: { series: { month: string; mrr: number; target: number }[]; target: number }) {
  if (!series.length) return <Skeleton h={240} />;
  const monthlyTarget = target / 6;
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
          <XAxis dataKey="month" stroke={MUTED} fontSize={13} />
          <YAxis stroke={MUTED} fontSize={13} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }}
            formatter={(v: any) => fmtEur(Number(v))}
          />
          <ReferenceLine y={monthlyTarget} stroke={GOLD} strokeDasharray="4 4" label={{ value: "Cible/mois", fill: GOLD, fontSize: 12, position: "right" }} />
          <Line type="monotone" dataKey="mrr" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} />
          <Line type="monotone" dataKey="target" stroke={MUTED} strokeWidth={1.5} strokeDasharray="6 6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiamiWidget({ miami }: { miami?: Analytics["miami"] }) {
  if (!miami) return <Skeleton h={260} />;
  const total = miami.men + miami.women;
  const menPct = total > 0 ? Math.round((miami.men / total) * 100) : 50;
  const womenPct = 100 - menPct;
  const balanced = total > 0 && Math.abs(menPct - 50) <= 10;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Profils Miami" value={fmt(miami.total)} />
        <MiniStat label="Gold-Ready Miami" value={fmt(miami.goldReady)} accent />
        <MiniStat label="Équilibre" value={balanced ? "Sain" : "Déséquilibré"}
          tone={balanced ? undefined : "warn"} />
      </div>

      <div>
        <div className="flex items-baseline justify-between text-base mb-2">
          <span style={{ color: TEXT }}>Ratio H / F</span>
          <span className="tabular-nums" style={{ color: MUTED }}>
            <span style={{ color: TEXT, fontWeight: 600 }}>{menPct}%</span> H ·{" "}
            <span style={{ color: TEXT, fontWeight: 600 }}>{womenPct}%</span> F
          </span>
        </div>
        <div className="flex h-6 rounded-md overflow-hidden border" style={{ borderColor: BORDER }}>
          <div style={{ width: `${menPct}%`, background: "#3B82F6" }} />
          <div style={{ width: `${womenPct}%`, background: "#EC4899" }} />
        </div>
      </div>

      <div>
        <div className="text-base mb-2" style={{ color: TEXT }}>
          Alertes de densité <span style={{ color: MUTED }}>(zip avec dominance ≥ 60%)</span>
        </div>
        {miami.densityAlerts.length === 0 ? (
          <div className="rounded-md border p-3 text-base" style={{ borderColor: BORDER, color: MUTED }}>
            Aucune saturation détectée.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {miami.densityAlerts.slice(0, 6).map((a) => (
              <div key={a.zip} className="flex items-center justify-between rounded-md border px-3 py-2 text-base"
                style={{ borderColor: GOLD, background: SURFACE_2 }}>
                <span className="tabular-nums font-semibold" style={{ color: TEXT }}>{a.zip}</span>
                <span style={{ color: MUTED }} className="tabular-nums">
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

function VelocityWidget({ v }: { v?: Analytics["velocity"] }) {
  if (!v) return <Skeleton h={260} />;
  const aged = v.oldestPendingMinutes > 60;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="File de modération" value={fmt(v.moderationQueueSize)} />
        <MiniStat
          label="Plus ancien en attente"
          value={v.oldestPendingMinutes ? `${v.oldestPendingMinutes} min` : "—"}
          tone={aged ? "warn" : undefined}
          accent={!aged}
        />
        <MiniStat label="Concierge Live" value={fmt(v.conciergeLive)} accent />
        <MiniStat label="Inactifs > 7j" value={fmt(v.churnRisk)} tone={v.churnRisk > 0 ? "warn" : undefined} />
      </div>

      <div className="rounded-md border p-4 text-base leading-relaxed"
        style={{ borderColor: aged ? GOLD : BORDER, background: SURFACE_2, color: aged ? GOLD : MUTED }}>
        {aged
          ? `Alerte : un actif attend depuis ${v.oldestPendingMinutes} min — au-delà du SLA de 60 min.`
          : "SLA de modération respecté (< 60 min)."}
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent, tone }: { label: string; value: string; accent?: boolean; tone?: "warn" }) {
  const color = tone === "warn" ? DANGER : accent ? GOLD : TEXT;
  return (
    <div className="rounded-md border p-3" style={{ background: SURFACE_2, borderColor: BORDER }}>
      <div className="text-base mb-1" style={{ color: MUTED }}>{label}</div>
      <div className="text-2xl font-semibold tabular-nums" style={{ color }}>{value}</div>
    </div>
  );
}

function Skeleton({ h }: { h: number }) {
  return <div className="rounded-md animate-pulse" style={{ height: h, background: SURFACE_2 }} />;
}
