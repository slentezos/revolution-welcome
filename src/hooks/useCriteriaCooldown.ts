import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CooldownState {
  loading: boolean;
  isCompleted: boolean;
  isInGracePeriod: boolean;
  isLocked: boolean;
  daysRemaining: number;
  canEdit: boolean;
}

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const META_QUESTION_ID = "criteria_cooldown_meta";

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

    const fetch = async () => {
      // Get profile completion status
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_step, updated_at")
        .eq("id", profileId)
        .maybeSingle();

      if (!profile || profile.onboarding_step !== "completed") {
        setState({ loading: false, isCompleted: false, isInGracePeriod: false, isLocked: false, daysRemaining: 0, canEdit: true });
        return;
      }

      // Get cooldown metadata from quiz_responses
      const { data: meta } = await supabase
        .from("quiz_responses")
        .select("answer_value, created_at")
        .eq("profile_id", profileId)
        .eq("question_id", META_QUESTION_ID)
        .maybeSingle();

      const now = Date.now();

      // Parse stored metadata
      let completedAt: number;
      let lastCriteriaUpdate: number | null = null;

      if (meta?.answer_value) {
        try {
          const parsed = JSON.parse(meta.answer_value);
          completedAt = new Date(parsed.onboarding_completed_at).getTime();
          lastCriteriaUpdate = parsed.last_criteria_update_at
            ? new Date(parsed.last_criteria_update_at).getTime()
            : null;
        } catch {
          completedAt = new Date(profile.updated_at).getTime();
        }
      } else {
        // No meta yet — use profile updated_at as fallback
        completedAt = new Date(profile.updated_at).getTime();
      }

      // Grace period: 24h after completion
      const isInGracePeriod = (now - completedAt) < GRACE_PERIOD_MS;
      if (isInGracePeriod) {
        setState({ loading: false, isCompleted: true, isInGracePeriod: true, isLocked: false, daysRemaining: 0, canEdit: true });
        return;
      }

      // After grace: check 30-day cooldown from last update
      const referenceTime = lastCriteriaUpdate || completedAt;
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

    fetch();
  }, [profileId]);

  const recordCriteriaUpdate = useCallback(async () => {
    if (!profileId) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get existing meta
    const { data: existing } = await supabase
      .from("quiz_responses")
      .select("answer_value")
      .eq("profile_id", profileId)
      .eq("question_id", META_QUESTION_ID)
      .maybeSingle();

    const now = new Date().toISOString();
    let metaValue: any = { last_criteria_update_at: now };

    if (existing?.answer_value) {
      try {
        const parsed = JSON.parse(existing.answer_value);
        metaValue = { ...parsed, last_criteria_update_at: now };
      } catch {}
    }

    await supabase.from("quiz_responses").upsert(
      {
        user_id: session.user.id,
        profile_id: profileId,
        question_id: META_QUESTION_ID,
        answer_value: JSON.stringify(metaValue),
      },
      { onConflict: "profile_id,question_id" }
    );

    // Update local state to locked
    setState((prev) => ({
      ...prev,
      isLocked: true,
      canEdit: false,
      daysRemaining: 30,
      isInGracePeriod: false,
    }));
  }, [profileId]);

  const recordOnboardingComplete = useCallback(async () => {
    if (!profileId) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const now = new Date().toISOString();

    await supabase.from("quiz_responses").upsert(
      {
        user_id: session.user.id,
        profile_id: profileId,
        question_id: META_QUESTION_ID,
        answer_value: JSON.stringify({ onboarding_completed_at: now }),
      },
      { onConflict: "profile_id,question_id" }
    );
  }, [profileId]);

  return { ...state, recordCriteriaUpdate, recordOnboardingComplete };
}
