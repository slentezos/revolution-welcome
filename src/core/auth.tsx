import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "moderator" | "viewer";
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mocked auth state — replace with real Supabase session logic later.
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: true,
      user: { id: "mock-admin", email: "admin@kalimera.fr", role: "admin" },
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
