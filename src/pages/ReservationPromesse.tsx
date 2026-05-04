import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Camera, Brain, ClipboardList, Sparkles, Headphones, ArrowRight, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

// Assets (Assurez-vous que les chemins sont corrects)
import conciergeHero from "@/assets/concierge-hero.jpg";
import promiseStep1 from "@/assets/promise-step1.jpg";
import promiseStep2 from "@/assets/promise-step2.jpg";
import promiseStep3 from "@/assets/promise-step3.jpg";
import promiseStep4 from "@/assets/promise-step4.jpg";

const SERVICE_STEPS = [
  {
    id: "step-01",
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
    id: "step-02",
    number: "02",
    icon: Camera,
    title: "Vos photos & vidéo",
    subtitle: "Votre image authentique",
    preparation: "Repérez 2 ou 3 photos récentes de vous dans votre téléphone où vous vous plaisez.",
    action:
      "Lors de notre appel vidéo en direct, nous sélectionnons ensemble vos meilleures photos. Ensuite, à votre rythme et uniquement lorsque vous vous sentez parfaitement prêt(e), nous enregistrons votre courte présentation vidéo.",
    result: "Un profil visuel lumineux, rassurant et très attractif pour vos futurs contacts.",
    image: promiseStep4,
  },
  {
    id: "step-03",
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
    id: "step-04",
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
  const [activeStep, setActiveStep] = useState("01");

  // Refs pour le scroll reveal
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const overviewRef = useScrollReveal<HTMLElement>();
  const guaranteeRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  // Logic pour détecter l'étape active au scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Déclenche quand la section occupe le centre de l'écran
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepNumber = entry.target.getAttribute("data-step-number");
          if (stepNumber) setActiveStep(stepNumber);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    SERVICE_STEPS.forEach((step) => {
      const el = document.getElementById(step.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -140; // Hauteur de la barre collante + marge
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={conciergeHero} alt="Conciergerie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/95" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span
            data-reveal
            className="text-lg font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block"
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
            className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
            Confiez-nous la création de votre profil. En un seul appel vidéo, notre équipe s'occupe de tout.
          </p>

          <div
            data-reveal
            data-reveal-delay="450"
            className="inline-block bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-10 py-6 mb-12"
          >
            <span className="font-heading text-6xl text-[hsl(var(--gold-light))]">89 €</span>
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
            <div className="flex items-center gap-2 mt-6 text-primary-foreground/80 font-medium text-lg">
              <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold-light))]" />
              <span>Garantie 100% satisfait ou remboursé</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY NAV TABS */}
      <div className="sticky top-[64px] z-40 w-full bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-20 md:h-24">
            {SERVICE_STEPS.map((step) => {
              const isActive = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => scrollToStep(step.id)}
                  className="flex-1 flex flex-col items-center group transition-all duration-300"
                >
                  <span
                    className={cn(
                      "font-heading text-2xl md:text-3xl transition-colors duration-300",
                      isActive ? "text-[hsl(var(--gold))] font-bold scale-110" : "text-muted-foreground/60",
                    )}
                  >
                    {step.number}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 text-center px-2 hidden sm:block transition-colors duration-300",
                      isActive ? "text-foreground" : "text-muted-foreground/40",
                    )}
                  >
                    {step.title.split(" ")[1] || step.title}
                  </span>
                  {/* Barre d'animation sous l'onglet */}
                  <div
                    className={cn(
                      "h-1 mt-2 rounded-full transition-all duration-500",
                      isActive ? "w-12 md:w-20 bg-[hsl(var(--gold))]" : "w-0 bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INTRO OVERVIEW */}
      <section ref={overviewRef} className="bg-background text-center pt-20 pb-16">
        <div className="container-main mx-auto px-6">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
            Pendant notre appel vidéo
          </span>
          <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-8">Votre profil complet en 4 étapes</h2>
          <div className="divider-gold mx-auto" />
        </div>
      </section>

      {/* 4. DETAILED STEPS (Alternating) */}
      {SERVICE_STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <section
            id={step.id}
            key={step.number}
            data-step-number={step.number}
            className="grid lg:grid-cols-2 border-t border-border/50 scroll-mt-24"
          >
            {/* Image */}
            <div
              className={cn(
                "relative min-h-[45vh] lg:h-[750px] overflow-hidden",
                index % 2 === 0 ? "order-1" : "order-1 lg:order-2",
              )}
            >
              <img
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-10 left-10 md:top-16 md:left-16">
                <span className="font-heading text-8xl md:text-[12rem] font-medium text-white/20">{step.number}</span>
              </div>
            </div>

            {/* Texte */}
            <div
              className={cn(
                "flex items-center justify-center p-8 md:p-12 lg:p-20",
                index % 2 === 0 ? "bg-background order-2" : "bg-secondary/20 order-2 lg:order-1",
              )}
            >
              <div className="max-w-xl w-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#1B2333] flex items-center justify-center rounded-xl shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] text-lg">
                    Étape {step.number}
                  </span>
                </div>

                <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3 leading-tight">{step.title}</h2>
                <p className="text-muted-foreground font-medium mb-12 text-2xl italic">{step.subtitle}</p>

                <div className="space-y-8">
                  <div className="bg-white/50 p-6 rounded-2xl border border-border shadow-sm">
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-sm">
                      VOTRE SEULE PRÉPARATION :
                    </span>
                    <p className="text-foreground/80 leading-relaxed text-xl">{step.preparation}</p>
                  </div>

                  <div className="bg-white/50 p-6 rounded-2xl border border-border shadow-sm">
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-sm">
                      NOTRE ÉCHANGE EN DIRECT :
                    </span>
                    <p className="text-foreground/80 leading-relaxed text-xl">{step.action}</p>
                  </div>

                  <div className="bg-[#1B2333]/5 p-8 rounded-2xl border-2 border-[hsl(var(--gold)/0.3)] shadow-md">
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-sm">
                      LE RÉSULTAT FINAL :
                    </span>
                    <p className="text-foreground font-semibold leading-relaxed text-xl">{step.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* 5. POST-CALL SECTION */}
      <section className="py-28 bg-secondary text-foreground text-center px-6">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm border border-border/50">
            <Mail className="w-10 h-10 text-[hsl(var(--gold))]" />
          </div>
          <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-tight">Et après notre appel ?</h2>
          <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed mb-8 font-medium">
            Le travail est terminé de votre côté.
            <br />
            Nos experts prennent le relais en studio.
          </p>
          <p className="text-muted-foreground leading-relaxed text-xl max-w-2xl mx-auto">
            D'ici <strong>24 à 48 heures</strong>, vous recevrez un email contenant votre profil finalisé. Vous pourrez
            tout vérifier sereinement avant l'activation.
          </p>
        </div>
      </section>

      {/* 6. PRICING RECAP */}
      <section className="relative py-28 lg:py-36 overflow-hidden bg-[#1B2333] text-white">
        <div className="relative z-10 container-main mx-auto px-6 text-center">
          <h2 className="font-heading text-5xl md:text-7xl mb-6">Tout est inclus pour 89 €</h2>
          <p className="text-white/60 mb-16 text-2xl">Un paiement unique, sans abonnement, sans surprise.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl text-left backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-[#1B2333]" />
                </div>
                <span className="text-white/90 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/reservation/calendrier")}
            className="inline-flex items-center gap-4 bg-[hsl(var(--gold))] text-[#1B2333] px-16 py-6 font-bold tracking-wide transition-all duration-500 hover:scale-105 hover:brightness-110 text-xl rounded-full shadow-2xl"
          >
            Réserver mon créneau
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* 7. GUARANTEE & FINAL CTA */}
      <section ref={guaranteeRef} className="py-28 bg-background">
        <div className="container-main mx-auto px-6 text-center">
          <ShieldCheck className="h-20 w-20 text-[hsl(var(--gold))] mx-auto mb-8" />
          <h2 className="font-heading text-4xl md:text-6xl mb-6 leading-tight">Garantie Sérénité Absolue</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-16">
            Si à la réception de votre profil, notre service ne répond pas à vos attentes, nous vous remboursons
            intégralement. Sans condition.
          </p>

          <div className="flex flex-col items-center gap-8">
            <h3 className="font-heading text-3xl md:text-4xl">Prêt à écrire votre prochain chapitre ?</h3>
            <button
              onClick={() => navigate("/reservation/calendrier")}
              className="bg-[#1B2333] text-white px-14 py-6 rounded-full text-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3"
            >
              Réserver maintenant
              <ArrowRight className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigate("/onboarding")}
              className="text-muted-foreground hover:text-foreground underline underline-offset-8"
            >
              ← Revenir à l'option gratuite
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
