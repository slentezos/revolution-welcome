import { useState } from "react";
import { ShieldCheck, Loader2, MapPin, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MockMatch } from "@/pages/Dashboard";

interface DashboardPendingCardProps {
  match: MockMatch & { acceptedAt: string };
  onView: () => void;
}

export default function DashboardPendingCard({ match, onView }: DashboardPendingCardProps) {
  const [glowing, setGlowing] = useState(false);

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlowing(true);
    setTimeout(() => {
      setGlowing(false);
      onView();
    }, 1000);
  };

  return (
    <div
      className={`group relative flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden bg-card border border-emerald-200/60 transition-all duration-700 cursor-pointer hover:shadow-[var(--shadow-luxury)] ${
        glowing
          ? "ring-2 ring-emerald-400/60 shadow-[0_0_40px_rgba(52,211,153,0.25)]"
          : "shadow-[var(--shadow-card)]"
      }`}
      onClick={onView}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full md:w-1.5 md:h-full h-1.5 bg-gradient-to-r md:bg-gradient-to-b from-emerald-400 to-emerald-600 z-10" />

      {/* Left: Photo */}
      <div className="relative w-full md:w-[220px] lg:w-[260px] flex-shrink-0 overflow-hidden">
        <img
          src={match.avatar}
          alt={match.name}
          className="w-full h-[200px] md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent" />

        {match.verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gold text-white text-lg font-semibold px-3 py-1.5 rounded-full shadow-md">
            <ShieldCheck className="h-4 w-4" />
            Vérifié
          </div>
        )}

        {/* Affinity on photo */}
        <div className="absolute bottom-4 left-4 bg-emerald-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          <span className="text-lg font-bold">{match.affinity}%</span>
          <span className="text-lg font-medium ml-1.5 opacity-90">affinité</span>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col justify-between p-6 lg:p-8">
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="font-heading text-3xl lg:text-4xl text-foreground tracking-tight">
                {match.name}, <span className="text-muted-foreground">{match.age} ans</span>
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-lg text-muted-foreground font-medium">{match.location}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mt-4 bg-emerald-50 rounded-xl px-5 py-3">
            <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
            <span className="text-emerald-800 font-semibold text-lg">En attente de sa réponse</span>
            <span className="text-emerald-600/70 ml-auto text-lg">Accepté le {match.acceptedAt}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {match.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium text-base"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end mt-5 pt-4 border-t border-emerald-100">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-3 text-lg font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50 shadow-[0_4px_0_0_rgba(16,185,129,0.2)] hover:shadow-[0_2px_0_0_rgba(16,185,129,0.2)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100"
            onClick={handleViewClick}
          >
            <Eye className="h-5 w-5 mr-2" />
            Voir le profil
          </Button>
        </div>
      </div>
    </div>
  );
}
