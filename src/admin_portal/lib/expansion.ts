/**
 * Expansion module — pure data helpers (no React).
 * Aggregates raw waitlist_leads + profiles into a strategic regional map.
 */

export type Lead = {
  id: string;
  email: string;
  phone: string | null;
  postal_code: string;
  city_name: string;
  region_name: string;
  status: string;
  created_at: string;
};

export type ProfileLite = {
  user_id: string;
  gender: string | null;
  postal_code: string | null;
};

/** Hardcoded expansion targets. Postal code prefix → zone. */
export const TARGET_ZONES: { id: string; label: string; prefix: string; threshold: number }[] = [
  { id: "lyon", label: "Lyon", prefix: "69", threshold: 1000 },
  { id: "bordeaux", label: "Bordeaux", prefix: "33", threshold: 1000 },
  { id: "nice", label: "Nice", prefix: "06", threshold: 1000 },
  { id: "lille", label: "Lille", prefix: "59", threshold: 1000 },
  { id: "marseille", label: "Marseille", prefix: "13", threshold: 1000 },
  { id: "toulouse", label: "Toulouse", prefix: "31", threshold: 1000 },
];

/** Acquisition sources (mocked in absence of a server-tracked field). */
export const ACQUISITION_SOURCES = ["Meta", "Google", "Organique", "Parrainage"] as const;
export type AcquisitionSource = (typeof ACQUISITION_SOURCES)[number];

/** Deterministic source derivation so the same lead always shows the same source. */
export function deriveSource(id: string): AcquisitionSource {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ACQUISITION_SOURCES[h % ACQUISITION_SOURCES.length];
}

export function deptOf(postalCode: string | null | undefined): string {
  if (!postalCode) return "??";
  const cp = postalCode.trim();
  if (cp.length < 2) return "??";
  return cp.slice(0, 2);
}

/** Liquidity tiers based on lead density. */
export type LiquidityTier = "ouvert" | "amorçage" | "froid" | "saturé";
export function liquidityTier(leads: number, threshold = 1000): LiquidityTier {
  const ratio = leads / threshold;
  if (ratio >= 1) return "ouvert";
  if (ratio >= 0.5) return "amorçage";
  if (ratio >= 0.1) return "froid";
  return "froid";
}

export type ZoneRow = {
  dept: string;
  topCity: string;
  region: string;
  leads: number;
  males: number;
  females: number;
  ratioM: number; // 0..1
  ratioF: number; // 0..1
  imbalanced: boolean;
  liquidity: LiquidityTier;
  potentialMrr: number; // €/month at full conversion
  postalBreakdown: { postal_code: string; city: string; leads: number }[];
};

const ARPU_EUR = 39; // average revenue per user per month
const CONVERSION = 0.18; // hypothesis: 18% lead → paid conversion
const TARGET_THRESHOLD = 1000;

export function buildZoneRows(leads: Lead[], profiles: ProfileLite[]): ZoneRow[] {
  // Profiles per dept → gender ratio
  const genderByDept = new Map<string, { m: number; f: number }>();
  for (const p of profiles) {
    const d = deptOf(p.postal_code);
    if (d === "??") continue;
    const g = (p.gender ?? "").toLowerCase();
    if (g !== "homme" && g !== "femme" && g !== "male" && g !== "female") continue;
    const cur = genderByDept.get(d) ?? { m: 0, f: 0 };
    if (g.startsWith("h") || g === "male") cur.m += 1;
    else cur.f += 1;
    genderByDept.set(d, cur);
  }

  // Leads grouped by dept → counts + city/postal breakdown
  type Bucket = {
    dept: string;
    region: string;
    leads: number;
    cities: Map<string, number>;
    postals: Map<string, { city: string; leads: number }>;
  };
  const byDept = new Map<string, Bucket>();
  for (const l of leads) {
    const d = deptOf(l.postal_code);
    if (d === "??") continue;
    let b = byDept.get(d);
    if (!b) {
      b = {
        dept: d,
        region: l.region_name ?? "",
        leads: 0,
        cities: new Map(),
        postals: new Map(),
      };
      byDept.set(d, b);
    }
    b.leads += 1;
    b.cities.set(l.city_name, (b.cities.get(l.city_name) ?? 0) + 1);
    const pk = l.postal_code;
    const pb = b.postals.get(pk) ?? { city: l.city_name, leads: 0 };
    pb.leads += 1;
    b.postals.set(pk, pb);
  }

  const rows: ZoneRow[] = [];
  for (const b of byDept.values()) {
    const g = genderByDept.get(b.dept) ?? { m: 0, f: 0 };
    const totalG = g.m + g.f;
    const ratioM = totalG ? g.m / totalG : 0.5;
    const ratioF = totalG ? g.f / totalG : 0.5;
    const imbalanced = totalG > 0 && (ratioM > 0.65 || ratioF > 0.65);
    const topCity =
      [...b.cities.entries()].sort((a, z) => z[1] - a[1])[0]?.[0] ?? "—";
    const postalBreakdown = [...b.postals.entries()]
      .map(([postal_code, v]) => ({ postal_code, city: v.city, leads: v.leads }))
      .sort((a, z) => z.leads - a.leads);

    rows.push({
      dept: b.dept,
      topCity,
      region: b.region,
      leads: b.leads,
      males: g.m,
      females: g.f,
      ratioM,
      ratioF,
      imbalanced,
      liquidity: liquidityTier(b.leads, TARGET_THRESHOLD),
      potentialMrr: Math.round(b.leads * CONVERSION * ARPU_EUR),
      postalBreakdown,
    });
  }
  return rows.sort((a, z) => z.leads - a.leads);
}

export function leadsForPrefix(leads: Lead[], prefix: string): Lead[] {
  return leads.filter((l) => (l.postal_code ?? "").startsWith(prefix));
}
