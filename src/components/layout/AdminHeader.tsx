import { LogOut, Search, Settings, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { useAuth } from "@/core/auth";
import { useUIState } from "@/core/ui-state";

export function AdminHeader() {
  const { user } = useAuth();
  const { setCommandPaletteOpen } = useUIState();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center gap-4 px-6 sticky top-0 z-30">
      <SidebarTrigger className="h-10 w-10" />
      <div className="flex-1 min-w-0">
        <AdminBreadcrumb />
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-background text-base text-muted-foreground hover:border-navy/30 transition"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher…</span>
        <kbd className="ml-2 text-xs font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar className="h-10 w-10 border-2 border-gold">
            <AvatarFallback className="bg-navy text-white font-semibold">
              {user?.email.slice(0, 2).toUpperCase() ?? "AD"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-base">
            <div className="flex flex-col">
              <span className="font-semibold text-navy">{user?.email}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-base">
            <UserIcon className="mr-2 h-4 w-4" /> Profil
          </DropdownMenuItem>
          <DropdownMenuItem className="text-base">
            <Settings className="mr-2 h-4 w-4" /> Paramètres
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-base text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
