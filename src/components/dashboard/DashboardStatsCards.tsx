import { useState, useEffect } from "react";
import { MessageSquare, Sparkles, Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsCardsProps {
  onMessagesClick: () => void;
  newProposalsCount: number;
  pendingCount: number;
  savedCount: number;
  unreadMessageCount?: number;
}

export default function DashboardStatsCards({
  onMessagesClick,
  newProposalsCount,
  pendingCount,
  savedCount,
  unreadMessageCount = 0,
}: DashboardStatsCardsProps) {
  // État pour savoir quelle section est actuellement visible à l'écran
  const [activeSection, setActiveSection] = useState<string>("messages");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // On soustrait 140px pour ne pas que l'élément soit caché sous le header + la sticky bar
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const tabs = [
    {
      id: "messages",
      label: "Mes nouveaux messages",
      count: unreadMessageCount,
      icon: MessageSquare,
      badgeColor: "bg-[#1B2333] text-white",
      action: onMessagesClick,
    },
    {
      id: "section-nouvelles",
      label: "Nouvelles propositions",
      count: newProposalsCount,
      icon: Sparkles,
      badgeColor: "bg-[hsl(var(--gold))] text-white",
      action: () => scrollTo("section-nouvelles"),
    },
    {
      id: "section-attente",
      label: "En attente de sa réponse",
      count: pendingCount,
      icon: Send,
      badgeColor: "bg-emerald-500 text-white",
      action: () => scrollTo("section-attente"),
    },
    {
      id: "section-finaliser",
      label: "À finaliser",
      count: savedCount,
      icon: Clock,
      badgeColor: "bg-amber-500 text-white",
      action: () => scrollTo("section-finaliser"),
    },
  ];

  // (Optionnel) Intersection Observer pour mettre à jour l'onglet actif automatiquement au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-150px 0px -60% 0px" }, // Déclenche quand la section arrive dans le tiers supérieur
    );

    tabs.forEach((tab) => {
      if (tab.id !== "messages") {
        const el = document.getElementById(tab.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [tabs]);

  return (
    <div className="sticky top-[80px] z-40 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-border/40 shadow-sm mb-10 pt-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SCROLL HORIZONTAL (Pour tablette/mobile) */}
        <div className="flex overflow-x-auto scrollbar-none gap-4 md:gap-8 lg:gap-12 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // On considère que "messages" n'est actif que si cliqué, les autres le sont au scroll
            const isActive = activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id);
                  tab.action();
                }}
                className={cn(
                  "relative flex items-center gap-3 py-4 px-2 whitespace-nowrap transition-all duration-300 outline-none group",
                  isActive ? "text-[#1B2333]" : "text-muted-foreground hover:text-foreground/80",
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isActive ? "text-[hsl(var(--gold))]" : "opacity-60 group-hover:opacity-100",
                  )}
                />

                <span
                  className={cn(
                    "font-heading text-xl md:text-2xl transition-all",
                    isActive ? "font-bold" : "font-medium",
                  )}
                >
                  {tab.label}
                </span>

                {tab.count > 0 && (
                  <span
                    className={cn(
                      "flex items-center justify-center h-7 px-2.5 min-w-[28px] rounded-full text-sm font-bold ml-1 transition-all",
                      isActive ? tab.badgeColor : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {tab.count}
                  </span>
                )}

                {/* Soulignement de l'onglet actif */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[hsl(var(--gold))] animate-in fade-in zoom-in-95 duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
