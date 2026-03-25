import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import OnboardingMedia from "@/components/onboarding/OnboardingMedia";
import OnboardingQuiz from "@/components/onboarding/OnboardingQuiz";
import OnboardingProfile from "@/components/onboarding/OnboardingProfile";
import OnboardingPersonality from "@/components/onboarding/OnboardingPersonality";
import WelcomeRoadmap from "@/components/onboarding/WelcomeRoadmap";
import { Image, HelpCircle, ClipboardList, Brain, BookOpen } from "lucide-react";

type OnboardingStep =
  | "welcome"
  | "media_upload"
  | "quiz"
  | "profile"
  | "personality"
  | "personality-results"
  | "completed";

const tabs = [
  { id: "welcome", label: "Notre Tutoriel", icon: BookOpen },
  { id: "quiz", label: "Quiz des 3 préférences", icon: HelpCircle },
  { id: "media_upload", label: "Vos photos & vidéo", icon: Image },
  { id: "profile", label: "Mon profil / son profil", icon: ClipboardList },
  { id: "personality", label: "Test de personnalité", icon: Brain },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/connexion");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, onboarding_step")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        setProfileId(profile.id);

        const requestedStep = searchParams.get("step");
        // ON UTILISE LE TIRET ICI AUSSI
        const validSteps = ["welcome", "media_upload", "quiz", "profile", "personality", "personality-results"];

        if (requestedStep && validSteps.includes(requestedStep)) {
          if (profile.onboarding_step === "completed") setIsReturningUser(true);
          setStep(requestedStep as OnboardingStep);
        } else if (profile.onboarding_step === "completed") {
          navigate("/dashboard");
          return;
        } else {
          setStep(profile.onboarding_step as OnboardingStep);
        }
      } else {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({ user_id: session.user.id, onboarding_step: "welcome" })
          .select()
          .single();
        if (newProfile) setProfileId(newProfile.id);
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate, searchParams]);

  const handleStartAutonomous = async () => {
    if (!profileId) return;
    await supabase.from("profiles").update({ onboarding_step: "quiz" }).eq("id", profileId);
    setStep("quiz");
  };

  const handleStartConcierge = async () => {
    if (!profileId) return;
    await supabase.from("profiles").update({ onboarding_step: "quiz" }).eq("id", profileId);
    window.open("https://calendly.com/", "_blank");
  };

  const handleQuizComplete = async () => {
    if (isReturningUser) {
      navigate("/profil");
      return;
    }
    setStep("media_upload");
  };

  const handleMediaComplete = async () => {
    if (isReturningUser) {
      navigate("/profil");
      return;
    }
    setStep("profile");
  };

  const handleProfileComplete = async () => {
    if (isReturningUser) {
      navigate("/profil");
      return;
    }
    setStep("personality");
  };

  const handlePersonalityComplete = async () => {
    if (isReturningUser) {
      navigate("/profil");
      return;
    }
    navigate("/dashboard");
  };

  const handleTabClick = (tabId: string) => {
    setStep(tabId as OnboardingStep);
  };

  const isViewMode = searchParams.get("mode") === "view";
  const effectiveTab = step === "personality-results" ? "personality" : (step as string);
  const currentTabIndex = tabs.findIndex((t) => t.id === effectiveTab);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
          <nav className="bg-secondary border-b border-border/30 sticky top-0 z-[100]">
            <div className="flex overflow-x-auto scrollbar-none">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = tab.id === effectiveTab;
                const isLockedTab = tab.id === "quiz" || tab.id === "media_upload";
                const canClick = !isLockedTab && (index <= currentTabIndex || isReturningUser);
                return (
                  <button
                    key={tab.id}
                    onClick={() => canClick && handleTabClick(tab.id)}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-5 px-6 text-lg font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-[hsl(var(--gold))] text-foreground"
                        : isLockedTab
                          ? "border-transparent text-muted-foreground/40 cursor-not-allowed"
                          : "border-transparent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

        {step === "welcome" && (
          <WelcomeRoadmap onStartAutonomous={handleStartAutonomous} onStartConcierge={handleStartConcierge} />
        )}
        {step === "quiz" && profileId && <OnboardingQuiz profileId={profileId} onComplete={handleQuizComplete} />}
        {step === "media_upload" && profileId && (
          <OnboardingMedia profileId={profileId} onComplete={handleMediaComplete} />
        )}
        {step === "profile" && profileId && (
          <OnboardingProfile profileId={profileId} onComplete={handleProfileComplete} readOnly={isViewMode} />
        )}
        {step === "personality" && profileId && (
          <OnboardingPersonality profileId={profileId} onComplete={handlePersonalityComplete} />
        )}

        {/* LA LIGNE MAGIQUE POUR LE PREVIEW DES RÉSULTATS */}
        {step === "personality-results" && profileId && (
          <OnboardingPersonality profileId={profileId} onComplete={handlePersonalityComplete} showResultDirectly />
        )}
      </div>
    </Layout>
  );
}
