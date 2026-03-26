import { Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import profileQuestionnairesImg from "@/assets/profile-questionnaires.jpg";

interface ProfileQuestionnairesTabProps {
  onContactTab: () => void;
}

const questionnaires = [
  {
    title: "Quiz des 3 préférences",
    subtitle: "10 questions",
    editable: true,
    href: "/onboarding?step=quiz",
  },
  {
    title: "Vos photos & vidéo",
    subtitle: "Infos – photos – vidéo",
    editable: true,
    href: "/onboarding?step=media_upload",
  },
  {
    title: "Mon profil / son profil",
    subtitle: "50 questions",
    editable: false,
    href: "/onboarding?step=profile",
  },
  {
    title: "Ma personnalité",
    subtitle: "40 questions",
    editable: false,
    href: "/onboarding?step=personality-results",
  },
];

export default function ProfileQuestionnairesTab({ onContactTab }: ProfileQuestionnairesTabProps) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero split – reversed */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24 order-2 lg:order-1">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Vos réponses
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Mes Questionnaires
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Retrouvez et modifiez vos réponses aux différentes étapes de votre inscription. Chaque détail compte pour
            trouver la personne idéale.
          </p>
        </div>
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh] order-1 lg:order-2">
          <img src={profileQuestionnairesImg} alt="Vos questionnaires" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Questionnaire cards */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {questionnaires.map((q) => (
              <div
                key={q.title}
                className="group bg-secondary/50 hover:bg-secondary p-8 md:p-10 transition-all duration-300 hover:shadow-[var(--shadow-card)]"
              >
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-2">{q.title}</h3>
                <p className="text-muted-foreground mb-6 text-xl">{q.subtitle}</p>
                {q.editable ? (
                  <a
                    href={q.href}
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-medium text-lg transition-all duration-300 hover:shadow-elevated hover:translate-y-[-1px] min-h-[56px]"
                  >
                    <Pencil className="h-5 w-5" />
                    Modifier
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-3 px-8 py-4 text-lg min-h-[56px]"
                    onClick={() => navigate(`${q.href}&mode=view`)}
                  >
                    <Eye className="h-5 w-5" />
                    Visualiser
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
