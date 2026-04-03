import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import heroCouple from "@/assets/hero-couple.jpg";

import InscriptionStep1Profil from "@/components/inscription/InscriptionStep1Profil";
import InscriptionStep2Localisation from "@/components/inscription/InscriptionStep2Localisation";
import InscriptionStep3Telephone from "@/components/inscription/InscriptionStep3Telephone";
import InscriptionStep4Compte from "@/components/inscription/InscriptionStep4Compte";

export default function Inscription() {
  const storedLocation = getStoredLocation();
  const skipLocation = !!(storedLocation?.postalCode && storedLocation?.cityName);

  // Build dynamic steps
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
  const [emailSent, setEmailSent] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Check if email exists in waitlist
      const { data: existingLead } = await supabase
        .from("waitlist_leads")
        .select("id")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingLead) {
        toast({
          title: "Déjà inscrit(e) !",
          description: "Vous êtes déjà inscrit(e) sur notre liste VIP ! Nous vous contacterons très bientôt.",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            first_name: formData.firstName,
            nationality: formData.nationality,
            postal_code: formData.postalCode,
            gender: formData.gender,
            looking_for: formData.lookingFor,
            birth_date: getBirthDate(),
            phone: formData.phone,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const locationInfo = storedLocation;
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          first_name: formData.firstName,
          gender: formData.gender,
          looking_for: formData.lookingFor,
          birth_date: getBirthDate() || null,
          onboarding_step: "media_upload",
          postal_code: formData.postalCode,
          city_name: locationInfo?.cityName || null,
          region_name: locationInfo?.regionName || null,
          phone: formData.phone || null,
          account_status: "pending_review",
        });

        if (profileError) console.error("Profile creation error:", profileError);
        setPendingReview(true);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Erreur lors de la création du compte",
        description:
          error.message === "User already registered"
            ? "Un compte existe déjà avec cette adresse email."
            : "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pending Review holding screen
  if (pendingReview) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12">
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
              Votre profil est en cours de <strong className="text-foreground">validation manuelle</strong> sous 24h
              pour garantir la sécurité du club.
            </p>
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <Shield className="h-6 w-6 text-[hsl(var(--gold))] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-foreground font-medium text-lg mb-1">Vérification en cours</p>
                  <p className="text-muted-foreground text-base">
                    Vous recevrez un email à <strong>{formData.email}</strong> pour accéder aux membres dès validation.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-base mb-8">
              Cette étape garantit des rencontres authentiques et sûres pour tous nos membres.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-10 py-4 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated text-lg"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="text-center text-primary-foreground relative z-10">
              <h2 className="font-heading text-4xl font-semibold mb-6">Bienvenue chez Kalimera</h2>
              <p className="text-primary-foreground/90 max-w-md mx-auto text-xl">
                Votre profil sera bientôt parmi nos membres vérifiés.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resolve current step label to component
  const currentStepLabel = allSteps[step];

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col px-6 md:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto flex flex-col flex-1">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-8 block">
            Kalimera
          </Link>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-3">
              {allSteps.map((label) => (
                <span key={label} className="text-lg">
                  {label}
                </span>
              ))}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-2 text-lg">
              Étape {step + 1} sur {allSteps.length}
            </p>
          </div>

          {/* Step content */}
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

          {/* Footer */}
          <p className="mt-8 text-center text-muted-foreground pb-4 text-xl">
            Déjà membre ?{" "}
            <Link to="/connexion" className="text-primary font-medium hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading font-semibold mb-6 text-5xl">75% d'affinités réciproques</h2>
            <p className="text-primary-foreground/90 max-w-md mx-auto mb-8 text-2xl">
              Notre algorithme analyse plus de 200 critères pour vous proposer des profils vraiment compatibles.
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <div className="text-4xl font-heading font-bold" style={{ color: "hsl(var(--gold))" }}>
                  40+
                </div>
                <div className="text-primary-foreground/80 text-2xl">Rubriques</div>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold" style={{ color: "hsl(var(--gold))" }}>
                  300+
                </div>
                <div className="text-primary-foreground/80 text-2xl">Critères</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
