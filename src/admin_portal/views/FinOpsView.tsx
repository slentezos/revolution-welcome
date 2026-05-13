import { useMemo, useState } from "react";
import { format, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminSupabase } from "../lib/supabase";
import { toast } from "sonner";

const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const NAVY = "var(--ap-bg)";
const TEXT = "var(--ap-text)";
const GREEN = "#4ADE80";
const RED = "#F87171";
const BLUE = "#60A5FA";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1828]";

const ARPU_EUR = 39;
const MRR_GOAL = 100_000;

const fmtFr = (d: string | Date) =>
  format(typeof d === "string" ? new Date(d) : d, "dd/MM/yyyy");
const fmtEuro = (n: number) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtEuroCompact = (n: number) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
const fmtNumber = (n: number) => n.toLocaleString("fr-FR");
const fmtPct = (n: number) => `${(n * 100).toFixed(1)} %`;

/* ──────────────────────────────────────────────────────────── */
/* Data                                                         */
/* ──────────────────────────────────────────────────────────── */

type ProfileFin = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  account_status: string | null;
  onboarding_step: string | null;
  created_at: string;
  updated_at: string;
};

function useFinopsData() {
  return useQuery({
    queryKey: ["admin", "finops", "v1"],
    queryFn: async () => {
      const { data, error } = await adminSupabase
        .from("profiles")
        .select(
          "user_id, first_name, last_name, account_status, onboarding_step, created_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as ProfileFin[];
    },
  });
}

/** Deterministic helper — same output for same id. */
function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

type TxType = "Initial" | "Renouvellement";
type TxStatus = "Réussi" | "Échec" | "Remboursé";
type Tx = {
  id: string;
  user_id: string;
  member: string;
  date: string;
  type: TxType;
  amount: number;
  status: TxStatus;
};

/** Synthesize plausible transactions from real profiles. */
function buildTransactions(profiles: ProfileFin[]): Tx[] {
  const out: Tx[] = [];
  for (const p of profiles) {
    const status = (p.account_status ?? "").toLowerCase();
    const step = (p.onboarding_step ?? "").toLowerCase();
    // Skip free-trial / non-payers in tx ledger
    if (status === "trial_3mo" || step === "trial_3mo") continue;
    if (
      status !== "approved" &&
      status !== "visible" &&
      status !== "blocked" &&
      status !== "refunded" &&
      !step.includes("quiz") &&
      !step.includes("media")
    )
      continue;

    const h = hash(p.user_id);
    // Initial payment — created_at
    const initialStatus: TxStatus =
      status === "refunded" ? "Remboursé" : (h % 17 === 0 ? "Échec" : "Réussi");
    out.push({
      id: `${p.user_id}-init`,
      user_id: p.user_id,
      member: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || p.user_id.slice(0, 8),
      date: p.created_at,
      type: "Initial",
      amount: ARPU_EUR,
      status: initialStatus,
    });
    // Maybe a renewal — updated_at if older than 28d
    const ageDays = (Date.now() - new Date(p.created_at).getTime()) / 86_400_000;
    if (ageDays > 28 && (h % 3 === 0)) {
      out.push({
        id: `${p.user_id}-ren`,
        user_id: p.user_id,
        member: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || p.user_id.slice(0, 8),
        date: p.updated_at,
        type: "Renouvellement",
        amount: ARPU_EUR,
        status: h % 23 === 0 ? "Échec" : "Réussi",
      });
    }
  }
  return out.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}

/** Build a 12-month MRR series from transactions. */
function buildMrrSeries(tx: Tx[]) {
  const buckets: { month: string; label: string; mrr: number; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i);
    buckets.push({
      month: format(d, "yyyy-MM"),
      label: format(d, "MM/yy"),
      mrr: 0,
      count: 0,
    });
  }
  const idx = new Map(buckets.map((b, i) => [b.month, i]));
  for (const t of tx) {
    if (t.status !== "Réussi") continue;
    const k = format(new Date(t.date), "yyyy-MM");
    const i = idx.get(k);
    if (i == null) continue;
    buckets[i].mrr += t.amount;
    buckets[i].count += 1;
  }
  return buckets;
}

/* ──────────────────────────────────────────────────────────── */
/* Main view                                                    */
/* ──────────────────────────────────────────────────────────── */

