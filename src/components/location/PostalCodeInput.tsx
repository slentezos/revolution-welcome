import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

// Dictionnaire des préfectures pour le mode "Bassin" (Optimisation Volume)
const DEPARTMENT_TO_CITY: Record<string, string> = {
  "01": "Bourg-en-Bresse",
  "02": "Laon",
  "03": "Moulins",
  "04": "Digne-les-Bains",
  "05": "Gap",
  "06": "Nice",
  "07": "Privas",
  "08": "Charleville-Mézières",
  "09": "Foix",
  "10": "Troyes",
  "11": "Carcassonne",
  "12": "Rodez",
  "13": "Marseille",
  "14": "Caen",
  "15": "Aurillac",
  "16": "Angoulême",
  "17": "La Rochelle",
  "18": "Bourges",
  "19": "Tulle",
  "20": "Ajaccio",
  "2A": "Ajaccio",
  "2B": "Bastia",
  "21": "Dijon",
  "22": "Saint-Brieuc",
  "23": "Guéret",
  "24": "Périgueux",
  "25": "Besançon",
  "26": "Valence",
  "27": "Évreux",
  "28": "Chartres",
  "29": "Quimper",
  "30": "Nîmes",
  "31": "Toulouse",
  "32": "Auch",
  "33": "Bordeaux",
  "34": "Montpellier",
  "35": "Rennes",
  "36": "Châteauroux",
  "37": "Tours",
  "38": "Grenoble",
  "39": "Lons-le-Saunier",
  "40": "Mont-de-Marsan",
  "41": "Blois",
  "42": "Saint-Étienne",
  "43": "Le Puy-en-Velay",
  "44": "Nantes",
  "45": "Orléans",
  "46": "Cahors",
  "47": "Agen",
  "48": "Mende",
  "49": "Angers",
  "50": "Saint-Lô",
  "51": "Châlons-en-Champagne",
  "52": "Chaumont",
  "53": "Laval",
  "54": "Nancy",
  "55": "Bar-le-Duc",
  "56": "Vannes",
  "57": "Metz",
  "58": "Nevers",
  "59": "Lille",
  "60": "Beauvais",
  "61": "Alençon",
  "62": "Arras",
  "63": "Clermont-Ferrand",
  "64": "Pau",
  "65": "Tarbes",
  "66": "Perpignan",
  "67": "Strasbourg",
  "68": "Colmar",
  "69": "Lyon",
  "70": "Vesoul",
  "71": "Mâcon",
  "72": "Le Mans",
  "73": "Chambéry",
  "74": "Annecy",
  "75": "Paris",
  "76": "Rouen",
  "77": "Melun",
  "78": "Versailles",
  "79": "Niort",
  "80": "Amiens",
  "81": "Albi",
  "82": "Montauban",
  "83": "Toulon",
  "84": "Avignon",
  "85": "La Roche-sur-Yon",
  "86": "Poitiers",
  "87": "Limoges",
  "88": "Épinal",
  "89": "Auxerre",
  "90": "Belfort",
  "91": "Évry",
  "92": "Nanterre",
  "93": "Bobigny",
  "94": "Créteil",
  "95": "Cergy",
};

// Départements nécessitant un affichage "Pinpoint" (IDF + Belfort)
const PINPOINT_DEPARTMENTS = ["75", "77", "78", "90", "91", "92", "93", "94", "95"];

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

  const renderLocationDisplay = () => {
    if (!locationInfo) return null;

    const deptPrefix = postalCode.slice(0, 2);
    const isPinpoint = PINPOINT_DEPARTMENTS.includes(deptPrefix);

    if (isPinpoint) {
      return (
        <div className="mt-4 p-5 bg-[#222a39]/60 border border-[hsl(var(--gold))/30] rounded-xl animate-fade-in text-left">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--gold))]" />
            <p className="font-bold text-xl text-white">Localisation confirmée : {locationInfo.cityName}</p>
          </div>
          <p className="text-base text-primary-foreground/70 leading-relaxed">
            Secteur à haute densité. Votre emplacement précis est utilisé pour optimiser la pertinence de vos futures
            rencontres de proximité.
          </p>
        </div>
      );
    }

    const majorCity = DEPARTMENT_TO_CITY[deptPrefix] || locationInfo.regionName;

    return (
      <div className="mt-4 p-5 bg-[#222a39]/60 border border-[hsl(var(--gold))/30] rounded-xl animate-fade-in text-left">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--gold))]" />
          <p className="font-bold text-xl text-white">
            {locationInfo.cityName} ({postalCode})
          </p>
        </div>
        <p className="text-base text-primary-foreground/80 leading-relaxed">
          Afin de vous garantir un volume critique de profils qualifiés, vous êtes rattaché(e) au bassin de rencontre :{" "}
          <strong>{majorCity} & alentours</strong>.
        </p>
      </div>
    );
  };

  return (
    <div className={className}>
      <div
        className={`flex items-center gap-0 rounded-sm overflow-hidden shadow-elevated ${isHero ? "max-w-lg mx-auto" : "max-w-md"}`}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Code postal (ex: 75008)"
          value={postalCode}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 h-14 px-5 outline-none tracking-wider font-medium text-primary-foreground text-xl bg-[#222a39] border-transparent"
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

      {renderLocationDisplay()}

      <p
        className={`text-lg mt-4 flex items-center gap-2 ${isHero ? "text-muted-foreground justify-center" : "text-primary-foreground/60"}`}
      >
        <Lock className="h-4 w-4" />
        Saisie sécurisée — Confidentialité garantie.
      </p>
    </div>
  );
}
