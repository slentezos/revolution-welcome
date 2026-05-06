import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, MapPin } from "lucide-react";
import { lookupPostalCode, type LocationInfo } from "@/data/frenchPostalCodes";
import { handleLocationTransition } from "@/lib/locationTransition";
// IMPORT CRUCIAL : La source de précision
import { PINPOINT_MAPPING } from "@/data/locationData";

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
      if (info) {
        // LOGIQUE DE PRÉCISION : Priorité au mapping local
        const preciseCity = PINPOINT_MAPPING[cleaned] || info.cityName;

        setLocationInfo({
          ...info,
          cityName: preciseCity, // On injecte le nom exact (ex: Bagneux)
        });
      } else {
        setLocationInfo(null);
      }
    } else {
      setLocationInfo(null);
    }
  };

  const handleSubmit = () => {
    // On passe le locationInfo mis à jour pour garantir la persistance au clic
    handleLocationTransition(postalCode, navigate, locationInfo);
  };

  const isHero = variant === "hero";
  const isPinpoint = !!PINPOINT_MAPPING[postalCode];

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
          className="flex-1 h-14 px-5 outline-none tracking-wider font-medium text-primary-foreground text-xl border-0 bg-[#222a39]"
        />

        <button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="h-14 px-6 bg-[hsl(var(--gold))] text-primary font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap text-xl"
        >
          Vérifier
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {locationInfo && (
        <div className="mt-4 p-4 bg-[#222a39]/50 border border-[hsl(var(--gold))/20] rounded-xl animate-fade-in text-left">
          <p className="font-bold text-2xl text-[hsl(var(--gold))] mb-2 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            {isPinpoint ? `Localisation : ${locationInfo.cityName}` : `Bassin de ${locationInfo.regionName}`}
          </p>
          <p className="text-base text-primary-foreground/80 leading-relaxed">
            Votre code postal ({postalCode}) a bien été identifié.
            {isPinpoint ? (
              <>
                {" "}
                Vous bénéficiez d'un <strong>accès prioritaire</strong> pour le secteur de{" "}
                <strong>{locationInfo.cityName}</strong>.
              </>
            ) : (
              <>
                {" "}
                Vous êtes rattaché(e) au bassin de rencontre de{" "}
                <strong>{locationInfo.regionName} et ses alentours</strong>.
              </>
            )}
          </p>
        </div>
      )}

      <p
        className={`text-lg mt-4 flex items-center gap-1.5 ${isHero ? "text-muted-foreground justify-center" : "text-primary-foreground/60"}`}
      >
        <Lock className="h-3.5 w-3.5" />
        Vérification de la proximité pour garantir des rencontres authentiques.
      </p>
    </div>
  );
}
