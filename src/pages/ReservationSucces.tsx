import { useNavigate } from "react-router-dom";
import { CheckCircle2, Camera, Video, Clock } from "lucide-react";

const TIPS = [
  {
    icon: Camera,
    title: "Préparez 3 à 4 photos",
    description: "Choisissez des photos récentes, souriantes, qui vous ressemblent au quotidien.",
  },
  {
    icon: Video,
    title: "Pensez à votre vidéo",
    description: "Trouvez un endroit calme et lumineux. Nous vous guiderons lors de l'appel.",
  },
  {
    icon: Clock,
    title: "Soyez disponible",
    description: "Réservez 45 minutes sans interruption le jour de votre entretien.",
  },
];

export default function ReservationSucces() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Success icon */}
        <div className="mb-8 animate-in zoom-in duration-500">
          <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-4">
            Félicitations&nbsp;!
          </h1>
          <div className="divider-gold mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed text-xl max-w-lg mx-auto">
            Votre réservation est confirmée. Notre équipe vous contactera sur{" "}
            <strong className="text-foreground">WhatsApp</strong> au créneau choisi pour votre entretien
            de 45 minutes.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-secondary p-8 sm:p-10 mb-10">
          <h2 className="font-heading text-2xl text-foreground mb-2">
            En attendant votre appel…
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Voici quelques conseils pour préparer au mieux votre entretien.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-background flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <h3 className="font-heading text-base text-foreground mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/onboarding")}
          className="btn-outline px-10 py-4 text-base"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
