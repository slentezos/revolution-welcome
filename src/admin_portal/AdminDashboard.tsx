import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

type Section = "members" | "overview";

const NAVY = "#1B2333";
const NAVY_LIGHT = "#2A3447";
const GOLD = "#C9A961";

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("admin-list-users");
        if (error) throw error;
        setUsers(data?.users ?? []);
      } catch (e: any) {
        setError(e.message ?? "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q)
    );
  }, [users, search]);

  const exportCsv = () => {
    const header = ["Email", "Téléphone", "Prénom", "Nom", "Date d'inscription"];
    const rows = filtered.map((u) => [
      u.email,
      u.phone,
      u.first_name,
      u.last_name,
      new Date(u.created_at).toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const last30 = users.filter(
    (u) => Date.now() - new Date(u.created_at).getTime() < 30 * 24 * 3600 * 1000
  ).length;

  return (
    <div
      className="min-h-screen flex font-sans text-sm"
      style={{ background: "#0F1420", color: "#E5E7EB", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 flex flex-col p-5 border-r"
        style={{ background: NAVY, borderColor: NAVY_LIGHT }}
      >
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest opacity-60">Kalimera</div>
          <div className="text-lg font-semibold" style={{ color: GOLD }}>
            Admin Portal
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { id: "overview", label: "Vue d'ensemble" },
            { id: "members", label: "Matrice des membres" },
          ].map((it) => (
            <button
              key={it.id}
              onClick={() => setSection(it.id as Section)}
              className="text-left px-3 py-2 rounded-md transition-colors"
              style={{
                background: section === it.id ? NAVY_LIGHT : "transparent",
                color: section === it.id ? GOLD : "#CBD5E1",
              }}
            >
              {it.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto text-xs opacity-50">v1.0 · Internal</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {/* KPI Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "#F8FAFC" }}>
            {section === "overview" ? "Vue d'ensemble" : "Matrice des membres"}
          </h1>
          <p className="text-sm opacity-60">Tableau de bord administratif Kalimera</p>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Kpi label="Utilisateurs inscrits" value={loading ? "—" : String(users.length)} />
          <Kpi label="Inscrits (30 derniers jours)" value={loading ? "—" : String(last30)} />
          <Kpi
            label="Avec téléphone"
            value={loading ? "—" : String(users.filter((u) => u.phone).length)}
          />
        </div>

        {section === "members" && (
          <section
            className="rounded-lg border overflow-hidden"
            style={{ background: NAVY, borderColor: NAVY_LIGHT }}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: NAVY_LIGHT }}>
              <input
                type="text"
                placeholder="Rechercher email, téléphone, nom…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 max-w-md px-3 py-2 rounded-md border outline-none"
                style={{ background: "#0F1420", borderColor: NAVY_LIGHT, color: "#E5E7EB" }}
              />
              <button
                onClick={exportCsv}
                disabled={loading || filtered.length === 0}
                className="ml-4 px-4 py-2 rounded-md font-medium transition-opacity disabled:opacity-40"
                style={{ background: GOLD, color: NAVY }}
              >
                Export CSV
              </button>
            </div>

            {error && (
              <div className="p-4 text-sm" style={{ color: "#F87171" }}>
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: NAVY_LIGHT }}>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider opacity-70">Email</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider opacity-70">Téléphone</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider opacity-70">Nom</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider opacity-70">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center opacity-60">
                        Chargement…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center opacity-60">
                        Aucun membre.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="border-t" style={{ borderColor: NAVY_LIGHT }}>
                        <td className="px-4 py-3">{u.email || <span className="opacity-40">—</span>}</td>
                        <td className="px-4 py-3">{u.phone || <span className="opacity-40">—</span>}</td>
                        <td className="px-4 py-3">
                          {(u.first_name || u.last_name)
                            ? `${u.first_name} ${u.last_name}`.trim()
                            : <span className="opacity-40">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(u.created_at).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "overview" && (
          <section
            className="rounded-lg border p-6"
            style={{ background: NAVY, borderColor: NAVY_LIGHT }}
          >
            <p className="opacity-70">
              Sélectionnez « Matrice des membres » pour consulter et exporter la liste des utilisateurs inscrits.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "#1B2333", borderColor: "#2A3447" }}
    >
      <div className="text-xs uppercase tracking-wider opacity-60 mb-2">{label}</div>
      <div className="text-3xl font-semibold" style={{ color: "#C9A961" }}>
        {value}
      </div>
    </div>
  );
}
