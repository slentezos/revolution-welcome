import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/core/ProtectedRoute";
import { GlobalLoading } from "@/components/system/GlobalLoading";
import { OnboardingGuard } from "@/core/OnboardingGuard";

const CommandCenter = lazy(() => import("@/pages/admin/CommandCenter"));
const Members = lazy(() => import("@/pages/admin/Members"));
const Moderation = lazy(() => import("@/pages/admin/Moderation"));
const Expansion = lazy(() => import("@/pages/admin/Expansion"));
const FinOps = lazy(() => import("@/pages/admin/FinOps"));
const Events = lazy(() => import("@/pages/admin/Events"));
const CMS = lazy(() => import("@/pages/admin/CMS"));
const Login = lazy(() => import("@/pages/admin/Login"));
const NotFound = lazy(() => import("@/pages/admin/NotFound"));
const PublicSite = lazy(() => import("@/pages/portal/PublicSite"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<GlobalLoading />}>{node}</Suspense>
);

const router = createBrowserRouter([
  { path: "/login", element: withSuspense(<Login />) },
  { path: "/public", element: withSuspense(<PublicSite />) },
  { path: "/dashboard", element: withSuspense(<Dashboard />) },
  {
    path: "/onboarding",
    element: withSuspense(
      <OnboardingGuard>
        <Onboarding />
      </OnboardingGuard>
    ),
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: withSuspense(<CommandCenter />) },
          { path: "members", element: withSuspense(<Members />) },
          { path: "moderation", element: withSuspense(<Moderation />) },
          { path: "expansion", element: withSuspense(<Expansion />) },
          { path: "finops", element: withSuspense(<FinOps />) },
          { path: "events", element: withSuspense(<Events />) },
          { path: "cms", element: withSuspense(<CMS />) },
        ],
      },
    ],
  },
  { path: "*", element: withSuspense(<NotFound />) },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
