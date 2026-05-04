import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Sparkles, Send, Clock } from "lucide-react";

interface DashboardStatsCardsProps {
  onMessagesClick: () => void;
  newProposalsCount: number;
  pendingCount: number;
  savedCount: number;
  unreadMessageCount?: number;
}

const messageAvatars = [
  { name: "Marie", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
  {
    name: "Sophie",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

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
      count: newProposalsCount,
      icon: Sparkles,
      colorClasses: "bg-primary/10 text-primary",
      badgeClasses: "bg-primary text-primary-foreground",
    },
    {
      id: "section-attente",
      label: "En attente de sa réponse",
      count: pendingCount,
      icon: Send,
      colorClasses: "bg-emerald-100 text-emerald-700",
      badgeClasses: "bg-emerald-600 text-white",
    },
    {
      id: "section-finaliser",
      label: "À finaliser de ma part",
      count: savedCount,
      icon: Clock,
      colorClasses: "bg-amber-100 text-amber-700",
      badgeClasses: "bg-amber-600 text-white",
    },
  ];

  return (
    <div className="sticky top-16 md:top-20 z-40 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-border/30 shadow-sm py-4 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto px-4">
        {/* ... le reste de votre code ne change pas ... */}
        <div
          className="bg-card rounded-xl p-4 md:p-5 border border-border/30 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onMessagesClick}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
              {unreadMessageCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {unreadMessageCount}
                </span>
              )}
          </div>
          <h3 className="font-semibold text-foreground text-base leading-tight md:text-2xl">Mes nouveaux messages</h3>
        </div>

        {/* Section navigation tabs */}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              className="bg-card rounded-xl p-4 md:p-5 border border-border/30 cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => scrollTo(tab.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab.colorClasses}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {tab.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-sm font-bold ${tab.badgeClasses}`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors md:text-2xl">
                {tab.label}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
