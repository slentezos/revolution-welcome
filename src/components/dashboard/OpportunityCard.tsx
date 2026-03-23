import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, ArrowRight, Zap } from "lucide-react";
import { Opportunity } from "@/types/dashboard";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const typeConfig: Record<string, { label: string; className: string }> = {
    recruitment: { label: "Recruiting", className: "bg-primary/10 text-primary border-primary/20" },
    trial: { label: "Trial", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    interest: { label: "Interest", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
    job: { label: "Job Opening", className: "bg-primary/10 text-primary border-primary/20" },
    application: { label: "Application", className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800" },
  };

  const config = typeConfig[opportunity.type] || typeConfig.recruitment;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer">
      {/* Avatar */}
      <Avatar className="h-11 w-11 shrink-0 border-2 border-border">
        <AvatarImage src={opportunity.avatar} />
        <AvatarFallback className="bg-secondary text-sm font-semibold">
          {opportunity.title.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h4 className="text-sm font-semibold text-foreground truncate">{opportunity.title}</h4>
          {opportunity.urgent && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 gap-0.5">
              <Zap className="h-2.5 w-2.5" />
              Urgent
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1.5">{opportunity.subtitle}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {opportunity.date}
          </span>
        </div>
      </div>

      {/* Type Badge + Arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <Badge variant="outline" className={`${config.className} text-[11px] font-medium hidden sm:flex`}>
          {config.label}
        </Badge>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
