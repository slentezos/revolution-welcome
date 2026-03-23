import { ReactNode } from "react";
import { DashboardTopNav } from "./DashboardTopNav";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <DashboardTopNav />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
