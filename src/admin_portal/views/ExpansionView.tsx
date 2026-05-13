import { Fragment as FragmentRow, useMemo, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { adminSupabase } from "../lib/supabase";
import {
  ACQUISITION_SOURCES,
  TARGET_ZONES,
  buildZoneRows,
  deriveSource,
  leadsForPrefix,
  type Lead,
  type ProfileLite,
  type ZoneRow,
} from "../lib/expansion";
import { toast } from "sonner";

const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const NAVY = "var(--ap-bg)";
const TEXT = "var(--ap-text)";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1828]";

const fmtFr = (d: string | Date | null | undefined) =>
  d ? format(typeof d === "string" ? new Date(d) : d, "dd/MM/yyyy") : "—";

const fmtNumber = (n: number) => n.toLocaleString("fr-FR");
const fmtEuro = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/* ──────────────────────────────────────────────────────────── */
/* Data hooks                                                  */
/* ──────────────────────────────────────────────────────────── */

function useExpansionData() {
  return useQuery({
    queryKey: ["admin", "expansion", "v1"],
    queryFn: async () => {
      const [leadsRes, profilesRes] = await Promise.all([
        adminSupabase
          .from("waitlist_leads")
          .select("id, email, phone, postal_code, city_name, region_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5000),
        adminSupabase
          .from("profiles")
          .select("user_id, gender, postal_code")
          .limit(5000),
      ]);
      if (leadsRes.error) throw leadsRes.error;
      if (profilesRes.error) throw profilesRes.error;
      const leads = (leadsRes.data ?? []) as Lead[];
      const profiles = (profilesRes.data ?? []) as ProfileLite[];
      return { leads, profiles };
    },
  });
}

/* ──────────────────────────────────────────────────────────── */
/* Main view                                                   */
/* ──────────────────────────────────────────────────────────── */

export function ExpansionView() {
  const { data, isLoading, error, refetch, isRefetching } = useExpansionData();

  const zoneRows = useMemo(() => {
    if (!data) return [];
    return buildZoneRows(data.leads, data.profiles);
  }, [data]);

  return (
    <div className="space-y-6">
      <ZoneTable
        rows={zoneRows}
        loading={isLoading}
        error={error?.message}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
      />

      <LaunchCockpit leads={data?.leads ?? []} />

      <LeadMatrix leads={data?.leads ?? []} loading={isLoading} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* TASK 1 — Geographic table (TanStack Table)                  */
/* ──────────────────────────────────────────────────────────── */

const zoneCol = createColumnHelper<ZoneRow>();

function ZoneTable({
  rows,
  loading,
  error,
  onRefresh,
  refreshing,
}: {
  rows: ZoneRow[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "leads", desc: true }]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      zoneCol.accessor("dept", {
        header: "Zone",
        cell: (c) => (
          <div className="min-w-0">
            <div className="font-semibold text-lg">
              {c.row.original.topCity}{" "}
              <span className="opacity-50 font-normal">({c.row.original.dept})</span>
            </div>
            <div className="opacity-60 truncate text-lg">
              {c.row.original.region || "—"}
            </div>
          </div>
        ),
      }),
      zoneCol.accessor("leads", {
        header: "Pré-inscrits",
        cell: (c) => <span className="font-medium">{fmtNumber(c.getValue())}</span>,
      }),
      zoneCol.accessor("ratioM", {
        header: "Ratio H/F",
        cell: (c) => <GenderGauge ratioM={c.getValue()} ratioF={c.row.original.ratioF} imbalanced={c.row.original.imbalanced} />,
      }),
      zoneCol.accessor("liquidity", {
        header: "Statut de Liquidité",
        cell: (c) => <LiquidityBadge tier={c.getValue()} />,
      }),
      zoneCol.accessor("potentialMrr", {
        header: "Potentiel MRR",
        cell: (c) => <span className="font-medium">{fmtEuro(c.getValue())}</span>,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      aria-labelledby="zone-table-title"
    >
      <header
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: BORDER }}
      >
        <div>
          <h2 id="zone-table-title" className="font-semibold text-xl">
            Répartition Géographique
          </h2>
          <p className="opacity-60 mt-0.5 text-lg">
            Cliquez une ligne pour explorer les codes postaux du département.
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
      </header>

      {error && (
        <div className="px-4 py-3 text-sm" style={{ color: "#F87171" }}>
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-lg" role="grid">
          <thead style={{ background: "#172238" }}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sortDir = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      className="px-4 py-3 font-medium uppercase tracking-wider opacity-80 text-lg"
                      aria-sort={
                        sortDir === "asc"
                          ? "ascending"
                          : sortDir === "desc"
                          ? "descending"
                          : "none"
                      }
                    >
                      <button
                        onClick={h.column.getToggleSortingHandler()}
                        className={`inline-flex items-center gap-1 hover:text-white transition-colors ${FOCUS_RING}`}
                        type="button"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span aria-hidden className="opacity-60">
                          {sortDir === "asc" ? "↑" : sortDir === "desc" ? "↓" : ""}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center opacity-60 text-xl">
                  Chargement…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center opacity-60 text-xl">
                  Aucun département actif.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isOpen = expanded === row.original.dept;
                return (
                  <FragmentRow key={row.id}>
                    <tr
                      tabIndex={0}
                      onClick={() => setExpanded(isOpen ? null : row.original.dept)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpanded(isOpen ? null : row.original.dept);
                        }
                      }}
                      className={`border-t cursor-pointer hover:bg-white/[0.03] transition-colors ${FOCUS_RING}`}
                      style={{
                        borderColor: BORDER,
                        background: isOpen ? "rgba(197,160,89,0.06)" : "transparent",
                      }}
                      aria-expanded={isOpen}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-middle text-lg">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    {isOpen && (
                      <tr style={{ background: NAVY, borderTop: `1px solid ${BORDER}` }}>
                        <td colSpan={columns.length} className="px-6 py-4">
                          <div className="uppercase tracking-wider opacity-60 mb-2 text-lg">
                            Codes postaux — {row.original.topCity} ({row.original.dept})
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {row.original.postalBreakdown.slice(0, 24).map((p) => (
                              <div
                                key={p.postal_code}
                                className="flex items-center justify-between px-3 py-2 rounded-md border text-lg"
                                style={{ borderColor: BORDER }}
                              >
                                <div className="min-w-0 truncate text-lg">
                                  <span className="font-medium">{p.postal_code}</span>{" "}
                                  <span className="opacity-60">{p.city}</span>
                                </div>
                                <span className="font-semibold" style={{ color: GOLD }}>
                                  {fmtNumber(p.leads)}
                                </span>
                              </div>
                            ))}
                            {row.original.postalBreakdown.length === 0 && (
                              <p className="opacity-60 text-lg">Aucun détail disponible.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LiquidityBadge({ tier }: { tier: ZoneRow["liquidity"] }) {
  const map: Record<ZoneRow["liquidity"], { bg: string; fg: string; label: string }> = {
    ouvert: { bg: "rgba(34,197,94,0.12)", fg: "#4ADE80", label: "Ouvert" },
    amorçage: { bg: "rgba(245,158,11,0.12)", fg: "#FBBF24", label: "Amorçage" },
    froid: { bg: "rgba(148,163,184,0.12)", fg: "#94A3B8", label: "Froid" },
    saturé: { bg: "rgba(197,160,89,0.18)", fg: GOLD, label: "Saturé" },
  };
  const c = map[tier];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md font-semibold text-lg"
      style={{ background: c.bg, color: c.fg }}
    >
      {c.label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* TASK 3 — Gender gauge                                       */
/* ──────────────────────────────────────────────────────────── */

function GenderGauge({
  ratioM,
  ratioF,
  imbalanced,
}: {
  ratioM: number;
  ratioF: number;
  imbalanced: boolean;
}) {
  const m = Math.round(ratioM * 100);
  const f = 100 - m;
  return (
    <div className="min-w-[120px]">
      <div
        className="flex h-2 rounded-full overflow-hidden border"
        style={{ borderColor: BORDER }}
        role="img"
        aria-label={`Ratio hommes ${m}% / femmes ${f}%`}
      >
        <div style={{ width: `${m}%`, background: "#3B82F6" }} />
        <div style={{ width: `${f}%`, background: "#EC4899" }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
        <span>H {m}%</span>
        <span>F {f}%</span>
      </div>
      {imbalanced && (
        <div
          className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: GOLD, border: `1px solid ${GOLD}` }}
        >
          Priorité Acquisition
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* TASK 2 — Launch Readiness Cockpit                           */
/* ──────────────────────────────────────────────────────────── */

function LaunchCockpit({ leads }: { leads: Lead[] }) {
  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      aria-labelledby="cockpit-title"
    >
      <header
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: BORDER }}
      >
        <div>
          <h2 id="cockpit-title" className="font-semibold text-xl">
            Cockpit de Lancement
          </h2>
          <p className="opacity-60 mt-0.5 text-lg">
            Seuil de lancement par zone : 1 000 pré-inscrits seniors.
          </p>
        </div>
      </header>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TARGET_ZONES.map((z) => {
          const subset = leadsForPrefix(leads, z.prefix);
          const count = subset.length;
          const pct = Math.min(100, Math.round((count / z.threshold) * 100));
          const ready = count >= z.threshold;
          return <TargetCard key={z.id} label={z.label} prefix={z.prefix} count={count} threshold={z.threshold} pct={pct} ready={ready} />;
        })}
      </div>
    </section>
  );
}

function TargetCard({
  label,
  prefix,
  count,
  threshold,
  pct,
  ready,
}: {
  label: string;
  prefix: string;
  count: number;
  threshold: number;
  pct: number;
  ready: boolean;
}) {
  const launch = () => {
    toast.success(`Campagne email préparée pour ${label} — ${fmtNumber(count)} contacts.`);
  };
  return (
    <article
      className="rounded-lg border p-4"
      style={{
        borderColor: ready ? GOLD : BORDER,
        background: NAVY,
        boxShadow: ready ? `0 0 0 1px ${GOLD}, 0 0 28px -6px rgba(197,160,89,0.55)` : undefined,
      }}
    >
      <header className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-xl">{label}</h3>
          <p className="opacity-60 mt-0.5 text-lg">
            Préfixe {prefix} · Seuil {fmtNumber(threshold)}
          </p>
        </div>
        <span
          className="inline-block px-2 py-0.5 rounded font-bold uppercase tracking-wider text-lg"
          style={{
            background: ready ? GOLD : "rgba(148,163,184,0.12)",
            color: ready ? NAVY : "#94A3B8",
          }}
        >
          {ready ? "Prêt" : "En cours"}
        </span>
      </header>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums">{fmtNumber(count)}</span>
          <span className="opacity-60 text-lg">/ {fmtNumber(threshold)} ({pct}%)</span>
        </div>
        <div
          className="mt-2 h-2 rounded-full overflow-hidden"
          style={{ background: "#1F2A44" }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression ${label}`}
        >
          <div
            className="h-full transition-all"
            style={{ width: `${pct}%`, background: ready ? GOLD : "#3B82F6" }}
          />
        </div>
      </div>

      <button
        onClick={launch}
        disabled={!ready}
        className={`mt-4 w-full h-10 rounded-md font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity ${FOCUS_RING} text-lg`}
        style={{ background: ready ? GOLD : "rgba(197,160,89,0.18)", color: ready ? NAVY : GOLD }}
      >
        Lancer Campagne Email
      </button>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* TASK 4 — Lead Matrix + Filters + Export                     */
/* ──────────────────────────────────────────────────────────── */

type LeadRow = Lead & { source: string };
const leadCol = createColumnHelper<LeadRow>();

function LeadMatrix({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const [globalCp, setGlobalCp] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const data: LeadRow[] = useMemo(
    () => leads.map((l) => ({ ...l, source: deriveSource(l.id) })),
    [leads]
  );

  const columns = useMemo(
    () => [
      leadCol.accessor("email", {
        header: "Email",
        cell: (c) => <span className="truncate">{c.getValue()}</span>,
      }),
      leadCol.accessor("postal_code", {
        header: "Code Postal",
        filterFn: (row, _id, value) =>
          (row.original.postal_code ?? "").toString().startsWith(String(value)),
      }),
      leadCol.accessor("city_name", { header: "Ville" }),
      leadCol.accessor("region_name", { header: "Région" }),
      leadCol.accessor("source", {
        header: "Source",
        filterFn: (row, _id, value) =>
          value === "all" ? true : row.original.source === value,
        cell: (c) => <SourcePill src={c.getValue()} />,
      }),
      leadCol.accessor("created_at", {
        header: "Date d'inscription",
        cell: (c) => fmtFr(c.getValue()),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Sync custom filter UI → tanstack column filters
  const applyFilters = (cp: string, src: string) => {
    const next: ColumnFiltersState = [];
    if (cp.trim()) next.push({ id: "postal_code", value: cp.trim() });
    if (src !== "all") next.push({ id: "source", value: src });
    setColumnFilters(next);
  };

  const filteredRows = table.getFilteredRowModel().rows;

  const exportCsv = () => {
    const header = ["Email", "Téléphone", "CP", "Ville", "Région", "Source", "Statut", "Inscrit le"];
    const rows = filteredRows.map((r) => [
      r.original.email,
      r.original.phone ?? "",
      r.original.postal_code,
      r.original.city_name,
      r.original.region_name,
      r.original.source,
      r.original.status,
      fmtFr(r.original.created_at),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expansion-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      aria-labelledby="leads-title"
    >
      <header
        className="flex flex-wrap items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: BORDER }}
      >
        <div>
          <h2 id="leads-title" className="font-semibold text-xl">
            Matrice des Leads
          </h2>
          <p className="opacity-60 mt-0.5 text-lg">
            {fmtNumber(filteredRows.length)} pré-inscription(s) — {fmtNumber(data.length)} au total
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Code postal (ex. 75)"
            value={globalCp}
            onChange={(e) => {
              setGlobalCp(e.target.value);
              applyFilters(e.target.value, sourceFilter);
            }}
            className={`h-10 px-3 rounded-md border text-base w-[160px] ${FOCUS_RING}`}
            style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
          />
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              applyFilters(globalCp, e.target.value);
            }}
            className={`h-10 px-3 rounded-md border text-base ${FOCUS_RING}`}
            style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
          >
            <option value="all">Toutes sources</option>
            {ACQUISITION_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            disabled={loading || filteredRows.length === 0}
            className={`h-10 px-4 rounded-md font-semibold text-base disabled:opacity-40 ${FOCUS_RING}`}
            style={{ background: GOLD, color: NAVY }}
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="grid">
          <thead style={{ background: "#172238" }}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sortDir = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      className="px-4 py-3 font-medium uppercase tracking-wider opacity-80 text-lg"
                      aria-sort={
                        sortDir === "asc"
                          ? "ascending"
                          : sortDir === "desc"
                          ? "descending"
                          : "none"
                      }
                    >
                      <button
                        onClick={h.column.getToggleSortingHandler()}
                        type="button"
                        className={`inline-flex items-center gap-1 hover:text-white transition-colors ${FOCUS_RING}`}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span aria-hidden className="opacity-60">
                          {sortDir === "asc" ? "↑" : sortDir === "desc" ? "↓" : ""}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center opacity-60 text-xl">
                  Chargement…
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center opacity-60 text-xl">
                  Aucun lead ne correspond aux filtres.
                </td>
              </tr>
            ) : (
              filteredRows.slice(0, 500).map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  className={`border-t hover:bg-white/[0.02] transition-colors ${FOCUS_RING}`}
                  style={{ borderColor: BORDER }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredRows.length > 500 && (
          <div className="px-4 py-3 opacity-60 border-t text-lg" style={{ borderColor: BORDER }}>
            Affichage limité aux 500 premières lignes — utilisez l'export CSV pour la liste complète.
          </div>
        )}
      </div>
    </section>
  );
}

function SourcePill({ src }: { src: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    Meta: { bg: "rgba(59,130,246,0.12)", fg: "#60A5FA" },
    Google: { bg: "rgba(234,179,8,0.12)", fg: "#FACC15" },
    Organique: { bg: "rgba(34,197,94,0.12)", fg: "#4ADE80" },
    Parrainage: { bg: "rgba(197,160,89,0.18)", fg: GOLD },
  };
  const c = map[src] ?? { bg: "rgba(148,163,184,0.12)", fg: "#94A3B8" };
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md font-medium text-lg"
      style={{ background: c.bg, color: c.fg }}
    >
      {src}
    </span>
  );
}
