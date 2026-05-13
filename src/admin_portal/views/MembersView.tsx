import { useEffect, useMemo, useState } from "react";
import { adminSupabase } from "../lib/supabase";
import { formatDateTimeFr, formatIsoForCsv } from "../lib/dates";

type AdminUser = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

const SURFACE = "#0F1828";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";
const NAVY = "#0E1626";

export function MembersView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await adminSupabase.functions.invoke("admin-list-users");
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
        u.last_name.toLowerCase().includes(q),
    );
  }, [users, search]);

  const exportCsv = () => {
    const header = ["Email", "Téléphone", "Prénom", "Nom", "Date d'inscription"];
    const rows = filtered.map((u) => [
      u.email,
      u.phone,
      u.first_name,
      u.last_name,
      formatIsoForCsv(u.created_at),
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

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div
        className="flex items-center justify-between gap-4 p-5 border-b"
        style={{ borderColor: BORDER }}
      >
        <input
          type="text"
          placeholder="Rechercher email, téléphone, nom…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md h-11 px-4 rounded-md border outline-none text-base focus:border-[#C9A961] transition-colors"
          style={{ background: NAVY, borderColor: BORDER, color: "#E5E7EB" }}
        />
        <button
          onClick={exportCsv}
          disabled={loading || filtered.length === 0}
          className="h-11 px-5 rounded-md font-semibold text-base transition-opacity disabled:opacity-40 hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className="px-5 py-3 text-base" style={{ color: "#F87171" }}>
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "#172238" }}>
              <Th>Email</Th>
              <Th>Téléphone</Th>
              <Th>Nom</Th>
              <Th>Date d'inscription</Th>
            </tr>
          </thead>
          <tbody className="text-xl">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center opacity-60 text-base">
                  Chargement…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center opacity-60 text-base">
                  Aucun membre.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: BORDER }}
                >
                  <Td>{u.email || <Dash />}</Td>
                  <Td>{u.phone || <Dash />}</Td>
                  <Td>
                    {u.first_name || u.last_name ? (
                      `${u.first_name} ${u.last_name}`.trim()
                    ) : (
                      <Dash />
                    )}
                  </Td>
                  <Td>{formatDateTimeFr(u.created_at)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-base font-medium uppercase tracking-wider opacity-70">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-middle">{children}</td>;
}
function Dash() {
  return <span className="opacity-40">—</span>;
}
