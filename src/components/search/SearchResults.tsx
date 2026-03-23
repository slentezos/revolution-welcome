import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { mockPlayers, mockCoaches, mockClubs } from "@/data/mockData";

export function SearchResults() {
  const { filters } = useDashboard();
  const showRole = filters.role;

  const filteredPlayers = (showRole === "all" || showRole === "player")
    ? mockPlayers.filter((p) => {
        if (filters.country && p.country !== filters.country) return false;
        if (filters.level && p.level !== filters.level) return false;
        if (filters.availability && p.availability !== filters.availability) return false;
        if (filters.position && p.position !== filters.position) return false;
        if (filters.contractStatus && p.contractStatus !== filters.contractStatus) return false;
        if (filters.handedness && p.handedness !== filters.handedness) return false;
        if (p.age < filters.ageRange[0] || p.age > filters.ageRange[1]) return false;
        return true;
      })
    : [];

  const filteredCoaches = (showRole === "all" || showRole === "coach")
    ? mockCoaches.filter((c) => {
        if (filters.country && c.country !== filters.country) return false;
        if (filters.level && c.level !== filters.level) return false;
        if (filters.availability && c.availability !== filters.availability) return false;
        if (filters.specialization && c.specialization !== filters.specialization) return false;
        if (filters.licenseLevel && c.licenseLevel !== filters.licenseLevel) return false;
        if (filters.preferredRole && c.preferredRole !== filters.preferredRole) return false;
        return true;
      })
    : [];

  const filteredClubs = (showRole === "all" || showRole === "club")
    ? mockClubs.filter((cl) => {
        if (filters.country && cl.country !== filters.country) return false;
        if (filters.level && cl.level !== filters.level) return false;
        if (filters.division && cl.division !== filters.division) return false;
        if (filters.recruiting && cl.recruiting !== filters.recruiting) return false;
        if (filters.clubType && cl.clubType !== filters.clubType) return false;
        return true;
      })
    : [];

  const totalResults = filteredPlayers.length + filteredCoaches.length + filteredClubs.length;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">{totalResults} results found</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((p) => (
          <Card key={p.id} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-[4.5rem] w-[4.5rem]">
                  <AvatarImage src={p.avatar} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-lg">{p.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold truncate">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.position} · {p.age}yo</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">🏐 Player</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />{p.city}, {p.country}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-[10px]">{p.level}</Badge>
                <Badge variant="secondary" className="text-[10px]">{p.contractStatus}</Badge>
                <Badge variant="secondary" className="text-[10px]">{p.handedness}</Badge>
                {p.nationalTeam && <Badge variant="secondary" className="text-[10px]">🇺🇳 National</Badge>}
              </div>
              <Button variant="outline" size="sm" className="w-full">View Profile</Button>
            </CardContent>
          </Card>
        ))}

        {filteredCoaches.map((c) => (
          <Card key={c.id} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-[4.5rem] w-[4.5rem]">
                  <AvatarImage src={c.avatar} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-lg">{c.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold truncate">{c.name}</h4>
                  <p className="text-xs text-muted-foreground">{c.specialization} · {c.experience}yr</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">📋 Coach</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />{c.city}, {c.country}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-[10px]">{c.licenseLevel}</Badge>
                <Badge variant="secondary" className="text-[10px]">{c.preferredRole}</Badge>
                <Badge variant="secondary" className="text-[10px]">{c.availability}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">View Profile</Button>
            </CardContent>
          </Card>
        ))}

        {filteredClubs.map((cl) => (
          <Card key={cl.id} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-[4.5rem] w-[4.5rem]">
                  <AvatarImage src={cl.logo} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-lg">{cl.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold truncate">{cl.name}</h4>
                  <p className="text-xs text-muted-foreground">{cl.division}</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">🏟️ Club</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />{cl.city}, {cl.country}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-[10px]">{cl.clubType}</Badge>
                <Badge variant="secondary" className="text-[10px]">Recruiting: {cl.recruiting}</Badge>
                {cl.internationalCompetition && <Badge variant="secondary" className="text-[10px]">🌍 Int'l</Badge>}
              </div>
              {cl.openPositions.length > 0 && (
                <p className="text-xs text-muted-foreground mb-2">Open: {cl.openPositions.join(", ")}</p>
              )}
              <Button variant="outline" size="sm" className="w-full">View Club</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
