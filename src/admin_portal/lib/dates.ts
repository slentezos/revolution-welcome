import { format, formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/** Standardized French date formatting helpers for the Admin Portal. */

const safeParse = (value: string | Date): Date =>
  value instanceof Date ? value : parseISO(value);

/** Example: "12 mai 2026" */
export const formatDateFr = (value: string | Date): string =>
  format(safeParse(value), "d MMMM yyyy", { locale: fr });

/** Example: "12/05/2026 14:32" */
export const formatDateTimeFr = (value: string | Date): string =>
  format(safeParse(value), "dd/MM/yyyy HH:mm", { locale: fr });

/** Example: "il y a 3 jours" */
export const formatRelativeFr = (value: string | Date): string =>
  formatDistanceToNow(safeParse(value), { locale: fr, addSuffix: true });

/** Sortable ISO format for CSV exports. */
export const formatIsoForCsv = (value: string | Date): string =>
  safeParse(value).toISOString();
