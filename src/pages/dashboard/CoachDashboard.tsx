import { useState } from "react";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { SquadTable } from "@/components/dashboard/SquadTable";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { ProfileViewItem } from "@/components/dashboard/ProfileViewItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCoachOpportunities, mockProfileViews, mockPlayers } from "@/data/mockData";
import { Search, Users, Eye, GraduationCap, Calendar, ArrowRight, MessageSquare, Newspaper, CalendarDays, User, ClipboardList } from "lucide-react";

const tabs = [
  { id: "scouting", label: "Scouting", icon: Search },
  { id: "candidates", label: "Candidates", icon: ClipboardList },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "events", label: "Events", icon: CalendarDays },
];

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState("scouting");
  const freeAgents = mockPlayers.filter((p) => p.contractStatus === "Free Agent");

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

      {activeTab === "scouting" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search players..." className="pl-10 h-10 text-sm border-border" />
            </div>
          </div>

          <div className="flex gap-6">
            <DashboardFilters />
            <div className="flex-1 min-w-0">
              <SquadTable players={freeAgents} />
            </div>
          </div>
        </div>
      )}

      {activeTab !== "scouting" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Candidates & Job Openings</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {mockCoachOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Profile Views</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border">
                  {mockProfileViews.slice(0, 3).map((view) => (
                    <ProfileViewItem key={view.id} view={view} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Education & Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">EHF Master Coach Course</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Vienna, Austria · Apr 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">IHF Coaching Symposium</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Online · May 2026
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
