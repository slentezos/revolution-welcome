import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const NAVY = "var(--ap-bg)";
const GREEN = "#16A34A";
const RED = "#DC2626";
const TEXT = "var(--ap-text)";

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

/** Minutes since `iso`. */
function minutesSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
}

function SlaBadge({ since }: { since: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  void now;
  const mins = minutesSince(since);
  const breached = mins >= 60;
  const label =
    mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, "0")}`;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold"
      style={{
        background: breached ? "rgba(201,169,97,0.15)" : "rgba(148,163,184,0.12)",
        color: breached ? GOLD : "#94A3B8",
        border: `1px solid ${breached ? GOLD : BORDER}`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: breached ? GOLD : "#94A3B8" }}
      />
      SLA {label}
    </span>
  );
}

export function ModerationView() {
  const [users, setUsers] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Pending | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const reload = useCallback(async () => {
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
      queue.sort((a, b) => +new Date(a.updated_at) - +new Date(b.updated_at));
      setUsers(queue);
      setActive((prev) => {
        if (!prev) return queue[0] ?? null;
        return queue.find((u) => u.id === prev.id) ?? queue[0] ?? null;
      });
    } catch (e: any) {
      toast.error(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const photo = useMemo(
    () => active?.media.find((m) => m.media_type.includes("photo") || m.media_type.includes("image")),
    [active]
  );
  const video = useMemo(
    () => active?.media.find((m) => m.media_type.includes("video")),
    [active]
  );

  const handleApprove = useCallback(async () => {
    if (!active) return;
    try {
      await supabase.functions.invoke("admin-moderate-user", {
        body: { action: "approve_media", user_id: active.id },
      });
      toast.success("Médias approuvés. Étape 'quiz_50_ready' débloquée.");
      reload();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  }, [active, reload]);

  // Keyboard shortcuts: A approve, R reject (ignored when typing or modal open)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (rejectOpen || !active) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleApprove();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        setRejectOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, rejectOpen, handleApprove]);

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER, color: TEXT, minHeight: 500 }}
    >
      <aside className="border-r" style={{ borderColor: BORDER }}>
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-semibold text-xl">File de Modération</h3>
          <p className="opacity-60 mt-1 text-xl">
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate text-lg">
                      {`${u.first_name} ${u.last_name}`.trim() || u.email}
                    </span>
                    <SlaBadge since={u.updated_at} />
                  </div>
                  <div className="opacity-60 mt-0.5 text-lg">
                    {calcAge(u.birth_date) ?? "?"} ans · {shortLocation(u)}
                  </div>
                  <div className="opacity-50 mt-1 text-lg">
                    Soumis {formatRelativeFr(u.updated_at)}
                  </div>
                </button>
              </li>
            );
          })}
          {!loading && users.length === 0 && (
            <li className="px-4 py-8 text-center opacity-60 text-xl">
              File vide. Tous les profils sont traités.
            </li>
          )}
        </ul>
      </aside>

      <div className="p-6">
        {!active ? (
          <p className="opacity-60 text-xl">Sélectionnez un profil à modérer.</p>
        ) : (
          <>
            <header className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">
                    {`${active.first_name} ${active.last_name}`.trim() || active.email}
                  </h3>
                  <SlaBadge since={active.updated_at} />
                </div>
                <p className="opacity-60 mt-1 text-lg">
                  {calcAge(active.birth_date) ?? "?"} ans · {active.gender ?? "—"} ·{" "}
                  {shortLocation(active)}
                </p>
                <p className="opacity-50 mt-1 text-lg">
                  Soumis le {format(new Date(active.updated_at), "dd/MM/yyyy 'à' HH:mm")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRejectOpen(true)}
                  className="h-10 px-4 rounded-md font-semibold text-sm"
                  style={{ background: RED, color: "#fff" }}
                  title="Raccourci : R"
                >
                  REJETER <kbd className="ml-1.5 opacity-70 text-[10px]">R</kbd>
                </button>
                <button
                  onClick={handleApprove}
                  className="h-10 px-4 rounded-md font-semibold text-sm"
                  style={{ background: GREEN, color: "#fff" }}
                  title="Raccourci : A"
                >
                  APPROUVER <kbd className="ml-1.5 opacity-70 text-[10px]">A</kbd>
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
              <div className="opacity-60 uppercase tracking-wider mb-2 text-lg">Métadonnées</div>
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
      <div
        className="px-3 py-2 uppercase tracking-wider opacity-70 border-b bg-slate-50 text-lg"
        style={{ borderColor: BORDER }}
      >
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
        <div
          className="px-3 py-2 text-[11px] opacity-50 border-t truncate"
          style={{ borderColor: BORDER }}
        >
          {media.file_path}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider opacity-50 text-lg">{label}</div>
      <div className="font-medium text-lg">{value || "—"}</div>
    </div>
  );
}

const rejectSchema = z.object({
  reason: z.enum([
    REJECTION_REASONS[0].value,
    ...REJECTION_REASONS.slice(1).map((r) => r.value),
  ] as [string, ...string[]]),
  custom_text: z
    .string()
    .trim()
    .min(20, "Veuillez fournir au moins 20 caractères d'instructions claires.")
    .max(1000, "1000 caractères maximum."),
});
type RejectFormValues = z.infer<typeof rejectSchema>;

function RejectModal({
  user,
  onClose,
  onDone,
}: {
  user: Pending;
  onClose: () => void;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: REJECTION_REASONS[0].value, custom_text: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await supabase.functions.invoke("admin-moderate-user", {
        body: {
          action: "reject_media",
          user_id: user.id,
          reason: values.reason,
          custom_text: values.custom_text,
        },
      });
      toast.success("Profil rejeté. Email d'instruction envoyé au membre.");
      onDone();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-xl border shadow-2xl"
        style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      >
        <header className="p-5 border-b" style={{ borderColor: BORDER }}>
          <h3 className="text-lg font-semibold">Motif de Rejet</h3>
          <p className="opacity-60 mt-1 text-xl">
            {`${user.first_name} ${user.last_name}`.trim() || user.email}
          </p>
        </header>

        <div className="p-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider opacity-70">Motif</span>
            <select
              {...register("reason")}
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
              Instructions du Concierge
            </span>
            <textarea
              {...register("custom_text")}
              rows={4}
              maxLength={1000}
              placeholder="Indications précises pour aider le membre à corriger…"
              className="mt-1 w-full px-3 py-2 rounded-md border text-sm resize-none"
              style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
            />
            {errors.custom_text && (
              <span className="block mt-1 text-xs" style={{ color: "#F87171" }}>
                {errors.custom_text.message}
              </span>
            )}
          </label>
        </div>

        <footer
          className="p-5 border-t flex justify-end gap-2"
          style={{ borderColor: BORDER }}
        >
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-md text-sm border"
            style={{ borderColor: BORDER, color: TEXT, background: NAVY }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-4 rounded-md font-semibold text-sm disabled:opacity-40"
            style={{ background: RED, color: "#fff" }}
          >
            {isSubmitting ? "Envoi…" : "Confirmer le rejet"}
          </button>
        </footer>
      </form>
    </div>
  );
}
