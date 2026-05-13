import { useEffect, useState } from "react";
import { adminSupabase } from "../lib/supabase";

const SURFACE = "#0F1828";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";

export function CommandCenterView() {
  const [total, setTotal] = useState<number | null>(null);
  const [last30, setLast30] = useState<number | null>(null);
  const [withPhone, setWithPhone] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await adminSupabase.functions.invoke("admin-list-users");
      const users: any[] = data?.users ?? [];
      setTotal(users.length);
      setLast30(
        users.filter(
          (u) => Date.now() - new Date(u.created_at).getTime() < 30 * 24 * 3600 * 1000,
        ).length,
      );
      setWithPhone(users.filter((u) => u.phone).length);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Kpi label="Utilisateurs inscrits" value={total} />
        <Kpi label="Inscrits (30 derniers jours)" value={last30} />
        <Kpi label="Avec téléphone vérifié" value={withPhone} />
      </div>
      <section
        className="rounded-xl border p-7"
        style={{ background: SURFACE, borderColor: BORDER }}
      >
        <h2 className="text-xl font-semibold mb-2" style={{ color: GOLD }}>
          Bienvenue dans le Command Center
        </h2>
        <p className="text-base opacity-70 leading-relaxed max-w-2xl">
          Naviguez via la barre latérale ou pressez <kbd className="px-1.5 py-0.5 rounded border text-base" style={{ borderColor: BORDER }}>⌘K</kbd> pour ouvrir la palette de commandes et accéder rapidement à toutes les sections du portail.
        </p>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number | null }) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="text-base uppercase tracking-wider opacity-60 mb-3">{label}</div>
      <div className="text-4xl font-semibold tabular-nums" style={{ color: GOLD }}>
        {value === null ? "—" : value.toLocaleString("fr-FR")}
      </div>
    </div>
  );
}
