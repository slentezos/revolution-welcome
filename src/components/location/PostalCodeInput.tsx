import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

interface PostalCodeInputProps {
  className?: string;
  variant?: "hero" | "section";
}

export default function PostalCodeInput({ className = "", variant = "hero" }: PostalCodeInputProps) {
  const [postalCode, setPostalCode] = useState("");
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(cleaned);

    if (cleaned.length === 5) {
      const info = lookupPostalCode(cleaned);
      if (info) setLocationInfo(info);
      else setLocationInfo(null);
    } else {
      setLocationInfo(null);
    }
  };

  const handleSubmit = () => {
    if (!locationInfo) return;
    saveLocation(locationInfo);
    if (locationInfo.isIDF) {
      navigate("/inscription");
    } else {
      navigate("/liste-attente");
    }
  };

  const isHero = variant === "hero";

  return (
    <div className={className}>
      <div
        className={`flex items-center gap-0 rounded-sm overflow-hidden shadow-elevated ${isHero ? "max-w-lg mx-auto" : "max-w-md"}`}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Entrer votre code postal"
          value={postalCode}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 h-14 px-5 border-[hsl(var(--gold)/0.6)] border-r-0 outline-none tracking-wider font-medium text-primary-foreground text-xl border-transparent border-0 bg-[#222a39]"
        />

        <button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="h-14 px-6 bg-[hsl(var(--gold))] text-primary font-medium flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap text-xl"
        >
          Vérifier
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* City/Region display */}
      {locationInfo && (
        <div className="mt-3 animate-fade-in">
          <p className="font-bold text-2xl">
            📍 {locationInfo.cityName}, {locationInfo.regionName}
          </p>
        </div>
      )}

      {/* Helper text */}
      <p
        className={`text-lg mt-3 flex items-center gap-1.5 ${isHero ? "text-muted-foreground justify-center" : "text-primary-foreground/60"}`}
      >
        <Lock className="h-3.5 w-3.5" />
        Vérification de la proximité pour garantir des rencontres authentiques.
      </p>
    </div>
  );
}
