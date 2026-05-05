import { useEffect, useState } from "react";
import { MessageSquare, Sparkles, Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsCardsProps {
  onMessagesClick: () => void;
  newProposalsCount: number;
  pendingCount: number;
  savedCount: number;
  unreadMessageCount?: number;
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    // Décalage pour que le titre ne passe pas sous le menu sticky
    const y = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

export default function DashboardStatsCards({
  onMessagesClick,
  newProposalsCount,
  pendingCount,
  savedCount,
  unreadMessageCount = 0,
}: DashboardStatsCardsProps) {
  const tabs = [
    {
      id: "section-nouvelles",
      label: "Nouvelles propositions",
      count: newProposalsCount,
      icon: Sparkles,
      pillClasses: "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20",
      badgeClasses: "bg-[#1B2333] text-white",
    },
    {
      id: "section-attente",
      label: "En attente de sa réponse",
      count: pendingCount,
      icon: Send,
      pillClasses: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200",
      badgeClasses: "bg-emerald-600 text-white",
    },
    {
      id: "section-finaliser",
      label: "À finaliser de ma part",
      count: savedCount,
      icon: Clock,
      pillClasses: "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200",
      badgeClasses: "bg-amber-500 text-white",
    },
  ];

  return (
    <div className="sticky top-[64px] z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm py-4 overflow-hidden">
      {/* BOÎTE PARENTE : Gère uniquement le scroll (overflow-x-auto) avec le padding global */}
      <div className="w-full overflow-x-auto no-scrollbar px-4 md:px-8">
        {/* BOÎTE ENFANT : w-max force les éléments à rester sur une ligne sans se compresser */}
        <div className="flex items-center gap-3 md:gap-4 w-max min-w-full lg:justify-center mx-auto pb-1">
          <button
            onClick={onMessagesClick}
            className="shrink-0 inline-flex items-center gap-2.5 rounded-full px-6 py-3 bg-white border border-border/60 hover:bg-muted transition-colors min-h-[48px] shadow-sm"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-lg md:text-xl">Messages</span>
            {unreadMessageCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-[#1B2333] text-white font-bold text-base shadow-sm">
                {unreadMessageCount}
              </span>
            )}
          </button>

          <div className="h-8 w-px bg-border/60 shrink-0 mx-1 lg:mx-2" aria-hidden />

          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2.5 rounded-full px-6 py-3 transition-colors min-h-[48px] shadow-sm",
                  tab.pillClasses,
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-semibold text-lg md:text-xl">{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full font-bold text-base shadow-sm",
                      tab.badgeClasses,
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* L'ASTUCE ANTI-COUPURE : Ce div vide force le navigateur à calculer un espace à droite lors du scroll final */}
          <div className="w-1 shrink-0" aria-hidden />
        </div>
      </div>
    </div>
  );
}
