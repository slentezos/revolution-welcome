import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PersonalityProfile from "@/components/personality/PersonalityProfile";
import type { Gender } from "@/data/personalityDatabase";

interface PersonalityResultPageProps {
  answers: Record<string, number>;
  onContinue: () => void;
}

export default function PersonalityResultPage({ answers, onContinue }: PersonalityResultPageProps) {
  const [searchParams] = useSearchParams();
  const isViewMode = searchParams.get("mode") === "view";
  const [gender, setGender] = useState<Gender>("homme");

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data } = await supabase
          .from("profiles")
          .select("gender")
          .eq("user_id", session.user.id)
          .maybeSingle();
        const g = (data?.gender || "").toLowerCase();
        if (g.startsWith("f") || g.includes("femme") || g === "woman") setGender("femme");
        else setGender("homme");
      } catch (e) {
        console.error("Failed to load gender:", e);
      }
    })();
  }, []);

  // Affiche le profil "Le Stratège" — la base de données peut être étendue
  // dans `src/data/personalityDatabase.ts` pour ajouter les 15 autres profils.
  const profileId = "strategiste";

  if (isViewMode) {
    return (
      <div>
        <PersonalityProfile profileId={profileId} gender={gender} onContinue={onContinue} />
        <section className="bg-[hsl(var(--cream))]">
          <div className="max-w-2xl mx-auto px-6 pb-16 md:pb-24 text-center -mt-8">
            <Button
              onClick={() => (window.location.href = "/profil?tab=questionnaires")}
              className="px-12 py-6 text-lg h-auto rounded-xl gap-3"
              variant="outline"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour au profil
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return <PersonalityProfile profileId={profileId} gender={gender} onContinue={onContinue} />;
}
