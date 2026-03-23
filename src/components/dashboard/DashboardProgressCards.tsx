import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

type ProgressCard = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  variant: "navy" | "cream";
  link: string | null;
};

const progressCards: ProgressCard[] = [
  {
    id: "infos",
    title: "Vos photos & vidéo",
    subtitle: "Infos - photos – vidéo",
    progress: 100,
    variant: "navy",
    link: "/onboarding?step=media_upload",
  },
  {
    id: "quiz",
    title: "Quiz des 3 préférences",
    subtitle: "10 questions",
    progress: 100,
    variant: "cream",
    link: "/onboarding?step=quiz",
  },
  {
    id: "profil",
    title: "Mon profil / son profil",
    subtitle: "50 questions",
    progress: 70,
    variant: "navy",
    link: "/onboarding?step=profile",
  },
  {
    id: "test",
    title: "Test de personalité",
    subtitle: "40 questions",
    progress: 100,
    variant: "navy",
    link: "/onboarding?step=personality",
  },
];

export default function DashboardProgressCards() {
  const incompleteCards = progressCards.filter((card) => card.progress < 100);

  if (incompleteCards.length === 0) return null;

  return;
}
