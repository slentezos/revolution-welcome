import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Smartphone, Edit3, Camera, Clock } from "lucide-react";

const SERVICE_STEPS = [
  {
    icon: Smartphone,
    title: "1. L'appel vidéo en toute simplicité",
    description:
      "À la date et l'heure choisies, votre conseiller personnel vous appelle en vidéo sur votre téléphone portable. Installez-vous confortablement, vous n'avez besoin d'aucune compétence informatique.",
  },
  {
    icon: Edit3,
    title: "2. Nous remplissons tout à votre place",
    description:
      "Fini les formulaires fastidieux. Vous nous répondez naturellement à l'oral, et le conseiller se charge de tout rédiger et structurer dans notre système.",
  },
  {
    icon: Camera,
    title: "3. Vos photos et vidéo sur-mesure",
    description:
      "Pendant l'appel, nous vous guidons pas à pas pour enregistrer une courte présentation vidéo très naturelle. Ne préparez rien, laissez-vous guider.",
  },
  {
    icon: Clock,
    title: "4. Le montage et la livraison",
    description:
      "Nous réalisons le montage de votre vidéo, optimisons vos photos, et mettons votre profil en page avec élégance. D'ici 24 à 48 heures, vous recevrez votre profil finalisé.",
  },
];

const GUARANTEES = [
  "Paiement 100% sécurisé",
  "Rendez-vous humain et privé",
  "Aucun effort technique requis",
  "Garantie satisfait ou remboursé",
];

export default function ReservationPromesse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="tracking-[0.2em] uppercase text-[hsl(var(--gold))] block mb-4 text-sm font-semibold">
            Service Premium
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground leading-tight mb-6">
            Un profil parfait, <br className="hidden sm:block" />
            sans aucun effort technique.
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Détendez-vous. Notre équipe s'occupe de créer votre profil de A à Z pour vous mettre en valeur avec
            élégance.
          </p>
        </div>
      </section>

      {/* Pricing & Steps Card (The "Pricing Page" look) */}
      <section className="px-6 md:px-12">
        <div className="max-w-4xl mx-auto bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
          {/* Header of the card */}
          <div className="bg-secondary/50 p-8 sm:p-12 text-center border-b border-border">
            <h2 className="font-heading text-3xl text-foreground mb-4">La Conciergerie Privée</h2>
            <div className="flex justify-center items-baseline gap-2 mb-4">
              <span className="font-heading text-5xl font-bold text-foreground">89 €</span>
              <span className="text-muted-foreground text-lg">/ paiement unique</span>
            </div>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Le service tout compris pour démarrer vos rencontres sereinement, avec l'aide d'un expert.
            </p>
          </div>

          {/* Body of the card: The 4 Steps */}
          <div className="p-8 sm:p-12">
            <h3 className="font-heading text-2xl text-foreground text-center mb-10">Comment ça se passe ?</h3>
            <div className="space-y-10">
              {SERVICE_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="shrink-0 w-14 h-14 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center border border-[hsl(var(--gold)/0.2)]">
                      <Icon className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <div>
                      <h4 className="font-heading text-xl text-foreground mb-2">{step.title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-[16px]">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer of the card: Guarantee & CTA */}
          <div className="bg-secondary/30 p-8 sm:p-12 border-t border-border">
            <div className="bg-background border border-[hsl(var(--gold)/0.3)] rounded-xl p-6 mb-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[hsl(var(--gold))]"></div>
              <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold))] mx-auto mb-3" />
              <h4 className="font-heading text-xl text-foreground mb-2">Garantie Sérénité</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Si, lors de la découverte de votre profil final, le résultat ne vous donne pas entière satisfaction,
                vous êtes intégralement remboursé, sans discussion.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {GUARANTEES.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0" />
                  <span className="text-muted-foreground text-sm">{g}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/reservation/calendrier")}
                className="w-full sm:w-auto px-12 py-5 bg-[hsl(var(--gold))] text-primary-foreground font-semibold rounded-full text-lg shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                Choisir la date de mon appel →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
