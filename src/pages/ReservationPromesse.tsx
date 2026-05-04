import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Camera, Brain, ClipboardList, Sparkles, ArrowRight, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

// Assets
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

  // Déclaration statique des hooks pour éviter l'erreur React (Hooks inside a loop)
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const overviewRef = useScrollReveal<HTMLElement>();
  const guaranteeRef = useScrollReveal<HTMLElement>();

  const step1Ref = useScrollReveal<HTMLElement>();
  const step2Ref = useScrollReveal<HTMLElement>();
  const step3Ref = useScrollReveal<HTMLElement>();
  const step4Ref = useScrollReveal<HTMLElement>();
  const stepRefs = [step1Ref, step2Ref, step3Ref, step4Ref];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
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
      const yOffset = -200;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
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
          {/* Animation douce et lente (2 secondes) */}
          <img
            src={conciergeHero}
            alt="Conciergerie"
            className="w-full h-full object-cover animate-in fade-in zoom-in-[1.03] duration-[2000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/95" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-xl"
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
      <div className="sticky top-[64px] z-40 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-b border-border/50 shadow-sm py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            {SERVICE_STEPS.map((step) => {
              const isActive = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => scrollToStep(step.id)}
                  className="flex-1 flex flex-col items-center group transition-all duration-500 outline-none"
                >
                  <span
                    className={cn(
                      "font-heading text-4xl md:text-6xl transition-all duration-500",
                      isActive
                        ? "text-[hsl(var(--gold))] scale-110"
                        : "text-muted-foreground/30 group-hover:text-muted-foreground/50",
                    )}
                  >
                    {step.number}
                  </span>

                  <div
                    className={cn(
                      "h-[3px] mt-3 mb-4 transition-all duration-700",
                      isActive ? "w-16 md:w-24 bg-[hsl(var(--gold))]" : "w-12 md:w-16 bg-transparent",
                    )}
                  />

                  <span
                    className={cn(
                      "font-heading text-lg md:text-2xl text-center px-4 hidden xl:block transition-all duration-500 leading-tight max-w-[280px]",
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground/40 group-hover:text-foreground/60",
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INTRO OVERVIEW */}
      <section ref={overviewRef} className="bg-background text-center pt-24 pb-20">
        <div className="container-main mx-auto px-6">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
            Pendant notre appel vidéo
          </span>
          <h2 data-reveal data-reveal-delay="150" className="font-heading text-5xl md:text-7xl text-foreground mb-8">
            Votre profil complet en 4 étapes
          </h2>
          <div data-reveal data-reveal-delay="300" className="w-16 h-px bg-[hsl(var(--gold)/0.4)] mx-auto" />
        </div>
      </section>

      {/* 4. DETAILED STEPS (Z-Pattern) */}
      {SERVICE_STEPS.map((step, index) => {
        const Icon = step.icon;
        const currentRef = stepRefs[index]; // Utilisation de la référence statique

        return (
          <section
            ref={currentRef}
            id={step.id}
            key={step.number}
            data-step-number={step.number}
            className="grid lg:grid-cols-2 border-t border-border/50 scroll-mt-24"
          >
            {/* Image Block */}
            <div
              className={cn(
                "relative min-h-[50vh] lg:h-[800px] overflow-hidden",
                index % 2 === 0 ? "order-1" : "order-1 lg:order-2",
              )}
            >
              <div data-reveal className="absolute inset-0 w-full h-full">
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-out hover:scale-105 animate-in fade-in zoom-in-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-10 left-10 md:top-20 md:left-20 pointer-events-none">
                <span
                  data-reveal
                  data-reveal-delay="200"
                  className="font-heading text-[10rem] md:text-[15rem] font-medium text-white/20 drop-shadow-2xl"
                >
                  {step.number}
                </span>
              </div>
            </div>

            {/* Text Block */}
            <div
              className={cn(
                "flex flex-col justify-center p-10 md:p-20 lg:p-24 bg-background",
                index % 2 === 0 ? "order-2" : "order-2 lg:order-1",
              )}
            >
              <div className="max-w-xl mx-auto w-full">
                <div data-reveal className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#1B2333] flex items-center justify-center rounded-md shadow-xl">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold tracking-[0.3em] uppercase text-muted-foreground/60 text-sm">
                    Étape {step.number}
                  </span>
                </div>

                <h2
                  data-reveal
                  data-reveal-delay="100"
                  className="font-heading text-4xl md:text-5xl text-foreground mb-4 leading-[1.1]"
                >
                  {step.title}
                </h2>

                <p
                  data-reveal
                  data-reveal-delay="200"
                  className="text-[hsl(var(--gold))] font-medium mb-14 text-2xl italic"
                >
                  {step.subtitle}
                </p>

                <div className="space-y-8">
                  <div data-reveal data-reveal-delay="300" className="border-l-4 border-amber-100 pl-8 py-2">
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-xs">
                      VOTRE SEULE PRÉPARATION :
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xl">{step.preparation}</p>
                  </div>

                  <div data-reveal data-reveal-delay="400" className="border-l-4 border-amber-100 pl-8 py-2">
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-xs">
                      NOTRE ÉCHANGE EN DIRECT :
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-xl">{step.action}</p>
                  </div>

                  <div
                    data-reveal
                    data-reveal-delay="500"
                    className="bg-[#1B2333]/5 p-8 rounded-xl border border-border"
                  >
                    <span className="font-black tracking-widest uppercase text-[hsl(var(--gold))] mb-3 block text-xs">
                      VOTRE PROFIL FINAL :
                    </span>
                    <p className="text-foreground font-medium leading-relaxed text-xl">{step.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* 5. POST-CALL SECTION */}
      <section className="py-32 bg-secondary/30 text-foreground text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div data-reveal>
            <Mail className="w-20 h-20 text-[hsl(var(--gold))] mx-auto mb-10 opacity-80" />
          </div>
          <h2 data-reveal data-reveal-delay="100" className="font-heading text-5xl md:text-6xl mb-8">
            Et après notre appel ?
          </h2>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-2xl md:text-3xl text-foreground/80 leading-relaxed mb-10 font-medium"
          >
            Le travail est terminé de votre côté.
            <br />
            Nos experts prennent le relais en studio.
          </p>
          <p
            data-reveal
            data-reveal-delay="300"
            className="text-muted-foreground leading-relaxed text-xl max-w-2xl mx-auto"
          >
            D'ici <strong>24 à 48 heures</strong>, vous recevrez un email contenant votre profil finalisé. Vous pourrez
            tout vérifier sereinement avant l'activation officielle.
          </p>
        </div>
      </section>

      {/* 6. PRICING RECAP */}
      <section className="relative py-32 lg:py-40 overflow-hidden bg-[#1B2333] text-white">
        <div className="relative z-10 container-main mx-auto px-6 text-center">
          <h2 data-reveal className="font-heading text-5xl md:text-7xl mb-8">
            Tout est inclus pour 89 €
          </h2>
          <p data-reveal data-reveal-delay="100" className="text-white/50 mb-20 text-2xl font-light">
            Un paiement unique, sans abonnement, sans surprise.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {INCLUDED.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(150 + i * 50)}
                className="flex items-center gap-5 bg-white/5 border border-white/10 p-8 rounded-2xl text-left backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-[#1B2333]" />
                </div>
                <span className="text-white/90 text-xl font-medium">{item}</span>
              </div>
            ))}
          </div>

          <button
            data-reveal
            data-reveal-delay="400"
            onClick={() => navigate("/reservation/calendrier")}
            className="inline-flex items-center gap-4 bg-[hsl(var(--gold))] text-[#1B2333] px-16 py-7 font-bold tracking-widest transition-all hover:scale-105 hover:brightness-110 text-2xl rounded-full shadow-[0_20px_50px_rgba(226,163,54,0.3)]"
          >
            Réserver mon créneau
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* 7. GUARANTEE & FINAL CTA */}
      <section ref={guaranteeRef} className="py-32 bg-background">
        <div className="container-main mx-auto px-6 text-center">
          <ShieldCheck data-reveal className="h-24 w-24 text-[hsl(var(--gold))] mx-auto mb-10 opacity-90" />
          <h2 data-reveal data-reveal-delay="100" className="font-heading text-4xl md:text-6xl mb-8">
            Garantie Sérénité Absolue
          </h2>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-muted-foreground text-2xl max-w-3xl mx-auto mb-20 leading-relaxed"
          >
            Si à la réception de votre profil, notre service ne répond pas à 100% à vos attentes, nous vous remboursons
            intégralement. Immédiatement et sans discussion.
          </p>

          <div className="flex flex-col items-center gap-10">
            <h3 data-reveal data-reveal-delay="300" className="font-heading text-3xl md:text-5xl">
              Prêt à écrire votre prochain chapitre ?
            </h3>
            <button
              data-reveal
              data-reveal-delay="400"
              onClick={() => navigate("/reservation/calendrier")}
              className="bg-[#1B2333] text-white px-16 py-7 rounded-full text-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-4 shadow-2xl"
            >
              Réserver maintenant
              <ArrowRight className="h-7 w-7" />
            </button>
            <button
              data-reveal
              data-reveal-delay="500"
              onClick={() => navigate("/onboarding")}
              className="text-muted-foreground hover:text-foreground underline underline-offset-8 text-lg"
            >
              ← Revenir à l'option gratuite
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
