import { useNavigate } from "react-router-dom";
import {
  Check,
  ShieldCheck,
  Camera,
  Brain,
  ClipboardList,
  Sparkles,
  Headphones,
  ArrowRight,
  Mail,
  ChevronDown,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import conciergeHero from "@/assets/concierge-hero.jpg";
import promiseStep1 from "@/assets/promise-step1.jpg";
import promiseStep2 from "@/assets/promise-step2.jpg";
import promiseStep3 from "@/assets/promise-step3.jpg";
import promiseStep4 from "@/assets/promise-step4.jpg";

const SERVICE_STEPS = [
  {
    number: "01",
    icon: Brain,
    title: "Quiz des 3 préférences",
    subtitle: "Vos goûts, vos passions",
    preparation: "Réfléchissez simplement, en toute décontraction, à ce qui vous anime au quotidien.",
    action:
      "Nous parcourons notre quiz ludique pour sélectionner ensemble vos centres d'intérêt, vos goûts culturels et vos loisirs favoris.",
    result: "Des éléments concrets et positifs ajoutés à votre profil pour briser la glace facilement.",
    image: promiseStep2,
  },
  {
    number: "02",
    icon: Camera,
    title: "Vos photos & vidéo",
    subtitle: "Votre image authentique",
    preparation: "Repérez 2 ou 3 photos récentes de vous dans votre téléphone où vous vous plaisez.",
    action:
      "Nous sélectionnons ensemble les meilleurs clichés et vous guidons pour enregistrer une courte présentation vidéo naturelle.",
    result: "Un profil visuel lumineux, rassurant et très attractif pour vos futurs contacts.",
    image: promiseStep4,
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Mon profil & Son profil",
    subtitle: "La fondation de vos rencontres",
    preparation: "Installez-vous confortablement. Aucune préparation écrite n'est requise.",
    action:
      "Nous échangeons naturellement en vidéo autour de nos 50 questions pour comprendre votre parcours et la personne que vous recherchez.",
    result: "Votre conseiller rédige l'intégralité de votre description mot pour mot, avec justesse et élégance.",
    image: promiseStep1,
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Ma personnalité",
    subtitle: "Mieux vous comprendre",
    preparation: "Soyez simplement vous-même, honnête et spontané.",
    action: "Nous remplissons ensemble votre test de personnalité afin d'analyser votre dynamique relationnelle.",
    result:
      "Un portrait psychologique subtil qui permettra à notre algorithme de vous présenter les meilleures compatibilités.",
    image: promiseStep3,
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

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

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
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/95" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span
            data-reveal
            className="text-lg font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block md:text-xl"
          >
            Service Conciergerie
          </span>

          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-5xl md:text-7xl font-medium text-primary-foreground mb-6 leading-tight"
          >
            Un profil sur-mesure,
            <br />
            sans le moindre effort technique.
          </h1>

          <p
            data-reveal
            data-reveal-delay="300"
            className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Confiez-nous la création de votre profil. En un seul appel vidéo, notre équipe s'occupe de tout pour que
            vous puissiez vous concentrer sur l'essentiel : rencontrer la personne qui vous correspond vraiment.
          </p>

          <div
            data-reveal
            data-reveal-delay="450"
            className="inline-block bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-10 py-6 mb-12"
          >
            <span className="font-heading text-6xl md:text-7xl font-medium text-[hsl(var(--gold-light))]">89 €</span>
            <p className="text-primary-foreground/70 mt-2 text-xl">Paiement unique · Sans abonnement</p>
          </div>

       <div data-reveal data-reveal-delay="600" className="flex flex-col items-center">
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-lg"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
            
            {/* Mention de réassurance ajoutée ici */}
            <div className="flex items-center gap-2 mt-4 text-primary-foreground/80 font-medium text-base md:text-lg">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--gold-light))]" />
              <span>Garantie 100% satisfait ou remboursé</span>
            </div>
          </div>

      {/* Overview — what's included */}
      <section ref={overviewRef} className="section-luxury bg-background text-center pt-24 pb-20">
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

          {/* Step numbers preview */}
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
            <div className={`relative min-h-[40vh] lg:h-[650px] ${index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}`}>
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
                  <span className="font-medium tracking-[0.2em] uppercase text-muted-foreground text-xl">
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

                <p data-reveal data-reveal-delay="150" className="text-[hsl(var(--gold))] font-medium mb-8 text-2xl">
                  {step.subtitle}
                </p>

                {/* Structured details: Before, During, After */}
                <div data-reveal data-reveal-delay="250" className="space-y-6">
                  <div className="bg-background/50 p-5 rounded-lg border border-border">
                    <span className="font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block text-xl">
                      VOTRE SEULE PRÉPARATION :
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xl">{step.preparation}</p>
                  </div>

                  <div className="bg-background/50 p-5 rounded-lg border border-border">
                    <span className="font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block text-xl">
                      NOTRE ÉCHANGE :
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xl">{step.action}</p>
                  </div>

                  <div className="bg-primary/5 p-5 rounded-lg border border-[hsl(var(--gold)/0.2)]">
                    <span className="font-bold tracking-wider uppercase text-[hsl(var(--gold))] mb-2 block text-xl">
                      VOTRE PROFIL :
                    </span>
                    <p className="text-foreground font-medium leading-relaxed text-xl">{step.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Post-Call Delivery Email Section (Changed to Soft Secondary for harmony) */}
      <section className="py-24 bg-secondary text-foreground text-center px-6">
        <div className="max-w-3xl mx-auto">
          <Mail className="w-16 h-16 text-[hsl(var(--gold))] mx-auto mb-8" />
          <h2 className="font-heading text-4xl md:text-5xl mb-6">Et après notre appel ?</h2>
          <div className="w-12 h-px bg-[hsl(var(--gold)/0.5)] mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed mb-6 font-medium">
            Le travail est terminé de votre côté. Nos experts prennent le relais en studio.
          </p>
          <p className="text-muted-foreground leading-relaxed text-xl">
            D'ici <strong>24 à 48 heures</strong>, vous recevrez un email contenant le récapitulatif complet et un
            aperçu visuel de votre profil finalisé. Vous pourrez tout vérifier sereinement avant que votre profil ne
            devienne officiellement visible.
          </p>
        </div>
      </section>

      {/* Pricing recap */}
      <section className="relative py-28 lg:py-36 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--gold))] rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(var(--gold-light))] rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span
              data-reveal
              className="inline-block px-5 py-2 bg-primary-foreground/8 backdrop-blur-sm border border-primary-foreground/15 rounded-full font-medium tracking-[0.2em] uppercase text-primary-foreground/60 mb-8 text-lg"
            >
              VOTRE CONCIERGERIE.
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-5 leading-tight"
            >
              Tout est inclus pour 89 €
            </h2>
            <p
              data-reveal
              data-reveal-delay="300"
              className="text-primary-foreground/60 max-w-xl mx-auto text-xl leading-relaxed"
            >
              Un paiement unique, sans abonnement, sans surprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto mb-14">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(100 + i * 80)}
                className="flex items-start gap-4 bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] p-5 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-primary-foreground/[0.07]"
              >
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--gold)/0.15)] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-[hsl(var(--gold-light))]" />
                </div>
                <span className="text-primary-foreground/85 leading-snug text-xl">{item}</span>
              </div>
            ))}
          </div>

          <div data-reveal data-reveal-delay="400" className="text-center">
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 bg-[hsl(var(--gold))] text-primary px-12 py-5 font-semibold tracking-wide transition-all duration-500 hover:shadow-elevated hover:brightness-110 text-lg rounded-full"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section ref={guaranteeRef} className="py-24 lg:py-32 bg-secondary/40">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div
              data-reveal
              className="w-20 h-20 mx-auto mb-8 bg-[hsl(var(--gold)/0.1)] flex items-center justify-center rounded-2xl"
            >
              <ShieldCheck className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-5 leading-tight"
            >
              Garantie Sérénité Absolue
            </h2>
            <div data-reveal data-reveal-delay="200" className="w-12 h-px bg-[hsl(var(--gold)/0.4)] mx-auto mb-8" />
            <p
              data-reveal
              data-reveal-delay="300"
              className="text-muted-foreground text-xl leading-relaxed mb-12 max-w-xl mx-auto"
            >
              Si à la réception de l'email de livraison, notre service ne répond pas à vos attentes, nous vous
              remboursons intégralement. Sans condition, sans délai.
            </p>
            <div className="grid sm:grid-cols-2 gap-5 max-w-lg mx-auto">
              {GUARANTEES.map((g, i) => (
                <div
                  key={i}
                  data-reveal
                  data-reveal-delay={String(400 + i * 100)}
                  className="flex items-center gap-4 text-left bg-background p-4 rounded-xl border border-border/60 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="text-foreground font-medium leading-snug text-xl">{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-28 lg:py-36 bg-[#232a39]">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <div data-reveal className="w-14 h-14 mx-auto mb-8 bg-primary/5 flex items-center justify-center rounded-2xl">
            <Headphones className="h-7 w-7 text-[hsl(var(--gold))]" />
          </div>
          <span
            data-reveal
            data-reveal-delay="100"
            className="font-medium tracking-[0.2em] uppercase mb-6 block text-xl text-primary-foreground"
          >
            UN ACCOMPAGNEMENT SUR-MESURE
          </span>
          <h2
            data-reveal
            data-reveal-delay="200"
            className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-primary-foreground"
          >
            Prêt à écrire votre prochain chapitre ?
          </h2>
          <div data-reveal data-reveal-delay="250" className="w-12 h-px bg-[hsl(var(--gold)/0.4)] mx-auto mb-8" />
          <p
            data-reveal
            data-reveal-delay="350"
            className="mb-14 max-w-2xl mx-auto text-xl leading-relaxed text-primary-foreground"
          >
            Nous nous occupons de tout. Vous n'avez qu'à répondre à nos questions en vidéo, et votre portrait sera prêt
            à séduire les membres qui vous correspondent.
          </p>
          <div data-reveal data-reveal-delay="450" className="flex flex-col items-center gap-6">
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="inline-flex items-center gap-3 px-14 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-xl rounded-full bg-[#e2a336] text-[#232a39]"
            >
              Réserver mon créneau
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/onboarding?step=welcome&showPricing=true")}
              className="text-primary-foreground/60 hover:text-primary-foreground underline underline-offset-4 text-base transition-colors"
            >
              ← Revenir à l'option gratuite
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
