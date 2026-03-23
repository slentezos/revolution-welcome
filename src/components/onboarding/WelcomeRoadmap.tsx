import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Star, Phone, Check, HelpCircle, Camera, ClipboardList, Brain, ArrowDown } from "lucide-react";

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
   PRICING MODAL (Texte mis à jour & Ordonné)
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
      <DialogContent className="max-w-6xl w-[calc(100%-2rem)] rounded-sm border-border shadow-[var(--shadow-luxury)] p-0 gap-0 bg-background overflow-hidden max-h-[90vh] flex flex-col">
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
              {/* MODE AUTONOME */}
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
              {/* SERVICE CONCIERGERIE */}
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
   STEP CARD
   ═══════════════════════════════════════════════ */

function StepCard({
  number,
  title,
  duration,
  description,
  highlights,
  nextSteps,
  nextLabel,
  onNext,
  isLast,
}: {
  number: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  nextSteps: string[];
  nextLabel?: string;
  onNext: () => void;
  isLast?: boolean;
}) {
  return (
    <section className="section-luxury">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="font-heading text-[120px] leading-none text-muted-foreground/10 block select-none">
            {number}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground -mt-10">{title}</h2>
          <p className="text-[hsl(var(--gold))] font-medium mt-3 text-2xl">{duration}</p>
          <div className="divider-gold mx-auto mt-6" />
        </div>
        <p className="leading-relaxed text-center max-w-2xl mx-auto mb-12 font-normal text-[#232a39] text-3xl">
          {description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-card border border-border">
              <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-1" />
              <span className="leading-relaxed text-xl text-[#232a39] font-medium">{h}</span>
            </div>
          ))}
        </div>
        <div className="border border-border p-8 sm:p-10 mb-12 bg-[#b27615]">
          <h3 className="font-heading mb-6 text-2xl font-semibold text-primary-foreground">
            Que se passe-t-il ensuite ?
          </h3>
          <ul className="space-y-4">
            {nextSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[hsl(var(--gold))] font-bold mt-0.5">→</span>
                <span className="leading-relaxed text-xl text-secondary">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <button
            onClick={onNext}
            className={`${isLast ? "btn-primary px-14 py-5 text-xl shadow-xl hover:scale-105 transition-transform" : "text-foreground hover:text-[hsl(var(--gold))] text-lg font-medium underline underline-offset-8 decoration-[hsl(var(--gold))]/40 hover:decoration-[hsl(var(--gold))] transition-colors"}`}
          >
            {nextLabel || `Découvrir l'Étape suivante ↓`}
          </button>
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
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const refs = [step1Ref, step2Ref, step3Ref, step4Ref];
  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <style>{slowFloatAnimation}</style>

      {/* ─── HERO ─── */}
      <section className="section-luxury text-center pb-0">
        <div className="max-w-3xl mx-auto px-6">
          <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-6 text-2xl font-medium">
            Bienvenue sur Kalimera
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
            Votre parcours vers <br /> de belles rencontres
          </h1>
          <div className="divider-gold mx-auto mb-8" />
          <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed mb-12 font-medium">
            4 étapes simples et guidées pour créer votre portrait unique.
            <br className="hidden sm:block" />
            Prenez votre temps, nous sommes là pour vous accompagner.
          </p>

          {/* BOUTON INSÉRÉ EXACTEMENT ENTRE LE TEXTE ET LA NAV */}
          <div className="flex justify-center pb-16 animate-slow-float">
            <button onClick={() => scrollTo(step1Ref)} className="flex flex-col items-center gap-3 group">
              <span className="text-[hsl(var(--gold))] font-medium tracking-wide group-hover:text-foreground transition-colors duration-700 text-3xl">
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
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(refs[i])}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-[hsl(var(--gold))]"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium tracking-wide text-3xl">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── ÉTAPES (DÉTAILLÉES SANS '...') ─── */}
      <div ref={step1Ref}>
        <StepCard
          number="01"
          title="Le Quiz des 3 Préférences"
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
          onNext={() => scrollTo(step2Ref)}
        />
      </div>

      <div ref={step2Ref}>
        <StepCard
          number="02"
          title="Photos & Vidéo"
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
          onNext={() => scrollTo(step3Ref)}
        />
      </div>

      <div ref={step3Ref}>
        <StepCard
          number="03"
          title="Mon Profil & Le Profil Idéal"
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
          onNext={() => scrollTo(step4Ref)}
        />
      </div>

      <div ref={step4Ref}>
        <StepCard
          number="04"
          title="Le Test de Personnalité"
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
          nextLabel="Choisir mon mode d'inscription ➡️"
          onNext={() => setIsModalOpen(true)}
          isLast
        />
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
