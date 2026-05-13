import { AdminProviders } from "./core/AdminProviders";
import { AdminLayout } from "./components/AdminLayout";
import { useAdminSection } from "./core/useAdminSection";
import { ADMIN_SECTIONS } from "./core/navigation";
import { CommandCenterView } from "./views/CommandCenterView";
import { MembersView } from "./views/MembersView";
import { PlaceholderView } from "./views/PlaceholderView";

export default function AdminDashboard() {
  return (
    <AdminProviders>
      <AdminLayout>
        <SectionRouter />
      </AdminLayout>
    </AdminProviders>
  );
}

function SectionRouter() {
  const { section } = useAdminSection();
  const meta = ADMIN_SECTIONS.find((s) => s.id === section);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <header>
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ color: "#F8FAFC" }}
        >
          {meta?.label}
        </h1>
        <p className="text-base mt-1 opacity-60">{meta?.description}</p>
      </header>

      {section === "command-center" && <CommandCenterView />}
      {section === "members" && <MembersView />}
      {section === "moderation" && (
        <PlaceholderView
          title="Modération & qualité"
          description="Gérez les signalements, la modération des profils et la qualité des interactions au sein de la communauté."
        />
      )}
      {section === "expansion" && (
        <PlaceholderView
          title="Expansion & marchés"
          description="Pilotez la liste d'attente, l'ouverture de nouvelles villes et le suivi des leads par région."
        />
      )}
      {section === "finops" && (
        <PlaceholderView
          title="FinOps & abonnements"
          description="Suivez les revenus, les abonnements actifs, les remboursements et les indicateurs financiers clés."
        />
      )}
    </div>
  );
}
