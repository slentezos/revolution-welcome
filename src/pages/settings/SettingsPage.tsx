import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole } from "../core/useAdminRole";
import { toast } from "sonner";

const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const NAVY = "var(--ap-bg)";
const TEXT = "var(--ap-text)";

type TeamMember = {
  id: string;
  email: string;
  role: string;
  roles: string[];
  last_sign_in_at: string | null;
  created_at: string;
};

type Invite = {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

const ROLE_LABEL: Record<string, string> = {
  superadmin: "SuperAdmin",
  admin: "Administrateur",
  moderator: "Modérateur",
};

const ROLE_TONE: Record<string, { bg: string; fg: string }> = {
  superadmin: { bg: "rgba(201,169,97,0.15)", fg: "#9A7B2E" },
  admin: { bg: "rgba(22,163,74,0.12)", fg: "#16A34A" },
  moderator: { bg: "rgba(59,130,246,0.12)", fg: "#2563EB" },
};

export function SettingsPage() {
  const { isSuperAdmin, loading } = useAdminRole();
  const [tab, setTab] = useState<"team">("team");

  if (loading) {
    return <div className="opacity-60 text-xl">Chargement…</div>;
  }
  if (!isSuperAdmin) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{ background: SURFACE, borderColor: BORDER }}
      >
        <h2 className="text-2xl font-semibold" style={{ color: GOLD }}>
          Accès restreint
        </h2>
        <p className="mt-2 opacity-70 text-lg">
          Seul un SuperAdmin peut accéder à la configuration de l'équipe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-md border bg-slate-50 w-fit"
        style={{ borderColor: BORDER }}
      >
        <button
          onClick={() => setTab("team")}
          className="h-12 px-4 rounded font-medium text-lg transition-all"
          style={{
            background: tab === "team" ? GOLD : "transparent",
            color: tab === "team" ? NAVY : TEXT,
          }}
        >
          Équipe & Accès
        </button>
      </div>

      {tab === "team" && <TeamAccessTab />}
    </div>
  );
}

function TeamAccessTab() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list-team");
      if (error) throw error;
      setTeam(data?.team ?? []);
      setInvites(data?.invites ?? []);
    } catch (e: any) {
      setError(e.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: BORDER }}
      >
        <div>
          <h3 className="text-xl font-semibold">Membres de l'équipe</h3>
          <p className="opacity-60 text-base mt-1">
            Gérez les accès SuperAdmin, Admin et Modérateur.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="h-14 px-5 rounded-md font-semibold text-lg hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}
        >
          + Inviter un collaborateur
        </button>
      </div>

      {error && (
        <div className="px-5 py-3 text-base" style={{ color: "#DC2626" }}>
          {error}
        </div>
      )}

      <div
        className="grid items-center px-4 py-3 font-medium uppercase tracking-wider opacity-70 bg-slate-50 text-base"
        style={{
          borderBottom: `1px solid ${BORDER}`,
          gridTemplateColumns: "minmax(260px,2fr) 160px minmax(180px,1fr) 120px",
        }}
      >
        <div>Email</div>
        <div>Rôle</div>
        <div>Dernière connexion</div>
        <div className="text-right">Statut</div>
      </div>

      {loading ? (
        <div className="px-5 py-12 text-center opacity-60 text-xl">Chargement…</div>
      ) : team.length === 0 ? (
        <div className="px-5 py-12 text-center opacity-60 text-xl">Aucun collaborateur.</div>
      ) : (
        team.map((m) => {
          const tone = ROLE_TONE[m.role] ?? ROLE_TONE.moderator;
          return (
            <div
              key={m.id}
              className="grid items-center px-4 py-4 border-t hover:bg-black/[0.02]"
              style={{
                borderColor: BORDER,
                gridTemplateColumns: "minmax(260px,2fr) 160px minmax(180px,1fr) 120px",
                minHeight: 64,
              }}
            >
              <div className="font-medium text-lg truncate">{m.email}</div>
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-md font-semibold text-base"
                  style={{ background: tone.bg, color: tone.fg }}
                >
                  {ROLE_LABEL[m.role] ?? m.role}
                </span>
              </div>
              <div className="text-lg opacity-80">
                {m.last_sign_in_at
                  ? format(new Date(m.last_sign_in_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </div>
              <div className="text-right">
                <span
                  className="inline-flex items-center gap-1.5 text-base font-medium"
                  style={{ color: "#16A34A" }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: "#16A34A" }}
                  />
                  Actif
                </span>
              </div>
            </div>
          );
        })
      )}

      {invites.length > 0 && (
        <div className="border-t p-4 space-y-2" style={{ borderColor: BORDER }}>
          <h4 className="font-semibold text-lg" style={{ color: GOLD }}>
            Invitations en attente
          </h4>
          {invites
            .filter((i) => !i.accepted_at)
            .map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-3 rounded border text-base"
                style={{ borderColor: BORDER }}
              >
                <span className="font-medium">{i.email}</span>
                <span className="opacity-60">
                  {ROLE_LABEL[i.role] ?? i.role} · expire le {format(new Date(i.expires_at), "dd/MM/yyyy")}
                </span>
              </div>
            ))}
        </div>
      )}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSuccess={() => {
            setShowInvite(false);
            reload();
          }}
        />
      )}
    </section>
  );
}

function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "moderator">("moderator");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.includes("@")) {
      toast.error("Email invalide.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-invite-collaborator", {
        body: { email, role, origin: window.location.origin },
      });
      if (error) throw error;
      const url = data?.accept_url as string;
      if (url) {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Invitation créée — lien copié dans le presse-papier.", {
            description: url,
            duration: 10000,
          });
        } catch {
          toast.success("Invitation créée.", { description: url, duration: 10000 });
        }
      } else {
        toast.success("Invitation créée.");
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl border shadow-2xl"
        style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
      >
        <div className="p-5 border-b" style={{ borderColor: BORDER }}>
          <h3 className="text-xl font-semibold">Inviter un collaborateur</h3>
          <p className="opacity-60 text-base mt-1">
            Un lien d'invitation à usage unique sera généré.
          </p>
        </div>
        <div className="p-5 space-y-4">
          <label className="block text-base font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collaborateur@kalimera.fr"
              className="mt-2 w-full h-14 px-3 rounded-md border text-base outline-none"
              style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
            />
          </label>
          <label className="block text-base font-medium">
            Rôle
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "moderator")}
              className="mt-2 w-full h-14 px-3 rounded-md border text-base"
              style={{ background: NAVY, borderColor: BORDER, color: TEXT }}
            >
              <option value="moderator">Modérateur — Membres & Modération uniquement</option>
              <option value="admin">Administrateur — accès opérationnel complet</option>
            </select>
          </label>
        </div>
        <div
          className="flex items-center justify-end gap-2 p-5 border-t"
          style={{ borderColor: BORDER }}
        >
          <button
            onClick={onClose}
            className="h-12 px-4 rounded-md border text-lg"
            style={{ borderColor: BORDER, color: TEXT }}
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="h-12 px-5 rounded-md font-semibold text-lg disabled:opacity-50"
            style={{ background: GOLD, color: NAVY }}
          >
            {submitting ? "Envoi…" : "Envoyer l'invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
