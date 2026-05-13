import { LayoutDashboard, Users, ShieldAlert, Globe2, Wallet } from "lucide-react";

/**
 * Single source of truth for Admin Portal navigation.
 * Sections are addressed via the `?section=` search param so that
 * navigation works without modifying the global router in App.tsx.
 */
export const ADMIN_SECTIONS = [
  {
    id: "command-center",
    label: "Command Center",
    description: "Vue d'ensemble stratégique",
    icon: LayoutDashboard,
  },
  {
    id: "members",
    label: "Membres",
    description: "Matrice des inscrits",
    icon: Users,
  },
  {
    id: "moderation",
    label: "Modération",
    description: "Signalements & qualité",
    icon: ShieldAlert,
  },
  {
    id: "expansion",
    label: "Expansion",
    description: "Liste d'attente & marchés",
    icon: Globe2,
  },
  {
    id: "finops",
    label: "FinOps",
    description: "Revenus & abonnements",
    icon: Wallet,
  },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];

export const DEFAULT_SECTION: AdminSectionId = "command-center";

export const isAdminSectionId = (value: string | null | undefined): value is AdminSectionId =>
  !!value && ADMIN_SECTIONS.some((s) => s.id === value);
