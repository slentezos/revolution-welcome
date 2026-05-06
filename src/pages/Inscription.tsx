import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import { Button } from "@/components/ui/button";
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

  // Protocole Zero-Scroll : Verrouillage du viewport pour stabilité maximale
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
    if (!formData.nationality) e.nationality = "Sélection requise";
    if (!formData.email || !formData.email.includes("@")) e.email = "Format email non conforme";
    if (!formData.password || formData.password.length < 6) e.password = "Minimum 6 caractères";
    if (!formData.acceptTerms) e.acceptTerms = "Acceptation des conditions obligatoire";
    setErrors(e);
    return Object.keys(e).length === 0;
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
      toast({ title: "Erreur Système", description: "Le traitement a échoué.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (pendingReview) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-24">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-bold text-primary mb-8 block">
              Kalimera
            </Link>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <h1 className="font-heading text-4xl font-bold mb-4 text-[#1B2333]">Dossier en cours</h1>
            <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
              Validation manuelle sous un délai de 24 heures ouvrées.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#1B2333] text-white h-14 font-bold rounded-xl text-lg"
            >
              Quitter le tunnel
            </Button>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative bg-[#1B2333]">
          <img src={heroCouple} alt="Marketing" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        </div>
      </div>
    );
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* COLONNE GAUCHE - INTERFACE TRANSACTIONNELLE (SCROLL INTERNE) */}
      <div className="flex-1 h-full overflow-y-auto bg-white flex flex-col scrollbar-hide">
        <div className="max-w-lg w-full mx-auto px-6 py-12 md:px-12 flex flex-col min-h-full">
          <Link to="/" className="font-heading text-3xl font-bold text-[#1B2333] mb-12 block shrink-0">
            Kalimera
          </Link>

          <div className="mb-10 shrink-0">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-slate-500 mt-4 text-xs font-bold uppercase tracking-[0.3em]">
              Étape {step + 1} / {allSteps.length} — {currentStepLabel}
            </p>
          </div>

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

      {/* COLONNE DROITE - ANALYSE & MARKETING (FIXE) */}
      <div className="hidden lg:flex flex-1 relative bg-[#1B2333] h-full overflow-hidden items-center justify-center p-16">
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {/* LOCALISATION : CERTIFICATION DE DISPONIBILITÉ */}
          <div className="w-full mb-10 transform scale-105">
            <RegistrationLocationHeader />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 text-center leading-tight">75% d'affinités réciproques</h2>
          <p className="text-white/70 text-xl text-center mb-16 leading-relaxed">
            Notre algorithme traite 200 points de données pour assurer la viabilité des mises en relation.
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
            <p className="text-white/50 mb-6 font-medium">Déjà référencé dans notre club ?</p>
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
