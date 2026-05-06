import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import OnboardingMedia from "@/components/onboarding/OnboardingMedia";
import OnboardingQuiz from "@/components/onboarding/OnboardingQuiz";
import OnboardingProfile from "@/components/onboarding/OnboardingProfile";
import OnboardingPersonality from "@/components/onboarding/OnboardingPersonality";
import WelcomeRoadmap from "@/components/onboarding/WelcomeRoadmap";
import { Image, HelpCircle, ClipboardList, Brain, BookOpen, Check, Clock } from "lucide-react";
import { useCriteriaCooldown } from "@/hooks/useCriteriaCooldown";

type OnboardingStep =
  | "welcome"
  | "media_upload"
  | "quiz"
  | "profile"
  | "personality"
  | "personality-results"
  | "completed";

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [showValidationScreen, setShowValidationScreen] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  const cooldown = useCriteriaCooldown(profileId);

  useEffect(() => {
    // TEMP: auth redirects disabled for design work
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // if (!session) { navigate("/connexion"); return; }

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, onboarding_step")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (profile) {
          setProfileId(profile.id);
          const completed = profile.onboarding_step === "completed";
          setIsOnboardingCompleted(completed);

          const requestedStep = searchParams.get("step");
          const validSteps = ["welcome", "quiz", "media_upload", "profile", "personality", "personality-results"];

          if (requestedStep && validSteps.includes(requestedStep)) {
            if (completed) setIsReturningUser(true);
            setStep(requestedStep as OnboardingStep);
          } else if (!completed) {
            setStep(profile.onboarding_step as OnboardingStep);
          }
          // else { navigate("/dashboard"); return; }
        }
      } else {
        // No session: allow design preview, default to welcome step
        const requestedStep = searchParams.get("step");
        const validSteps = ["welcome", "quiz", "media_upload", "profile", "personality", "personality-results"];
        if (requestedStep && validSteps.includes(requestedStep)) {
          setStep(requestedStep as OnboardingStep);
        }
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

  const handleStartConcierge = () => {
    navigate("/reservation");
  };

  const handleQuizComplete = async () => {
    if (isReturningUser) {
      await cooldown.recordCriteriaUpdate();
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
      await cooldown.recordCriteriaUpdate();
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
    await cooldown.recordOnboardingComplete();
    // Récupérer le prénom pour l'écran de validation
    if (profileId) {
      const { data } = await supabase.from("profiles").select("first_name").eq("id", profileId).maybeSingle();
      if (data?.first_name) setFirstName(data.first_name);
    }
    setShowValidationScreen(true);
  };

  const handleTabClick = (tabId: string) => {
    setStep(tabId as OnboardingStep);
  };

  const tabs = [
    { id: "welcome", label: "Notre Tutoriel", icon: BookOpen },
    { id: "quiz", label: "Quiz des 3 préférences", icon: HelpCircle },
    { id: "media_upload", label: "Vos photos & vidéo", icon: Image },
    { id: "profile", label: "Mon profil / son profil", icon: ClipboardList },
    {
      id: "personality",
      label: isOnboardingCompleted ? "Ma personnalité" : "Test de personnalité",
      icon: Brain,
    },
  ];

  const isViewMode = searchParams.get("mode") === "view";
  const effectiveTab = step === "personality-results" ? "personality" : (step as string);
  const currentTabIndex = tabs.findIndex((t) => t.id === effectiveTab);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  if (showValidationScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
        <div className="max-w-xl w-full text-center bg-white rounded-2xl border border-[#E5E0D8] shadow-[var(--shadow-luxury)] p-10 md:p-14">
          <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
            Kalimera
          </Link>
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-[hsl(var(--gold))]" />
          </div>
          <h1 className="font-heading text-4xl font-semibold mb-4 text-[#1B2333]">
            Félicitations{firstName ? `, ${firstName}` : ""} !
          </h1>
          <p className="text-foreground text-2xl mb-4 leading-relaxed">
            Votre profil est complet.
          </p>
          <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
            Notre équipe procède à une vérification attentive de votre profil. Vous recevrez une notification dès son
            activation, généralement <span className="font-semibold text-foreground">sous 24 heures</span>.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-[#1B2333] text-white px-10 py-4 font-bold rounded-xl text-lg transition-all hover:scale-[1.02] min-h-[56px]"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-[#E5E0D8] sticky top-0 z-40 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-none">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === effectiveTab;
            const isCompleted = index < currentTabIndex;
            const canClick = index <= currentTabIndex || isReturningUser;

            return (
              <button
                key={tab.id}
                onClick={() => canClick && handleTabClick(tab.id)}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-4 py-6 px-8 text-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#1B2333] text-white border-b-4 border-[hsl(var(--gold))] shadow-md z-10"
                    : isCompleted
                      ? "bg-white text-[#1B2333] border-b-4 border-[#E5E0D8] hover:bg-gray-50"
                      : "bg-gray-50 text-gray-400 border-b-4 border-transparent cursor-not-allowed opacity-60"
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive || isCompleted ? "text-[hsl(var(--gold))]" : "text-gray-300"}`} />
                <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>

                {/* CORRECTION : On retire 'hidden lg:block' pour que la coche soit TOUJOURS là */}
                {isCompleted && <Check className="h-5 w-5 text-[hsl(var(--gold))] ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      </nav>

      {step === "welcome" &&
        (isReturningUser ? (
          <WelcomeRoadmap onStartAutonomous={handleStartAutonomous} onStartConcierge={handleStartConcierge} viewOnly />
        ) : (
          <WelcomeRoadmap
            onStartAutonomous={handleStartAutonomous}
            onStartConcierge={handleStartConcierge}
            showPricingInitially={searchParams.get("showPricing") === "true"}
          />
        ))}
      {step === "quiz" && profileId && (
        <OnboardingQuiz
          profileId={profileId}
          onComplete={handleQuizComplete}
          cooldown={isReturningUser ? cooldown : undefined}
        />
      )}
      {step === "media_upload" && profileId && (
        <OnboardingMedia profileId={profileId} onComplete={handleMediaComplete} />
      )}
      {step === "profile" && profileId && (
        <OnboardingProfile
          profileId={profileId}
          onComplete={handleProfileComplete}
          readOnly={isViewMode}
          cooldown={isReturningUser ? cooldown : undefined}
        />
      )}
      {step === "personality" && profileId && (
        <OnboardingPersonality profileId={profileId} onComplete={handlePersonalityComplete} />
      )}

      {step === "personality-results" && profileId && (
        <OnboardingPersonality profileId={profileId} onComplete={handlePersonalityComplete} showResultDirectly />
      )}
    </div>
  );
}
