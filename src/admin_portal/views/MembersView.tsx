import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import { adminSupabase } from "../lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeFr } from "../lib/dates";
import {
  TUNNEL_STEPS,
  calcAge,
  deriveFinancialStatus,
  deriveTunnelStep,
  isStuckOver48h,
  shortLocation,
  tunnelStepIndex,
  tunnelStepLabel,
  MASTER_ADMIN_EMAIL,
} from "../lib/tunnel";
import { useAdminRole } from "../core/useAdminRole";
import { toast } from "sonner";

type AdminUser = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  birth_date: string | null;
  gender: string | null;
  postal_code: string | null;
  city_name: string | null;
  region_name: string | null;
  onboarding_step: string | null;
  account_status: string | null;
  quiz_count: number;
  media: { media_type: string; file_path: string; created_at: string }[];
};

const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const NAVY = "var(--ap-bg)";
const RED = "#DC2626";
const TEXT = "var(--ap-text)";
const PAGE_SIZE = 50;

const fmtFr = (d: string | Date | null | undefined) =>
  d ? format(typeof d === "string" ? new Date(d) : d, "dd/MM/yyyy") : "—";

function activityTone(iso: string | null | undefined): { fg: string; bg: string; label: string } {
  if (!iso) return { fg: "#94A3B8", bg: "rgba(148,163,184,0.10)", label: "—" };
  const ageH = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (ageH < 24) return { fg: "#16A34A", bg: "rgba(22,163,74,0.10)", label: formatRelativeFr(iso) };
  if (ageH < 24 * 7) return { fg: "#D97706", bg: "rgba(217,119,6,0.10)", label: formatRelativeFr(iso) };
  return { fg: "#DC2626", bg: "rgba(220,38,38,0.10)", label: formatRelativeFr(iso) };
}

