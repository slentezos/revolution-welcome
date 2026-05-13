import { Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/core/auth";
import { UIStateProvider } from "@/core/ui-state";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";
import { GlobalLoading } from "@/components/system/GlobalLoading";
import i18n from "@/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<GlobalLoading />}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <UIStateProvider>
                <TooltipProvider delayDuration={150}>
                  {children}
                  <Toaster richColors position="top-right" />
                </TooltipProvider>
              </UIStateProvider>
            </AuthProvider>
          </QueryClientProvider>
        </I18nextProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
