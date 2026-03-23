import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TransferOpportunity } from "@/data/opportunitiesData";
import { MapPin, Clock, ArrowRight, CheckCircle, Home, Zap, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getFlag } from "@/lib/flags";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const typeBadge: Record<string, {label: string;className: string;}> = {
  recruitment: { label: "Recruiting", className: "bg-primary/10 text-primary border-primary/20" },
  trial: { label: "Trial", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
  camp: { label: "Camp", className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800" },
  interest: { label: "Interest", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" }
};

function getMatchScore(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i) | 0;
  return 65 + Math.abs(hash % 30);
}

export function TransferOpportunityRow({ opportunity, index = 0 }: {opportunity: TransferOpportunity;index?: number;}) {
  const badge = typeBadge[opportunity.type] || typeBadge.recruitment;
  const matchScore = getMatchScore(opportunity.id);
  const isNew = Date.now() - opportunity.datePosted.getTime() < 12 * 3600000;
  const countryFlag = getFlag(opportunity.country);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "group relative flex items-start gap-5 p-5 rounded-2xl border border-border/60 bg-card hover:bg-accent/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer",
        opportunity.urgent && "ring-1 ring-destructive/20 bg-destructive/[0.02]"
      )}>

      {/* Match score gradient bar */}
      <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full overflow-hidden">
        <div className="h-full w-full rounded-full" style={{
          background: matchScore >= 85 ?
          'linear-gradient(180deg, hsl(var(--primary)), hsl(var(--primary) / 0.4))' :
          matchScore >= 75 ?
          'linear-gradient(180deg, hsl(25 95% 50% / 0.6), hsl(25 95% 50% / 0.2))' :
          'hsl(var(--border))'
        }} />
      </div>

      {/* Club avatar */}
      <Avatar className={cn(
        "h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl border-2 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md",
        opportunity.verified ? "border-primary/30" : "border-border"
      )}>
        <AvatarImage src={opportunity.clubLogo} className="object-cover" />
        <AvatarFallback className="rounded-2xl bg-secondary text-lg font-bold">
          {opportunity.clubName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Top row: club name + badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[15px] font-bold text-foreground truncate">{opportunity.clubName}</span>
          {opportunity.verified &&
          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
          }
          {isNew &&
          <Badge className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20 font-semibold gap-1" variant="outline">
              <Sparkles className="h-3 w-3" />NEW
            </Badge>
          }
          {opportunity.urgent &&
          <Badge variant="destructive" className="text-[10px] px-2 py-0.5 gap-1 animate-pulse">
              <Zap className="h-3 w-3" />Urgent
            </Badge>
          }
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-foreground/85 truncate">{opportunity.title}</p>
        <p className="text-muted-foreground truncate leading-relaxed text-base">{opportunity.subtitle}</p>

        {/* Bottom meta row */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <span className="text-base leading-none">{countryFlag}</span>
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          {opportunity.housing &&
          <span className="flex items-center gap-1 text-muted-foreground bg-secondary/80 px-2 py-1 rounded-full text-sm">
              <Home className="h-3 w-3" />Housing
            </span>
          }
          {opportunity.deadline &&
          <span className="flex items-center gap-1 text-[11px] text-destructive font-medium bg-destructive/5 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              {opportunity.deadline}
            </span>
          }
        </div>
      </div>

      {/* Right column: match + type + time */}
      <div className="flex flex-col items-end gap-2.5 shrink-0 pt-0.5">
        {/* Match score pill */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
          matchScore >= 85 ?
          "bg-primary/10 text-primary" :
          matchScore >= 75 ?
          "bg-secondary text-foreground/70" :
          "bg-secondary text-muted-foreground"
        )}>
          <TrendingUp className="h-3 w-3" />
          {matchScore}%
        </div>

        <Badge variant="outline" className={cn("text-[11px] font-medium px-2.5 py-0.5", badge.className)}>
          {badge.label}
        </Badge>

        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(opportunity.datePosted)}
        </span>
      </div>

      {/* Hover arrow */}
      <ArrowRight className="h-5 w-5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0 self-center" />
    </motion.div>);

}