function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function MembersView() {
  const { isSuperAdmin, can } = useAdminRole();
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 300);
  const [stuckOnly, setStuckOnly] = useState(false);
  const [stepFilter, setStepFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, stuckOnly, stepFilter]);

  const query = useQuery({
    queryKey: ["admin-members", page, search, stuckOnly, stepFilter],
    queryFn: async () => {
      const { data, error } = await adminSupabase.functions.invoke("admin-list-users", {
        body: {
          page,
          page_size: PAGE_SIZE,
          search: search.trim() || undefined,
          stuck_only: stuckOnly || undefined,
          step: stepFilter !== "all" ? stepFilter : undefined,
        },
      });
      if (error) throw error;
      return data as { users: AdminUser[]; total_count: number };
    },
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });

  const users = query.data?.users ?? [];
  const total = query.data?.total_count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Client-side step refinement (since derivation is logical, not a DB column)
  const filtered = useMemo(() => {
    if (stepFilter === "all") return users;
    return users.filter((u) => deriveTunnelStep(u) === stepFilter);
  }, [users, stepFilter]);

  // Cross-component requests
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const u = users.find((x) => x.id === id);
      if (u) setDetailUser(u);
    };
    window.addEventListener("admin:open-member", onOpen as EventListener);
    return () => window.removeEventListener("admin:open-member", onOpen as EventListener);
  }, [users]);

  const exportCsv = () => {
    const header = [
      "Email", "Nom", "Âge", "Genre", "CP", "Ville",
      "Étape", "Statut", "Inscrit le", "Dernière activité",
    ];
    const rows = filtered.map((u) => [
      u.email,
      `${u.first_name} ${u.last_name}`.trim(),
      calcAge(u.birth_date) ?? "",
      u.gender ?? "",
      u.postal_code ?? "",
      u.city_name ?? "",
      tunnelStepLabel(deriveTunnelStep(u)),
      deriveFinancialStatus(u).label,
      fmtFr(u.created_at),
      fmtFr(u.updated_at),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-page-${page}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBlock = async (u: AdminUser) => {
    if (u.email === MASTER_ADMIN_EMAIL) {
      toast.error("Compte maître protégé.");
      return;
    }
    if (!confirm(`Bloquer définitivement ${u.email} ?`)) return;
    try {
      const { error } = await supabase.functions.invoke("admin-moderate-user", {
        body: { action: "block", user_id: u.id },
      });
      if (error) throw error;
      toast.success("Membre bloqué.");
      query.refetch();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  const handleRefund = async (u: AdminUser) => {
    if (!can("refund_user")) return;
    try {
      const { data, error } = await supabase.functions.invoke("admin-moderate-user", {
        body: { action: "refund", user_id: u.id },
      });
      if (error) throw error;
      if (data?.stripe_url) window.open(data.stripe_url, "_blank", "noopener");
      toast.success("Remboursement initié.");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 border-b"
        style={{ borderColor: BORDER }}
      >
        <input
          type="text"
          placeholder="Rechercher email, nom, CP, ville…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 min-w-[220px] h-12 px-3 rounded-md border outline-none text-base focus:border-[#C9A961] transition-colors"
          style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
        />
        <select
          value={stepFilter}
          onChange={(e) => setStepFilter(e.target.value)}
          className="h-12 px-3 rounded-md border text-base"
          style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
        >
          <option value="all">Toutes étapes</option>
          {TUNNEL_STEPS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <label
          className="flex items-center gap-2 h-12 px-3 rounded-md border cursor-pointer text-base"
          style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
        >
          <input
            type="checkbox"
            checked={stuckOnly}
            onChange={(e) => setStuckOnly(e.target.checked)}
            className="accent-[#C9A961] h-5 w-5"
          />
          Friction &gt; 48h
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span className="opacity-60 hidden md:inline text-lg">
            {total.toLocaleString("fr-FR")} membre(s)
          </span>
          <button
            onClick={() => query.refetch()}
            className="h-12 px-4 rounded-md border text-base hover:opacity-80"
            style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
          >
            Rafraîchir
          </button>
          {can("export_csv") && (
            <button
              onClick={exportCsv}
              disabled={query.isLoading || filtered.length === 0}
              className="h-12 px-4 rounded-md font-semibold text-base disabled:opacity-40 hover:opacity-90"
              style={{ background: GOLD, color: NAVY }}
            >
              Export CSV (page)
            </button>
          )}
        </div>
      </div>

      {query.error && (
        <div className="px-5 py-3 text-base" style={{ color: "#DC2626" }}>
          {(query.error as Error).message}
        </div>
      )}

      {/* Header */}
      <div
        className="grid items-center px-4 py-3 font-medium uppercase tracking-wider opacity-70 bg-slate-50 text-base"
        style={{ borderBottom: `1px solid ${BORDER}`, gridTemplateColumns: GRID_COLS }}
      >
        <div>Nom</div>
        <div>Âge</div>
        <div>Genre</div>
        <div>Localisation</div>
        <div>Étape du Tunnel</div>
        <div>Statut Financier</div>
        <div>Dernière Activité</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Rows (50/page — no virtualization needed) */}
      <div>
        {query.isLoading ? (
          <div className="px-5 py-12 text-center opacity-60 text-xl">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center opacity-60 text-xl">Aucun membre.</div>
        ) : (
          filtered.map((u) => {
            const step = deriveTunnelStep(u);
            const fin = deriveFinancialStatus(u);
            const stuck = isStuckOver48h(u);
            const isMaster = u.email === MASTER_ADMIN_EMAIL;
            const tone = activityTone(u.updated_at);
            return (
              <div
                key={u.id}
                className="grid items-center px-4 py-3 hover:bg-black/[0.02] transition-colors border-t"
                style={{ borderColor: BORDER, gridTemplateColumns: GRID_COLS, minHeight: 64 }}
              >
                <div>
                  <div className="font-medium truncate text-lg">
                    {`${u.first_name} ${u.last_name}`.trim() || (
                      <span className="opacity-50">{u.email}</span>
                    )}
                    {isMaster && (
                      <span
                        className="ml-2 inline-block px-1.5 py-0.5 rounded uppercase tracking-wider text-base"
                        style={{ background: GOLD, color: NAVY }}
                      >
                        Maître
                      </span>
                    )}
                  </div>
                  <div className="opacity-50 truncate text-base">{u.email}</div>
                </div>
                <div className="text-lg">{calcAge(u.birth_date) ?? <Dash />}</div>
                <div className="capitalize text-lg">{u.gender || <Dash />}</div>
                <div className="truncate text-lg">{shortLocation(u)}</div>
                <div>
                  <StepBadge stepIndex={tunnelStepIndex(step)} label={tunnelStepLabel(step)} />
                </div>
                <div>
                  <FinancialPill {...fin} />
                </div>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-medium text-base"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: tone.fg }}
                    />
                    {tone.label}
                    {stuck && <span className="opacity-80">· bloqué</span>}
                  </span>
                </div>
                <div className="text-right whitespace-nowrap">
                  <button
                    onClick={() => setDetailUser(u)}
                    className="underline opacity-80 hover:opacity-100 mr-3 text-lg"
                  >
                    Détails
                  </button>
                  {can("refund_user") && (
                    <button
                      onClick={() => handleRefund(u)}
                      className="underline opacity-70 hover:opacity-100 mr-3 text-lg"
                      style={{ color: GOLD }}
                    >
                      Rembourser
                    </button>
                  )}
                  <button
                    onClick={() => handleBlock(u)}
                    disabled={isMaster}
                    className="font-semibold px-3 py-2 rounded-md disabled:opacity-30 text-lg"
                    style={{ background: RED, color: "#fff" }}
                  >
                    Bloquer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination footer */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-4 border-t flex-wrap"
        style={{ borderColor: BORDER }}
      >
        <div className="text-base opacity-70">
          Page {page} sur {pageCount} · {total.toLocaleString("fr-FR")} résultats
        </div>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} loading={query.isFetching} />
      </div>

      {detailUser && (
        <DetailsSlideOver
          user={detailUser}
          onClose={() => setDetailUser(null)}
          isSuperAdmin={isSuperAdmin}
          onAfterAnonymize={() => {
            setDetailUser(null);
            query.refetch();
          }}
        />
      )}
    </section>
  );
}

const GRID_COLS =
  "minmax(220px,1.4fr) 60px 90px minmax(180px,1.2fr) minmax(180px,1fr) 120px minmax(160px,1fr) minmax(280px,auto)";

function Dash() {
  return <span className="opacity-40">—</span>;
}

function StepBadge({ stepIndex, label }: { stepIndex: number; label: string }) {
  const total = TUNNEL_STEPS.length - 1;
  const pct = Math.max(0, Math.min(1, stepIndex / total));
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: GOLD }} />
      </div>
      <span className="text-lg">{label}</span>
    </div>
  );
}

function FinancialPill({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "warn" | "muted" | "bad";
}) {
  const map: Record<typeof tone, { bg: string; fg: string }> = {
    ok: { bg: "rgba(22,163,74,0.12)", fg: "#16A34A" },
    warn: { bg: "rgba(217,119,6,0.12)", fg: "#D97706" },
    muted: { bg: "rgba(148,163,184,0.12)", fg: "#64748B" },
    bad: { bg: "rgba(220,38,38,0.15)", fg: "#DC2626" },
  };
  const c = map[tone];
  return (
    <span
      className="inline-block px-2 py-1 rounded-md font-medium text-base"
      style={{ background: c.bg, color: c.fg }}
    >
      {label}
    </span>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
  loading,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  loading: boolean;
}) {
  const pages: (number | "…")[] = useMemo(() => {
    const out: (number | "…")[] = [];
    const window = 1;
    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= page - window && i <= page + window)
      ) {
        out.push(i);
      } else if (out[out.length - 1] !== "…") {
        out.push("…");
      }
    }
    return out;
  }, [page, pageCount]);

  const btn = "h-12 min-w-[48px] px-3 rounded-md border text-base font-medium";
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        className={btn + " disabled:opacity-30"}
        style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
        disabled={page <= 1 || loading}
        onClick={() => onChange(page - 1)}
      >
        ← Précédent
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 opacity-50 text-lg">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={btn}
            style={{
              borderColor: p === page ? GOLD : BORDER,
              background: p === page ? GOLD : NAVY,
              color: p === page ? NAVY : TEXT,
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        className={btn + " disabled:opacity-30"}
        style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
        disabled={page >= pageCount || loading}
        onClick={() => onChange(page + 1)}
      >
        Suivant →
      </button>
    </div>
  );
}

function DetailsSlideOver({
  user,
  onClose,
  isSuperAdmin,
  onAfterAnonymize,
}: {
  user: AdminUser;
  onClose: () => void;
  isSuperAdmin: boolean;
  onAfterAnonymize: () => void;
}) {
  const [quiz, setQuiz] = useState<{ question_id: string; answer_value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [anonymizing, setAnonymizing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("admin-moderate-user", {
          body: { action: "fetch_quiz", user_id: user.id },
        });
        setQuiz(data?.quiz ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.id]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-gdpr-export", {
        body: { user_id: user.id },
      });
      if (error) throw error;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gdpr-export-${user.id}-${format(new Date(), "yyyy-MM-dd")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export RGPD téléchargé.");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur d'export");
    } finally {
      setExporting(false);
    }
  };

  const handleAnonymize = async () => {
    if (confirmEmail.toLowerCase().trim() !== user.email.toLowerCase()) {
      toast.error("L'email de confirmation ne correspond pas.");
      return;
    }
    if (
      !confirm(
        "Action irréversible. Anonymiser et supprimer toutes les données personnelles de ce membre ?"
      )
    )
      return;
    setAnonymizing(true);
    try {
      const { error } = await supabase.functions.invoke("admin-gdpr-anonymize", {
        body: { user_id: user.id, confirm_email: user.email },
      });
      if (error) throw error;
      toast.success("Membre anonymisé. Logs financiers conservés.");
      onAfterAnonymize();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur d'anonymisation");
    } finally {
      setAnonymizing(false);
    }
  };

  const isMaster = user.email === MASTER_ADMIN_EMAIL;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <aside
        className="w-full max-w-xl h-full overflow-y-auto border-l shadow-2xl"
        style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-5 border-b z-10"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <div>
            <h3 className="text-xl font-semibold">
              {`${user.first_name} ${user.last_name}`.trim() || user.email}
            </h3>
            <p className="opacity-60 text-lg">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-lg opacity-70 hover:opacity-100 h-12 px-3 rounded"
          >
            Fermer ✕
          </button>
        </div>

        <div className="p-5 space-y-3 text-lg">
          <Meta label="Téléphone" value={user.phone} />
          <Meta label="Date de naissance" value={fmtFr(user.birth_date)} />
          <Meta label="Âge" value={calcAge(user.birth_date)?.toString() ?? "—"} />
          <Meta label="Genre" value={user.gender ?? "—"} />
          <Meta label="Localisation" value={shortLocation(user)} />
          <Meta label="Région" value={user.region_name ?? "—"} />
          <Meta label="Étape" value={tunnelStepLabel(deriveTunnelStep(user))} />
          <Meta label="Statut" value={user.account_status ?? "—"} />
          <Meta label="Inscrit le" value={fmtFr(user.created_at)} />
          <Meta label="Dernière activité" value={fmtFr(user.updated_at)} />
          <Meta label="Médias uploadés" value={String(user.media.length)} />

          <div>
            <h4 className="font-semibold mb-2 text-xl" style={{ color: GOLD }}>
              Réponses Quiz ({quiz.length})
            </h4>
            {loading ? (
              <p className="opacity-60 text-lg">Chargement…</p>
            ) : quiz.length === 0 ? (
              <p className="opacity-60 text-lg">Aucune réponse enregistrée.</p>
            ) : (
              <ul className="space-y-1.5">
                {quiz.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 py-1.5 border-b text-base leading-tight"
                    style={{ borderColor: BORDER }}
                  >
                    <span className="opacity-70 font-mono text-base">{q.question_id}</span>
                    <span className="font-medium text-right">{q.answer_value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Zone de Danger RGPD */}
          <div
            className="mt-8 rounded-lg border-2 p-5 space-y-4"
            style={{ borderColor: RED, background: "rgba(220,38,38,0.04)" }}
          >
            <div>
              <h4 className="font-bold text-xl" style={{ color: RED }}>
                ⚠ Zone de Danger (RGPD)
              </h4>
              <p className="text-base opacity-70 mt-1">
                Conformité Article 17 — Droit à l'effacement. Les logs financiers sont conservés
                pour obligations comptables.
              </p>
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full h-14 rounded-md border-2 font-semibold text-lg hover:bg-black/5 transition disabled:opacity-50"
              style={{ borderColor: BORDER, color: TEXT }}
            >
              {exporting ? "Export en cours…" : "📥 Exporter les données (JSON)"}
            </button>

            {isSuperAdmin && !isMaster ? (
              <div className="space-y-3">
                <label className="block text-base font-medium">
                  Pour confirmer, saisissez l'email du membre :
                  <input
                    type="text"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder={user.email}
                    className="mt-2 w-full h-14 px-3 rounded-md border text-base outline-none"
                    style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
                  />
                </label>
                <button
                  onClick={handleAnonymize}
                  disabled={anonymizing || confirmEmail.toLowerCase().trim() !== user.email.toLowerCase()}
                  className="w-full h-14 rounded-md font-bold text-lg disabled:opacity-30 hover:opacity-90 transition"
                  style={{ background: RED, color: "#fff" }}
                >
                  {anonymizing ? "Anonymisation…" : "🗑 Anonymiser & Supprimer"}
                </button>
              </div>
            ) : (
              <p className="text-base opacity-60 italic">
                {isMaster
                  ? "Compte maître — anonymisation interdite."
                  : "Anonymisation réservée au SuperAdmin."}
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 py-1.5 border-b"
      style={{ borderColor: BORDER }}
    >
      <span className="uppercase tracking-wider opacity-60 text-base">{label}</span>
      <span className="font-medium text-lg">{value || <span className="opacity-40">—</span>}</span>
    </div>
  );
}
