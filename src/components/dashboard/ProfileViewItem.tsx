import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileView } from "@/types/dashboard";

const roleBadge: Record<string, { label: string; className: string }> = {
  club: { label: "Club", className: "bg-primary/10 text-primary border-primary/20" },
  coach: { label: "Coach", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
  player: { label: "Player", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
};

export function ProfileViewItem({ view }: { view: ProfileView }) {
  const badge = roleBadge[view.viewerRole] || roleBadge.player;

  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar className="h-9 w-9 shrink-0 border border-border">
        <AvatarImage src={view.avatar} />
        <AvatarFallback className="text-xs bg-secondary font-semibold">{view.viewerName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate text-foreground">{view.viewerName}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${badge.className}`}>
            {badge.label}
          </Badge>
        </div>
        {view.viewerOrg && (
          <p className="text-xs text-muted-foreground">{view.viewerOrg}</p>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground shrink-0 font-medium">{view.timestamp}</span>
    </div>
  );
}
