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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
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
        const { error: profileError } = await supabase.from("profiles").insert({
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

        if (profileError) console.error("Profile creation error:", profileError);
        setPendingReview(true);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message === "User already registered" ? "Un compte existe déjà." : "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (pendingReview) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
              Kalimera
            </Link>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 border border-[hsl(var(--gold)/0.3)]">
              <Clock className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Merci, {formData.firstName} !
            </h1>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Votre profil est en cours de validation manuelle sous 24h.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-10 py-4 font-medium transition-all hover:shadow-elevated text-lg"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden bg-primary">
          <img src={heroCouple} alt="Couple" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        </div>
      </div>
    );
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col px-6 md:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto flex flex-col min-h-full">
          <Link to="/" className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-10 block">
            Kalimera
          </Link>

          <div className="mb-8">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-3 text-xs font-bold uppercase tracking-[0.2em]">
              Étape {step + 1} / {allSteps.length} — {currentStepLabel}
            </p>
          </div>

          <RegistrationLocationHeader />

          <div className="flex-1">
            {currentStepLabel === "Profil" && (
              <InscriptionStep1Profil formData={formData} setFormData={setFormData} onNext={nextStep} errors={errors} />
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
      </div>

      {/* Right Column - Image (Fixed) */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* TOP CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading font-semibold mb-6 text-5xl">75% d'affinités réciproques</h2>
            <p className="text-primary-foreground/90 max-w-md mx-auto mb-10 text-2xl leading-relaxed">
              Notre algorithme analyse 200 critères pour garantir votre compatibilité.
            </p>
            <div className="flex justify-center gap-12">
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">40+</div>
                <div className="text-primary-foreground/60 text-sm uppercase tracking-widest font-bold">Rubriques</div>
              </div>
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">300+</div>
                <div className="text-primary-foreground/60 text-sm uppercase tracking-widest font-bold">Critères</div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT : DEJA MEMBRE POSITIONED HERE */}
        <div className="absolute bottom-10 right-10 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-white/80 text-xl backdrop-blur-md bg-black/20 px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            Déjà membre ?{" "}
            <Link to="/connexion" className="text-[hsl(var(--gold))] font-bold hover:underline transition-all">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
