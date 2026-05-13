import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AdminTheme = "light" | "dark";

interface AdminThemeContextValue {
  theme: AdminTheme;
  setTheme: (t: AdminTheme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "admin_portal_theme";
const DEFAULT_THEME: AdminTheme = "light";

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

function readInitialTheme(): AdminTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(readInitialTheme);

  const setTheme = useCallback((t: AdminTheme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: AdminTheme = prev === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Reflect on <html> to allow scoped CSS rules globally if needed.
  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
    return () => {
      delete document.documentElement.dataset.adminTheme;
    };
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within <AdminThemeProvider>.");
  return ctx;
}
