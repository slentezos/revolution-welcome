import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** UI state shared across the Admin Portal (sidebar, etc.). */
interface AdminContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminContextProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const value = useMemo<AdminContextValue>(
    () => ({ sidebarOpen, toggleSidebar, setSidebarOpen }),
    [sidebarOpen, toggleSidebar]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext must be used within <AdminProviders>.");
  }
  return ctx;
}
