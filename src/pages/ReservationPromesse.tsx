import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";

const GUARANTEES = [
  "Paiement 100% sécurisé",
  "Rendez-vous humain et privé",
  "Aucun effort technique requis",
  "Garantie satisfait ou remboursé",
];

export default function ReservationPromesse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-foreground">
      {/* 1. HERO SECTION (L'Accroche Premium) */}
      <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <span className="tracking-[0.2em] uppercase text-[hsl(var(--gold))] block mb-6 text-sm font-semibold">
          Service Premium • 89 €
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight mb-8 text-foreground">
          Un profil parfait, <br className="hidden sm:block" />
          sans aucun effort technique.
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          Détendez-vous. Notre équipe s'occupe de créer votre profil de A à Z pour vous mettre en valeur avec élégance.
          Le service tout compris pour démarrer vos rencontres sereinement.
        </p>
        <button
          onClick={() => navigate("/reservation/calendrier")}
          className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[hsl(var(--gold))] text-primary-foreground font-semibold rounded-full text-lg shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
        >
          Choisir la date de mon appel <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* 2. LES ÉTAPES EN ZIG-ZAG (Respiration et Pacing) */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-24 sm:space-y-32">
        {/* Étape 1 : Image à gauche, Texte à droite */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-secondary/50 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
            {/* TODO Image: Senior souriant avec un café devant son téléphone */}
            <span className="text-muted-foreground font-mono text-sm opacity-50 absolute">
              Image_Senior_Appel_Video.jpg
            </span>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-[hsl(var(--gold))] font-heading text-6xl opacity-30 absolute -z-10 -ml-8 -mt-8">
              01
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl leading-tight">
              L'appel vidéo en <br /> toute simplicité
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              À la date et l'heure choisies, votre conseiller personnel vous appelle en vidéo sur votre téléphone
              portable. Installez-vous confortablement, vous n'avez besoin d'aucune compétence informatique.
            </p>
          </div>
        </div>

        {/* Étape 2 : Texte à gauche, Image à droite */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-secondary/50 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
            {/* TODO Image: Un conseiller bienveillant au téléphone / clavier */}
            <span className="text-muted-foreground font-mono text-sm opacity-50 absolute">
              Image_Conseiller_Kalimera.jpg
            </span>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-[hsl(var(--gold))] font-heading text-6xl opacity-30 absolute -z-10 -ml-8 -mt-8">
              02
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl leading-tight">
              Nous remplissons <br /> tout à votre place
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fini les formulaires fastidieux. Vous nous répondez naturellement à l'oral, et le conseiller se charge de
              tout rédiger et structurer dans notre système avec des mots qui vous mettent en valeur.
            </p>
          </div>
        </div>

        {/* Étape 3 : Image à gauche, Texte à droite */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-secondary/50 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
            {/* TODO Image: Un beau profil sur un téléphone ou une jolie photo en train d'être prise */}
            <span className="text-muted-foreground font-mono text-sm opacity-50 absolute">Image_Photos_Video.jpg</span>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-[hsl(var(--gold))] font-heading text-6xl opacity-30 absolute -z-10 -ml-8 -mt-8">
              03
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl leading-tight">
              Vos photos et vidéo <br /> sur-mesure
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pendant l'appel, nous vous guidons pas à pas pour enregistrer une courte présentation vidéo très
              naturelle. Ne préparez rien, laissez-vous guider.
            </p>
          </div>
        </div>

        {/* Étape 4 : Texte à gauche, Image à droite */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-secondary/50 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
            {/* TODO Image: Écran du profil Kalimera finalisé et élégant */}
            <span className="text-muted-foreground font-mono text-sm opacity-50 absolute">Image_Profil_Livre.jpg</span>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-[hsl(var(--gold))] font-heading text-6xl opacity-30 absolute -z-10 -ml-8 -mt-8">
              04
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl leading-tight">
              Le montage <br /> et la livraison
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nous réalisons le montage de votre vidéo, optimisons vos photos, et mettons votre profil en page avec
              élégance. D'ici 24 à 48 heures, vous recevrez votre profil finalisé.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LE BOUCLIER DE CONFIANCE (La Garantie) */}
      <section className="mt-16 px-6">
        <div className="max-w-4xl mx-auto bg-secondary/30 rounded-3xl p-8 sm:p-16 border border-border text-center">
          <ShieldCheck className="w-16 h-16 text-[hsl(var(--gold))] mx-auto mb-6" />
          <h2 className="font-heading text-3xl sm:text-4xl mb-6">Garantie Sérénité</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            Si, lors de la découverte de votre profil final, le résultat ne vous donne pas entière satisfaction, vous
            êtes intégralement remboursé, sans discussion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12 text-left">
            {GUARANTEES.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[hsl(var(--gold))] shrink-0" />
                <span className="text-muted-foreground text-base">{g}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/reservation/calendrier")}
            className="w-full sm:w-auto px-12 py-5 bg-[hsl(var(--gold))] text-primary-foreground font-semibold rounded-full text-lg shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-3"
          >
            Réserver mon entretien (89 €) <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
