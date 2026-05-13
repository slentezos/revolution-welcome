import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Isolated Supabase client for the Admin Portal.
 *
 * Uses the same project URL + publishable key as the main app, but is
 * instantiated separately so admin sessions / storage keys never collide
 * with the public-facing user session.
 *
 * Fail-fast: throws immediately at module load if required env vars are missing.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!SUPABASE_URL) {
  throw new Error("[admin_portal] VITE_SUPABASE_URL is not defined.");
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("[admin_portal] VITE_SUPABASE_PUBLISHABLE_KEY is not defined.");
}

export const adminSupabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // Isolated storage key so the admin portal never overwrites the
      // public user session living in localStorage under the default key.
      storageKey: "kalimera-admin-auth",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export const ADMIN_SUPABASE_URL = SUPABASE_URL;
export const ADMIN_SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;
