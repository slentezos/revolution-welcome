import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Eye, TrendingUp, Users, Briefcase, UserCheck, ArrowUpRight } from "lucide-react";
import { UserRole } from "@/types/dashboard";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  progress?: number;
  change?: string;
  changePositive?: boolean;
}

const roleStats: Record<UserRole, StatItem[]> = {
  player: [
    { label: "Profile Completion", value: "92%", icon: TrendingUp, progress: 92 },
    { label: "New Messages", value: 3, icon: MessageSquare, change: "+2 today", changePositive: true },
    { label: "Profile Views", value: 47, icon: Eye, change: "+12 this week", changePositive: true },
    { label: "Recommended Clubs", value: 12, icon: Users },
  ],
  coach: [
    { label: "Profile Completion", value: "88%", icon: TrendingUp, progress: 88 },
    { label: "Player Applications", value: 5, icon: UserCheck, change: "+3 new", changePositive: true },
    { label: "Messages", value: 2, icon: MessageSquare },
    { label: "Profile Views", value: 31, icon: Eye, change: "+8 this week", changePositive: true },
  ],
  club: [
    { label: "Profile Completion", value: "95%", icon: TrendingUp, progress: 95 },
    { label: "Recommended Players", value: 18, icon: Users, change: "4 new matches", changePositive: true },
    { label: "New Applications", value: 4, icon: Briefcase, change: "+2 today", changePositive: true },
    { label: "Messages", value: 6, icon: MessageSquare },
  ],
};

export function ActionPanel({ role }: { role: UserRole }) {
  const stats = roleStats[role];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.change && (
                <span className="text-[11px] font-medium text-primary flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            {stat.progress !== undefined && (
              <Progress value={stat.progress} className="mt-3 h-1.5" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
