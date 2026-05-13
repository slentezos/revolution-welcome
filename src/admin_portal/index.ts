/** Public surface of the Admin Portal infrastructure. */
export { adminSupabase } from "./lib/supabase";
export { formatDateFr, formatDateTimeFr, formatRelativeFr, formatIsoForCsv } from "./lib/dates";
export { AdminProviders, useAdminContext } from "./core/AdminProviders";
export type { Member, Lead, ProfileRow, WaitlistLeadRow } from "./types";
export { toMember, toLead } from "./types";
