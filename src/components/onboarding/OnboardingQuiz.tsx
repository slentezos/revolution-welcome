import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CriteriaEditWarningModal from "@/components/onboarding/CriteriaEditWarningModal";

interface CooldownInfo {
  isCompleted: boolean;
  isLocked: boolean;
  canEdit: boolean;
  daysRemaining: number;
  recordCriteriaUpdate: () => Promise<void>;
}

interface OnboardingQuizProps {
  profileId: string;
  onComplete: () => void;
  cooldown?: CooldownInfo;
}

type PreferenceCategory = {
  id: string;
  label: string;
  placeholder: string;
  suggestions: string[];
};

const categories: PreferenceCategory[] = [
  {
    id: "drinks",
    label: "Vos 3 boissons préférées",
    placeholder: "Boisson",
    suggestions: ["Thé vert", "Champagne", "Café noir", "Vin rouge"],
  },
  {
    id: "food",
    label: "Vos 3 plats/desserts préférés",
    placeholder: "Plat",
    suggestions: ["Blanquette de veau", "Tarte Tatin", "Risotto", "Crème brûlée"],
  },
  {
    id: "books",
    label: "Vos 3 livres préférés",
    placeholder: "Livre",
    suggestions: ["Le Petit Prince", "L'Étranger", "Belle du Seigneur", "Les Misérables"],
  },
  {
    id: "movies",
    label: "Vos 3 films culte",
    placeholder: "Film",
    suggestions: ["Les Intouchables", "Amélie Poulain", "Le Grand Bleu", "Casablanca"],
  },
  {
    id: "music",
    label: "Vos 3 genres de musique",
    placeholder: "Genre",
    suggestions: ["Jazz", "Classique", "Chanson française", "Bossa nova"],
  },
  {
    id: "destinations",
    label: "Vos 3 destinations de rêve",
    placeholder: "Destination",
    suggestions: ["Toscane", "Provence", "Japon", "Grèce"],
  },
  {
    id: "artists",
    label: "Vos 3 artistes / personnages",
    placeholder: "Artiste",
    suggestions: ["Aznavour", "Édith Piaf", "Monet", "Simone Veil"],
  },
  {
    id: "animals",
    label: "Vos 3 animaux préférés",
    placeholder: "Animal",
    suggestions: ["Chat", "Cheval", "Dauphin", "Chien"],
  },
  {
    id: "objects",
    label: "Vos 3 objets fétiches",
    placeholder: "Objet",
    suggestions: ["Montre ancienne", "Carnet de voyage", "Appareil photo", "Vinyle"],
  },
  {
    id: "hobbies",
    label: "Vos 3 passe-temps favoris",
    placeholder: "Passe-temps",
    suggestions: ["Jardinage", "Randonnée", "Lecture", "Cuisine"],
  },
];

const TOTAL_PAGES = categories.length + 1; // +1 for "why alone"

