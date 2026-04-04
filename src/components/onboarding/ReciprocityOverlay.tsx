import { useState } from "react";
import { Lock, Unlock, Check, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import type { PersonalityProfile } from "@/data/personalityProfiles";
import personalityHero from "@/assets/personality-hero.jpg";

interface ReciprocityOverlayProps {
  profile: PersonalityProfile;
  dimensions: { id: number; dominant: string; percent: number }[];
  onComplete: () => void;
}

const steps = [
  {
    title: "Le principe de réciprocité",
    subtitle: "La confiance commence par un petit pas l'un vers l'autre.",
  },
  {
    title: "Ce qui sera visible",
    subtitle: "Transparence totale sur ce que vos matchs verront.",
  },
  {
    title: "Votre aperçu public",
    subtitle: "Voici comment votre profil apparaîtra.",
  },
  {
    title: "Votre décision",
    subtitle: "Acceptez-vous le partage réciproque ?",
  },
];

export default function ReciprocityOverlay({ profile, dimensions, onComplete }: ReciprocityOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleChoice = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#1B2333]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* ─── FLOATING STEP INDICATOR ─── */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg border border-border/30">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentStep ? "w-8 bg-[#D4AF37]" : i < currentStep ? "w-3 bg-[#1B2333]" : "w-3 bg-gray-200"
              }`}
            />
          ))}
          <span className="ml-3 text-base font-bold text-muted-foreground tracking-wider uppercase">
            {currentStep + 1}/{steps.length}
          </span>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* STEP 1: Introduction */}
          {currentStep === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-[hsl(var(--cream))] rounded-full flex items-center justify-center mb-8 text-4xl shadow-sm border border-[#D4AF37]/10">
                🤝
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-[#1B2333] mb-4">{steps[0].title}</h2>
              <p className="font-heading text-xl md:text-2xl text-[#1B2333]/80 italic max-w-md leading-relaxed mb-6">
                "{steps[0].subtitle}"
              </p>
              <p className="text-muted-foreground text-lg max-w-sm">
                Chez Kalimera, nous encourageons l'ouverture mutuelle pour créer des connexions authentiques.
              </p>
            </div>
          )}

          {/* STEP 2: What's shared */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col justify-center px-10 py-20 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-heading text-2xl md:text-3xl text-[#1B2333] text-center mb-10">{steps[1].title}</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto w-full">
                <div className="bg-[hsl(var(--cream))] p-6 rounded-2xl border border-[#D4AF37]/10">
                  <div className="flex items-center gap-2 mb-5">
                    <Eye className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-base font-bold tracking-[0.2em] uppercase text-[#D4AF37]">Visible</span>
                  </div>
                  <ul className="space-y-3">
                    {["Titre de personnalité", "Vos 4 scores", "Résumé de tempérament"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-base font-medium text-[#1B2333]">
                        <Check className="h-4 w-4 text-[#D4AF37] shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 opacity-60">
                  <div className="flex items-center gap-2 mb-5">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    <span className="text-base font-bold tracking-[0.2em] uppercase text-gray-400">Privé</span>
                  </div>
                  <ul className="space-y-3">
                    {["Analyse complète", "Forces & Fragilités", "Visions & Détails"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-base text-gray-400">
                        <Lock className="h-4 w-4 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preview card */}
          {currentStep === 2 && (
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-20 animate-in fade-in zoom-in-95 duration-500">
              <p className="text-muted-foreground text-lg uppercase tracking-[0.2em] font-bold mb-6">
                Votre portrait Prestige
              </p>
              <div className="relative rounded-[24px] overflow-hidden shadow-2xl border border-white/20 max-w-sm w-full aspect-[3/4]">
                <img src={personalityHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1B2333]/85 backdrop-blur-[2px]" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
                  <h3 className="font-heading text-2xl font-bold mb-6">{profile.title}</h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {dimensions.slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-base font-medium"
                      >
                        {d.dominant} <span className="text-[#D4AF37] ml-1">{d.percent}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-base italic opacity-90 leading-relaxed font-serif line-clamp-3">
                    "{profile.temperament[0]}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Decision */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-20 text-center animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-heading text-3xl md:text-4xl text-[#1B2333] mb-4">{steps[3].title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
                En acceptant de partager votre résumé, vous débloquez automatiquement le droit de découvrir celui de vos rencontres.
              </p>
              <div className="flex flex-col gap-4 max-w-sm w-full">
                <button
                  onClick={() => handleChoice()}
                  className="w-full py-5 rounded-2xl bg-[#D4AF37] text-[#1B2333] font-bold text-xl shadow-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all"
                >
                  <Unlock className="h-5 w-5" /> Oui, je partage
                </button>
                <button
                  onClick={() => handleChoice()}
                  className="w-full py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-medium text-lg hover:bg-gray-50 transition-all"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Lock className="h-4 w-4" /> Non, garder privé
                  </span>
                </button>
              </div>
              <p className="text-lg text-muted-foreground mt-6 italic">Choix modifiable à tout moment dans vos réglages.</p>
            </div>
          )}
        </div>

        {/* ─── BOTTOM NAV ─── */}
        {currentStep < 3 && (
          <div className="px-10 py-6 border-t border-border/30 text-center shrink-0">
            <button
              onClick={handleNext}
              className="text-[#1B2333] hover:text-[#D4AF37] font-bold text-xl flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              Continuer <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
