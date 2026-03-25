import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Star,
  Phone,
  Check,
  HelpCircle,
  Image as ImageIcon,
  ClipboardList,
  Brain,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

/* ─── ANIMATION DOUCE PERSONNALISÉE ─── */
const slowFloatAnimation = `
  @keyframes slowFloat {
    0% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(15px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.8; }
  }
  .animate-slow-float {
    animation: slowFloat 4s ease-in-out infinite;
  }
`;

const CONCIERGE_BENEFITS = [
  "Un entretien téléphonique privé de 45 minutes",
  "Nous remplissons l'intégralité ensemble de votre profil pour vous",
  "Accompagnement pas à pas pour votre vidéo",
  "Zéro stress technique, nous nous occupons de tout",
];

/* ─── LES VRAIS LABELS (Wayfinding Parfait) ─── */
const TABS = [
  { id: "step1", label: "Quiz des 3 préférences", icon: HelpCircle },
  { id: "step2", label: "Vos photos & vidéo", icon: ImageIcon },
  { id: "step3", label: "Mon profil / son profil", icon: ClipboardList },
  { id: "step4", label: "Test de personnalité", icon: Brain },
];

/* ═══════════════════════════════════════════════
   PRICING MODAL
   ═══════════════════════════════════════════════ */

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
        if (!v) {
          setTimeout(() => setView("story"), 400); // Fix "Node not found"
        } else {
          setView("story");
        }
      }}
    >
      <DialogContent className="max-w-5xl w-[calc(100%-2rem)] rounded-sm border-border shadow-2xl p-0 gap-0 bg-background overflow-hidden max-h-[90vh] flex flex-col z-[100]">
        {view === "story" ? (
          <div className="p-10 sm:p-20 text-center space-y-8 flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-500">
            <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground text-sm sm:text-base">
              Notre Engagement
            </span>
            <DialogTitle className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
              Kalimera a été pensé <br /> pour votre sérénité
            </DialogTitle>
            <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto" />
            <DialogDescription className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl italic font-light mx-auto">
              "Nous comprenons que la technologie peut parfois sembler intimidante. C'est pourquoi nous avons tout
              simplifié pour que vous puissiez vous concentrer sur l'essentiel : faire de belles rencontres."
            </DialogDescription>
            <button
              onClick={() => setView("pricing")}
              className="mt-8 border border-foreground text-foreground px-10 py-4 text-sm tracking-widest uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Découvrir mes options
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4 duration-500 bg-[#FAFAFA]">
            <div className="text-center px-6 pt-12 pb-8">
              <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">
                Comment souhaitez-vous débuter ?
              </h2>
              <p className="text-slate-500 text-lg sm:text-xl font-light">
                Deux chemins, une même destination : votre épanouissement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-6 lg:px-12 pb-8 flex-1 overflow-y-auto">
              <div className="bg-white border border-slate-200 p-8 sm:p-10 flex flex-col h-full shadow-sm rounded-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 border border-slate-200 flex items-center justify-center rounded-sm">
                    <Star className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="font-medium tracking-[0.15em] uppercase text-slate-500 text-sm">Mode Autonome</span>
                </div>
                <h3 className="font-heading mb-4 text-3xl text-foreground">Vos premières impressions</h3>
                <div className="w-12 h-px bg-[hsl(var(--gold))] mb-6" />
                <p className="text-slate-500 leading-relaxed flex-grow mb-10 text-lg font-light">
                  Profitez de vos 3 mois d'accès offerts en complétant votre portrait à votre rythme : commencez par
                  notre <strong>quiz ludique</strong>, ajoutez vos plus belles <strong>photos</strong>, suivez notre{" "}
                  <strong>tutoriel pour réussir votre vidéo</strong>, enregistrez votre <strong>son</strong>, puis
                  complétez votre <strong>profil</strong> et votre test de <strong>personnalité</strong> en toute
                  sérénité.
                </p>
                <button
                  onClick={onStartAutonomous}
                  className="w-full border border-foreground text-foreground py-4 text-sm sm:text-base font-medium hover:bg-slate-50 transition-colors rounded-sm"
                >
                  Je débute à mon rythme (Inclus)
                </button>
              </div>

              <div className="bg-[#1b2333] text-white p-8 sm:p-10 flex flex-col h-full relative shadow-xl rounded-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm">
                    <Phone className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="font-medium tracking-[0.15em] uppercase text-slate-300 text-sm">
                    Service Conciergerie
                  </span>
                </div>
                <h3 className="font-heading mb-4 text-white text-3xl">L'Accompagnement Privé</h3>
                <div className="w-12 h-px bg-[hsl(var(--gold))] mb-6" />
                <ul className="space-y-5 flex-grow mb-10">
                  {CONCIERGE_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                      <span className="text-slate-200 leading-relaxed text-lg font-light">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartConcierge}
                  className="w-full bg-[hsl(var(--gold))] text-[#1b2333] py-4 text-sm sm:text-base font-bold hover:bg-white transition-colors rounded-sm"
                >
                  Réserver mon entretien (89 €)
                </button>
              </div>
            </div>

            <div className="text-center py-6 pb-8">
              <button
                onClick={() => setView("story")}
                className="text-slate-500 hover:text-foreground text-base sm:text-lg font-light flex items-center justify-center gap-2 mx-auto"
              >
                <span className="text-slate-400">←</span>
                <span className="underline underline-offset-4 decoration-slate-300 hover:decoration-foreground transition-colors">
                  Revoir notre engagement de sérénité
                </span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════
   STEP CARD (Aérien, Split-Screen)
   ═══════════════════════════════════════════════ */

function StepCard({
  number,
  title,
  duration,
  description,
  highlights,
  nextSteps,
}: {
  number: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  nextSteps: string[];
}) {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center py-20 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative z-10 pr-0 lg:pr-10">
            <span className="absolute -top-20 -left-12 font-heading text-[200px] leading-none text-muted-foreground/[0.03] select-none -z-10">
              {number}
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-[hsl(var(--gold))] font-medium text-xl sm:text-2xl mb-10 flex items-center gap-3">
              <span className="text-2xl">⏱️</span> {duration}
            </p>
            <div className="w-20 h-[2px] bg-[hsl(var(--gold)/0.4)] mb-10" />
            <p className="leading-loose text-[#232a39] text-xl sm:text-2xl font-light">{description}</p>
          </div>

          <div className="flex flex-col gap-14 z-10">
            <div className="space-y-6">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center shrink-0 mt-1">
                    <Check className="h-4 w-4 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="leading-relaxed text-xl text-foreground/80 font-light">{h}</span>
                </div>
              ))}
            </div>

            <div className="relative p-10 border border-[hsl(var(--gold)/0.2)] bg-gradient-to-br from-[hsl(var(--gold)/0.03)] to-transparent">
              <h3 className="font-heading mb-8 text-2xl text-foreground">Que se passe-t-il ensuite ?</h3>
              <ul className="space-y-6">
                {nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-5">
                    <span className="text-[hsl(var(--gold))] font-serif italic text-2xl mt-0.5">0{i + 1}.</span>
                    <span className="leading-relaxed text-lg text-foreground/70 font-light">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export default function WelcomeRoadmap({
  onStartAutonomous,
  onStartConcierge,
}: {
  onStartAutonomous: () => void;
  onStartConcierge: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const refs = [step1Ref, step2Ref, step3Ref, step4Ref];

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    const y = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === step1Ref.current) setActiveStep(1);
            if (entry.target === step2Ref.current) setActiveStep(2);
            if (entry.target === step3Ref.current) setActiveStep(3);
            if (entry.target === step4Ref.current) setActiveStep(4);
          }
        });
      },
      { threshold: 0.3 },
    );

    const r1 = step1Ref.current;
    const r2 = step2Ref.current;
    const r3 = step3Ref.current;
    const r4 = step4Ref.current;

    if (r1) observer.observe(r1);
    if (r2) observer.observe(r2);
    if (r3) observer.observe(r3);
    if (r4) observer.observe(r4);

    return () => {
      if (r1) observer.unobserve(r1);
      if (r2) observer.unobserve(r2);
      if (r3) observer.unobserve(r3);
      if (r4) observer.unobserve(r4);
    };
  }, []);

  return (
    <div className="relative">
      <style>{slowFloatAnimation}</style>

      {/* LOGO KALIMERA TOP LEFT */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-50">
        <span className="font-heading text-3xl md:text-4xl tracking-wide text-[hsl(var(--gold))] cursor-default">
          Kalimera.
        </span>
      </div>

      {/* ─── HERO ─── */}
      <section className="section-luxury text-center pb-0 pt-24 md:pt-32">
        <div className="max-w-3xl mx-auto px-6">
          <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-6 text-2xl font-medium">
            Bienvenue sur Kalimera
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
            Votre parcours vers <br /> de belles rencontres
          </h1>
          <div className="divider-gold mx-auto mb-10" />
          <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed mb-16 font-medium">
            4 étapes simples et guidées pour composer vôtre profil.
            <br className="hidden sm:block" />
            L’inscription va vous prendre un peu de temps mais le jeu en vaut la chandelle. Quelques minutes aujourd’hui
            peuvent faire toute la différence demain.
          </p>

          <div className="flex justify-center pb-20 animate-slow-float">
            <button onClick={() => scrollTo(step1Ref)} className="flex flex-col items-center gap-4 group">
              <span className="text-[hsl(var(--gold))] font-medium tracking-wide group-hover:text-foreground transition-colors duration-700 text-2xl sm:text-3xl">
                Découvrir votre parcours pas à pas
              </span>
              <div className="w-14 h-14 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-700">
                <ArrowDown className="h-6 w-6 text-[hsl(var(--gold))] group-hover:text-white" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── STICKY TABS (Design "Onboarding" avec scroll horizontal si besoin) ─── */}
      <nav className="sticky top-0 z-40 bg-[#FAFAFA] md:bg-secondary/95 backdrop-blur-md border-b border-border shadow-sm">
        {/* On utilise overflow-x-auto et scrollbar-none pour que les textes longs tiennent sans sauter de ligne */}
        <div className="flex overflow-x-auto scrollbar-none w-full">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeStep === i + 1;
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(refs[i])}
                className={`flex-1 min-w-[240px] flex items-center justify-center gap-3 py-5 px-6 transition-all border-b-2 ${
                  isActive
                    ? "border-[hsl(var(--gold))] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[hsl(var(--gold))]" : ""}`} />
                <span className="font-medium tracking-wide text-base lg:text-lg whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── ÉTAPES ─── */}
      <div ref={step1Ref}>
        <StepCard
          number="01"
          title="Quiz des 3 préférences"
          duration="⏱️ 3 minutes"
          description="Un court questionnaire ludique pour mieux comprendre ce que vous recherchez. Trois questions simples, trois réponses sincères."
          highlights={[
            "Questions simples et bienveillantes",
            "Aucune mauvaise réponse possible",
            "Aide notre équipe à mieux vous connaître",
            "Résultats confidentiels et sécurisés",
          ]}
          nextSteps={[
            "Vos réponses sont enregistrées en toute confidentialité.",
            "Elles nous permettent de vous proposer des profils compatibles.",
            "Vous passez ensuite à la présentation de vos photos et vidéo.",
          ]}
        />
      </div>

      <div ref={step2Ref}>
        <StepCard
          number="02"
          title="Vos photos & vidéo"
          duration="⏱️ 5 à 10 min"
          description="Montrez qui vous êtes vraiment. Ajoutez vos plus belles photos, et enregistrez une courte vidéo de présentation."
          highlights={[
            "Jusqu'à 4 photos pour illustrer votre quotidien",
            "Une vidéo pour révéler votre personnalité",
            "Tutoriel pour réussir votre vidéo inclus",
            "Un message sonore pour faire entendre votre voix",
          ]}
          nextSteps={[
            "Vos médias sont stockés de manière sécurisée.",
            "Ils permettent aux autres de mieux vous découvrir.",
            "Vous poursuivez ensuite avec la construction de votre profil.",
          ]}
        />
      </div>

      <div ref={step3Ref}>
        <StepCard
          number="03"
          title="Mon profil / son profil"
          duration="⏱️ 15 à 20 min"
          description="Décrivez-vous en détail et esquissez le portrait de la personne que vous aimeriez rencontrer."
          highlights={[
            "Votre description personnelle approfondie",
            "Le portrait de votre partenaire idéal(e)",
            "Vos valeurs, passions et style de vie",
            "Critères de recherche personnalisés",
          ]}
          nextSteps={[
            "Votre profil est analysé par notre algorithme.",
            "Il est croisé avec les profils existants.",
            "Dernière étape : le test de personnalité.",
          ]}
        />
      </div>

      <div ref={step4Ref} className="pb-32">
        <StepCard
          number="04"
          title="Test de personnalité"
          duration="⏱️ 15 à 20 min"
          description="Un test psychologique simple pour affiner vos correspondances."
          highlights={[
            "Basé sur des méthodes éprouvées",
            "Révèle vos traits dominants",
            "Améliore la qualité des correspondances",
            "Résultats personnalisés et détaillés",
          ]}
          nextSteps={[
            "Votre profil de personnalité est calculé.",
            "Il complète votre portrait unique.",
            "Votre espace personnel s'ouvre enfin !",
          ]}
        />
      </div>

      {/* ─── BOUTONS FLOTTANTS (NAVIGATION GLOBALE) ─── */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 left-4 md:left-8 z-50 transition-all duration-500 ${activeStep > 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-[-20px]"}`}
      >
        <button
          onClick={() => scrollTo(refs[activeStep - 2])}
          className="flex items-center gap-4 group bg-white/95 backdrop-blur-sm p-4 pr-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[hsl(var(--gold)/0.2)] hover:border-[hsl(var(--gold))] transition-all"
        >
          <div className="w-12 h-12 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-500 shrink-0">
            <ArrowLeft className="h-6 w-6 text-[hsl(var(--gold))] group-hover:text-white" />
          </div>
          <span className="hidden xl:block font-heading text-xl text-foreground mt-1">Étape {activeStep - 1}</span>
        </button>
      </div>

      <div
        className={`fixed top-1/2 -translate-y-1/2 right-4 md:right-8 z-50 transition-all duration-500 ${activeStep > 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-[20px]"}`}
      >
        {activeStep < 4 && (
          <button
            onClick={() => scrollTo(refs[activeStep])}
            className="flex items-center gap-4 group bg-white/95 backdrop-blur-sm p-4 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[hsl(var(--gold)/0.2)] hover:border-[hsl(var(--gold))] transition-all"
          >
            <span className="hidden xl:block font-heading text-xl text-foreground mt-1">Étape {activeStep + 1}</span>
            <div className="w-12 h-12 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-500 shrink-0">
              <ArrowRight className="h-6 w-6 text-[hsl(var(--gold))] group-hover:text-white" />
            </div>
          </button>
        )}

        {activeStep === 4 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 group bg-[hsl(var(--gold))] p-4 pl-8 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-[hsl(var(--gold))] hover:brightness-110 transition-all"
          >
            <span className="hidden md:block font-heading text-xl text-primary font-bold mt-1">Choisir mon mode</span>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
          </button>
        )}
      </div>

      <PricingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onStartAutonomous={onStartAutonomous}
        onStartConcierge={onStartConcierge}
      />
    </div>
  );
}
