import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Radar,
  Wallet,
  CalendarDays,
  Newspaper,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { titleKey: "Command Center", url: "/admin", icon: LayoutDashboard },
  { titleKey: "Matrice des Membres", url: "/admin/members", icon: Users },
  { titleKey: "Hub de Modération", url: "/admin/moderation", icon: ShieldAlert },
  { titleKey: "Radar d'Expansion", url: "/admin/expansion", icon: Radar },
  { titleKey: "FinOps & Abonnements", url: "/admin/finops", icon: Wallet },
  { titleKey: "Gestion des Événements", url: "/admin/events", icon: CalendarDays },
  { titleKey: "CMS & Blog", url: "/admin/cms", icon: Newspaper },
] as const;

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gold flex items-center justify-center text-navy font-bold text-lg">
            K
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sidebar-foreground font-bold text-base leading-tight">Mon Kalimera</span>
            <span className="text-gold text-xs font-medium tracking-wider uppercase">Admin Console</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.titleKey} className="h-12 text-base">
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
                          isActive
                            ? "bg-sidebar-accent text-gold font-semibold"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.titleKey}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
