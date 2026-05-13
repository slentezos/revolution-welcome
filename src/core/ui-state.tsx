import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface ConciergeSession {
  id: string;
  memberName: string;
  startedAt: string;
}

interface UIStateContextValue {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  activeConciergeSession: ConciergeSession | null;
  setActiveConciergeSession: (s: ConciergeSession | null) => void;
}

const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [activeConciergeSession, setActiveConciergeSession] = useState<ConciergeSession | null>(null);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);

  const value = useMemo<UIStateContextValue>(
    () => ({
      isSidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      activeConciergeSession,
      setActiveConciergeSession,
    }),
    [isSidebarCollapsed, isCommandPaletteOpen, activeConciergeSession, toggleSidebar]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export function useUIState(): UIStateContextValue {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within a UIStateProvider");
  return ctx;
}
