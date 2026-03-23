import { Search, MessageSquare, User, Settings, LogOut, TrendingUp, Calendar, Bell, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { title: "HOME", url: "/dashboard/home", icon: TrendingUp },
  { title: "SEARCH", url: "/dashboard/search", icon: Search },
  { title: "MESSAGES", url: "/dashboard/messages", icon: MessageSquare },
  { title: "OPPORTUNITIES", url: "/dashboard/opportunities", icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )},
  { title: "EVENTS", url: "/dashboard/events", icon: Calendar },
];

const roleLabels: Record<UserRole, { label: string; emoji: string }> = {
  player: { label: "Player", emoji: "🏐" },
  coach: { label: "Coach", emoji: "📋" },
  club: { label: "Club", emoji: "🏟️" },
};

export function DashboardTopNav() {
  const location = useLocation();
  const { role, setRole } = useDashboard();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Top utility bar */}
      <div className="flex h-10 items-center justify-between px-4 md:px-6 border-b border-border">
        <a href="/" className="flex items-center shrink-0">
          <span className="text-xl font-bold tracking-tight text-foreground">i<span className="text-primary">Handball</span></span>
        </a>

        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="w-[120px] h-7 text-xs font-medium bg-secondary/50 border-border hidden sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="player">{roleLabels.player.emoji} Player</SelectItem>
              <SelectItem value="coach">{roleLabels.coach.emoji} Coach</SelectItem>
              <SelectItem value="club">{roleLabels.club.emoji} Club</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="relative h-7 w-7">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <User className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" /> My Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" /> Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden">
                <Menu className="h-3.5 w-3.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="flex flex-col items-center gap-1 py-4">
                {navItems.map((item) => {
                  const active = item.url === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.url);
                  return (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={`flex items-center gap-3 px-6 py-2.5 w-full text-sm font-semibold tracking-wide transition-colors ${
                        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                      activeClassName=""
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main nav tabs - TransferRoom style */}
      <nav className="hidden md:flex items-center justify-center">
        {navItems.map((item) => {
          const active = item.url === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/dashboard"}
              className={`relative flex flex-col items-center gap-1.5 px-8 py-3 text-xs font-bold tracking-wider transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              activeClassName=""
            >
              <item.icon className="h-6 w-6" />
              <span>{item.title}</span>
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
