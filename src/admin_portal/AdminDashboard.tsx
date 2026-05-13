import { AdminProviders } from "./core/AdminProviders";
import { AdminLayout } from "./components/AdminLayout";
import { useAdminSection } from "./core/useAdminSection";
import { ADMIN_SECTIONS } from "./core/navigation";
import { CommandCenterView } from "./views/CommandCenterView";
import { MembersView } from "./views/MembersView";
import { ModerationView } from "./views/ModerationView";
import { ExpansionView } from "./views/ExpansionView";
import { FinOpsView } from "./views/FinOpsView";
import { CmsView } from "./views/CmsView";
import { PlaceholderView } from "./views/PlaceholderView";
import { ProtectedRoute } from "./core/ProtectedRoute";
import { AdminErrorBoundary } from "./core/AdminErrorBoundary";
import { useNoIndex } from "./core/useNoIndex";

export default function AdminDashboard() {
  useNoIndex();

  return (
    <ProtectedRoute>
      <AdminErrorBoundary>
        <AdminProviders>
          <AdminLayout>
            <SectionRouter />
          </AdminLayout>
        </AdminProviders>
      </AdminErrorBoundary>
    </ProtectedRoute>
  );
}

function SectionRouter() {
  const { section } = useAdminSection();
  const meta = ADMIN_SECTIONS.find((s) => s.id === section);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <header>
        <h1
          className="text-3xl font-semibold tracking-tight text-slate-950"
          style={{ color: "#F8FAFC" }}
        >
          {meta?.label}
        </h1>
        <p className="mt-1 opacity-60 text-xl">{meta?.description}</p>
      </header>

      {section === "command-center" && <CommandCenterView />}
      {section === "members" && <MembersView />}
      {section === "moderation" && <ModerationView />}
      {section === "expansion" && <ExpansionView />}
      {section === "finops" && <FinOpsView />}
      {section === "events" && (
        <PlaceholderView title="Gestion des Événements" slots={6} />
      )}
      {section === "cms" && <CmsView />}
      {section === "settings" && (
        <PlaceholderView title="Paramètres" slots={4} />
      )}
    </div>
  );
}
