import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Lock, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lookupPostalCode, type LocationInfo } from "@/data/frenchPostalCodes";
import { handleLocationTransition } from "@/lib/locationTransition";
import { PINPOINT_MAPPING } from "@/data/locationData";

interface LocationCheckModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LocationCheckModal({ open, onClose }: LocationCheckModalProps) {
  const [postalCode, setPostalCode] = useState("");
  const [locationInfo, setLocationInfo] = useState<(LocationInfo & { isPinpoint?: boolean }) | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    // On garde bien les 5 chiffres (évite le bug 9220)
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(cleaned);
    setError("");

    if (cleaned.length === 5) {
      const info = lookupPostalCode(cleaned);
      if (info) {
        const isPinpoint = !!PINPOINT_MAPPING[cleaned];

        // LOGIQUE CAC40 : Si Pinpoint -> Ville précise. Sinon -> Bassin de Région.
        const displayTitle = isPinpoint ? PINPOINT_MAPPING[cleaned] : `Bassin de ${info.regionName}`;

        setLocationInfo({
          ...info,
          cityName: displayTitle,
          isPinpoint: isPinpoint,
        });
      } else {
        setLocationInfo(null);
        setError("Code postal non reconnu. Veuillez vérifier.");
      }
    } else {
      setLocationInfo(null);
    }
  };

  const handleSubmit = () => {
    // On s'assure que handleLocationTransition utilise bien les mêmes data
    if (!handleLocationTransition(postalCode, navigate, locationInfo)) return;
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-2xl border border-[hsl(var(--gold))]/40 w-full max-w-md mx-auto p-6 sm:p-8 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="h-6 w-6 text-[#1B2333]" />
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <MapPin className="h-7 w-7" />
          </div>
          <h2 className="font-heading font-bold text-[#1B2333] mb-3 text-3xl sm:text-4xl">Bienvenue chez Kalimera.</h2>
          <p className="text-center text-[hsl(var(--gold))] font-bold tracking-widest uppercase text-sm sm:text-base">
            Vérifions que notre Cercle est ouvert dans votre région.
          </p>
        </div>

        <div className="max-w-xs mx-auto mb-8">
          <Input
            placeholder="Code postal"
            value={postalCode}
            onChange={(e) => handleChange(e.target.value)}
            inputMode="numeric"
            maxLength={5}
            className="h-16 text-center tracking-[0.3em] rounded-xl border-gray-200 focus:border-[hsl(var(--gold))] text-2xl font-bold"
            autoFocus
          />

          {locationInfo && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-1">
                {locationInfo.isPinpoint && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                <p className="text-[#1B2333] font-bold text-xl leading-tight">{locationInfo.cityName}</p>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {locationInfo.isPinpoint ? "Zone prioritaire identifiée" : "Région disponible"}
              </p>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-3 text-center font-medium">{error}</p>}
        </div>

        <p className="text-slate-400 mb-8 text-xs flex items-center justify-center gap-2 italic">
          <Lock className="h-3.5 w-3.5" />
          Vérification de proximité sécurisée.
        </p>

        <Button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="w-full h-14 rounded-xl text-white font-bold text-lg bg-[#1B2333] hover:bg-[#1B2333]/90 shadow-lg transition-all active:scale-[0.97]"
        >
          Vérifier ma zone
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
