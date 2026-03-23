import { useState } from "react";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { SquadTable } from "@/components/dashboard/SquadTable";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockClubOpportunities, mockPlayers, mockCoaches } from "@/data/mockData";
import { Search, Edit, Users, UserCheck, FileText, Clock, ArrowRight, MessageSquare, Trophy, Newspaper, CalendarDays, User } from "lucide-react";

const tabs = [
  { id: "squad", label: "Squad", icon: Users },
  { id: "search", label: "Search", icon: Search },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "player-ads", label: "Player Ads", icon: Newspaper },
  { id: "events", label: "Events", icon: CalendarDays },
];

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("squad");
  const recommendedCoaches = mockCoaches.filter((c) => c.availability !== "Not Available").slice(0, 2);

  return (
    <div className="space-y-0">
      {/* Tab Navigation — TransferRoom style */}
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

      {activeTab === "squad" && (
        <div className="space-y-6">
          {/* Search + Edit row */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for player..." className="pl-10 h-10 text-sm border-border" />
            </div>
            <Button variant="outline" className="gap-2 font-semibold">
              <Edit className="h-4 w-4" /> EDIT
            </Button>
          </div>

          {/* Two-column: Filters + Table */}
          <div className="flex gap-6">
            <DashboardFilters />
            <div className="flex-1 min-w-0">
              <SquadTable players={mockPlayers} />
            </div>
          </div>
        </div>
      )}

      {activeTab !== "squad" && (
        <div className="space-y-6">
          {/* Market Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Market Activity</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {mockClubOpportunities.slice(0, 3).map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold">Recommended Coaches</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {recommendedCoaches.map((coach) => (
                      <RecommendationCard
                        key={coach.id}
                        name={coach.name}
                        subtitle={`${coach.specialization} · ${coach.experience}yr exp`}
                        location={`${coach.city}, ${coach.country}`}
                        tags={[coach.licenseLevel, coach.preferredRole]}
                        avatar={coach.avatar}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold">Contract Tracker</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Lucas Martínez</p>
                      <p className="text-xs text-muted-foreground">Left Back · Negotiating</p>
                    </div>
                    <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20">In Progress</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Anna Svensson</p>
                      <p className="text-xs text-muted-foreground">Right Wing · Contract Expiring</p>
                    </div>
                    <Badge variant="outline" className="text-[11px]">Saved</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
