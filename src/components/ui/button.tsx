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
    // Verrouillage du body pour éviter le double scroll (browser + app)
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async () => {
    // ... (Logique de soumission identique à la précédente)
  };

  if (pendingReview) {
    // ... (Vue pending review identique)
  }

  const currentStepLabel = allSteps[step];

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* COLONNE GAUCHE - FORMULAIRE */}
      {/* overflow-y-auto est crucial ici pour que SEUL le formulaire défile si besoin */}
      <div className="flex-1 h-full overflow-y-auto bg-white custom-scrollbar">
        <div className="max-w-lg w-full mx-auto px-6 md:px-12 py-10 flex flex-col min-h-full">
          <div className="flex-1 pb-10">
            {" "}
            {/* Padding bottom important pour le bouton */}
            <Link to="/" className="font-heading text-3xl font-bold text-[#1B2333] mb-10 block">
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
                Étape {step + 1} sur {allSteps.length}
              </p>
            </div>
            <RegistrationLocationHeader />
            <div className="mt-8">
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
          </div>
        </div>
      </div>

      {/* COLONNE DROITE - IMAGE FIXE */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center text-white">
          <div className="max-w-md">
            <h2 className="font-heading font-semibold mb-6 text-5xl">75% d'affinités réciproques</h2>
            <p className="text-white/90 mb-12 text-2xl leading-relaxed">
              Notre algorithme analyse 200 critères pour garantir votre compatibilité.
            </p>

            <div className="flex justify-center gap-12 mb-16">
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">40+</div>
                <div className="text-white/60 text-sm uppercase tracking-widest font-bold">Rubriques</div>
              </div>
              <div>
                <div className="text-5xl font-heading font-bold text-[hsl(var(--gold))] mb-1">300+</div>
                <div className="text-white/60 text-sm uppercase tracking-widest font-bold">Critères</div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-white/60 text-lg mb-4">Déjà membre de notre club ?</p>
              <Link
                to="/connexion"
                className="inline-block px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xl hover:bg-white/20 transition-all"
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
