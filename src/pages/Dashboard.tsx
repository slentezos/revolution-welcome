import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import PlayerDashboard from "./dashboard/PlayerDashboard";
import CoachDashboard from "./dashboard/CoachDashboard";
import ClubDashboard from "./dashboard/ClubDashboard";

function DashboardContent() {
  const { role } = useDashboard();

  return (
    <DashboardLayout>
      {role === "player" && <PlayerDashboard />}
      {role === "coach" && <CoachDashboard />}
      {role === "club" && <ClubDashboard />}
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
