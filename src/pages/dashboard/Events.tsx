import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import eventsHero from "@/assets/events-hero.jpg";

const mockEvents = [
{ id: "e1", title: "European Handball Transfer Summit", date: "Mar 15-16, 2026", location: "Vienna, Austria", type: "Conference", attendees: 340, featured: true, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop" },
{ id: "e2", title: "Scandinavian Player Showcase", date: "Apr 5-7, 2026", location: "Copenhagen, Denmark", type: "Trial Camp", attendees: 120, featured: true, image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=250&fit=crop" },
{ id: "e3", title: "Bundesliga Recruitment Days", date: "Apr 20-21, 2026", location: "Cologne, Germany", type: "Recruitment", attendees: 85, featured: false, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop" },
{ id: "e4", title: "IHF Youth Development Forum", date: "May 10-12, 2026", location: "Basel, Switzerland", type: "Forum", attendees: 200, featured: false, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop" },
{ id: "e5", title: "Mediterranean Handball Cup — Scouting Edition", date: "Jun 1-4, 2026", location: "Barcelona, Spain", type: "Tournament", attendees: 450, featured: true, image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=250&fit=crop" }];


const typeColors: Record<string, string> = {
  Conference: "bg-blue-100 text-blue-700 border-blue-200",
  "Trial Camp": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Recruitment: "bg-amber-100 text-amber-700 border-amber-200",
  Forum: "bg-purple-100 text-purple-700 border-purple-200",
  Tournament: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function Events() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden h-48 md:h-56">
          <img
            src={eventsHero}
            alt="Handball events and conferences"
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Upcoming</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Events & Showcases</h2>
            <p className="text-white/70 max-w-md text-lg">
              Connect with clubs, scouts, and players at handball's biggest recruitment events.
            </p>
          </div>
        </div>

        {/* Featured Events */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Featured Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockEvents.filter((e) => e.featured).map((event) =>
            <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border-0 shadow-sm">
                <div className="relative h-36 overflow-hidden">
                  <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                  <div className="absolute top-3 left-3">
                    <Badge className={`text-[10px] font-semibold border ${typeColors[event.type] || ""}`}>
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-lg">
                    {event.title}
                  </h4>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-primary/70" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary/70" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-primary/70" />
                      {event.attendees} attending
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3 text-xs group/btn">
                    Register <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* All Events */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">All Events</h3>
          <div className="space-y-3">
            {mockEvents.filter((e) => !e.featured).map((event) =>
            <Card key={event.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                  <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">{event.title}</h4>
                    <Badge className={`text-[10px] font-medium border ${typeColors[event.type] || ""}`}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-base"><Calendar className="h-3 w-3" />{event.date}</span>
                    <span className="flex items-center gap-1 text-base"><MapPin className="h-3 w-3" />{event.location}</span>
                    <span className="flex items-center gap-1 text-sm"><Users className="h-3 w-3" />{event.attendees} attending</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 text-xs">
                  Register
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>);

}