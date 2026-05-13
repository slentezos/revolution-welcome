import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { adminSupabase } from "../lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { formatRelativeFr } from "../lib/dates";
import {
  REJECTION_REASONS,
  calcAge,
  deriveTunnelStep,
  shortLocation,
  MASTER_ADMIN_EMAIL,
} from "../lib/tunnel";
import { toast } from "sonner";

const SURFACE = "#0F1828";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";
const NAVY = "#0E1626";
const GREEN = "#16A34A";
const RED = "#DC2626";
const TEXT = "#E5E7EB";

type Media = { media_type: string; file_path: string; created_at: string };
type Pending = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  gender: string | null;
  postal_code: string | null;
  city_name: string | null;
  region_name: string | null;
  onboarding_step: string | null;
  account_status: string | null;
  updated_at: string;
  media: Media[];
};

export function ModerationView() {
  const [users, setUsers] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Pending | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminSupabase.functions.invoke("admin-list-users");
      if (error) throw error;
      const all: Pending[] = data?.users ?? [];
      const queue = all.filter(
        (u) =>
          (u.onboarding_step === "media_uploaded" || u.account_status === "pending_review") &&
          u.email !== MASTER_ADMIN_EMAIL
      );
      // Oldest first → SLA fairness
      queue.sort((a, b) => +new Date(a.updated_at) - +new Date(b.updated_at));
      setUsers(queue);
      // Keep selection in sync
      setActive((prev) => {
        if (!prev) return queue[0] ?? null;
        return queue.find((u) => u.id === prev.id) ?? queue[0] ?? null;
      });
    } catch (e: any) {
      toast.error(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const photo = useMemo(
    () => active?.media.find((m) => m.media_type.includes("photo") || m.media_type.includes("image")),
    [active]
  );
  const video = useMemo(
    () => active?.media.find((m) => m.media_type.includes("video")),
    [active]
  );

  const handleApprove = async () => {
    if (!active) return;
    try {
      await supabase.functions.invoke("admin-moderate-user", {
        body: { action: "approve_media", user_id: active.id },
      });
      toast.success("Médias approuvés. Quiz 50 débloqué, email envoyé.");
      reload();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT, minHeight: 500 }}
    >
      {/* Queue */}
      <aside className="border-r" style={{ borderColor: BORDER }}>
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="text-base font-semibold">File de Modération</h3>
          <p className="text-xs opacity-60 mt-1">
            {loading ? "Chargement…" : `${users.length} profil(s) en attente`}
          </p>
        </div>
        <ul className="divide-y" style={{ borderColor: BORDER }}>
          {users.map((u) => {
            const isActive = active?.id === u.id;
            return (
              <li key={u.id}>
                <button
                  onClick={() => setActive(u)}
                  className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors"
                  style={{ background: isActive ? "rgba(201,169,97,0.08)" : "transparent" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {`${u.first_name} ${u.last_name}`.trim() || u.email}
                    </span>
                    <span className="text-xs opacity-60">
                      {calcAge(u.birth_date) ?? "?"} ans
                    </span>
                  </div>
                  <div className="text-xs opacity-60 mt-0.5">{shortLocation(u)}</div>
                  <div className="text-xs opacity-50 mt-1">
                    En attente {formatRelativeFr(u.updated_at)}
                  </div>
                </button>
              </li>
            );
          })}
          {!loading && users.length === 0 && (
            <li className="px-4 py-8 text-center text-sm opacity-60">
              File vide. Tous les profils sont traités.
            </li>
          )}
        </ul>
      </aside>

      {/* Decision panel */}
      <div className="p-6">
        {!active ? (
          <p className="opacity-60 text-base">Sélectionnez un profil à modérer.</p>
        ) : (
          <>
            <header className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold">
                  {`${active.first_name} ${active.last_name}`.trim() || active.email}
                </h3>
                <p className="text-sm opacity-60 mt-1">
                  {calcAge(active.birth_date) ?? "?"} ans · {active.gender ?? "—"} ·{" "}
                  {shortLocation(active)}
                </p>
                <p className="text-xs opacity-50 mt-1">
                  Soumis le {format(new Date(active.updated_at), "dd/MM/yyyy 'à' HH:mm")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRejectOpen(true)}
                  className="h-10 px-4 rounded-md font-semibold text-sm"
                  style={{ background: RED, color: "#fff" }}
                >
                  REJETER
                </button>
                <button
                  onClick={handleApprove}
                  className="h-10 px-4 rounded-md font-semibold text-sm"
                  style={{ background: GREEN, color: "#fff" }}
                >
                  APPROUVER
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MediaTile title="Photo d'identité" media={photo} />
              <MediaTile title="Vidéo de profil" media={video} />
            </div>

            <div
              className="mt-6 p-4 rounded-md text-sm"
              style={{ background: NAVY, border: `1px solid ${BORDER}` }}
            >
              <div className="opacity-60 text-xs uppercase tracking-wider mb-2">Métadonnées</div>
              <div className="grid grid-cols-2 gap-2">
                <Meta label="Étape" value={deriveTunnelStep(active)} />
                <Meta label="Statut" value={active.account_status ?? "—"} />
                <Meta label="Email" value={active.email} />
                <Meta label="Région" value={active.region_name ?? "—"} />
              </div>
            </div>
          </>
        )}
      </div>

      {rejectOpen && active && (
        <RejectModal
          user={active}
          onClose={() => setRejectOpen(false)}
          onDone={() => {
            setRejectOpen(false);
            reload();
          }}
        />
      )}
    </section>
  );
}

function MediaTile({ title, media }: { title: string; media?: Media }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!media) return;
      // Try public URL first; fall back to signed URL
      try {
        const path = media.file_path;
        const seg = path.split("/");
        const bucket = seg[0];
        const rest = seg.slice(1).join("/");
        const { data } = await adminSupabase.storage.from(bucket).createSignedUrl(rest, 3600);
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      } catch {
        /* ignored */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [media]);

  return (
    <div
      className="rounded-md overflow-hidden border"
      style={{ borderColor: BORDER, background: NAVY }}
    >
      <div className="px-3 py-2 text-xs uppercase tracking-wider opacity-70 border-b" style={{ borderColor: BORDER }}>
        {title}
      </div>
      <div className="aspect-video flex items-center justify-center">
        {!media ? (
          <span className="opacity-40 text-sm">Non fourni</span>
        ) : url ? (
          media.media_type.includes("video") ? (
            <video src={url} controls className="w-full h-full object-contain" />
          ) : (
            <img src={url} alt={title} className="w-full h-full object-contain" />
          )
        ) : (
          <span className="opacity-50 text-xs">Chargement du média…</span>
        )}
      </div>
      {media && (
        <div className="px-3 py-2 text-[11px] opacity-50 border-t truncate" style={{ borderColor: BORDER }}>
          {media.file_path}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider opacity-50">{label}</div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );
}

function RejectModal({
  user,
  onClose,
  onDone,
}: {
  user: Pending;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState<string>(REJECTION_REASONS[0].value);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await supabase.functions.invoke("admin-moderate-user", {
        body: {
          action: "reject_media",
          user_id: user.id,
          reason,
          custom_text: text,
        },
      });
      toast.success("Profil rejeté. Email d'instruction envoyé au membre.");
      onDone();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className="w-full max-w-lg rounded-xl border shadow-2xl"
        style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      >
        <header className="p-5 border-b" style={{ borderColor: BORDER }}>
          <h3 className="text-lg font-semibold">Motif de Rejet</h3>
          <p className="text-xs opacity-60 mt-1">
            {`${user.first_name} ${user.last_name}`.trim() || user.email}
          </p>
        </header>

        <div className="p-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider opacity-70">Motif</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md border text-base"
              style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider opacity-70">
              Instruction additionnelle du Concierge
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Indications précises pour aider le membre à corriger…"
              className="mt-1 w-full px-3 py-2 rounded-md border text-sm resize-none"
              style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
            />
          </label>
        </div>

        <footer className="p-5 border-t flex justify-end gap-2" style={{ borderColor: BORDER }}>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-md text-sm border"
            style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="h-10 px-4 rounded-md font-semibold text-sm disabled:opacity-40"
            style={{ background: RED, color: "#fff" }}
          >
            {submitting ? "Envoi…" : "Confirmer le rejet"}
          </button>
        </footer>
      </div>
    </div>
  );
}
