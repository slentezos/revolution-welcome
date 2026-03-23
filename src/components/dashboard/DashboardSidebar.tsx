import { Home, Search, MessageSquare, User, Settings, LogOut, ChevronDown, TrendingUp, Calendar } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/dashboard";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { title: "Market", url: "/dashboard", icon: Home },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Opportunities", url: "/dashboard/opportunities", icon: TrendingUp },
  { title: "Events", url: "/dashboard/events", icon: Calendar },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const roleLabels: Record<UserRole, { label: string; emoji: string }> = {
  player: { label: "Player", emoji: "🏐" },
  coach: { label: "Coach", emoji: "📋" },
  club: { label: "Club", emoji: "🏟️" },
};

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { role, setRole } = useDashboard();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Logo */}
      <SidebarHeader className="p-4 pb-2">
        {!collapsed ? (
          <a href="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary-foreground">i</span>
            </div>
            <span className="text-lg font-bold text-foreground">iHandball</span>
          </a>
        ) : (
          <a href="/" className="flex items-center justify-center mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">i</span>
            </div>
          </a>
        )}

        {/* Role Switcher */}
        {!collapsed ? (
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="w-full bg-secondary/50 border-border text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="player">{roleLabels.player.emoji} Player View</SelectItem>
              <SelectItem value="coach">{roleLabels.coach.emoji} Coach View</SelectItem>
              <SelectItem value="club">{roleLabels.club.emoji} Club View</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <button
            onClick={() => {
              const roles: UserRole[] = ["player", "coach", "club"];
              const idx = roles.indexOf(role);
              setRole(roles[(idx + 1) % 3]);
            }}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-secondary/50 border border-border text-xs font-bold hover:bg-secondary transition-colors"
            title={`Switch role (${roleLabels[role].label})`}
          >
            {roleLabels[role].emoji}
          </button>
        )}
      </SidebarHeader>

      <Separator className="mx-4 w-auto" />

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = item.url === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        <Separator className="mb-3" />
        <button
          onClick={() => signOut()}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
