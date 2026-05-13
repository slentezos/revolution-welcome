import { differenceInYears, parseISO } from "date-fns";

/** Master bypass — full visibility on all members. */
export const MASTER_ADMIN_EMAIL = "solentebaptiste@gmail.com";

/**
 * Logical funnel order. Index = position. Used to render the "Étape du Tunnel".
 * Maps server `onboarding_step` values into a stable, human-readable flow.
 */
export const TUNNEL_STEPS = [
  { id: "tutorial", label: "Tutoriel" },
  { id: "payment", label: "Paiement" },
  { id: "quiz_initial", label: "Quiz Initial" },
  { id: "media", label: "Médias" },
  { id: "review", label: "En Revue" },
  { id: "quiz_50", label: "Quiz 50" },
  { id: "quiz_40", label: "Quiz 40" },
  { id: "visible", label: "Visible" },
] as const;

export type TunnelStepId = (typeof TUNNEL_STEPS)[number]["id"];

/** Map raw `onboarding_step` + `account_status` to a canonical tunnel step. */
export function deriveTunnelStep(p: {
  onboarding_step?: string | null;
  account_status?: string | null;
}): TunnelStepId {
  const step = (p.onboarding_step ?? "").toLowerCase();
  const status = (p.account_status ?? "").toLowerCase();

  if (status === "approved" || status === "visible") return "visible";
  if (status === "pending_review" && step.includes("media")) return "review";
  if (step.includes("quiz_40")) return "quiz_40";
  if (step.includes("quiz_50")) return "quiz_50";
  if (step.includes("media")) return "media";
  if (step.includes("quiz")) return "quiz_initial";
  if (step.includes("payment") || step.includes("pricing")) return "payment";
  if (step.includes("tutorial") || step.includes("welcome") || step === "profile") return "tutorial";
  return "tutorial";
}

export function tunnelStepIndex(id: TunnelStepId): number {
  return TUNNEL_STEPS.findIndex((s) => s.id === id);
}

export function tunnelStepLabel(id: TunnelStepId): string {
  return TUNNEL_STEPS.find((s) => s.id === id)?.label ?? id;
}

/** Status financier (display only). */
export function deriveFinancialStatus(p: {
  account_status?: string | null;
  onboarding_step?: string | null;
}): { label: string; tone: "ok" | "warn" | "muted" | "bad" } {
  const status = (p.account_status ?? "").toLowerCase();
  const step = deriveTunnelStep(p);

  if (status === "blocked") return { label: "Bloqué", tone: "bad" };
  if (status === "refunded") return { label: "Remboursé", tone: "warn" };
  if (tunnelStepIndex(step) >= tunnelStepIndex("quiz_initial")) return { label: "Payé", tone: "ok" };
  return { label: "Non payé", tone: "muted" };
}

export function calcAge(birthDate?: string | null): number | null {
  if (!birthDate) return null;
  try {
    return differenceInYears(new Date(), parseISO(birthDate));
  } catch {
    return null;
  }
}

export function shortLocation(p: {
  postal_code?: string | null;
  city_name?: string | null;
}): string {
  const cp = p.postal_code?.trim();
  const dept = cp && cp.length >= 2 ? cp.slice(0, 2) : null;
  const city = p.city_name?.trim();
  if (cp && city) return `${cp} · ${city} (${dept})`;
  if (cp) return `${cp} (${dept})`;
  if (city) return city;
  return "—";
}

/** A member is "stuck" if last activity > 48h on Paiement or Quiz steps. */
export function isStuckOver48h(p: {
  updated_at?: string | null;
  onboarding_step?: string | null;
  account_status?: string | null;
}): boolean {
  if (!p.updated_at) return false;
  const step = deriveTunnelStep(p);
  if (!["payment", "quiz_initial", "quiz_50", "quiz_40"].includes(step)) return false;
  const ageMs = Date.now() - new Date(p.updated_at).getTime();
  return ageMs > 48 * 60 * 60 * 1000;
}

export const REJECTION_REASONS = [
  { value: "blurry_photo", label: "Photo floue" },
  { value: "non_compliant_video", label: "Vidéo non conforme" },
  { value: "incomplete_profile", label: "Profil incomplet" },
  { value: "low_quality", label: "Qualité insuffisante" },
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number]["value"];
