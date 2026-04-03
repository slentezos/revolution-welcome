import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, ArrowDown, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PROFILE_QUESTIONS, CHAPTERS, getChapterQuestions, type ProfileQuestion } from "@/data/profileQuestions";
import CriteriaEditWarningModal from "@/components/onboarding/CriteriaEditWarningModal";

interface CooldownInfo {
  isCompleted: boolean;
  isLocked: boolean;
  canEdit: boolean;
  daysRemaining: number;
  recordCriteriaUpdate: () => Promise<void>;
}

interface OnboardingProfileProps {
  profileId: string;
  onComplete: () => void;
  readOnly?: boolean;
  cooldown?: CooldownInfo;
}

type Answers = Record<string, {mon: string[];son: string[];}>;

const STORAGE_KEY_PREFIX = "profile_answers_";

// Animation de flottement doux
const slowFloatAnimation = `
  @keyframes slowFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(12px); }
  }
  .animate-slow-float {
    animation: slowFloat 3s ease-in-out infinite;
  }
`;

// Type pour notre flux de défilement unifié (Chapitres + Questions)
type ScrollNode = {
  id: string;
  type: "chapter" | "question";
  index?: number; // Index absolu pour les questions uniquement
};

export default function OnboardingProfile({ profileId, onComplete, readOnly = false, cooldown }: OnboardingProfileProps) {
  const { toast } = useToast();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [editUnlocked, setEditUnlocked] = useState(false);

  // Cooldown logic for "son profil" fields
  const isCooldownLocked = cooldown?.isCompleted && cooldown?.isLocked;
  const isSonEditable = !cooldown || !cooldown.isCompleted || cooldown.canEdit || editUnlocked;

  const [currentChapter, setCurrentChapter] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + profileId);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Identifiant de Nœud global (Chapitre ou Question)
  const [activeNodeId, setActiveNodeId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const isAutoScrolling = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ── 1. Création de la séquence complète de défilement ──
  const scrollNodes = useMemo(() => {
    const nodes: ScrollNode[] = [];
    let qIndex = 0;
    CHAPTERS.forEach((ch, idx) => {
      // Le titre du chapitre devient une étape
      nodes.push({ id: `chapter-${idx}`, type: "chapter" });
      // Suivi de ses questions
      getChapterQuestions(idx).forEach((q) => {
        nodes.push({ id: q.id, type: "question", index: qIndex++ });
      });
    });
    return nodes;
  }, []);

  // ── localStorage auto-save ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + profileId, JSON.stringify(answers));
  }, [answers, profileId]);

  // ── Initialisation ──
  useEffect(() => {
    if (scrollNodes.length > 0 && !activeNodeId) {
      // Reprendre à la première question non répondue, ou au Chapitre 1
      const firstUnanswered = PROFILE_QUESTIONS.find((q) => !isQuestionAnswered(q, answers));
      if (firstUnanswered) {
        setActiveNodeId(firstUnanswered.id);
      } else {
        setActiveNodeId(scrollNodes[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Synchroniser le chapitre actif avec la barre de progression ──
  useEffect(() => {
    if (!activeNodeId) return;
    if (activeNodeId.startsWith("chapter-")) {
      setCurrentChapter(parseInt(activeNodeId.split("-")[1], 10));
    } else {
      const chapterIdx = CHAPTERS.findIndex((_, i) => getChapterQuestions(i).some((q) => q.id === activeNodeId));
      if (chapterIdx !== -1 && chapterIdx !== currentChapter) {
        setCurrentChapter(chapterIdx);
      }
    }
  }, [activeNodeId, currentChapter]);

  // ── Intersection Observer (Le Radar Infaillible) ──
  useEffect(() => {
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-node-id");
            if (id) setActiveNodeId(id);
          }
        });
      },
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 }
    );

    observerRef.current = observer;

    const timer = setTimeout(() => {
      nodeRefs.current.forEach((el) => observer.observe(el));
    }, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [scrollNodes]);

  const answeredCount = useMemo(() => {
    return PROFILE_QUESTIONS.filter((q) => isQuestionAnswered(q, answers)).length;
  }, [answers]);

  const handlePillSelect = useCallback(
    (questionId: string, column: "mon" | "son", value: string, max: number) => {
      if (readOnly) return;
      // Block "son" column edits when cooldown is locked
      if (column === "son" && cooldown?.isCompleted && !isSonEditable) {
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
      setAnswers((prev) => {
        const current = prev[questionId]?.[column] || [];
        let next: string[];
        if (max === 1) {
          next = current.includes(value) ? [] : [value];
        } else {
          if (current.includes(value)) {
            next = current.filter((v) => v !== value);
          } else if (current.length < max) {
            next = [...current, value];
          } else {
            return prev;
          }
        }
        return { ...prev, [questionId]: { ...prev[questionId], [column]: next } };
      });
    },
    [readOnly]
  );

  const handleFreeInput = useCallback(
    (questionId: string, column: "mon" | "son", value: string, index?: number) => {
      if (readOnly) return;
      if (column === "son" && cooldown?.isCompleted && !isSonEditable) {
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
      setAnswers((prev) => {
        const current = prev[questionId]?.[column] || [];
        let next: string[];
        if (index !== undefined) {
          next = [...current];
          next[index] = value;
        } else {
          next = [value];
        }
        return {
          ...prev,
          [questionId]: { mon: prev[questionId]?.mon || [], son: prev[questionId]?.son || [], [column]: next }
        };
      });
    },
    [readOnly]
  );

  // ── Logique de défilement fluide ──
  const scrollToNode = (nodeId: string | undefined) => {
    if (!nodeId) return;
    isAutoScrolling.current = true;
    setActiveNodeId(nodeId);

    setTimeout(() => {
      const element = document.getElementById(`node-${nodeId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 1200);
    }, 10);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await supabase.from("quiz_responses").upsert(
        {
          user_id: session.user.id,
          profile_id: profileId,
          question_id: "profile_preferences",
          answer_value: JSON.stringify(answers)
        },
        { onConflict: "profile_id,question_id" }
      );
      if (error) throw error;
      toast({ title: "Enregistré ✓", description: "Vos réponses ont été sauvegardées." });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    await handleSave();
    onComplete();
  };

  const setNodeRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el);else
    nodeRefs.current.delete(id);
  }, []);

  // Index actuel dans le flux global (Chapitres + Questions)
  const currentNodeIdx = scrollNodes.findIndex((n) => n.id === activeNodeId);
  const activeNode = scrollNodes[currentNodeIdx];

  return (
    <div className={`min-h-screen bg-background ${readOnly ? "opacity-80" : ""}`}>
      <style>{slowFloatAnimation}</style>

      {/* Cooldown locked banner */}
      {isCooldownLocked && (
        <div className="bg-secondary border-b border-border px-6 py-4 text-center">
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            🔒 Les critères de recherche ("Son profil") sont en cours d'analyse. Vous pourrez les ajuster dans {cooldown?.daysRemaining} jours.
          </p>
        </div>
      )}

      {/* Cooldown warning modal */}
      <CriteriaEditWarningModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        onConfirm={() => setEditUnlocked(true)}
      />

      {/* ── Sticky Progress Header ── */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md pt-8 pb-4 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-heading text-3xl font-bold text-[#1B2333] transition-all duration-300">
              {CHAPTERS[currentChapter]}
            </h2>
            <span className="text-gray-500 text-xl font-normal">
              {answeredCount} / {PROFILE_QUESTIONS.length} répondues
            </span>
          </div>
          <div className="flex gap-2">
            {CHAPTERS.map((ch, i) =>
            <button
              key={i}
              // Cliquer sur la barre emmène au titre du chapitre
              onClick={() => scrollToNode(`chapter-${i}`)}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 cursor-pointer ${
              i === currentChapter ? "bg-[#D4AF37]" : i < currentChapter ? "bg-[#1B2333]" : "bg-gray-200"}`
              }
              title={ch} />

            )}
          </div>
        </div>
      </div>

      {/* ── Liste des Nœuds (Chapitres + Questions en flux continu) ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" style={{ paddingBottom: "30vh" }}>
        {CHAPTERS.map((chapterName, chapterIdx) => {
          const questions = getChapterQuestions(chapterIdx);
          const chapterId = `chapter-${chapterIdx}`;

          return (
            <div key={chapterIdx}>
              {/* LIGNE DE SÉPARATION DISCRÈTE (affichée uniquement avant le titre, sauf le premier) */}
              {chapterIdx > 0 &&
              <div className="flex items-center gap-6 opacity-40" style={{ marginTop: "10vh", marginBottom: "5vh" }}>
                  <div className="h-px bg-border flex-1" />
                  <div className="h-px bg-border flex-1" />
                </div>
              }

              {/* ── NŒUD 1: TITRE DU CHAPITRE (Ne devient jamais flou) ── */}
              <div
                id={`node-${chapterId}`}
                data-node-id={chapterId}
                ref={(el) => setNodeRef(chapterId, el)}
                onClick={() => {
                  if (activeNodeId !== chapterId) setActiveNodeId(chapterId);
                }}
                className="flex flex-col items-center justify-center text-center cursor-pointer relative"
                style={{
                  minHeight: "40vh",
                  marginTop: chapterIdx === 0 ? "5vh" : "10vh",
                  marginBottom: "35vh", // Espace avant la première question
                  scrollMarginTop: "180px" // Marge pour s'arrêter parfaitement sous le header
                }}>
                
                <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
                  Partie {chapterIdx + 1}
                </span>
                <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-10 max-w-2xl leading-tight">
                  {chapterName}
                </h2>

                {/* Bouton de progression pour le chapitre (Toujours visible et flottant) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToNode(scrollNodes[scrollNodes.findIndex((n) => n.id === chapterId) + 1]?.id);
                  }}
                  className="flex flex-col items-center gap-4 group transition-all duration-500">
                  
                  <span className="font-medium text-muted-foreground group-hover:text-[#D4AF37] transition-colors text-2xl">
                    Cliquez pour continuer vers les questions
                  </span>
                  <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center animate-slow-float bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/20 transition-all">
                    <ArrowDown className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                </button>
              </div>

              {/* ── NŒUDS 2+: QUESTIONS DU CHAPITRE ── */}
              <div className="flex flex-col">
                {questions.map((q) => {
                  const isActive = q.id === activeNodeId;

                  return (
                    <div
                      key={q.id}
                      id={`node-${q.id}`}
                      data-node-id={q.id}
                      ref={(el) => setNodeRef(q.id, el)}
                      onClick={() => {
                        if (!isActive) setActiveNodeId(q.id);
                      }}
                      // Style inline stricte pour forcer les marges de séparation et d'alignement
                      style={{ marginBottom: "45vh", scrollMarginTop: "180px" }}
                      className={`rounded-[24px] border p-6 md:p-10 transition-all duration-700 ease-out relative ${
                      isActive ?
                      "opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 pointer-events-auto border-[hsl(var(--gold))] bg-card scale-[1.01]" :
                      "opacity-40 cursor-pointer hover:opacity-80 border-border bg-[hsl(var(--cream))]/30 scale-100"}`
                      }>
                      
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 transition-colors duration-500 ${
                            isActive ? "bg-[#D4AF37] text-white" : "bg-gray-100 text-[#1B2333]"}`
                            }>
                            
                            {q.id.replace("R", "")}
                          </span>
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#1B2333] leading-snug">
                            {q.question}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`transition-all duration-700 ${isActive ? "opacity-100" : "pointer-events-none"}`}>
                        
                        {q.type === "free_input" ?
                        <FreeInputQuestion question={q} answer={answers[q.id]} onInput={handleFreeInput} /> :

                        <PillsQuestion question={q} answer={answers[q.id]} onSelect={handlePillSelect} />
                        }
                      </div>
                    </div>);

                })}
              </div>
            </div>);

        })}
      </div>

      {/* ── Fixed Bottom Action Bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] py-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            {activeNode?.type === "chapter" ?
            `Partie ${parseInt(activeNode.id.split("-")[1]) + 1} sur ${CHAPTERS.length}` :
            `Question ${(activeNode?.index ?? 0) + 1} sur ${PROFILE_QUESTIONS.length}`}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {currentNodeIdx > 0 &&
            <Button
              variant="outline"
              onClick={() => scrollToNode(scrollNodes[currentNodeIdx - 1]?.id)}
              className="h-11 px-5 rounded-lg border-gray-300 text-[#1B2333] hover:bg-gray-50 font-medium">
              
                <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
            }

            {currentNodeIdx === scrollNodes.length - 1 ?
            <Button
              onClick={handleContinue}
              disabled={saving}
              className="h-11 px-8 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium">
              
                {saving ? "Enregistrement..." : "Terminer et valider"}
              </Button> :

            <Button
              onClick={() => scrollToNode(scrollNodes[currentNodeIdx + 1]?.id)}
              className="h-11 px-6 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium">
              
                Suivant <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            }
          </div>
        </div>
      </div>
    </div>);

}

// ══════════════════════════════════════════════
// Sub-components (Inchangés)
// ══════════════════════════════════════════════

function NumericStepper({ value, onChange, min, max, unit, placeholder, variant = "default" }: any) {
  const numVal = parseInt(value, 10) || min;
  const increment = () => onChange(String(Math.min(max, numVal + 1)));
  const decrement = () => onChange(String(Math.max(min, numVal - 1)));
  const borderClass =
  variant === "primary" ?
  "border-primary/20 bg-primary/5 focus-within:ring-primary/30" :
  "border-border bg-[hsl(var(--cream))] focus-within:ring-[hsl(var(--gold))]/50";

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border min-h-[56px] px-2 transition-all focus-within:ring-2 ${borderClass}`}>
      
      <button
        type="button"
        onClick={decrement}
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-black/5 hover:bg-black/10 shrink-0 text-foreground">
        
        −
      </button>
      <div className="relative flex-1 text-center">
        <input
          type="text"
          inputMode="numeric"
          value={value || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d+$/.test(val)) {
              onChange(val);
            }
          }}
          onBlur={() => {
            if (value !== "") {
              const n = parseInt(value, 10);
              if (n < min) onChange(String(min));else
              if (n > max) onChange(String(max));
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-center text-2xl font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
        
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">
          {unit}
        </span>
      </div>
      <button
        type="button"
        onClick={increment}
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-black/5 hover:bg-black/10 shrink-0 text-foreground">
        
        +
      </button>
    </div>);

}

function FreeInputQuestion({ question, answer, onInput, disabled = false }: any) {
  const isAge = question.inputType === "age";
  const unit = isAge ? "ans" : "cm";
  const min = isAge ? 60 : 140;
  const max = isAge ? 85 : 210;
  const monVal = answer?.mon?.[0] || "";
  const sonMin = answer?.son?.[0] || "";
  const sonMax = answer?.son?.[1] || "";

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <div>
        <label className="block font-semibold text-muted-foreground mb-3 uppercase tracking-wider text-xl">Moi</label>
        <NumericStepper
          value={monVal}
          onChange={(val: any) => onInput(question.id, "mon", val)}
          min={min}
          max={max}
          unit={unit}
          placeholder={isAge ? "65" : "170"} />
        
      </div>
      <div>
        <label className="block font-semibold text-primary mb-3 uppercase tracking-wider text-xl">Lui / Elle</label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground whitespace-nowrap text-lg">De</span>
            <div className="flex-1">
              <NumericStepper
                value={sonMin}
                onChange={(val: any) => onInput(question.id, "son", val, 0)}
                min={min}
                max={max}
                unit={unit}
                placeholder={isAge ? "60" : "150"}
                variant="primary" />
              
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground whitespace-nowrap text-lg pl-1">à</span>
            <div className="flex-1">
              <NumericStepper
                value={sonMax}
                onChange={(val: any) => onInput(question.id, "son", val, 1)}
                min={min}
                max={max}
                unit={unit}
                placeholder={isAge ? "85" : "190"}
                variant="primary" />
              
            </div>
          </div>
        </div>
      </div>
    </div>);

}

function PillsQuestion({ question, answer, onSelect, disabled = false }: any) {
  const monSelected = answer?.mon || [];
  const sonSelected = answer?.son || [];
  const monMaxReached = monSelected.length >= question.monMax;
  const sonMaxReached = sonSelected.length >= question.sonMax;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="uppercase tracking-wider text-2xl font-bold text-[#232a39]">Moi</span>
          <span className="font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xl">
            {monSelected.length}/{question.monMax}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {question.monOptions.map((opt: string) => {
            const selected = monSelected.includes(opt);
            const isDisabled = !selected && monMaxReached;
            return (
              <button
                key={opt}
                onClick={() => onSelect(question.id, "mon", opt, question.monMax)}
                disabled={isDisabled}
                className={`w-full min-h-[56px] rounded-xl px-5 text-left text-base font-medium border transition-all duration-200 flex items-center justify-between gap-3 ${
                selected ?
                "bg-[hsl(var(--gold))] text-white border-[hsl(var(--gold))] shadow-md" :
                isDisabled ?
                "opacity-50 border-border/30 text-muted-foreground cursor-not-allowed bg-muted/30" :
                "border-border/50 text-foreground hover:border-[hsl(var(--gold))]/40 hover:bg-[hsl(var(--cream))] bg-card"}`
                }>
                
                <span className="leading-snug text-xl text-[#0e172a] font-semibold">{opt}</span>
                {selected && <Check className="h-5 w-5 shrink-0" />}
              </button>);

          })}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-primary uppercase tracking-wider text-2xl font-bold">Lui / Elle</span>
          <span className="font-medium text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full text-xl">
            {sonSelected.length}/{question.sonMax}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {question.sonOptions.map((opt: string) => {
            const selected = sonSelected.includes(opt);
            const isDisabled = !selected && sonMaxReached;
            return (
              <button
                key={opt}
                onClick={() => onSelect(question.id, "son", opt, question.sonMax)}
                disabled={isDisabled}
                className={`w-full min-h-[56px] rounded-xl px-5 text-left text-base font-medium border transition-all duration-200 flex items-center justify-between gap-3 ${
                selected ?
                "bg-primary text-primary-foreground border-primary shadow-md" :
                isDisabled ?
                "opacity-50 border-border/30 text-muted-foreground cursor-not-allowed bg-muted/30" :
                "border-border/50 text-foreground hover:border-primary/30 hover:bg-primary/5 bg-card"}`
                }>
                
                <span className="leading-snug text-xl font-medium">{opt}</span>
                {selected && <Check className="h-5 w-5 shrink-0" />}
              </button>);

          })}
        </div>
      </div>
    </div>);

}

function isQuestionAnswered(q: ProfileQuestion, answers: Answers): boolean {
  const a = answers[q.id];
  if (!a) return false;
  if (q.type === "free_input") {
    const monOk = a.mon && a.mon[0] && a.mon[0].trim() !== "";
    const sonOk = a.son && a.son[0] && a.son[0].trim() !== "" && a.son[1] && a.son[1].trim() !== "";
    return !!monOk && !!sonOk;
  }
  return (a.mon?.length || 0) > 0 && (a.son?.length || 0) > 0;
}