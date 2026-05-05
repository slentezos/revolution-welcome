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
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      shortLabel: "Nouvelles",
      count: newProposalsCount,
      icon: Sparkles,
      pillClasses: "bg-primary/10 text-primary hover:bg-primary/15 border-primary/20",
      badgeClasses: "bg-primary text-primary-foreground",
    },
    {
      id: "section-attente",
      label: "En attente de sa réponse",
      shortLabel: "En attente",
      count: pendingCount,
      icon: Send,
      pillClasses: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
      badgeClasses: "bg-emerald-600 text-white",
    },
    {
      id: "section-finaliser",
      label: "À finaliser de ma part",
      shortLabel: "À finaliser",
      count: savedCount,
      icon: Clock,
      pillClasses: "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200",
      badgeClasses: "bg-amber-500 text-white",
    },
  ];

  return (
    <div className="sticky top-16 md:top-20 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 backdrop-blur-md border-b border-border/40 shadow-sm bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
        <button
          onClick={onMessagesClick}
          className="shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-card border border-border hover:bg-muted transition-colors min-h-[48px]"
        >
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground whitespace-nowrap text-xl">Messages</span>
          {unreadMessageCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary text-primary-foreground font-bold text-base">
              {unreadMessageCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-border/60 shrink-0" aria-hidden />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 border transition-colors min-h-[48px]",
                tab.pillClasses,
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-semibold whitespace-nowrap text-xl">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full font-bold text-base",
                    tab.badgeClasses,
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
