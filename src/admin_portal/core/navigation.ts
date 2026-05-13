import {
  Home,
  Users,
  Shield,
  Map,
  Landmark,
  Calendar,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for Admin Portal navigation.
 * Sections are addressed via the `?section=` search param.
 */
export type AdminSection = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Render a separator above this item in the sidebar. */
  separatorBefore?: boolean;
};

export const ADMIN_SECTIONS = [
  {
    id: "command-center",
    label: "Command Center",
    description: "Vue d'ensemble stratégique",
    icon: Home,
  },
  {
    id: "members",
    label: "Matrice des Membres",
    description: "Annuaire & cycle de vie",
    icon: Users,
  },
  {
    id: "moderation",
    label: "Hub de Modération",
    description: "Qualité & signalements",
    icon: Shield,
  },
  {
    id: "expansion",
    label: "Radar d'Expansion",
    description: "Liste d'attente & marchés",
    icon: Map,
  },
  {
    id: "finops",
    label: "FinOps & Abonnements",
    description: "Trésorerie & rétention",
    icon: Landmark,
  },
  {
    id: "events",
    label: "Gestion des Événements",
    description: "Soirées, dîners & expériences",
    icon: Calendar,
  },
  {
    id: "cms",
    label: "CMS & Blog",
    description: "Contenus éditoriaux",
    icon: FileText,
  },
  {
    id: "settings",
    label: "Paramètres",
    description: "Configuration de la suite",
    icon: Settings,
    separatorBefore: true,
  },
] as const satisfies readonly AdminSection[];

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];

export const DEFAULT_SECTION: AdminSectionId = "command-center";

export const isAdminSectionId = (
  value: string | null | undefined,
): value is AdminSectionId =>
  !!value && ADMIN_SECTIONS.some((s) => s.id === value);
