import { useState } from "react";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { ProfileViewItem } from "@/components/dashboard/ProfileViewItem";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPlayerOpportunities, mockProfileViews, mockPlayers } from "@/data/mockData";
import { ArrowRight, Sparkles, Eye, Search, MessageSquare, CalendarDays, User, TrendingUp, Briefcase } from "lucide-react";

const tabs = [
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "search", label: "Search", icon: Search },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "opportunities", label: "Opportunities", icon: Briefcase },
  { id: "events", label: "Events", icon: CalendarDays },
];

export default function PlayerDashboard() {
  const [activeTab, setActiveTab] = useState("market");
  const featuredPlayers = mockPlayers.filter((p) => p.verified).slice(0, 3);

  return (
    <div className="space-y-0">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center gap-1 border-b border-border -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6 bg-card">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {activeTab === "market" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search opportunities..." className="pl-10 h-10 text-sm border-border" />
            </div>
          </div>

          <div className="flex gap-6">
            <DashboardFilters />
            <div className="flex-1 min-w-0 space-y-2">
              {mockPlayerOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
              <Button variant="ghost" className="w-full mt-3 text-sm text-muted-foreground hover:text-primary">
                View all opportunities <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "market" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Who Viewed Your Profile</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View all</Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {mockProfileViews.map((view) => (
                  <ProfileViewItem key={view.id} view={view} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Featured in Your Position</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Search className="h-3 w-3 mr-1" /> Search
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {featuredPlayers.map((player) => (
                  <RecommendationCard
                    key={player.id}
                    name={player.name}
                    subtitle={`${player.position} · ${player.age}yo`}
                    location={`${player.city}, ${player.country}`}
                    tags={[player.level, player.contractStatus]}
                    avatar={player.avatar}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
