import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Star,
  Phone,
  Check,
  HelpCircle,
  Camera,
  ClipboardList,
  Brain,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ─── PRICING MODAL (Inchangée) ─── */
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
      <DialogContent className="max-w-6xl w-[calc(100%-2rem)] rounded-sm border-border shadow-[var(--shadow-luxury)] p-0 gap-0 bg-background max-h-[90vh] overflow-y-auto flex flex-col z-[100]">
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
            <div className="text-center px-8 pt-12 pb-8 border-b border-border/60">
              <span className="font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6 text-2xl">
                Votre accueil
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl text-foreground mt-4 leading-tight">
                Comment souhaitez-vous débuter ?
              </h2>
              <div className="divider-gold mx-auto mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 sm:px-12 py-10 bg-[hsl(var(--cream))]/40">
              <div className="bg-card border border-border p-10 flex flex-col h-full shadow-[var(--shadow-card)] rounded-sm">
                <div className="flex items-center gap-4 mb-8">
                  <Star className="h-7 w-7 text-gold" />
                  <span className="font-medium tracking-[0.2em] uppercase text-muted-foreground text-xl">
                    Mode Autonome
                  </span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">À votre rythme</h3>
                <p className="text-gold font-medium text-xl mb-6">Inclus dans vos 3 mois offerts</p>
                <div className="divider-gold mb-8" />
                <p className="text-foreground/80 leading-relaxed flex-grow mb-10 text-xl">
                  Vous complétez votre portrait sereinement, étape par étape : quiz, photos, vidéo, profil et test de
                  personnalité.
                </p>
                <button
                  onClick={onStartAutonomous}
                  className="w-full btn-outline min-h-[64px] py-5 font-medium text-xl rounded-sm"
                >
                  Je débute à mon rythme
                </button>
              </div>
              <div className="bg-primary text-primary-foreground p-10 flex flex-col h-full relative shadow-[var(--shadow-luxury)] rounded-sm overflow-hidden">
                <div className="absolute top-2 right-6 bg-[hsl(var(--gold))] text-primary px-4 py-1 font-bold tracking-[0.2em] uppercase rounded-full text-sm">
                  Recommandé
                </div>
                <div className="flex items-center gap-4 mb-8 mt-4">
                  <Phone className="h-7 w-7 text-gold-light" />
                  <span className="font-medium tracking-[0.2em] uppercase text-white/80 text-xl">Conciergerie</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-primary-foreground mb-3">
                  L'Accompagnement Privé
                </h3>
                <p className="text-gold-light font-medium text-xl mb-6">89 € — une fois</p>
                <ul className="space-y-5 mb-10 flex-grow">
                  {CONCIERGE_BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Check className="h-6 w-6 text-gold-light shrink-0 mt-1" />
                      <span className="text-white/95 text-xl">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onStartConcierge}
                  className="w-full bg-gold text-white min-h-[64px] py-5 font-semibold text-xl rounded-sm"
                >
                  Choisir l'accompagnement privé
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const STEPS = [
  {
    number: "01",
    icon: HelpCircle,
    title: "Le Quiz des 3 Préférences",
    duration: "3 minutes",
    description: "Un court questionnaire ludique pour mieux comprendre vos attentes.",
    highlights: ["Questions bienveillantes", "Aucune mauvaise réponse", "Résultats confidentiels"],
  },
  {
    number: "02",
    icon: Camera,
    title: "Photos & Vidéo",
    duration: "5 à 10 min",
    description: "Montrez qui vous êtes vraiment. Ajoutez vos plus belles photos.",
    highlights: ["Jusqu'à 4 photos", "Vidéo de personnalité", "Tutoriel inclus"],
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Mon Profil",
    duration: "15 à 20 min",
    description: "Décrivez-vous en détail et esquissez votre partenaire idéal(e).",
    highlights: ["Description approfondie", "Portrait de l'autre", "Vos valeurs et passions"],
  },
  {
    number: "04",
    icon: Brain,
    title: "Test de Personnalité",
    duration: "15 à 20 min",
    description: "Un test psychologique simple pour affiner vos correspondances.",
    highlights: ["Méthode éprouvée", "Traits dominants", "Qualité des affinités"],
  },
];

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
  const [activeStep, setActiveStep] = useState(0); // 0 = Welcome screen
  const [isModalOpen, setIsModalOpen] = useState(showPricingInitially);

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* ─── HEADER / PROGRESS BAR (TOUJOURS VISIBLE) ─── */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border py-4 px-6 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveStep(0)}
            className="font-heading font-bold text-2xl text-foreground hover:text-gold transition-colors"
          >
            KALIMERA
          </button>

          <div className="flex items-center gap-2 sm:gap-8">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i + 1)}
                className={`group flex flex-col items-center gap-1 transition-all ${activeStep === i + 1 ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${activeStep === i + 1 ? "bg-gold border-gold text-white shadow-md" : "bg-secondary border-border text-muted-foreground"}`}
                >
                  {activeStep > i + 1 ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className="hidden sm:block text-xs font-bold uppercase tracking-tighter">Étape {i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT AREA (DYNAMIC) ─── */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 bg-[hsl(var(--cream))]/10">
        {/* ÉCRAN DE BIENVENUE (STEP 0) */}
        {activeStep === 0 && (
          <div className="max-w-4xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gold/30 bg-gold/5 mb-4">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="font-bold tracking-[0.2em] uppercase text-gold text-sm sm:text-base">
                Tutoriel Privé
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl text-foreground leading-[1.1]">
              Votre parcours <br /> en 4 étapes clés
            </h1>
            <p className="text-muted-foreground text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed italic font-light">
              "L'inscription prend quelques minutes, mais elle est le fondement de vos futures rencontres."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setActiveStep(1)}
                className="btn-primary px-12 py-5 text-2xl shadow-xl w-full sm:w-auto flex items-center gap-3"
              >
                Découvrir le parcours <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPES (STEP 1 À 4) */}
        {activeStep > 0 && (
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in slide-in-from-right-8 duration-500">
            {/* Gauche: Détails */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-inner">
                  {(() => {
                    const Icon = STEPS[activeStep - 1].icon;
                    return <Icon className="h-8 w-8 text-gold" />;
                  })()}
                </div>
                <div>
                  <span className="text-gold font-bold uppercase tracking-[0.2em] text-2xl">Étape 0{activeStep}</span>
                  <h2 className="font-heading text-4xl sm:text-5xl text-foreground">{STEPS[activeStep - 1].title}</h2>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm border border-border p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-gold">
                  <span className="text-xl">⏱️</span>{" "}
                  <span className="font-bold uppercase tracking-wider text-sm">
                    Durée estimée : {STEPS[activeStep - 1].duration}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                  {STEPS[activeStep - 1].description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {STEPS[activeStep - 1].highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl shadow-soft"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-2xl font-medium text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Droite: Navigation Action */}
            <div className="bg-primary p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent"></div>
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <span className="font-heading text-6xl text-gold-light">{activeStep}</span>
              </div>
              <h3 className="text-white text-3xl font-heading">On continue ?</h3>

              <div className="flex flex-col w-full gap-4 relative z-10">
                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="bg-gold text-white h-20 rounded-2xl font-bold text-2xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3"
                  >
                    Voir l'étape {activeStep + 1} <ArrowRight className="h-7 w-7" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-primary h-20 rounded-2xl font-bold text-2xl shadow-xl hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    Démarrer mon parcours <Sparkles className="h-7 w-7" />
                  </button>
                )}
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-white/60 hover:text-white flex items-center justify-center gap-2 text-lg font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Revenir à l'étape {activeStep === 1 ? "accueil" : activeStep - 1}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER ÉLITE ─── */}
      <footer className="bg-background border-t border-border py-4 px-10 shrink-0 hidden sm:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-muted-foreground text-xl font-medium tracking-widest uppercase">
          <span>SÉCURITÉ ABSOLUE</span>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>STANDARD EXCELLENCE 2027</span>
          </div>
          <span>CONFIDENTIALITÉ GARANTIE</span>
        </div>
      </footer>

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
