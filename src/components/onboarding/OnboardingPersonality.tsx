import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PersonalityResultPage from "./PersonalityResultPage";
import { personalityQuestions, wizardParts, likertOptions } from "@/data/personalityQuestions";

const STORAGE_KEY = "personality_test_answers";
const TOTAL = personalityQuestions.length; // 42

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

type ScrollNode = {
  id: string;
  type: "chapter" | "question";
  index?: number;
};

interface OnboardingPersonalityProps {
  profileId: string;
  onComplete: () => void;
  showResultDirectly?: boolean;
}

export default function OnboardingPersonality({
  profileId,
  onComplete,
  showResultDirectly = false,
}: OnboardingPersonalityProps) {
  const { toast } = useToast();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentPart, setCurrentPart] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showResult, setShowResult] = useState(showResultDirectly);
  const [loadingAnswers, setLoadingAnswers] = useState(showResultDirectly);

  // Identifiant de Nœud global
  const [activeNodeId, setActiveNodeId] = useState<string>("");

  const isAutoScrolling = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ── 1. Création de la séquence complète de défilement ──
  const scrollNodes = useMemo(() => {
    const nodes: ScrollNode[] = [];
    let qIndex = 0;
    wizardParts.forEach((part, idx) => {
      nodes.push({ id: `chapter-${idx}`, type: "chapter" });
      const partQuestions = personalityQuestions.filter((q) => q.id >= part.start && q.id <= part.end);
      partQuestions.forEach((q) => {
        nodes.push({ id: q.id.toString(), type: "question", index: qIndex++ });
      });
    });
    return nodes;
  }, []);

  // ── Chargement depuis DB ou LocalStorage ──
  useEffect(() => {
    if (showResultDirectly) {
      (async () => {
        try {
          const { data } = await supabase
            .from("quiz_responses")
            .select("answer_value")
            .eq("profile_id", profileId)
            .eq("question_id", "personality_test")
            .maybeSingle();
          if (data?.answer_value) {
            const parsed = typeof data.answer_value === "string" ? JSON.parse(data.answer_value) : data.answer_value;
            setAnswers(parsed);
          }
        } catch (e) {
          console.error("Failed to load personality answers:", e);
        } finally {
          setLoadingAnswers(false);
        }
      })();
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, number>;
        setAnswers(parsed);
      }
    } catch {}
  }, [showResultDirectly, profileId]);

  // ── Sauvegarde automatique ──
  useEffect(() => {
    if (!showResultDirectly && Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers, showResultDirectly]);

  // ── Initialisation ──
  useEffect(() => {
    if (scrollNodes.length > 0 && !activeNodeId && !showResultDirectly) {
      const firstUnanswered = personalityQuestions.find((q) => answers[`q${q.id}`] === undefined);
      if (firstUnanswered) {
        setActiveNodeId(firstUnanswered.id.toString());
      } else {
        setActiveNodeId(scrollNodes[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResultDirectly]);

  // ── Synchroniser la barre de progression ──
  useEffect(() => {
    if (!activeNodeId) return;
    if (activeNodeId.startsWith("chapter-")) {
      setCurrentPart(parseInt(activeNodeId.split("-")[1], 10));
    } else {
      const questionIdNum = parseInt(activeNodeId, 10);
      const partIdx = wizardParts.findIndex((p) => questionIdNum >= p.start && questionIdNum <= p.end);
      if (partIdx !== -1 && partIdx !== currentPart) {
        setCurrentPart(partIdx);
      }
    }
  }, [activeNodeId, currentPart]);

  // ── Intersection Observer (Le Radar) ──
  useEffect(() => {
    if (showResultDirectly) return;

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
      { rootMargin: "-15% 0px -50% 0px", threshold: 0 },
    );

    observerRef.current = observer;

    const timer = setTimeout(() => {
      nodeRefs.current.forEach((el) => observer.observe(el));
    }, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [scrollNodes, showResultDirectly]);

  const answeredCount = Object.keys(answers).length;

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

  const handleAnswer = useCallback(
    (questionId: number, value: number) => {
      const key = `q${questionId}`;
      setAnswers((prev) => ({ ...prev, [key]: value }));

      setTimeout(() => {
        const updatedAnswers = { ...answers, [key]: value };
        const nextQ = personalityQuestions.find((q) => q.id > questionId && updatedAnswers[`q${q.id}`] === undefined);

        if (nextQ) {
          scrollToNode(nextQ.id.toString());
        } else {
          const currentIdx = scrollNodes.findIndex((n) => n.id === questionId.toString());
          if (currentIdx < scrollNodes.length - 1) {
            scrollToNode(scrollNodes[currentIdx + 1].id);
          }
        }
      }, 400);
    },
    [answers, scrollNodes],
  );

  const handleSaveAndShowResult = async () => {
    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { error } = await supabase.from("quiz_responses").upsert(
        {
          user_id: session.user.id,
          profile_id: profileId,
          question_id: "personality_test",
          answer_value: JSON.stringify(answers),
        },
        { onConflict: "profile_id,question_id" },
      );
      if (error) throw error;

      localStorage.removeItem(STORAGE_KEY);
      setShowResult(true);
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (showResult) {
    if (loadingAnswers) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
        </div>
      );
    }
    return <PersonalityResultPage answers={answers} onContinue={onComplete} />;
  }

  const setNodeRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const currentNodeIdx = scrollNodes.findIndex((n) => n.id === activeNodeId);
  const activeNode = scrollNodes[currentNodeIdx];
  const allAnswered = answeredCount === TOTAL;

  return (
    <div className="min-h-screen bg-background pb-32">
      <style>{slowFloatAnimation}</style>

      {/* ══════ EN-TÊTE FIXE "STYLE KALIMERA" ══════ */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md pt-8 pb-4 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-4">
            <h1 className="font-heading text-3xl font-bold text-[#1B2333] transition-all duration-300">
              Test de personnalité
            </h1>
            <span className="text-gray-500 font-medium text-base">
              {answeredCount} / {TOTAL} répondues
            </span>
          </div>

          <div className="flex gap-2">
            {wizardParts.map((p, idx) => {
              const partQs = personalityQuestions.filter((q) => q.id >= p.start && q.id <= p.end);
              const partDone = partQs.every((q) => answers[`q${q.id}`] !== undefined);
              const isCurrent = idx === currentPart;

              return (
                <button
                  key={idx}
                  onClick={() => scrollToNode(`chapter-${idx}`)}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 cursor-pointer ${
                    isCurrent ? "bg-[#D4AF37]" : partDone ? "bg-[#1B2333]" : "bg-gray-200"
                  }`}
                  title={`Partie ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════ LISTE DES NŒUDS ══════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8" style={{ paddingBottom: "30vh" }}>
        {wizardParts.map((part, chapterIdx) => {
          const questions = personalityQuestions.filter((q) => q.id >= part.start && q.id <= part.end);
          const chapterId = `chapter-${chapterIdx}`;

          return (
            <div key={chapterIdx}>
              {chapterIdx > 0 && (
                <div className="flex items-center gap-6 opacity-40" style={{ marginTop: "10vh", marginBottom: "5vh" }}>
                  <div className="h-px bg-border flex-1" />
                  <div className="h-px bg-border flex-1" />
                </div>
              )}

              {/* ── NŒUD 1: TITRE DU CHAPITRE ── */}
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
                  marginBottom: "35vh",
                  scrollMarginTop: "180px",
                }}
              >
                <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-lg">
                  Partie {chapterIdx + 1}
                </span>
                <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-10 max-w-2xl leading-tight">
                  {part.title}
                </h2>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToNode(scrollNodes[scrollNodes.findIndex((n) => n.id === chapterId) + 1]?.id);
                  }}
                  className="flex flex-col items-center gap-4 group transition-all duration-500"
                >
                  <span className="text-base font-medium text-muted-foreground group-hover:text-[#D4AF37] transition-colors">
                    Cliquez pour continuer vers les questions
                  </span>
                  <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center animate-slow-float bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/20 transition-all">
                    <ArrowDown className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                </button>
              </div>

              {/* ── NŒUDS 2+: QUESTIONS DU CHAPITRE ── */}
              <div className="flex flex-col">
                {questions.map((question) => {
                  const key = `q${question.id}`;
                  const selectedValue = answers[key] ?? null;
                  const isActive = question.id.toString() === activeNodeId;

                  return (
                    <div
                      key={question.id}
                      id={`node-${question.id}`}
                      data-node-id={question.id.toString()}
                      ref={(el) => setNodeRef(question.id.toString(), el)}
                      onClick={() => {
                        if (!isActive) setActiveNodeId(question.id.toString());
                      }}
                      style={{ marginBottom: "45vh", scrollMarginTop: "180px" }}
                      className={`rounded-[24px] border p-6 md:p-8 transition-all duration-700 ease-out relative ${
                        isActive
                          ? "opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 pointer-events-auto border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/5 scale-[1.01]"
                          : "opacity-40 cursor-pointer hover:opacity-80 border-border bg-[hsl(var(--cream))]/30 scale-100"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <span
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 transition-colors duration-500 ${
                            isActive ? "bg-[#D4AF37] text-white" : "bg-gray-100 text-[#1B2333]"
                          }`}
                        >
                          {question.id.toString().padStart(2, "0")}
                        </span>
                        <h3 className="font-bold text-[#1B2333] leading-snug text-2xl">{question.text}</h3>
                      </div>

                      <div
                        className={`transition-all duration-700 space-y-3 md:ml-16 ${isActive ? "opacity-100" : "pointer-events-none"}`}
                      >
                        {likertOptions.map((option) => {
                          const isSelected = selectedValue === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnswer(question.id, option.value);
                              }}
                              className={`w-full h-[56px] rounded-xl px-5 text-left text-[16px] font-medium flex items-center justify-between transition-all duration-200 border ${
                                isSelected
                                  ? "bg-[#1B2333] text-white shadow-md border-[#1B2333]"
                                  : "bg-card text-[#1B2333] hover:bg-gray-50 hover:border-[#D4AF37]/40 border-border/50"
                              }`}
                            >
                              <span>{option.label}</span>
                              {isSelected && <Check className="h-5 w-5 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════ BARRE D'ACTIONS FIXE EN BAS ══════ */}
      <div
        className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] py-[10px]"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            {activeNode?.type === "chapter"
              ? `Partie ${parseInt(activeNode.id.split("-")[1]) + 1} sur ${wizardParts.length}`
              : `Question ${activeNode?.index !== undefined ? activeNode.index + 1 : 1} sur ${TOTAL}`}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {currentNodeIdx > 0 && (
              <Button
                variant="outline"
                onClick={() => scrollToNode(scrollNodes[currentNodeIdx - 1]?.id)}
                className="h-11 px-5 rounded-lg border-gray-300 text-[#1B2333] hover:bg-gray-50 font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Question précédente
              </Button>
            )}

            {currentNodeIdx === scrollNodes.length - 1 ? (
              <Button
                onClick={handleSaveAndShowResult}
                disabled={!allAnswered || saving}
                className="h-11 px-8 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium"
              >
                {saving ? "Enregistrement..." : "Terminer le test"}
              </Button>
            ) : (
              <Button
                onClick={() => scrollToNode(scrollNodes[currentNodeIdx + 1]?.id)}
                className="h-11 px-6 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium"
              >
                {activeNode?.type === "chapter" ? "Commencer" : "Question suivante"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
