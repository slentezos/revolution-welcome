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

const TABS = [
  { id: "step1", label: "Étape 1", icon: HelpCircle },
  { id: "step2", label: "Étape 2", icon: Camera },
  { id: "step3", label: "Étape 3", icon: ClipboardList },
  { id: "step4", label: "Étape 4", icon: Brain },
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
        if (!v) setView("story");
      }}
    >
      <DialogContent className="max-w-6xl w-[calc(100%-2rem)] rounded-sm border-border shadow-[var(--shadow-luxury)] p-0 gap-0 bg-background overflow-hidden max-h-[90vh] flex flex-col z-[100]">
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
                    <Star className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="font-medium tracking-widest uppercase text-muted-foreground text-xl">
                    Mode Autonome
                  </span>
                </div>
                <h3 className="font-heading mb-2 text-3xl">Vos premières impressions</h3>
                <div className="divider-gold mb-6" />
                <p className="text-muted-foreground leading-relaxed flex-grow mb-8 text-xl">
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
                    <Phone className="h-5 w-5 text-[hsl(var(--gold-light))]" />
                  </div>
                  <span className="font-medium tracking-widest uppercase text-white/70 text-lg">
                    Service Conciergerie
                  </span>
                </div>
                <h3 className="font-heading mb-2 text-white text-3xl">L'Accompagnement Privé</h3>
                <div className="divider-gold mb-6 border-white/20" />
                <ul className="space-y-4 mb-8 flex-grow">
                  {CONCIERGE_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[hsl(var(--gold-light))] shrink-0 mt-0.5" />
                      <span className="text-white/90 leading-snug text-xl">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartConcierge}
                  className="w-full bg-[hsl(var(--gold))] text-white py-4 font-bold hover:brightness-110 transition-all shadow-lg text-xl"
                >
                  Réserver mon entretien (89 €)
                </button>
              </div>
            </div>
            <div className="text-center py-4">
              <button
                onClick={() => setView("story")}
                className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-xl"
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

