import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, ArrowDown, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const TOTAL_PAGES = 11;

const CATEGORIES = [
  { id: "drinks", label: "Boissons", emoji: "🍸", placeholder: "Vos 3 boissons préférées...", hint: "Champagne, Vin rouge, Thé..." },
  { id: "food", label: "Cuisine", emoji: "🍽️", placeholder: "Vos 3 cuisines préférées...", hint: "Cuisine française, Sushi, Italien..." },
  { id: "books", label: "Livres", emoji: "📚", placeholder: "Vos 3 livres préférés...", hint: "Le Petit Prince, Belle du Seigneur, L'Étranger..." },
  { id: "movies", label: "Films", emoji: "🎬", placeholder: "Vos 3 films préférés...", hint: "Les Intouchables, Amélie Poulain, Casablanca..." },
  { id: "music", label: "Musique", emoji: "🎵", placeholder: "Vos 3 musiques préférées...", hint: "Jazz, Classique, Chanson française..." },
  { id: "destinations", label: "Destinations", emoji: "✈️", placeholder: "Vos 3 destinations préférées...", hint: "Toscane, Provence, Japon..." },
  { id: "artists", label: "Artistes", emoji: "🎨", placeholder: "Vos 3 artistes préférés...", hint: "Aznavour, Édith Piaf, Monet..." },
  { id: "animals", label: "Animaux", emoji: "🐕", placeholder: "Vos 3 animaux préférés...", hint: "Chat, Cheval, Dauphin..." },
  { id: "objects", label: "Objets fétiches", emoji: "⌚", placeholder: "Vos 3 objets fétiches...", hint: "Montre ancienne, Carnet de voyage, Appareil photo..." },
  { id: "hobbies", label: "Passe-temps", emoji: "🌿", placeholder: "Vos 3 passe-temps préférés...", hint: "Jardinage, Randonnée, Lecture..." },
];

export default function OnboardingQuiz({
  profileId,
  onComplete,
  cooldown
}: {
  profileId: string;
  onComplete: () => void;
  cooldown?: any;
}) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation style
  const slowFloatAnimation = `
    @keyframes slowFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(12px); }
    }
    .animate-slow-float {
      animation: slowFloat 3s ease-in-out infinite;
    }
  `;

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const { data, error } = await supabase
          .from("quiz_responses")
          .select("answer_value")
          .eq("profile_id", profileId)
          .eq("question_id", "three_preferences")
          .maybeSingle();

        if (error) throw error;
        if (data?.answer_value) {
          const parsed = typeof data.answer_value === "string" ? JSON.parse(data.answer_value) : data.answer_value;
          setAnswers(parsed);
        }
      } catch (error) {
        console.error("Error loading quiz answers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnswers();
  }, [profileId]);

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSave();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await supabase.from("quiz_responses").upsert(
        {
          user_id: session.user.id,
          profile_id: profileId,
          question_id: "three_preferences",
          answer_value: JSON.stringify(answers)
        },
        { onConflict: "profile_id,question_id" }
      );

      if (error) throw error;
      toast({ title: "Enregistré ✓", description: "Vos préférences ont été sauvegardées." });
      onComplete();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-medium animate-pulse">Chargement...</div>;

  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const currentCategory = CATEGORIES[currentPage];

  return (
    <div className="min-h-screen bg-background">
      <style>{slowFloatAnimation}</style>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md pt-8 pb-4 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-heading text-3xl font-bold text-[#1B2333]">Quiz des 3 préférences</h2>
            <span className="text-gray-500 font-medium text-xl">
              {currentPage + 1} / {TOTAL_PAGES}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i === currentPage ? "bg-[#D4AF37]" : i < currentPage ? "bg-[#1B2333]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        {!isLastPage ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6">
              <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1B2333] shrink-0 text-2xl">
                {currentPage + 1}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentCategory.emoji}</span>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333] leading-snug">
                  Quelles sont vos 3 {currentCategory.label.toLowerCase()} préférées ?
                </h3>
              </div>
            </div>

            <div className="space-y-6 md:ml-16">
              <p className="italic text-gray-500 text-xl">Exemple : {currentCategory.hint}</p>
              <Textarea
                placeholder={currentCategory.placeholder}
                value={answers[currentCategory.id] || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentCategory.id]: e.target.value }))}
                className="min-h-[160px] text-xl p-6 bg-white border-2 border-gray-100 focus:border-[#D4AF37] rounded-3xl shadow-sm transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Final Question with "écrire un message" style */}
            <div className="bg-white rounded-[32px] border-2 border-gray-100 shadow-xl overflow-hidden">
              <div className="bg-[#1B2333] px-8 py-6 flex items-center gap-5">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[hsl(var(--gold))]/10 border-2 border-[hsl(var(--gold))]/30 flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-[hsl(var(--gold))]" />
                </div>
                <div>
                  <p className="text-[hsl(var(--gold-light))] text-sm lg:text-base uppercase tracking-[0.18em] font-medium mb-1">
                    Question finale
                  </p>
                  <h2 className="font-heading font-semibold text-white text-2xl lg:text-3xl leading-tight">
                    Pourquoi êtes-vous seul(e) aujourd'hui ?
                  </h2>
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-6">
                <p className="italic text-gray-600 text-xl leading-relaxed">
                  Cette réponse est précieuse pour que nous puissions mieux vous accompagner dans votre démarche.
                </p>
                
                <Textarea
                  showDictation
                  placeholder="Partagez votre histoire avec nous..."
                  value={answers.why_alone || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, why_alone: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-16 flex items-center justify-between md:ml-16">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="text-gray-500 hover:text-[#1B2333] font-bold text-xl h-14 px-8"
          >
            {currentPage > 0 && <ChevronLeft className="mr-2 h-6 w-6" />}
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={saving}
            className="bg-[#1B2333] text-white hover:bg-[#1B2333]/90 font-bold text-xl h-14 px-10 rounded-2xl shadow-lg transition-all"
          >
            {isLastPage ? (saving ? "Enregistrement..." : "Terminer le quiz") : "Suivant"}
            {!isLastPage && <ChevronRight className="ml-2 h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Footer Hint */}
      {currentPage === 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce pointer-events-none">
          <span className="text-muted-foreground font-medium text-xl">Faites défiler pour voir la suite</span>
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white shadow-sm">
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}
