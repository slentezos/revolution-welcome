import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import heroCouple from "@/assets/hero-couple.jpg";

// Composants internes
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

  // FIX ZERO SCROLL : Verrouillage strict du viewport
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
            postal_code: finalZip,
            gender: formData.gender,
            birth_date: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
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
          postal_code: finalZip,
          city_name: finalCity,
          region_name: storedLocation?.regionName || null,
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
      <div className="h-screen flex items-center justify-center bg-white text-center p-6">
        <div className="max-w-md">
          <Clock className="h-16 w-16 text-[hsl(var(--gold))] mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 italic">Merci, {formData.firstName} !</h1>
          <p className="text-slate-500 mb-8">Votre profil est en cours de validation manuelle.</p>
          <Button onClick={() => navigate("/")} className="bg-[#1B2333] text-white px-8 py-4 rounded-xl">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* GAUCHE : FORMULAIRE (SCROLL INDÉPENDANT SI BESOIN) */}
      <div className="flex-1 h-full overflow-y-auto bg-white flex flex-col">
        <div className="max-w-lg w-full mx-auto px-6 py-12 md:px-12 flex flex-col min-h-full">
          <Link to="/" className="font-heading text-3xl font-bold text-[#1B2333] mb-12 block">
            Kalimera
          </Link>
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-slate-400 mt-4 text-[10px] font-bold uppercase tracking-[0.3em]">
              Étape {step + 1} sur {allSteps.length} — {currentStepLabel}
            </p>
          </div>
          {/* Form Content */}
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
          <div className="h-8 shrink-0" /> {/* Spacer de sécurité */}
        </div>
      </div>

      {/* DROITE : MARKETING + LOCALISATION (FIXE) */}
      <div className="hidden lg:flex flex-1 relative bg-[#1B2333] h-full overflow-hidden items-center justify-center p-16">
        <img src={heroCouple} alt="Marketing" className="absolute inset-0 w-full h-full object-cover opacity-40" />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {/* PLACEMENT CRUCIAL : La boîte de localisation au-dessus du titre */}
          <div className="w-full mb-12 transform scale-110">
            <RegistrationLocationHeader />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight text-center">75% d'affinités réciproques</h2>
          <p className="text-white/70 text-xl text-center mb-16 leading-relaxed">
            Notre algorithme analyse 200 critères pour garantir votre compatibilité.
          </p>

          <div className="flex justify-center gap-12 mb-16">
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(var(--gold))] mb-1">40+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/50">Rubriques</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(var(--gold))] mb-1">300+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/50">Critères</p>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 w-full text-center">
            <p className="text-white/50 mb-6 font-medium">Déjà membre de notre club ?</p>
            <Link
              to="/connexion"
              className="inline-block px-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-xl hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
