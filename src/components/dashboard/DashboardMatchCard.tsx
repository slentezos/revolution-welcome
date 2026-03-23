import { useState, useRef } from "react";
import { ShieldCheck, AlertTriangle, MapPin, Heart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { MockMatch } from "@/pages/Dashboard";

interface DashboardMatchCardProps {
  match: MockMatch;
  onView: () => void;
}

export default function DashboardMatchCard({ match, onView }: DashboardMatchCardProps) {
  const [glowing, setGlowing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDiscoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlowing(true);
    setTimeout(() => {
      setGlowing(false);
      onView();
    }, 1000);
  };

  const affinityLabel =
  match.affinity >= 90 ?
  "Affinité exceptionnelle" :
  match.affinity >= 80 ?
  "Excellente affinité" :
  "Belle affinité";

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden bg-card border border-border/40 transition-all duration-700 cursor-pointer hover:shadow-[var(--shadow-luxury)] ${
      glowing ?
      "ring-2 ring-gold/60 shadow-[0_0_40px_hsl(var(--gold)/0.2)]" :
      "shadow-[var(--shadow-card)]"}`
      }
      onClick={onView}>
      
      {/* Left: Large Photo */}
      <div className="relative w-full md:w-[220px] lg:w-[260px] flex-shrink-0 overflow-hidden">
        <img
          src={match.avatar}
          alt={match.name}
          className="w-full h-[200px] md:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />

        {/* Online indicator */}
        {match.online &&
        <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-sm font-medium text-white drop-shadow-md">En ligne</span>
          </div>
        }

        {/* Verified badge */}
        {match.verified &&
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gold text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
            <ShieldCheck className="h-4 w-4" />
            Vérifié
          </div>
        }

        {/* Affinity pill on photo */}
        <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full">
          <span className="text-lg font-bold">{match.affinity}%</span>
          <span className="font-medium ml-1.5 opacity-90 text-lg">affinité</span>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col justify-between p-6 lg:p-8">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="font-heading text-3xl lg:text-4xl text-foreground tracking-tight">
                {match.name}, <span className="text-muted-foreground">{match.age} ans</span>
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <MapPin className="h-4 w-4 text-gold" />
                <span className="text-lg text-muted-foreground font-medium">{match.location}</span>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-1">
              <span className="font-medium text-muted-foreground uppercase tracking-widest text-lg">{affinityLabel}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {match.tags.map((tag) =>
            <Badge
              key={tag}
              variant="secondary"
              className="text-sm px-4 py-1.5 bg-secondary text-secondary-foreground border border-border/50 font-medium">
              
                {tag}
              </Badge>
            )}
          </div>

          {/* Common point */}
          {match.commonPoint &&
          <div className="mt-4 flex items-start gap-3 bg-secondary/60 rounded-xl p-4">
              <Heart className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground uppercase tracking-wider mb-1 font-bold text-base">Pourquoi vous allez vous entendre</p>
                <p className="leading-relaxed text-xl text-secondary-foreground">{match.commonPoint}</p>
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
          <p className="text-muted-foreground text-lg">
            Proposition du{" "}
            {new Date(match.matchedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            {" — "}
            {(() => {
              const matchDate = new Date(match.matchedAt);
              const now = new Date();
              const diffDays = Math.max(0, 6 - Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24)));
              const isExpiring = diffDays <= 1;
              const label = isExpiring ?
              "Dernière chance aujourd'hui" :
              `Prenez votre temps : encore ${diffDays} jours`;
              return isExpiring ?
              <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-1 font-semibold text-gold cursor-help text-lg">
                        <AlertTriangle className="h-4 w-4" />
                        {label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px] text-center text-sm leading-snug">
                      Pour vous garantir des échanges avec des membres actifs, cette proposition expire bientôt.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> :

              <span className="font-semibold text-foreground">{label}</span>;

            })()}
          </p>

          <Button
            size="lg"
            className="px-8 py-3 text-lg font-semibold shadow-[0_4px_0_0_hsl(var(--primary)/0.4)] hover:shadow-[0_2px_0_0_hsl(var(--primary)/0.4)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100"
            onClick={handleDiscoverClick}>
            
            <Sparkles className="h-5 w-5 mr-2" />
            Découvrir
          </Button>
        </div>
      </div>
    </div>);

}