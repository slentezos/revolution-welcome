import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Camera, Brain, ClipboardList, Sparkles, Headphones, ArrowRight, Mail } from "lucide-react";
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
    icon: ClipboardList,
    title: "Mon profil & Son profil",
    subtitle: "La fondation de vos rencontres",
    preparation: "Installez-vous confortablement. Aucune préparation écrite n'est requise.",
    action:
      "Nous échangeons naturellement en vidéo autour de nos 50 questions pour comprendre votre parcours et la personne que vous recherchez.",
    result: "Votre conseiller rédige l'intégralité de votre description mot pour mot, avec justesse et élégance.",
    image: conciergeQuestionnaire,
  },
  {
    number: "02",
    icon: Brain,
    title: "Quiz des 3 préférences",
    subtitle: "Vos goûts, vos passions",
    preparation: "Réfléchissez simplement, en toute décontraction, à ce qui vous anime au quotidien.",
    action:
      "Nous parcourons notre quiz ludique pour sélectionner ensemble vos centres d'intérêt, vos goûts culturels et vos loisirs favoris.",
    result: "Des éléments concrets et positifs ajoutés à votre profil pour briser la glace facilement.",
    image: coupleBeach,
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Ma personnalité",
    subtitle: "Mieux vous comprendre",
    preparation: "Soyez simplement vous-même, honnête et spontané.",
    action: "Nous remplissons ensemble votre test de personnalité afin d'analyser votre dynamique relationnelle.",
    result:
      "Un portrait psychologique subtil qui permettra à notre algorithme de vous présenter les meilleures compatibilités.",
    image: coupleCafe,
  },
  {
    number: "04",
    icon: Camera,
    title: "Vos photos & vidéo",
    subtitle: "Votre image authentique",
    preparation: "Repérez 2 ou 3 photos récentes de vous dans votre téléphone où vous vous plaisez.",
    action:
      "Nous sélectionnons ensemble les meilleurs clichés et vous guidons pour enregistrer une courte présentation vidéo naturelle.",
    result: "Un profil visuel lumineux, rassurant et très attractif pour vos futurs contacts.",
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
  "Appel vidéo privé avec votre expert",
  "Création complète du profil (50 questions)",
  "Quiz des 3 préférences et Personnalité",
  "Sélection de photos et guide vidéo",
  "Aperçu final envoyé par email",
  "3 mois d'abonnement offerts à l'activation",
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
            className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block md:text-xl"
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
            <p className="text-primary-foreground/70 text-base mt-2">Paiement unique · Sans abonnement</p>
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
            Pendant notre appel vidéo
          </span>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8"
          >
            Votre profil complet en 4 étapes
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          {/* Step numbers preview - Changed to 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-4xl mx-auto">
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

      {/* Alternating step blocks with new structure */}
      {SERVICE_STEPS.map((step, index) => {
        const stepRef = useScrollReveal<HTMLElement>();
        const Icon = step.icon;
        return (
          <section ref={stepRef} key={step.number} className="grid lg:grid-cols-2 border-t border-border/50">
            {/* Image Container */}
            <div className={`relative min-h-[40vh] lg:h-[600px] ${index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}`}>
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
              className={`flex items-center justify-center p-8 md:p-12 lg:p-16 ${
                index % 2 === 0 ? "bg-background order-2" : "bg-secondary/30 order-2 lg:order-1"
              }`}
            >
              <div className="max-w-xl w-full">
                <div data-reveal className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium tracking-[0.2em] uppercase text-muted-foreground text-base">
                    Étape {step.number}
                  </span>
                </div>

                <h2
                  data-reveal
                  data-reveal-delay="100"
                  className="font-heading text-3xl md:text-4xl text-foreground mb-2 leading-tight"
                >
                  {step.title}
                </h2>

                <p data-reveal data-reveal-delay="150" className="text-[hsl(var(--gold))] font-medium text-lg mb-8">
                  {step.subtitle}
                </p>

                {/* Structured details: Before, During, After */}
                <div data-reveal data-reveal-delay="250" className="space-y-6">
                  <div className="bg-background/50 p-5 rounded-lg border border-border">
                    <span className="text-xs font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block">
                      Ce qu'il vous faut préparer :
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{step.preparation}</p>
                  </div>

                  <div className="bg-background/50 p-5 rounded-lg border border-border">
                    <span className="text-xs font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block">
                      Ce que nous ferons ensemble :
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{step.action}</p>
                  </div>

                  <div className="bg-primary/5 p-5 rounded-lg border border-[hsl(var(--gold)/0.2)]">
                    <span className="text-xs font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block">
                      Le résultat :
                    </span>
                    <p className="text-foreground font-medium leading-relaxed">{step.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Post-Call Delivery Email Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center px-6">
        <div className="max-w-3xl mx-auto">
          <Mail className="w-16 h-16 text-[hsl(var(--gold-light))] mx-auto mb-8" />
          <h2 className="font-heading text-4xl md:text-5xl mb-6">Et après notre appel ?</h2>
          <div className="w-12 h-px bg-[hsl(var(--gold-light)/0.5)] mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-6">
            Le travail est terminé de votre côté. Nos experts prennent le relais en studio.
          </p>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            D'ici <strong>24 à 48 heures</strong>, vous recevrez un email contenant le récapitulatif complet et un
            aperçu visuel de votre profil finalisé. Vous pourrez tout vérifier sereinement avant que votre profil ne
            devienne officiellement visible.
          </p>
        </div>
      </section>

      {/* Pricing recap */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary" />

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span
              data-reveal
              className="inline-block px-6 py-2 bg-primary/5 backdrop-blur-sm border border-primary/10 font-medium tracking-[0.3em] uppercase text-primary/70 mb-8 text-lg"
            >
              Récapitulatif
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
            >
              Tout est inclus pour 89 €
            </h2>
            <p data-reveal data-reveal-delay="300" className="text-muted-foreground text-xl max-w-xl mx-auto">
              Un paiement unique, sans abonnement, sans surprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(100 + i * 100)}
                className="flex items-start gap-4 bg-background border border-border p-6 shadow-sm"
              >
                <Check className="h-5 w-5 text-[hsl(var(--gold))] mt-0.5 shrink-0" />
                <span className="text-foreground text-lg">{item}</span>
              </div>
            ))}
          </div>

          <div data-reveal data-reveal-delay="400" className="text-center">
            <span className="font-heading text-7xl md:text-8xl font-medium text-[hsl(var(--gold))] block mb-4">
              89 €
            </span>
            <p className="text-muted-foreground text-base mb-10">Paiement unique</p>
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-lg"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section ref={guaranteeRef} className="section-luxury bg-secondary border-t border-border">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div
              data-reveal
              className="w-16 h-16 mx-auto mb-6 bg-background flex items-center justify-center shadow-sm"
            >
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
              className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-xl mx-auto"
            >
              Si à la réception de l'email de livraison, notre service ne répond pas à vos attentes, nous vous
              remboursons intégralement. Sans condition, sans délai.
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
                  <span className="text-foreground text-sm font-medium">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg">
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
          <p data-reveal data-reveal-delay="300" className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl">
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
