import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, FilterState, defaultFilters } from "@/types/dashboard";

interface DashboardContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("player");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <DashboardContext.Provider value={{ role, setRole, filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}
