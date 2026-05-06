import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import heroCouple from "@/assets/hero-couple.jpg";

import InscriptionStep1Profil from "@/components/inscription/InscriptionStep1Profil";
import InscriptionStep2Localisation from "@/components/inscription/InscriptionStep2Localisation";
import InscriptionStep3Telephone from "@/components/inscription/InscriptionStep3Telephone";
import InscriptionStep4Compte from "@/components/inscription/InscriptionStep4Compte";
import { RegistrationLocationHeader } from "@/components/RegistrationLocationHeader";

export default function Inscription() {
  const storedLocation = getStoredLocation();
  const skipLocation = !!(storedLocation?.postalCode && storedLocation?.cityName);
  const allSteps = skipLocation ? ["Profil", "Téléphone", "Compte"] : ["Profil", "Localisation", "Téléphone", "Compte"];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    lookingFor: "",
    postalCode: storedLocation?.postalCode || "",
    phone: "",
    nationality: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const finalZip = localStorage.getItem("user_postal_code") || formData.postalCode;
      const finalCity = localStorage.getItem("user_city_name") || storedLocation?.cityName;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            first_name: formData.firstName,
            nationality: formData.nationality,
            postal_code: finalZip,
            gender: formData.gender,
            looking_for: formData.lookingFor,
            birth_date: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            phone: formData.phone,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        await supabase.from("profiles").insert({
          user_id: data.user.id,
          first_name: formData.firstName,
          gender: formData.gender,
          looking_for: formData.lookingFor,
          onboarding_step: "media_upload",
          postal_code: finalZip,
          city_name: finalCity,
          region_name: storedLocation?.regionName || null,
          phone: formData.phone || null,
          account_status: "pending_review",
        });
        setPendingReview(true);
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (pendingReview) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <div className="flex-1 flex flex-col justify-center px-12 text-center">
          <Link to="/" className="font-heading text-3xl font-bold text-primary mb-8 block">
            Kalimera
          </Link>
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-[hsl(var(--gold))]" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Merci, {formData.firstName} !</h1>
          <p className="text-muted-foreground text-xl mb-8 leading-relaxed">Votre profil est en cours de validation.</p>
          <Link to="/" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold">
            Accueil
          </Link>
        </div>
        <div className="hidden lg:block flex-1 relative bg-primary">
          <img src={heroCouple} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Couple" />
        </div>
      </div>
    );
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans">
      {/* COLONNE GAUCHE - FORMULAIRE ÉPURÉ */}
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide">
        <div className="min-h-full flex flex-col px-6 py-10 md:px-16 lg:px-20">
          <div className="max-w-lg w-full mx-auto flex-1 flex flex-col">
            <Link to="/" className="font-heading text-3xl font-bold text-[#1B2333] mb-12 block">
              Kalimera
            </Link>

            {/* Barre de Progression */}
            <div className="mb-10">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-3 text-xs font-bold uppercase tracking-[0.2em]">
                Étape {step + 1} sur {allSteps.length}
              </p>
            </div>

            {/* Contenu dynamique des étapes */}
            <div className="flex-1">
              {currentStepLabel === "Profil" && (
                <InscriptionStep1Profil
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setStep((s) => s + 1)}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Localisation" && (
                <InscriptionStep2Localisation
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setStep((s) => s + 1)}
                  onBack={() => setStep((s) => s - 1)}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Téléphone" && (
                <InscriptionStep3Telephone
                  formData={formData}
                  setFormData={setFormData}
                  onNext={() => setStep((s) => s + 1)}
                  onBack={() => setStep((s) => s - 1)}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Compte" && (
                <InscriptionStep4Compte
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  onBack={() => setStep((s) => s - 1)}
                  errors={errors}
                  loading={loading}
                />
              )}
            </div>

            <div className="h-10 shrink-0" />
          </div>
        </div>
      </div>

      {/* COLONNE DROITE - MARKETING AVEC LOCALISATION INTÉGRÉE */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#1B2333] h-full overflow-hidden">
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center text-white">
          <div className="max-w-md flex flex-col items-center">
            {/* DÉPLACEMENT ICI : RegistrationLocationHeader au-dessus du titre */}
            <div className="mb-8 w-full">
              <RegistrationLocationHeader />
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">75% d'affinités réciproques</h2>
            <p className="text-xl mb-12 opacity-90 leading-relaxed text-white/80">
              Notre algorithme analyse 200 critères pour garantir votre compatibilité.
            </p>

            <div className="flex justify-center gap-12 mb-16">
              <div>
                <p className="text-5xl font-bold text-[hsl(var(--gold))] mb-1">40+</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Rubriques</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-[hsl(var(--gold))] mb-1">300+</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Critères</p>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 w-full">
              <p className="text-lg mb-6 opacity-70">Déjà membre de notre club ?</p>
              <Link
                to="/connexion"
                className="inline-block px-12 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white font-bold text-xl hover:bg-white/20 transition-all"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
