import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminContextProvider } from "./AdminContext";
import { AdminThemeProvider } from "./AdminTheme";
import "../admin-theme.css";

/**
 * Root providers for the Admin Portal.
 *
 * Owns its OWN QueryClient — fully isolated from the main app's QueryClient
 * declared in `src/App.tsx`. This guarantees zero cache cross-contamination
 * between public-facing data and admin queries.
 */
export function AdminProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminThemeProvider>
        <AdminContextProvider>{children}</AdminContextProvider>
      </AdminThemeProvider>
    </QueryClientProvider>
  );
}

export { useAdminContext } from "./AdminContext";
