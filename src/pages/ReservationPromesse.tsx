import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Phone, FileText, Video, Headphones } from "lucide-react";

const SERVICE_STEPS = [
  {
    icon: Phone,
    title: "Entretien téléphonique privé",
    description: "45 minutes d'écoute attentive pour comprendre vos attentes et votre personnalité.",
  },
  {
    icon: FileText,
    title: "Création de votre profil",
    description: "Nous remplissons ensemble l'intégralité de votre profil, mot par mot.",
  },
  {
    icon: Video,
    title: "Accompagnement vidéo",
    description: "Nos conseils personnalisés pour réussir votre vidéo de présentation.",
  },
  {
    icon: Headphones,
    title: "Zéro stress technique",
    description: "Nous nous occupons de tout. Vous n'avez rien à faire.",
  },
];

const GUARANTEES = [
  "Paiement 100% sécurisé via Stripe",
  "Garantie satisfait ou remboursé",
  "Aucun engagement supplémentaire",
  "Vos données restent confidentielles",
];

export default function ReservationPromesse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="section-luxury text-center">
        <div className="max-w-3xl mx-auto">
          <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-6 text-lg font-medium">
            Service Conciergerie
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
            Zéro effort,
            <br />
            un profil parfait
          </h1>
          <div className="divider-gold mx-auto mb-8" />
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            Confiez-nous la création de votre profil. En un seul appel de 45 minutes, notre équipe s'occupe de tout
            pour que vous puissiez vous concentrer sur l'essentiel&nbsp;: faire de belles rencontres.
          </p>
          <p className="text-[hsl(var(--gold))] font-heading text-3xl sm:text-4xl font-semibold mb-12">
            89&nbsp;€
          </p>
        </div>
      </section>

      {/* Les 4 étapes du service */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground text-center mb-16">
            Comment ça se passe&nbsp;?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-secondary flex items-center justify-center transition-colors group-hover:bg-[hsl(var(--gold)/0.1)]">
                    <Icon className="h-7 w-7 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="text-muted-foreground text-sm tracking-[0.2em] uppercase block mb-2">
                    Étape {i + 1}
                  </span>
                  <h3 className="font-heading text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="py-20 px-6 md:px-12 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-background flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold))]" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
            Garantie 100% remboursé
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Si notre service ne répond pas à vos attentes, nous vous remboursons intégralement. Sans condition, sans
            délai.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
            {GUARANTEES.map((g, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <Check className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" />
                <span className="text-foreground text-sm font-medium">{g}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/reservation/calendrier")}
            className="btn-primary px-12 py-5 text-lg shadow-xl hover:scale-[1.02] transition-transform"
          >
            Réserver mon créneau →
          </button>
        </div>
      </section>
    </div>
  );
}
