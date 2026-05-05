import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Lock, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

interface LocationCheckModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LocationCheckModal({ open, onClose }: LocationCheckModalProps) {
  const [postalCode, setPostalCode] = useState("");
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(cleaned);
    setError("");

    if (cleaned.length === 5) {
      const info = lookupPostalCode(cleaned);
      if (info) {
        setLocationInfo(info);
      } else {
        setLocationInfo(null);
        setError("Code postal non reconnu. Veuillez vérifier.");
      }
    } else {
      setLocationInfo(null);
    }
  };

  const handleSubmit = () => {
    if (!locationInfo) return;
    saveLocation(locationInfo);
    onClose();

    if (locationInfo.isIDF) {
      navigate("/inscription");
    } else {
      navigate("/liste-attente");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40 w-[calc(100%-2rem)] sm:max-w-md sm:w-full mx-auto p-6 sm:p-8 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5 text-[#1B2333]" />
        </button>

        {/* Centered icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="font-heading font-bold text-[#1B2333] mb-3 text-4xl">
            Bienvenue chez Kalimera.
          </h2>
          <p className="text-center text-[hsl(var(--gold))] font-bold tracking-widest uppercase md:text-lg mb-10 text-xl">
            Pour vous garantir des rencontres de qualité près de chez vous, vérifions d'abord que notre Cercle est
            ouvert dans votre région.
          </p>
        </div>

        {/* Postal code input */}
        <div className="max-w-xs mx-auto mb-6">
          <Input
            placeholder="Entrer votre code postal"
            value={postalCode}
            onChange={(e) => handleChange(e.target.value)}
            inputMode="numeric"
            maxLength={5}
            className="h-14 text-center tracking-widest rounded-xl border-gray-200 focus:border-[hsl(var(--gold))] text-xl"
            autoFocus
          />

          {locationInfo && (
            <div className="mt-3 text-center animate-fade-in">
              <p className="text-[#1B2333] font-medium text-base">{locationInfo.cityName}</p>
              <p className="text-gray-500 text-sm">{locationInfo.regionName}</p>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </div>

        {/* Helper text */}
        <p className="text-gray-500 text-center mb-6 flex items-center justify-center gap-1.5 text-xl">
          <Lock className="h-3.5 w-3.5" />
          Vérification de la proximité pour garantir des rencontres authentiques.
        </p>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
        >
          Vérifier ma zone
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
