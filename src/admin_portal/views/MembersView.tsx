import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
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

const SURFACE = "#0F1828";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";
const NAVY = "#0E1626";
const RED = "#DC2626";
const TEXT = "#E5E7EB";
const ROW_H = 64;

const fmtFr = (d: string | Date | null | undefined) =>
  d ? format(typeof d === "string" ? new Date(d) : d, "dd/MM/yyyy") : "—";

/** Color band for "Dernière Activité": <24h vert, <7j ambre, sinon rouge. */
function activityTone(iso: string | null | undefined): { fg: string; bg: string; label: string } {
  if (!iso) return { fg: "#94A3B8", bg: "rgba(148,163,184,0.10)", label: "—" };
  const ageH = (Date.now() - new Date(iso).getTime()) / 3_600_000;
  if (ageH < 24) return { fg: "#4ADE80", bg: "rgba(34,197,94,0.10)", label: formatRelativeFr(iso) };
  if (ageH < 24 * 7) return { fg: "#FBBF24", bg: "rgba(245,158,11,0.10)", label: formatRelativeFr(iso) };
  return { fg: "#F87171", bg: "rgba(220,38,38,0.10)", label: formatRelativeFr(iso) };
}

export function MembersView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stuckOnly, setStuckOnly] = useState(false);
  const [stepFilter, setStepFilter] = useState<string>("all");
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminSupabase.functions.invoke("admin-list-users");
      if (error) throw error;
      setUsers(data?.users ?? []);
    } catch (e: any) {
      setError(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // Listen for cross-component requests (Cmd+K palette → open a specific member).
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const u = users.find((x) => x.id === id);
      if (u) setDetailUser(u);
    };
    window.addEventListener("admin:open-member", onOpen as EventListener);
    return () => window.removeEventListener("admin:open-member", onOpen as EventListener);
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const hay = `${u.email} ${u.phone} ${u.first_name} ${u.last_name} ${u.postal_code ?? ""} ${u.city_name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stepFilter !== "all" && deriveTunnelStep(u) !== stepFilter) return false;
      if (stuckOnly && !isStuckOver48h(u)) return false;
      return true;
    });
  }, [users, search, stepFilter, stuckOnly]);

  const exportCsv = () => {
    const header = [
      "Email",
      "Nom",
      "Âge",
      "Genre",
      "CP",
      "Ville",
      "Étape",
      "Statut",
      "Inscrit le",
      "Dernière activité",
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
    a.download = `members-matrix-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const callModeration = async (action: string, user_id: string, extra?: Record<string, any>) => {
    const { data, error } = await supabase.functions.invoke("admin-moderate-user", {
      body: { action, user_id, ...extra },
    });
    if (error) throw error;
    return data;
  };

  const handleBlock = async (u: AdminUser) => {
    if (u.email === MASTER_ADMIN_EMAIL) {
      toast.error("Compte maître protégé.");
      return;
    }
    if (!confirm(`Bloquer définitivement ${u.email} ? Un email de notification sera envoyé.`)) return;
    try {
      await callModeration("block", u.id);
      toast.success("Membre bloqué. Email de notification déclenché.");
      reload();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  const handleRefund = async (u: AdminUser) => {
    try {
      const data = await callModeration("refund", u.id);
      if (data?.stripe_url) window.open(data.stripe_url, "_blank", "noopener");
      toast.success("Remboursement initié sur Stripe.");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  // Virtualization
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => ROW_H,
    overscan: 12,
  });

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] h-10 px-3 rounded-md border outline-none text-base focus:border-[#C9A961] transition-colors"
          style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
        />
        <select
          value={stepFilter}
          onChange={(e) => setStepFilter(e.target.value)}
          className="h-10 px-3 rounded-md border text-base"
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
          className="flex items-center gap-2 h-10 px-3 rounded-md border cursor-pointer text-base"
          style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
        >
          <input
            type="checkbox"
            checked={stuckOnly}
            onChange={(e) => setStuckOnly(e.target.checked)}
            className="accent-[#C9A961]"
          />
          Friction &gt; 48h
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs opacity-60 hidden md:inline">
            {filtered.length.toLocaleString("fr-FR")} membre(s)
          </span>
          <button
            onClick={reload}
            className="h-10 px-4 rounded-md border text-base hover:opacity-80"
            style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
          >
            Rafraîchir
          </button>
          <button
            onClick={exportCsv}
            disabled={loading || filtered.length === 0}
            className="h-10 px-4 rounded-md font-semibold text-base disabled:opacity-40 hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Export Matrix CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 text-base" style={{ color: "#F87171" }}>
          {error}
        </div>
      )}

      {/* Sticky header (grid) */}
      <div
        className="grid items-center px-4 py-3 text-xs font-medium uppercase tracking-wider opacity-70"
        style={{
          background: "#172238",
          borderBottom: `1px solid ${BORDER}`,
          gridTemplateColumns: GRID_COLS,
        }}
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

      {/* Virtualized rows */}
      <div
        ref={scrollerRef}
        className="overflow-y-auto"
        style={{ height: "min(70vh, 760px)" }}
      >
        {loading ? (
          <div className="px-5 py-12 text-center opacity-60 text-base">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center opacity-60 text-base">Aucun membre.</div>
        ) : (
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((vi) => {
              const u = filtered[vi.index];
              const step = deriveTunnelStep(u);
              const fin = deriveFinancialStatus(u);
              const stuck = isStuckOver48h(u);
              const isMaster = u.email === MASTER_ADMIN_EMAIL;
              const tone = activityTone(u.updated_at);
              return (
                <div
                  key={u.id}
                  className="grid items-center px-4 hover:bg-white/[0.02] transition-colors border-t"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${vi.start}px)`,
                    height: ROW_H,
                    width: "100%",
                    borderColor: BORDER,
                    gridTemplateColumns: GRID_COLS,
                  }}
                >
                  <div>
                    <div className="font-medium text-sm truncate">
                      {`${u.first_name} ${u.last_name}`.trim() || (
                        <span className="opacity-50">{u.email}</span>
                      )}
                      {isMaster && (
                        <span
                          className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider"
                          style={{ background: GOLD, color: NAVY }}
                        >
                          Maître
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-50 truncate">{u.email}</div>
                  </div>
                  <div className="text-sm">{calcAge(u.birth_date) ?? <Dash />}</div>
                  <div className="text-sm capitalize">{u.gender || <Dash />}</div>
                  <div className="text-sm truncate">{shortLocation(u)}</div>
                  <div>
                    <StepBadge stepIndex={tunnelStepIndex(step)} label={tunnelStepLabel(step)} />
                  </div>
                  <div>
                    <FinancialPill {...fin} />
                  </div>
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
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
                      className="text-sm underline opacity-80 hover:opacity-100 mr-3"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleRefund(u)}
                      className="text-sm underline opacity-70 hover:opacity-100 mr-3"
                      style={{ color: GOLD }}
                    >
                      Rembourser
                    </button>
                    <button
                      onClick={() => handleBlock(u)}
                      disabled={isMaster}
                      className="text-sm font-semibold px-3 py-1.5 rounded-md disabled:opacity-30"
                      style={{ background: RED, color: "#fff" }}
                    >
                      Bloquer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {detailUser && (
        <DetailsSlideOver user={detailUser} onClose={() => setDetailUser(null)} />
      )}
    </section>
  );
}

const GRID_COLS = "minmax(220px,1.4fr) 60px 90px minmax(180px,1.2fr) minmax(180px,1fr) 120px minmax(160px,1fr) minmax(280px,auto)";

function Dash() {
  return <span className="opacity-40">—</span>;
}

function StepBadge({ stepIndex, label }: { stepIndex: number; label: string }) {
  const total = TUNNEL_STEPS.length - 1;
  const pct = Math.max(0, Math.min(1, stepIndex / total));
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full" style={{ background: "#1F2A44" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: GOLD }}
        />
      </div>
      <span className="text-xs">{label}</span>
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
    ok: { bg: "rgba(34,197,94,0.12)", fg: "#4ADE80" },
    warn: { bg: "rgba(245,158,11,0.12)", fg: "#FBBF24" },
    muted: { bg: "rgba(148,163,184,0.12)", fg: "#94A3B8" },
    bad: { bg: "rgba(220,38,38,0.15)", fg: "#F87171" },
  };
  const c = map[tone];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {label}
    </span>
  );
}

function DetailsSlideOver({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [quiz, setQuiz] = useState<{ question_id: string; answer_value: string }[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/70" onClick={onClose} />
      <aside
        className="w-full max-w-xl h-full overflow-y-auto border-l shadow-2xl"
        style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-5 border-b"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <div>
            <h3 className="text-lg font-semibold">
              {`${user.first_name} ${user.last_name}`.trim() || user.email}
            </h3>
            <p className="text-xs opacity-60">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-base opacity-70 hover:opacity-100">
            Fermer ✕
          </button>
        </div>

        <div className="p-5 space-y-6 text-sm">
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
            <h4 className="text-base font-semibold mb-2" style={{ color: GOLD }}>
              Réponses Quiz ({quiz.length})
            </h4>
            {loading ? (
              <p className="opacity-60 text-sm">Chargement…</p>
            ) : quiz.length === 0 ? (
              <p className="opacity-60 text-sm">Aucune réponse enregistrée.</p>
            ) : (
              <ul className="space-y-1.5">
                {quiz.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 py-1.5 border-b text-[13px] leading-tight"
                    style={{ borderColor: BORDER }}
                  >
                    <span className="opacity-70 font-mono text-[12px]">{q.question_id}</span>
                    <span className="font-medium text-right">{q.answer_value}</span>
                  </li>
                ))}
              </ul>
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
      <span className="text-xs uppercase tracking-wider opacity-60">{label}</span>
      <span className="text-sm font-medium">{value || <span className="opacity-40">—</span>}</span>
    </div>
  );
}
