import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Star,
  Phone,
  Check,
  HelpCircle,
  Camera,
  ClipboardList,
  Brain,
  ArrowDown,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

/* ─── PRICING MODAL ─── */

const CONCIERGE_BENEFITS = [
  "Un entretien téléphonique privé de 45 minutes",
  "Nous remplissons l'intégralité ensemble de votre profil pour vous",
  "Accompagnement pas à pas pour votre vidéo",
  "Zéro stress technique, nous nous occupons de tout",
];

function PricingModal({
  open,
  onOpenChange,
  onStartAutonomous,
  onStartConcierge,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStartAutonomous: () => void;
  onStartConcierge: () => void;
}) {
  const [view, setView] = useState<"story" | "pricing">("story");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setView("story");
      }}
    >
      <DialogContent className="max-w-6xl w-[calc(100%-2rem)] rounded-sm border-border shadow-[var(--shadow-luxury)] p-0 gap-0 bg-background overflow-hidden max-h-[90vh] flex flex-col z-">
        {view === "story" ? (
          <div className="p-10 sm:p-20 text-center space-y-8 flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-500">
            <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground text-xl">
              Notre Engagement
            </span>
            <DialogTitle className="font-heading text-4xl sm:text-6xl text-foreground leading-tight">
              Kalimera a été pensé <br /> pour votre sérénité
            </DialogTitle>
            <div className="divider-gold mx-auto" />
            <DialogDescription className="text-muted-foreground text-xl sm:text-2xl leading-relaxed max-w-3xl italic font-light">
              "Nous comprenons que la technologie peut parfois sembler intimidante. C'est pourquoi nous avons tout
              simplifié pour que vous puissiez vous concentrer sur l'essentiel : faire de belles rencontres."
            </DialogDescription>
            <button
              onClick={() => setView("pricing")}
              className="btn-primary px-12 py-5 text-xl mt-8 shadow-xl hover:scale-105 transition-transform"
            >
              Découvrir mes options d'accueil →
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center px-6 pt-8 pb-4">
              <h2 className="font-heading text-3xl sm:text-4xl text-foreground">Comment souhaitez-vous débuter ?</h2>
              <p className="text-muted-foreground mt-2 text-2xl">
                Deux chemins, une même destination : votre épanouissement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-6 flex-1 overflow-y-auto">
              <div className="bg-card border border-border p-8 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                    <Star className="h-5 w-5 text-gold" />
                  </div>
                  <span className="font-medium tracking-widest uppercase text-muted-foreground text-2xl">
                    Mode Autonome
                  </span>
                </div>
                <h3 className="font-heading mb-2 text-4xl">Vos premières impressions</h3>
                <div className="divider-gold mb-6" />
                <p className="text-muted-foreground leading-relaxed flex-grow mb-8 text-2xl">
                  Profitez de vos 3 mois d'accès offerts en complétant votre portrait à votre rythme : commencez par
                  notre <strong>quiz ludique</strong>, ajoutez vos plus belles <strong>photos</strong>, suivez notre{" "}
                  <strong>tutoriel pour réussir votre vidéo</strong>, enregistrez votre <strong>son</strong>, puis
                  complétez votre <strong>profil</strong> et votre test de <strong>personnalité</strong> en toute
                  sérénité.
                </p>
                <button onClick={onStartAutonomous} className="w-full btn-outline py-4 font-medium text-xl">
                  Je débute à mon rythme (Inclus)
                </button>
              </div>
              <div className="bg-primary text-primary-foreground p-8 flex flex-col h-full relative shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-gold-light" />
                  </div>
                  <span className="font-medium tracking-widest uppercase text-white/70 text-2xl">
                    Service Conciergerie
                  </span>
                </div>
                <h3 className="font-heading mb-2 text-white text-4xl">L'Accompagnement Privé</h3>
                <div className="divider-gold mb-6 border-white/20" />
                <ul className="space-y-4 mb-8 flex-grow">
                  {CONCIERGE_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-gold-light shrink-0 mt-0.5" />
                      <span className="text-white/90 leading-snug text-2xl">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartConcierge}
                  className="w-full bg-gold text-white py-4 font-bold hover:brightness-110 transition-all shadow-lg text-xl"
                >
                  Découvrir l'accompagnement Privé (89 €)
                </button>
              </div>
            </div>
            <div className="text-center py-4">
              <button
                onClick={() => setView("story")}
                className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-2xl"
              >
                ← Revoir notre engagement de sérénité
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── STEP DATA ─── */

const STEPS = [
  {
    number: "01",
    icon: HelpCircle,
    title: "Le Quiz des 3 Préférences",
    duration: "3 minutes",
    description:
      "Un court questionnaire ludique de 10 questions pour mieux comprendre ce que vous recherchez. Trois questions simples, trois réponses sincères.",
    highlights: [
      "Questions simples et bienveillantes",
      "Aucune mauvaise réponse possible",
      "Aide notre équipe à mieux vous connaître",
      "Résultats confidentiels et sécurisés",
    ],
    nextLabel: "Ensuite : vos photos & vidéo",
  },
  {
    number: "02",
    icon: Camera,
    title: "Photos & Vidéo",
    duration: "5 à 10 minutes",
    description:
      "Montrez qui vous êtes vraiment. Ajoutez vos plus belles photos, et enregistrez une courte vidéo de présentation.",
    highlights: [
      "Jusqu'à 4 photos pour illustrer votre quotidien",
      "Une vidéo pour révéler votre personnalité",
      "Tutoriel pour réussir votre vidéo inclus",
      "Un message sonore pour faire entendre votre voix",
    ],
    nextLabel: "Ensuite : votre profil détaillé",
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Mon Profil & Le Profil Idéal",
    duration: "15 à 20 minutes",
    description: "Décrivez-vous en détail et esquissez le portrait de la personne que vous aimeriez rencontrer.",
    highlights: [
      "Votre description personnelle approfondie",
      "Le portrait de votre partenaire idéal(e)",
      "Vos valeurs, passions et style de vie",
      "Critères de recherche personnalisés",
    ],
    nextLabel: "Ensuite : test de personnalité",
  },
  {
    number: "04",
    icon: Brain,
    title: "Le Test de Personnalité",
    duration: "15 à 20 minutes",
    description: "Un test psychologique simple pour affiner vos correspondances et révéler vos traits dominants.",
    highlights: [
      "Basé sur des méthodes éprouvées",
      "Révèle vos traits dominants",
      "Améliore la qualité des correspondances",
      "Résultats personnalisés et détaillés",
    ],
    nextLabel: "",
  },
];

/* ─── PROGRESS BAR ─── */

function ProgressBar({ activeStep, onStepClick }: { activeStep: number; onStepClick: (i: number) => void }) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border py-[50px] pt-[20px] pb-[50px]">
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i + 1;
            const isPast = activeStep > i + 1;
            return (
              <button
                key={i}
                onClick={() => onStepClick(i)}
                className="flex flex-col items-center gap-2 group transition-all"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    isActive
                      ? "bg-gold border-gold text-white scale-110 shadow-lg"
                      : isPast
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-secondary border-border text-muted-foreground group-hover:border-gold/50"
                  }`}
                >
                  {isPast ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <span
                  className={`text-base sm:text-xl font-medium transition-colors text-center leading-tight ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="block sm:hidden">{i + 1}</span>
                  <span className="hidden sm:block">Étape {i + 1}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative mt-[-42px] sm:mt-[-46px] mx-[32px] sm:mx-[36px] -z-10">
          <div className="h-0.5 bg-border w-full" />
          <div
            className="h-0.5 bg-gold absolute top-0 left-0 transition-all duration-700"
            style={{ width: `${(Math.max(0, activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── STEP CARD ─── */

function StepCard({
  step,
  isLast,
  onStartClick,
  viewOnly,
}: {
  step: (typeof STEPS)[number];
  isLast: boolean;
  onStartClick?: () => void;
  viewOnly?: boolean;
}) {
  const Icon = step.icon;

  return (
    <section className="relative w-full flex items-center py-16 md:py-24 pb-0">
      <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center shrink-0">
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-gold" />
          </div>
          <div>
            <span className="text-gold font-semibold tracking-wider uppercase text-xl sm:text-xl">
              Étape {step.number}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
              {step.title}
            </h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 bg-secondary border border-border rounded-full px-6 py-3 mb-10">
          <span className="text-2xl leading-none">⏱️</span>
          <span className="text-2xl lg:text-2xl font-medium text-foreground">Durée : {step.duration}</span>
        </div>

        <p className="text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-2xl mb-12">{step.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
          {step.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg shadow-soft transition-all hover:shadow-card"
            >
              <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-gold" />
              </div>
              <span className="leading-snug text-foreground font-medium text-2xl">{h}</span>
            </div>
          ))}
        </div>

        {/* INDICATEUR D'ÉTAPE SUIVANTE OU BOUTON FINAL */}
        {!isLast ? (
          <div className="mt-12 flex items-center text-muted-foreground">
            <span className="text-xl opacity-80 italic">{step.nextLabel}</span>
          </div>
        ) : (
          !viewOnly &&
          onStartClick && (
            <div className="mt-14">
              <button
                onClick={onStartClick}
                className="flex items-center justify-center gap-4 bg-[#1B2333] text-white px-12 py-5 rounded-full shadow-xl hover:bg-[#1B2333]/90 transition-all group w-full md:w-auto"
              >
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-wide">Commencer mon parcours</span>
                <ChevronRight className="h-6 w-6 text-[hsl(var(--gold))] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}

/* ─── MAIN COMPONENT ─── */

export default function WelcomeRoadmap({
  onStartAutonomous,
  onStartConcierge,
  showPricingInitially = false,
  viewOnly = false,
}: {
  onStartAutonomous: () => void;
  onStartConcierge: () => void;
  showPricingInitially?: boolean;
  viewOnly?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(showPricingInitially);
  const [activeStep, setActiveStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());

  const heroRef = useRef<HTMLDivElement>(null);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    const y = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 140;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stepRefs.forEach((ref, i) => {
              if (entry.target === ref.current) {
                setRevealedSteps((prev) => new Set(prev).add(i + 1));
              }
            });
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setActiveStep(0);
            stepRefs.forEach((ref, i) => {
              if (entry.target === ref.current) setActiveStep(i + 1);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    const allRefs = [heroRef, ...stepRefs];
    allRefs.forEach((ref) => {
      if (ref.current) {
        revealObserver.observe(ref.current);
        spyObserver.observe(ref.current);
      }
    });

    return () => {
      allRefs.forEach((ref) => {
        if (ref.current) {
          revealObserver.unobserve(ref.current);
          spyObserver.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="relative">
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="section-luxury text-center pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-6 text-xl sm:text-2xl font-medium">
              BIENVENUE SUR LE TUTORIEL KALIMERA
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
              Votre parcours en 4 étapes <br className="hidden sm:block" /> vers de belles rencontres
            </h1>
            <div className="divider-gold mx-auto mb-8" />
            <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed mb-6 font-medium">
              4 étapes simples et guidées pour composer votre profil.
            </p>
            <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed mb-14">
              L'inscription va vous prendre un peu de temps mais le jeu en vaut la chandelle. Quelques minutes
              aujourd'hui peuvent faire toute la différence demain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-14">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={i}
                  onClick={() => scrollTo(stepRefs[i])}
                  className="group bg-card border border-border rounded-xl p-6 sm:p-8 hover:border-gold/50 hover:shadow-card transition-all duration-300 text-left flex flex-col h-full"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors shrink-0">
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-gold" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-gold text-xl sm:text-xl font-semibold tracking-wide block mb-2">
                      Étape {step.number}
                    </span>
                    <span className="text-foreground font-heading text-2xl sm:text-3xl leading-snug block mb-4">
                      {step.title}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xl flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                    <span className="text-2xl">⏱️</span> {step.duration}
                  </span>
                </button>
              );
            })}
          </div>

          <button onClick={() => scrollTo(stepRefs)} className="inline-flex flex-col items-center gap-3 group">
            <span className="text-gold font-medium tracking-wide group-hover:text-foreground transition-colors duration-500 text-xl sm:text-2xl">
              Découvrir chaque étape en détail
            </span>
            <div className="w-14 h-14 rounded-full border-2 border-gold/50 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
              <ArrowDown className="h-6 w-6 text-gold group-hover:text-white" />
            </div>
          </button>
        </div>
      </section>

      {/* ─── PROGRESS BAR ─── */}
      <ProgressBar activeStep={activeStep} onStepClick={(i) => scrollTo(stepRefs[i])} />

      {/* ─── STEPS ─── */}
      <div className="pb-16">
        {STEPS.map((step, i) => (
          <div
            key={i}
            ref={stepRefs[i]}
            className={`transition-all duration-1000 ease-out transform ${
              revealedSteps.has(i + 1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            } ${i === STEPS.length - 1 ? "" : "border-b border-border/40"}`}
          >
            <StepCard
              step={step}
              isLast={i === STEPS.length - 1}
              onStartClick={() => setIsModalOpen(true)}
              viewOnly={viewOnly}
            />
          </div>
        ))}
      </div>

      {/* ─── FLOATING NEXT BUTTON (UI Senior / CAC40) ─── */}
      {activeStep > 0 && activeStep < STEPS.length && (
        <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50 animate-in slide-in-from-right-8 duration-500">
          <button
            onClick={() => scrollTo(stepRefs[activeStep])}
            className="flex flex-col md:flex-row items-center justify-center gap-3 bg-[#1B2333] border-y-2 border-l-2 border-[hsl(var(--gold))] pl-5 md:pl-6 pr-3 md:pr-4 py-4 md:py-5 rounded-l-2xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:bg-[#1B2333]/90 transition-all hover:-translate-x-2 group cursor-pointer"
            aria-label="Passer à l'étape suivante"
          >
            <span className="font-heading text-lg md:text-xl text-white font-semibold hidden md:inline">
              Étape suivante
            </span>
            <ArrowDown className="h-6 w-6 md:h-7 md:w-7 text-[hsl(var(--gold))] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}

      {!viewOnly && (
        <PricingModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onStartAutonomous={onStartAutonomous}
          onStartConcierge={onStartConcierge}
        />
      )}
    </div>
  );
}
