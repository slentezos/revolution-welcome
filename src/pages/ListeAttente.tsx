import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";
// IMPORT OBLIGATOIRE : Pour vérifier le mapping pinpoint
import { PINPOINT_MAPPING } from "@/data/locationData";

export default function ListeAttente() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefersSms, setPrefersSms] = useState(true);
  const [prefersCall, setPrefersCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const location = getStoredLocation();

  // LOGIQUE DE SÉCURITÉ CAC40 :
  // On détermine si la ville doit être affichée (Pinpoint) ou si on reste sur le Bassin Régional.
  const isPinpoint = location && !!PINPOINT_MAPPING[location.postalCode];
  const displayLocation = isPinpoint 
    ? location.cityName 
    : `Bassin de ${location?.regionName}`;

  useEffect(() => {
    if (!location) {
      navigate("/");
    }
  }, [location, navigate]);

  if (!location) return null;

  // ... (Garder handleStep1 et handleSubmit identiques)

  if (done) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Votre accès VIP est confirmé !
            </h1>
            <p className="text-muted-foreground mb-4 text-xl leading-relaxed">
              Nous vous préviendrons dès que Kalimera sera disponible 
              {isPinpoint ? ` à ${displayLocation}` : ` dans le ${displayLocation}`}.
            </p>
            {/* ... reste du contenu identique */}
          </div>
        </div>
        {/* ... colonne image identique */}
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <div className="flex-1 flex flex-col px-6 md:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto flex flex-col min-h-full">
          <button onClick={() => navigate("/")} className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-8 block text-left">
            Kalimera
          </button>

          {/* BADGE : Utilise displayLocation pour bannir Marseille si pas pinpoint */}
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <MapPin className="h-4 w-4 text-[hsl(var(--gold))]" />
            <span className="text-xl font-bold text-[#1B2333]">
              {displayLocation}
            </span>
          </div>

          <div className="mb-10">
            {/* ... barre de progression identique */}
          </div>

          <div className="flex-1">
            {step === 0 ? (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3 leading-tight">
                    Kalimera arrive bientôt en {location.regionName}.
                  </h1>
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    Rejoignez les membres {isPinpoint ? `de ${displayLocation}` : `du ${displayLocation}`} et réservez votre privilège : 
                    <strong className="text-[#1B2333]"> 3 mois vous seront offerts </strong> dès notre arrivée.
                  </p>
                </div>
                {/* ... reste de l'étape 0 identique */}
              </div>
            ) : (
              /* ... reste de l'étape 1 identique */
            )}
          </div>
        </div>
      </div>
      {/* ... colonne image identique avec le lien de connexion en bas à droite */}
    </div>
  );
}