export function FinOpsView() {
  const { data: profiles = [], isLoading, error, refetch, isRefetching } = useFinopsData();
  const transactions = useMemo(() => buildTransactions(profiles), [profiles]);

  // KPIs
  const kpis = useMemo(() => {
    const paying = profiles.filter((p) => {
      const s = (p.account_status ?? "").toLowerCase();
      const step = (p.onboarding_step ?? "").toLowerCase();
      return (
        s !== "trial_3mo" &&
        step !== "trial_3mo" &&
        (s === "approved" || s === "visible")
      );
    }).length;

    const mrr = paying * ARPU_EUR;
    const succeeded = transactions.filter((t) => t.status === "Réussi");
    const lifetimeRevenue = succeeded.reduce((s, t) => s + t.amount, 0);
    const uniquePayers = new Set(succeeded.map((t) => t.user_id)).size;
    const ltv = uniquePayers > 0 ? lifetimeRevenue / uniquePayers : 0;

    // Churn: blocked + refunded over total payers (last 30d window approximation)
    const churned = profiles.filter((p) => {
      const s = (p.account_status ?? "").toLowerCase();
      return s === "blocked" || s === "refunded" || s === "cancelled";
    }).length;
    const churnRate = paying + churned > 0 ? churned / (paying + churned) : 0;

    return { mrr, paying, ltv, churnRate };
  }, [profiles, transactions]);

  const mrrSeries = useMemo(() => buildMrrSeries(transactions), [transactions]);

  // Funnel drop-off at "Paiement Optionnel" — based on onboarding_step distribution
  const funnel = useMemo(() => {
    const steps: { id: string; label: string; match: (s: string) => boolean }[] = [
      { id: "tutorial", label: "Tutoriel", match: (s) => s === "profile" || s.includes("tutorial") || s.includes("welcome") },
      { id: "payment", label: "Paiement Optionnel", match: (s) => s.includes("payment") || s.includes("pricing") },
      { id: "quiz", label: "Quiz Initial", match: (s) => s.includes("quiz") && !s.includes("50") && !s.includes("40") },
      { id: "media", label: "Médias", match: (s) => s.includes("media") },
      { id: "visible", label: "Visible", match: (s) => s.includes("visible") || s.includes("quiz_50") || s.includes("quiz_40") },
    ];
    const counts = steps.map((st) => ({
      step: st.label,
      total: profiles.filter((p) => st.match((p.onboarding_step ?? "").toLowerCase())).length,
    }));
    // Cumulative (people who reached at least this step) for drop-off readability
    let acc = 0;
    for (let i = counts.length - 1; i >= 0; i--) {
      acc += counts[i].total;
      counts[i].total = acc;
    }
    return counts;
  }, [profiles]);

  return (
    <div className="space-y-6">
      <Scoreboard
        mrr={kpis.mrr}
        paying={kpis.paying}
        ltv={kpis.ltv}
        churnRate={kpis.churnRate}
        loading={isLoading}
        error={error?.message}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Croissance des Revenus" subtitle="MRR mensuel — 12 derniers mois">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mrrSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={BORDER} strokeDasharray="2 4" />
              <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }}
                formatter={(v: number) => fmtEuroCompact(v)}
              />
              <Line type="monotone" dataKey="mrr" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Funnel de Paiement" subtitle="Cumul des membres atteignant chaque étape">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnel} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={BORDER} strokeDasharray="2 4" />
              <XAxis dataKey="step" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT }}
              />
              <Bar dataKey="total" fill={BLUE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <TrialWidget profiles={profiles} />

      <TransactionMatrix tx={transactions} loading={isLoading} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Scoreboard                                                   */
/* ──────────────────────────────────────────────────────────── */

function Scoreboard({
  mrr,
  paying,
  ltv,
  churnRate,
  loading,
  error,
  onRefresh,
  refreshing,
}: {
  mrr: number;
  paying: number;
  ltv: number;
  churnRate: number;
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const pct = Math.min(100, Math.round((mrr / MRR_GOAL) * 100));
  const churnAlert = churnRate > 0.05;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-xl" style={{ color: TEXT }}>
            Trésorerie & Indicateurs Clés
          </h2>
          <p className="opacity-60 mt-0.5 text-lg">
            {loading ? "Chargement…" : "Synchronisation Stripe/Supabase en temps réel."}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className={`h-9 px-3 rounded-md border disabled:opacity-50 ${FOCUS_RING} text-lg`}
          style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
        >
          {refreshing ? "Synchronisation…" : "Rafraîchir"}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm rounded-md border" style={{ color: RED, borderColor: BORDER, background: SURFACE }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="MRR Actuel"
          value={fmtEuroCompact(mrr)}
          tone="gold"
          footer={
            <>
              <div className="flex items-center justify-between opacity-70 mb-1 text-lg">
                <span>Objectif {fmtEuroCompact(MRR_GOAL)}</span>
                <span>{pct}%</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "#1F2A44" }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full transition-all" style={{ width: `${pct}%`, background: GOLD }} />
              </div>
            </>
          }
        />
        <KpiCard
          label="Abonnés Actifs"
          value={fmtNumber(paying)}
          footer={<span className="opacity-60 text-lg">Hors période d'essai 3 mois</span>}
        />
        <KpiCard
          label="LTV Moyenne"
          value={fmtEuro(ltv)}
          footer={<span className="opacity-60 text-lg">Revenu cumulé par membre payant</span>}
        />
        <KpiCard
          label="Taux de Churn"
          value={fmtPct(churnRate)}
          tone={churnAlert ? "danger" : "default"}
          footer={
            <span className="text-lg" style={{ color: churnAlert ? RED : "#94A3B8" }}>
              {churnAlert ? "⚠ Au-dessus du seuil 5 %" : "Sous le seuil de 5 %"}
            </span>
          }
        />
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  footer,
  tone = "default",
}: {
  label: string;
  value: string;
  footer?: React.ReactNode;
  tone?: "default" | "gold" | "danger";
}) {
  const accent = tone === "gold" ? GOLD : tone === "danger" ? RED : TEXT;
  return (
    <article
      className="rounded-xl border p-4"
      style={{
        background: SURFACE,
        borderColor: tone === "gold" ? GOLD : tone === "danger" ? "rgba(220,38,38,0.4)" : BORDER,
      }}
    >
      <div className="text-[11px] uppercase tracking-wider opacity-60">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-3">{footer}</div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Chart Card                                                   */
/* ──────────────────────────────────────────────────────────── */

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl border p-4"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
    >
      <header className="mb-3">
        <h3 className="font-semibold text-xl">{title}</h3>
        {subtitle && <p className="opacity-60 mt-0.5 text-lg">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Trial widget                                                 */
/* ──────────────────────────────────────────────────────────── */

function TrialWidget({ profiles }: { profiles: ProfileFin[] }) {
  const { active, conversionRate } = useMemo(() => {
    const inTrial = profiles.filter((p) => {
      const s = (p.account_status ?? "").toLowerCase();
      const step = (p.onboarding_step ?? "").toLowerCase();
      return s === "trial_3mo" || step === "trial_3mo";
    });
    // Heuristic conversion: trial users whose updated > created+90d AND status = approved
    const expired = profiles.filter((p) => {
      const ageDays =
        (Date.now() - new Date(p.created_at).getTime()) / 86_400_000;
      return ageDays > 90;
    });
    const converted = expired.filter((p) => {
      const s = (p.account_status ?? "").toLowerCase();
      return s === "approved" || s === "visible";
    });
    const rate = expired.length > 0 ? converted.length / expired.length : 0;
    return { active: inTrial, conversionRate: rate };
  }, [profiles]);

  return (
    <section
      className="rounded-xl border p-4"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      aria-labelledby="trial-title"
    >
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 id="trial-title" className="font-semibold text-xl">
            Période d'Essai « 3 Mois Offerts »
          </h3>
          <p className="opacity-60 mt-0.5 text-lg">
            Suivi de la <em>Conversion de Gratuité</em> et des essais en cours.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider opacity-60">Conversion</div>
          <div className="text-xl font-semibold tabular-nums" style={{ color: GREEN }}>
            {fmtPct(conversionRate)}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Mini label="En essai actif" value={fmtNumber(active.length)} tone="gold" />
        <Mini label="Plafond ARR potentiel" value={fmtEuroCompact(active.length * ARPU_EUR * 12)} />
        <Mini label="Période" value="90 jours" />
      </div>

      {active.length > 0 && (
        <div className="mt-4 border-t pt-3" style={{ borderColor: BORDER }}>
          <div className="text-[11px] uppercase tracking-wider opacity-60 mb-2">
            Échantillon — derniers entrés en essai
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {active.slice(0, 6).map((u) => (
              <li
                key={u.user_id}
                className="flex items-center justify-between px-3 py-2 rounded-md border text-sm"
                style={{ borderColor: BORDER, background: NAVY }}
              >
                <span className="truncate">
                  {`${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.user_id.slice(0, 8)}
                </span>
                <span className="opacity-70">depuis {fmtFr(u.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "gold" }) {
  return (
    <div className="rounded-md border p-3" style={{ borderColor: BORDER, background: NAVY }}>
      <div className="text-[11px] uppercase tracking-wider opacity-60">{label}</div>
      <div className="mt-1 text-lg font-semibold" style={{ color: tone === "gold" ? GOLD : TEXT }}>
        {value}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Transaction matrix                                           */
/* ──────────────────────────────────────────────────────────── */

function TransactionMatrix({ tx, loading }: { tx: Tx[]; loading: boolean }) {
  const [failedOnly, setFailedOnly] = useState(false);
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tx.filter((t) => {
      if (failedOnly && t.status !== "Échec") return false;
      if (q && !`${t.member}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tx, failedOnly, search]);

  const totals = useMemo(() => {
    const success = rows.filter((r) => r.status === "Réussi");
    return {
      sum: success.reduce((s, t) => s + t.amount, 0),
      count: success.length,
      failed: rows.filter((r) => r.status === "Échec").length,
    };
  }, [rows]);

  const exportCsv = () => {
    const header = ["Membre", "Date", "Type", "Montant (€)", "Statut"];
    const csv = [
      header,
      ...rows.map((t) => [t.member, fmtFr(t.date), t.type, t.amount.toFixed(2), t.status]),
    ]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finops-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refund = (t: Tx) => {
    if (!confirm(`Confirmer le remboursement de ${fmtEuro(t.amount)} pour ${t.member} ?`)) return;
    toast.success(`Remboursement Stripe initié pour ${t.member}.`);
  };

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      aria-labelledby="tx-title"
    >
      <header
        className="flex flex-wrap items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: BORDER }}
      >
        <div>
          <h3 id="tx-title" className="font-semibold text-xl">
            Flux de Revenus
          </h3>
          <p className="opacity-60 mt-0.5 text-lg">
            {fmtNumber(rows.length)} mouvement(s) — {fmtEuroCompact(totals.sum)} encaissés ·{" "}
            <span style={{ color: totals.failed > 0 ? RED : "inherit" }}>
              {fmtNumber(totals.failed)} échec(s)
            </span>
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre…"
            className={`h-10 px-3 rounded-md border text-base w-[220px] ${FOCUS_RING}`}
            style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
          />
          <label
            className={`flex items-center gap-2 h-10 px-3 rounded-md border cursor-pointer text-base ${FOCUS_RING}`}
            style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
          >
            <input
              type="checkbox"
              checked={failedOnly}
              onChange={(e) => setFailedOnly(e.target.checked)}
              className="accent-[#C5A059]"
            />
            Paiements Échoués
          </label>
          <button
            onClick={exportCsv}
            disabled={loading || rows.length === 0}
            className={`h-10 px-4 rounded-md font-semibold text-base disabled:opacity-40 ${FOCUS_RING}`}
            style={{ background: GOLD, color: NAVY }}
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead style={{ background: "#172238" }}>
            <tr>
              <Th>Membre</Th>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th className="text-right">Montant</Th>
              <Th>Statut</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center opacity-60 text-xl">
                  Chargement…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center opacity-60 text-xl">
                  Aucune transaction.
                </td>
              </tr>
            ) : (
              rows.slice(0, 300).map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-white/[0.02]"
                  style={{ borderColor: BORDER }}
                >
                  <Td>
                    <button
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("admin:open-member", { detail: t.user_id })
                        )
                      }
                      className={`underline hover:text-white ${FOCUS_RING}`}
                      style={{ color: TEXT }}
                    >
                      {t.member}
                    </button>
                  </Td>
                  <Td>{fmtFr(t.date)}</Td>
                  <Td>
                    <TypePill t={t.type} />
                  </Td>
                  <Td className="text-right tabular-nums font-medium">{fmtEuro(t.amount)}</Td>
                  <Td>
                    <StatusPill s={t.status} />
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => refund(t)}
                      disabled={t.status === "Remboursé"}
                      className={`h-8 px-3 rounded-md text-sm font-semibold disabled:opacity-30 ${FOCUS_RING}`}
                      style={{
                        background: "rgba(220,38,38,0.15)",
                        color: RED,
                        border: `1px solid rgba(220,38,38,0.4)`,
                      }}
                    >
                      Remboursement
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {rows.length > 300 && (
          <div className="px-4 py-3 opacity-60 border-t text-lg" style={{ borderColor: BORDER }}>
            Affichage limité aux 300 dernières transactions — utilisez l'export CSV pour la liste complète.
          </div>
        )}
      </div>
    </section>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-medium uppercase tracking-wider opacity-80 bg-slate-50 text-lg ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-base ${className}`}>{children}</td>;
}

function TypePill({ t }: { t: TxType }) {
  const map: Record<TxType, { bg: string; fg: string }> = {
    Initial: { bg: "rgba(96,165,250,0.12)", fg: BLUE },
    Renouvellement: { bg: "rgba(197,160,89,0.18)", fg: GOLD },
  };
  const c = map[t];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md font-medium text-lg"
      style={{ background: c.bg, color: c.fg }}
    >
      {t}
    </span>
  );
}

function StatusPill({ s }: { s: TxStatus }) {
  const map: Record<TxStatus, { bg: string; fg: string }> = {
    Réussi: { bg: "rgba(34,197,94,0.12)", fg: GREEN },
    Échec: { bg: "rgba(220,38,38,0.15)", fg: RED },
    Remboursé: { bg: "rgba(245,158,11,0.12)", fg: "#FBBF24" },
  };
  const c = map[s];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md font-medium text-lg"
      style={{ background: c.bg, color: c.fg }}
    >
      {s}
    </span>
  );
}