/* ═══════════════════════════════════════════════
   STEP CARD (Design "Split-Screen" 100vh sans scroll)
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
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center py-16 md:py-0 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative z-10">
            <span className="absolute -top-16 -left-10 font-heading text-[160px] leading-none text-muted-foreground/5 select-none -z-10">
              {number}
            </span>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-[hsl(var(--gold))] font-medium text-xl sm:text-2xl mb-8 flex flex-col items-start gap-1">
              <span className="text-2xl leading-none">⏱️</span>
              <span>{duration}</span>
            </p>

            <div className="w-16 h-px bg-[hsl(var(--gold))] mb-8" />

            <p className="leading-relaxed text-xl max-w-lg text-secondary-foreground font-normal sm:text-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-8 z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-5 bg-white border border-slate-200 shadow-sm rounded-sm"
                >
                  <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                  <span className="leading-snug text-[#232a39] font-medium text-xl">{h}</span>
                </div>
              ))}
            </div>

            <div className="border border-[hsl(var(--gold)/0.2)] p-8 sm:p-10 bg-[#b27615] rounded-sm shadow-md">
              <h3 className="font-heading mb-6 font-semibold text-white text-3xl">Que se passe-t-il ensuite ?</h3>
              <ul className="space-y-4">
                {nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[hsl(var(--gold-light))] font-bold mt-1">→</span>
                    <span className="leading-relaxed text-white/95 text-xl">{s}</span>
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
  viewOnly = false,
}: {
  onStartAutonomous: () => void;
  onStartConcierge: () => void;
  viewOnly?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0 = hero, 1-4 = steps

  const heroRef = useRef<HTMLDivElement>(null); // NOUVEAU: Référence pour la section Hero
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
            if (entry.target === heroRef.current) setActiveStep(0);
            if (entry.target === step1Ref.current) setActiveStep(1);
            if (entry.target === step2Ref.current) setActiveStep(2);
            if (entry.target === step3Ref.current) setActiveStep(3);
            if (entry.target === step4Ref.current) setActiveStep(4);
          }
        });
      },
      { threshold: 0.4 }, // MODIFIÉ: Augmenté à 0.4 pour éviter les déclenchements précoces
    );

    const rH = heroRef.current;
    const r1 = step1Ref.current;
    const r2 = step2Ref.current;
    const r3 = step3Ref.current;
    const r4 = step4Ref.current;

    if (rH) observer.observe(rH);
    if (r1) observer.observe(r1);
    if (r2) observer.observe(r2);
    if (r3) observer.observe(r3);
    if (r4) observer.observe(r4);

    return () => {
      if (rH) observer.unobserve(rH);
      if (r1) observer.unobserve(r1);
      if (r2) observer.unobserve(r2);
      if (r3) observer.unobserve(r3);
      if (r4) observer.unobserve(r4);
    };
  }, []);

  return (
    <div className="relative">
      <style>{slowFloatAnimation}</style>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="section-luxury text-center pb-0">
        <div className="max-w-3xl mx-auto px-6">
          <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-6 text-2xl font-medium">
            Bienvenue sur Kalimera
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
            Votre parcours en 4 étapes vers <br /> de belles rencontres
          </h1>
          <div className="divider-gold mx-auto mb-8" />
          <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed mb-12 font-medium">
            4 étapes simples et guidées pour composer vôtre profil.
            <br className="hidden sm:block" />
            L’inscription va vous prendre un peu de temps mais le jeu en vaut la chandelle. Quelques minutes aujourd’hui
            peuvent faire toute la différence demain.
          </p>

          <div className="flex justify-center pb-16 animate-slow-float">
            <button onClick={() => scrollTo(step1Ref)} className="flex flex-col items-center gap-3 group">
              <span className="text-[hsl(var(--gold))] font-medium tracking-wide group-hover:text-foreground transition-colors duration-700 text-2xl sm:text-3xl">
                Découvrir votre parcours pas à pas
              </span>
              <div className="w-12 h-12 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-700">
                <ArrowDown className="h-5 w-5 text-[hsl(var(--gold))] group-hover:text-white" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── STICKY TABS ─── */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex max-w-4xl mx-auto">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeStep === i + 1;
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(refs[i])}
                className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors border-b-2 ${
                  isActive
                    ? "border-[hsl(var(--gold))] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[hsl(var(--gold))]" : ""}`} />
                <span className="font-medium tracking-wide text-xl sm:text-2xl hidden md:inline">{tab.label}</span>
                <span className="font-medium tracking-wide text-lg sm:text-xl md:hidden">{i + 1}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── ÉTAPES ─── */}
      <div ref={step1Ref}>
        <StepCard
          number="01"
          title="Le Quiz des 3 Préférences"
          duration="3 minutes"
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
          title="Photos & Vidéo"
          duration="5 à 10 min"
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
          title="Mon Profil & Le Profil Idéal"
          duration="15 à 20 min"
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
          title="Le Test de Personnalité"
          duration="15 à 20 min"
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

      {/* Bouton Gauche (Précédent) */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 left-4 md:left-8 z-50 transition-all duration-500 ${activeStep > 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-[-20px]"}`}
      >
        <button
          onClick={() => scrollTo(refs[activeStep - 2])}
          className="flex items-center gap-3 group bg-white/95 backdrop-blur-sm p-3 pr-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold)/0.3)] hover:border-[hsl(var(--gold))] transition-all"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-500 shrink-0">
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--gold))] group-hover:text-white" />
          </div>
          <span className="hidden md:block font-heading text-xl text-foreground mt-1">Étape {activeStep - 1}</span>
        </button>
      </div>

      {/* Bouton Droite (Suivant ou Fin) */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-4 md:right-8 z-50 transition-all duration-500 ${activeStep >= 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-[20px]"}`}
      >
        {/* Affiché pour Hero(0), Etape 1, 2, 3 */}
        {activeStep < 4 && (
          <button
            onClick={() => scrollTo(refs[activeStep])}
            className="flex items-center gap-3 group bg-white/95 backdrop-blur-sm p-3 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold)/0.3)] hover:border-[hsl(var(--gold))] transition-all"
          >
            <span className="hidden md:block font-heading text-xl text-foreground mt-1">Étape {activeStep + 1}</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[hsl(var(--gold))] flex items-center justify-center group-hover:bg-[hsl(var(--gold))] transition-all duration-500 shrink-0">
              <ArrowRight className="h-5 w-5 text-[hsl(var(--gold))] group-hover:text-white" />
            </div>
          </button>
        )}

        {/* Affiché pour Etape 4 (Action Finale) — hidden in viewOnly mode */}
        {activeStep === 4 && !viewOnly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 group bg-[hsl(var(--gold))] p-3 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[hsl(var(--gold))] hover:brightness-110 transition-all bg-primary text-[#b37614]"
          >
            <span className="hidden md:block font-heading text-xl font-bold mt-1 text-primary-foreground">
              Choisir mon mode
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shrink-0">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </button>
        )}
      </div>

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
