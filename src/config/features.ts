/**
 * Feature flags — toggles for premium/pro features.
 *
 * Each flag is intentionally simple so it can later be wired to a user's
 * membership tier (e.g. via a `useMembership()` hook) without changing
 * call sites. For now, flip the boolean to enable/disable globally.
 */

export type MembershipTier = "free" | "pro";

export const FEATURES = {
  /**
   * Read receipts (WhatsApp-style ✓✓ arrows) on messages I sent.
   * Will become a Pro-only feature in the near future.
   */
  readReceipts: true as boolean,
} as const;

/**
 * Returns whether the read-receipts feature is currently enabled
 * for the given membership tier. Centralised so we only have one
 * place to update when we gate this behind Pro.
 */
export function canUseReadReceipts(tier: MembershipTier = "free"): boolean {
  if (!FEATURES.readReceipts) return false;
  // TODO: when launching Pro, change to: return tier === "pro";
  return true;
}
