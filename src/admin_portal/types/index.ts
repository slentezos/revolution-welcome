import type { Database } from "@/integrations/supabase/types";

/** Raw row from the `profiles` table. */
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Raw row from the `waitlist_leads` table. */
export type WaitlistLeadRow = Database["public"]["Tables"]["waitlist_leads"]["Row"];

/**
 * A registered Member as displayed in the admin portal.
 * Combines `auth.users` data (email) with the `profiles` row.
 */
export interface Member {
  id: string;
  userId: string;
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  gender: string | null;
  lookingFor: string | null;
  nationality: string | null;
  city: string | null;
  postalCode: string | null;
  region: string | null;
  onboardingStep: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
}

/** A waitlist Lead (pre-registration). */
export interface Lead {
  id: string;
  email: string;
  phone: string | null;
  phonePreference: string | null;
  postalCode: string;
  city: string;
  region: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** Mappers — convert raw DB rows into the strict UI types above. */
export const toMember = (
  row: ProfileRow,
  authUser: { email?: string | null } = {}
): Member => ({
  id: row.id,
  userId: row.user_id,
  email: authUser.email ?? "",
  phone: row.phone,
  firstName: row.first_name,
  lastName: row.last_name,
  birthDate: row.birth_date,
  gender: row.gender,
  lookingFor: row.looking_for,
  nationality: row.nationality,
  city: row.city_name,
  postalCode: row.postal_code,
  region: row.region_name,
  onboardingStep: row.onboarding_step,
  accountStatus: row.account_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const toLead = (row: WaitlistLeadRow): Lead => ({
  id: row.id,
  email: row.email,
  phone: row.phone,
  phonePreference: row.phone_preference,
  postalCode: row.postal_code,
  city: row.city_name,
  region: row.region_name,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
