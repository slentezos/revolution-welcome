import { useNavigate } from "react-router-dom";
import {
  Check,
  ShieldCheck,
  Video,
  Camera,
  Brain,
  ClipboardList,
  Sparkles,
  Headphones,
  ArrowRight,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import conciergeHero from "@/assets/concierge-hero.jpg";
import conciergePhotos from "@/assets/concierge-photos.jpg";
import conciergeQuestionnaire from "@/assets/concierge-questionnaire.jpg";
import coupleCafe from "@/assets/couple-cafe.jpg";
import coupleBeach from "@/assets/couple-beach.jpg";

const SERVICE_STEPS = [
  {
    number: "01",
    icon: Video,
    title: "L'appel vidéo privé",
    subtitle: "Un moment d'échange privilégié",
    description:
      "Votre conseiller vous appelle en vidéo sur votre smartphone. Installez-vous confortablement, nous faisons connaissance à votre rythme, sans aucune limite de temps préétablie.",
    image: conciergeHero,
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Le questionnaire approfondi",
    subtitle: "Nous rédigeons pour vous",
    description:
      "Pendant notre discussion, nous parcourons ensemble notre méthode des 50 questions. Vous parlez naturellement, et votre conseiller se charge de tout rédiger et structurer avec élégance.",
    image: conciergeQuestionnaire,
  },
  {
    number: "03",
    icon: Brain,
    title: "Le Quiz & La Personnalité",
    subtitle: "Vos valeurs, vos passions",
    description:
      "Toujours à l'oral, nous remplissons ensemble votre test de personnalité et le quiz de préférences. Une analyse fine pour comprendre votre fonctionnement et cibler vos futures compatibilités.",
    image: coupleBeach,
  },
  {
    number: "04",
    icon: Camera,
    title: "La sélection de vos photos",
    subtitle: "Votre meilleure image",
    description:
      "Nous regardons ensemble les photos de votre téléphone pour sélectionner celles qui vous mettent le plus en valeur, avec le regard bienveillant et objectif de notre expert.",
    image: coupleCafe,
  },
  {
    number: "05",
    icon: Sparkles,
    title: "L'enregistrement vidéo",
    subtitle: "Authentique et guidé",
    description:
      "Avant de raccrocher, nous vous guidons pas à pas pour enregistrer une courte présentation vidéo très naturelle directement depuis votre téléphone. Ne préparez rien, laissez-vous porter.",
    image: conciergePhotos,
  },
];

const GUARANTEES = [
  "Paiement 100% sécurisé via Stripe",
  "Garantie satisfait ou remboursé",
  "Aucun engagement supplémentaire",
  "Vos données restent confidentielles",
];

const INCLUDED = [
  "Appel vidéo privé avec votre conseiller",
  "Rédaction intégrale de votre profil",
  "Sélection de photos et guide vidéo",
  "Quiz des préférences rempli ensemble",
  "Questionnaire approfondi rédigé pour vous",
  "Test de personnalité guidé",
];

export default function ReservationPromesse() {
  const navigate = useNavigate();
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const overviewRef = useScrollReveal<HTMLElement>();
  const guaranteeRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      {/* Hero — full bleed with overlay */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={conciergeHero}
            alt="Service conciergerie Kalimera"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/90" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span
            data-reveal
            className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block md:text-2xl"
          >
            Service Conciergerie
          </span>

          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-5xl md:text-7xl font-medium text-primary-foreground mb-6 leading-tight"
          >
            Zéro effort,
            <br />
            un profil parfait
          </h1>

          <p
            data-reveal
            data-reveal-delay="300"
            className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Confiez-nous la création de votre profil. En un seul appel vidéo, notre équipe s'occupe de tout pour que
            vous puissiez vous concentrer sur l'essentiel : faire de belles rencontres.
          </p>

          <div
            data-reveal
            data-reveal-delay="450"
            className="inline-block bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-10 py-6 mb-12"
          >
            <span className="font-heading text-6xl md:text-7xl font-medium text-[hsl(var(--gold-light))]">89 €</span>
            <p className="text-primary-foreground/70 mt-2 text-2xl">Paiement unique · Sans abonnement</p>
          </div>

          <div data-reveal data-reveal-delay="600">
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-lg"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Overview — what's included */}
      <section ref={overviewRef} className="section-luxury bg-background text-center">
        <div className="container-main mx-auto px-6 md:px-12">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
            Ce qui est inclus
          </span>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8"
          >
            Votre profil complet en 5 étapes
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          {/* Step numbers preview */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-10 max-w-5xl mx-auto">
            {SERVICE_STEPS.map((step, i) => (
              <div
                key={step.number}
                data-reveal
                data-reveal-delay={String(300 + i * 120)}
                className="group text-center"
              >
                <span className="font-heading text-4xl font-medium text-[hsl(var(--gold))] block mb-3 md:text-6xl">
                  {step.number}
                </span>
                <div className="w-8 h-px bg-[hsl(var(--gold)/0.4)] mx-auto mb-3 group-hover:w-12 transition-all duration-300" />
                <h3 className="font-heading text-base text-foreground leading-tight px-px md:text-2xl">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating step blocks */}
      {SERVICE_STEPS.map((step, index) => {
        const stepRef = useScrollReveal<HTMLElement>();
        const Icon = step.icon;
        return (
          <section ref={stepRef} key={step.number} className="grid lg:grid-cols-2">
            {/* Image Container - Raccourci drastiquement ici */}
            <div className={`relative min-h-[40vh] lg:h-[550px] ${index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}`}>
              <img
                data-reveal
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={1200}
                height={800}
              />
              <div className="absolute top-10 left-10 md:top-16 md:left-16">
                <span className="font-heading text-8xl md:text-9xl font-medium text-primary-foreground/20">
                  {step.number}
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              className={`flex items-center justify-center p-10 md:p-16 lg:p-20 ${
                index % 2 === 0 ? "bg-background order-2" : "bg-secondary order-2 lg:order-1"
              }`}
            >
              <div className="max-w-lg">
                <div data-reveal className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground text-xl">
                    Étape {step.number}
                  </span>
                </div>

                <h2
                  data-reveal
                  data-reveal-delay="150"
                  className="font-heading text-4xl md:text-5xl text-foreground mb-3 leading-tight"
                >
                  {step.title}
                </h2>

                <p data-reveal data-reveal-delay="200" className="text-[hsl(var(--gold))] font-medium mb-6 text-xl">
                  {step.subtitle}
                </p>

                <div data-reveal data-reveal-delay="250" className="divider-gold mb-8" />

                <p data-reveal data-reveal-delay="350" className="text-muted-foreground leading-relaxed text-xl">
                  {step.description}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Pricing recap */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(var(--navy-light))]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[hsl(var(--gold-light))] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span
              data-reveal
              className="inline-block px-6 py-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 font-medium tracking-[0.3em] uppercase text-primary-foreground/70 mb-8 text-lg"
            >
              Récapitulatif
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6"
            >
              Tout est inclus pour 89 €
            </h2>
            <p data-reveal data-reveal-delay="300" className="text-primary-foreground/60 text-xl max-w-xl mx-auto">
              Un paiement unique, sans abonnement, sans surprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(100 + i * 100)}
                className="flex items-start gap-4 bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 p-6"
              >
                <Check className="h-5 w-5 text-[hsl(var(--gold-light))] mt-0.5 shrink-0" />
                <span className="text-primary-foreground text-xl">{item}</span>
              </div>
            ))}
          </div>

          <div data-reveal data-reveal-delay="400" className="text-center">
            <span className="font-heading text-7xl md:text-8xl font-medium text-[hsl(var(--gold-light))] block mb-4">
              89 €
            </span>
            <p className="text-primary-foreground/50 mb-10 text-xl">Paiement unique</p>
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-lg"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section ref={guaranteeRef} className="section-luxury bg-secondary">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div data-reveal className="w-16 h-16 mx-auto mb-6 bg-background flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold))]" />
            </div>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4"
            >
              Garantie 100% remboursé
            </h2>
            <p
              data-reveal
              data-reveal-delay="300"
              className="text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto text-2xl"
            >
              Si notre service ne répond pas à vos attentes, nous vous remboursons intégralement. Sans condition, sans
              délai.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {GUARANTEES.map((g, i) => (
                <div
                  key={i}
                  data-reveal
                  data-reveal-delay={String(400 + i * 100)}
                  className="flex items-center gap-3 text-left"
                >
                  <Check className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" />
                  <span className="text-foreground font-medium text-xl">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
            <Headphones className="h-6 w-6 inline-block mr-3 -mt-1" />
            Zéro stress technique
          </span>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Prêt à vous lancer ?
          </h2>
          <p data-reveal data-reveal-delay="300" className="text-muted-foreground mb-12 max-w-2xl mx-auto text-2xl">
            Nous nous occupons de tout. Vous n'avez qu'à répondre à nos questions en vidéo, et votre profil sera prêt à
            rencontrer l'amour.
          </p>
          <div data-reveal data-reveal-delay="450">
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-xl"
            >
              Réserver mon créneau →
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
