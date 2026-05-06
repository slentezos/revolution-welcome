import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, Clock, Shield, MapPin } from "lucide-react";
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

  // Verrouillage STRICT du viewport
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.height = "auto";
    };
  }, []);

  const getBirthDate = () => {
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      return `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;
    }
    return "";
  };

  const validateStep4 = () => {
    const e: Record<string, string> = {};
    if (!formData.nationality) e.nationality = "Veuillez sélectionner votre nationalité";
    if (!formData.email || !formData.email.includes("@")) e.email = "Veuillez entrer une adresse email valide";
    if (!formData.password || formData.password.length < 6)
      e.password = "Le mot de passe doit contenir au moins 6 caractères";
    if (!formData.acceptTerms) e.acceptTerms = "Vous devez accepter les conditions pour continuer";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    setStep((s) => s + 1);
    setErrors({});
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

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
            birth_date: getBirthDate(),
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
          birth_date: getBirthDate() || null,
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
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (pendingReview) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
              Kalimera
            </Link>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <h1 className="font-heading text-4xl font-semibold mb-4 text-[#1B2333]">Merci, {formData.firstName} !</h1>
            <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
              Votre profil est en cours de validation sous 24h.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#1B2333] text-white px-10 py-4 font-bold rounded-xl text-lg transition-all hover:scale-[1.02]"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src={heroCouple} alt="Couple" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
      </div>
    );
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* LEFT - FORMULAIRE (FIXE, ZÉRO SCROLL) */}
      <div className="flex-1 flex flex-col px-12 lg:px-20 py-10">
        <div className="max-w-lg w-full mx-auto flex flex-col h-full justify-between">
          <div>
            <Link to="/" className="font-heading text-3xl font-bold text-[#1B2333] mb-12 block">
              Kalimera
            </Link>

            <div className="mb-10">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-lg">
                Étape {step + 1} sur {allSteps.length} — {currentStepLabel}
              </p>
            </div>

            <div className="mt-8">
              {currentStepLabel === "Profil" && (
                <InscriptionStep1Profil
                  formData={formData}
                  setFormData={setFormData}
                  onNext={nextStep}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Localisation" && (
                <InscriptionStep2Localisation
                  formData={formData}
                  setFormData={setFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Téléphone" && (
                <InscriptionStep3Telephone
                  formData={formData}
                  setFormData={setFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                  errors={errors}
                />
              )}
              {currentStepLabel === "Compte" && (
                <InscriptionStep4Compte
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  onBack={prevStep}
                  errors={errors}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Footer removed from here */}
        </div>
      </div>

      {/* RIGHT - IMAGE + MARKETING + CONNECTEZ-VOUS */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center text-primary-foreground">
          <div className="max-w-md">
            <RegistrationLocationHeader />
            <h2 className="font-heading font-semibold mb-6 text-5xl">75% d'affinités réciproques</h2>
            <p className="text-primary-foreground/90 mb-12 text-2xl leading-relaxed">
              Notre algorithme analyse 200 critères pour garantir votre compatibilité.
            </p>

            <div className="flex justify-center gap-12 mb-16">
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">40+</div>
                <div className="text-primary-foreground/60 text-sm uppercase tracking-widest font-bold text-slate-50">Rubriques</div>
              </div>
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">300+</div>
                <div className="text-primary-foreground/60 text-sm uppercase tracking-widest font-bold text-slate-50">Critères</div>
              </div>
            </div>

            {/* POSITIONNEMENT FINAL DU LIEN DE CONNEXION */}
            <div className="pt-8 border-t border-white/10 animate-in fade-in zoom-in-95 duration-700">
              <p className="text-lg mb-2 text-slate-50">Déjà membre de notre club ?</p>
              <Link
                to="/connexion"
                className="inline-block px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xl hover:bg-white/20 transition-all active:scale-[0.98]"
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