export default function OnboardingQuiz({ profileId, onComplete, cooldown }: OnboardingQuizProps) {
  const [preferences, setPreferences] = useState<Record<string, string[]>>(
    Object.fromEntries(categories.map((cat) => [cat.id, ["", "", ""]])),
  );
  const [whyAlone, setWhyAlone] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [editUnlocked, setEditUnlocked] = useState(false);
  const { toast } = useToast();

  // Cooldown: if locked, show toast and block editing
  const isCooldownLocked = cooldown?.isCompleted && cooldown?.isLocked;
  const isCooldownEditable = !cooldown || !cooldown.isCompleted || cooldown.canEdit || editUnlocked;

  const handleInputChange = (categoryId: string, index: number, value: string) => {
    if (!isCooldownEditable) {
      if (isCooldownLocked) {
        toast({
          title: "🔒 Critères en cours d'analyse",
          description: `Vous pourrez les ajuster à nouveau dans ${cooldown?.daysRemaining} jours.`,
        });
      } else if (cooldown?.canEdit) {
        setShowWarningModal(true);
      }
      return;
    }
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].map((v, i) => (i === index ? value.slice(0, 40) : v)),
    }));
  };

  const isWhyAlonePage = currentPage >= categories.length;
  const isLastPage = currentPage === TOTAL_PAGES - 1;

  const currentCategory = !isWhyAlonePage ? categories[currentPage] : null;

  const currentPageValid = isWhyAlonePage ? true : preferences[currentCategory!.id].some((v) => v.trim().length > 0);

  const progressPercent = ((currentPage + 1) / TOTAL_PAGES) * 100;

  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const insertData: { user_id: string; profile_id: string; question_id: string; answer_value: string }[] = [];

      for (const category of categories) {
        const answers = preferences[category.id].filter((v) => v.trim().length > 0);
        if (answers.length > 0) {
          insertData.push({
            user_id: session.user.id,
            profile_id: profileId,
            question_id: category.id,
            answer_value: JSON.stringify(answers),
          });
        }
      }

      if (whyAlone.trim().length > 0) {
        insertData.push({
          user_id: session.user.id,
          profile_id: profileId,
          question_id: "why_alone",
          answer_value: whyAlone.trim(),
        });
      }

      if (insertData.length > 0) {
        const { error } = await supabase.from("quiz_responses").insert(insertData);
        if (error) throw error;
      }

      toast({ title: "Enregistré", description: "Vos préférences ont été sauvegardées" });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (isLastPage) {
      handleFinish();
    } else {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = async () => {
    await handleSave();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-40">
      {/* Cooldown locked banner */}
      {isCooldownLocked && (
        <div className="bg-secondary border-b border-border px-6 py-4 text-center">
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            🔒 Critères en cours d'analyse. Vous pourrez les ajuster à nouveau dans {cooldown?.daysRemaining} jours.
          </p>
        </div>
      )}

      {/* Cooldown warning modal */}
      <CriteriaEditWarningModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        onConfirm={() => setEditUnlocked(true)}
      />

      {/* ══════ TOP BAR ══════ */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md pt-8 pb-4 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-4">
            <h1 className="font-heading text-3xl font-bold text-[#1B2333]">Quiz des 3 préférences</h1>
            <span className="text-gray-500 font-medium text-xl">
              {currentPage + 1} / {TOTAL_PAGES}
            </span>
          </div>

          {/* Progress segments */}
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_PAGES }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  idx === currentPage ? "bg-[#D4AF37]" : idx < currentPage ? "bg-[#1B2333]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════ QUESTION CARDS ══════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-40">
        {!isWhyAlonePage && currentCategory ? (
          <div className="rounded-[24px] border p-6 md:p-10 transition-all duration-500 ease-out relative opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 pointer-events-auto border-[hsl(var(--gold))] bg-card">
            {/* Question header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B2333] shrink-0 text-2xl">
                {(currentPage + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="font-heading text-3xl md:text-3xl font-bold text-[#1B2333] leading-snug">
                {currentCategory.label}
              </h3>
            </div>

            {/* Inputs */}
            <div className="space-y-4 md:ml-14">
              {[0, 1, 2].map((index) => (
                <Input
                  key={index}
                  placeholder={`${currentCategory.placeholder} ${index + 1}`}
                  value={preferences[currentCategory.id][index]}
                  onChange={(e) => handleInputChange(currentCategory.id, index, e.target.value)}
                  maxLength={40}
                  className="bg-[hsl(35,15%,97%)] border-2 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-xl placeholder:text-muted-foreground placeholder:font-light border-[#7a7a7a]"
                />
              ))}
            </div>

            {/* Suggestions */}
            <div className="mt-6 md:ml-14">
              <p className="text-muted-foreground mb-2.5 italic text-base">Inspirations :</p>
              <div className="flex flex-wrap gap-2">
                {currentCategory.suggestions.map((suggestion) => (
                  <span
                    key={suggestion}
                    className="px-4 py-1.5 rounded-full font-medium bg-accent text-accent-foreground border border-border text-xl"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border p-6 md:p-10 transition-all duration-500 ease-out relative opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 pointer-events-auto border-[hsl(var(--gold))] bg-card">
            {/* Question header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B2333] shrink-0 text-2xl">
                11
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#1B2333] leading-snug md:text-2xl">
                Pourquoi êtes-vous seul(e) aujourd'hui ?
              </h3>
            </div>

            <div className="md:ml-14">
              <span className="italic mb-6 block text-gray-600 text-xl">
                A cette étape de votre désir de nouvelle vie, ne serait-il pas utile de faire le point avec vous-même et
                de vous demander en toute sincérité pourquoi vous êtes seule aujourd'hui. (information confidentielle
                non partagée)
              </span>
              <Textarea
                showDictation
                placeholder="Partagez votre histoire si vous le souhaitez..."
                value={whyAlone}
                onChange={(e) => setWhyAlone(e.target.value)}
                rows={8}
              />
            </div>
          </div>
        )}
      </div>

      {/* ══════ BOTTOM BAR ══════ */}
      <div
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] py-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          <div className="text-xl font-medium text-gray-500 hidden lg:block">
            Question {currentPage + 1} / {TOTAL_PAGES}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {currentPage > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-11 px-5 rounded-lg border-gray-300 text-[#1B2333] hover:bg-gray-50 font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={saving}
              className="h-11 px-6 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium"
            >
              {saving ? "Enregistrement..." : isLastPage ? "Terminer" : "Continuer"}
              {!isLastPage && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
