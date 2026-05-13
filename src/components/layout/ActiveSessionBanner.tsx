import { Radio } from "lucide-react";
import { useUIState } from "@/core/ui-state";

export function ActiveSessionBanner() {
  const { activeConciergeSession } = useUIState();
  if (!activeConciergeSession) return null;

  return (
    <div className="bg-gold/10 border-b border-gold/30 px-6 py-3 flex items-center gap-3">
      <Radio className="h-4 w-4 text-gold animate-pulse" />
      <span className="text-base font-medium text-navy">
        Live Concierge — {activeConciergeSession.memberName}
      </span>
    </div>
  );
}
