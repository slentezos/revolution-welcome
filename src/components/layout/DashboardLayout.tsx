import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ActiveSessionBanner } from "@/components/layout/ActiveSessionBanner";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <ActiveSessionBanner />
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
        <CommandPalette />
      </div>
    </SidebarProvider>
  );
}
