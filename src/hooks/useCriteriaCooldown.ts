import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CooldownState {
  loading: boolean;
  isCompleted: boolean; // Has user completed onboarding?
  isInGracePeriod: boolean; // Within 24h of completing onboarding
  isLocked: boolean; // Cooldown active (30 days not elapsed)
  daysRemaining: number; // Days until next edit allowed
  canEdit: boolean; // Can the user edit right now?
}

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function useCriteriaCooldown(profileId: string | null) {
  const [state, setState] = useState<CooldownState>({
    loading: true,
    isCompleted: false,
    isInGracePeriod: false,
    isLocked: false,
    daysRemaining: 0,
    canEdit: true,
  });

  useEffect(() => {
    if (!profileId) return;

    const fetchCooldownState = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_step, onboarding_completed_at, last_criteria_update_at")
        .eq("id", profileId)
        .maybeSingle();

      if (!profile) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const isCompleted = profile.onboarding_step === "completed";
      if (!isCompleted) {
        setState({ loading: false, isCompleted: false, isInGracePeriod: false, isLocked: false, daysRemaining: 0, canEdit: true });
        return;
      }

      const now = Date.now();
      const completedAt = profile.onboarding_completed_at ? new Date(profile.onboarding_completed_at).getTime() : null;
      const lastUpdate = profile.last_criteria_update_at ? new Date(profile.last_criteria_update_at).getTime() : null;

      // Grace period: 24h after onboarding completion
      const isInGracePeriod = completedAt ? (now - completedAt) < GRACE_PERIOD_MS : false;

      if (isInGracePeriod) {
        setState({ loading: false, isCompleted: true, isInGracePeriod: true, isLocked: false, daysRemaining: 0, canEdit: true });
        return;
      }

      // After grace period, check 30-day cooldown from last update
      const referenceTime = lastUpdate || completedAt || now;
      const elapsed = now - referenceTime;
      const isLocked = elapsed < COOLDOWN_MS;
      const daysRemaining = isLocked ? Math.ceil((COOLDOWN_MS - elapsed) / (24 * 60 * 60 * 1000)) : 0;

      setState({
        loading: false,
        isCompleted: true,
        isInGracePeriod: false,
        isLocked,
        daysRemaining,
        canEdit: !isLocked,
      });
    };

    fetchCooldownState();
  }, [profileId]);

  const recordCriteriaUpdate = useCallback(async () => {
    if (!profileId) return;
    await supabase
      .from("profiles")
      .update({ last_criteria_update_at: new Date().toISOString() } as any)
      .eq("id", profileId);
  }, [profileId]);

  return { ...state, recordCriteriaUpdate };
}
