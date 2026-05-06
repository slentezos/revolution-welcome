import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { User, ClipboardList, CreditCard, FileText, MessageCircle, Gift } from "lucide-react";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import ProfileQuestionnairesTab from "@/components/profile/ProfileQuestionnairesTab";
import ProfileSubscriptionTab from "@/components/profile/ProfileSubscriptionTab";
import ProfileTermsTab from "@/components/profile/ProfileTermsTab";
import ContactMemberContent from "@/components/profile/ContactMemberContent";
import ProfileGiftTab from "@/components/profile/ProfileGiftTab";

const tabs = [
{ id: "profil", label: "Mon Profil", icon: User },
{ id: "questionnaires", label: "Questionnaires", icon: ClipboardList },
{ id: "abonnement", label: "Abonnement", icon: CreditCard },
{ id: "conditions", label: "Conditions", icon: FileText },
{ id: "contact", label: "Nous Contacter", icon: MessageCircle },
{ id: "offrir", label: "Offrir", icon: Gift }];


export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || "profil";

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    looking_for: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // TEMP: auth redirect disabled for design work
      // if (!session) { navigate("/connexion"); return; }
      if (session) setUser(session.user);
      if (!session) { setLoading(false); return; }

      const { data: profileData } = await supabase.
      from("profiles").
      select("*").
      eq("user_id", session.user.id).
      maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          birth_date: profileData.birth_date || "",
          gender: profileData.gender || "",
          looking_for: profileData.looking_for || ""
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.
    from("profiles").
    update({
      first_name: formData.first_name,
      last_name: formData.last_name,
      birth_date: formData.birth_date || null,
      gender: formData.gender || null,
      looking_for: formData.looking_for || null
    }).
    eq("id", profile.id);

    if (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder.", variant: "destructive" });
    } else {
      toast({ title: "Profil mis à jour", description: "Vos modifications ont été enregistrées." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
      </div>);

  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Full-width tab navigation */}
        <nav className="bg-secondary border-b border-border/30 sticky top-16 md:top-20 z-40">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-5 px-6 text-lg font-medium transition-all duration-300 border-b-2 min-h-[64px] whitespace-nowrap ${
                  isActive ?
                  "border-[hsl(var(--gold))] text-foreground bg-background" :
                  "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"}`
                  }>
                  
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline font-bold">{tab.label}</span>
                </button>);

            })}
          </div>
        </nav>

        {/* Tab content – full bleed */}
        {activeTab === "profil" &&
        <ProfileInfoTab
          formData={formData}
          setFormData={setFormData}
          userEmail={user?.email || ""}
          saving={saving}
          onSave={handleSave}
          onContactTab={() => setActiveTab("contact")}
          profile={profile}
          onProfileUpdated={(next) => setProfile((prev: any) => ({ ...(prev || {}), ...next }))} />

        }
        {activeTab === "questionnaires" &&
        <ProfileQuestionnairesTab onContactTab={() => setActiveTab("contact")} />
        }
        {activeTab === "abonnement" &&
        <ProfileSubscriptionTab firstName={profile?.first_name} />
        }
        {activeTab === "conditions" && <ProfileTermsTab />}
        {activeTab === "contact" && <ContactMemberContent />}
        {activeTab === "offrir" && <ProfileGiftTab />}
      </div>
    </Layout>);

}