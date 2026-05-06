import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2, BellRing } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

// Dictionnaire de référence des Bassins (Préfectures / Villes Phares)
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
  "92": "Boulogne-Billancourt",
  "93": "Saint-Denis",
  "94": "Saint-Maur-des-Fossés",
  "95": "Cergy",
};

// Zones nécessitant un affichage chirurgical (Pinpoint)
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

    // STRATÉGIE DE ROUTAGE :
    // Si c'est l'IDF (75, 77, 78, 91-95), on ouvre l'inscription.
    // Le 90 (Belfort) est pinpoint mais sur liste d'attente pour l'instant.
    if (locationInfo.isIDF) {
      navigate("/inscription");
    } else {
      // Pour l'analyse future : On passe le code du département dans l'URL ou le state
      navigate(`/liste-attente?dept=${postalCode.slice(0, 2)}`);
    }
  };

  const isHero = variant === "hero";

  const renderLocationDisplay = () => {
    if (!locationInfo) return null;

    const deptPrefix = postalCode.slice(0, 2);
    const isPinpoint = PINPOINT_DEPARTMENTS.includes(deptPrefix);
    const isWaitlist = !locationInfo.isIDF; // Tout ce qui n'est pas IDF est en attente

    if (isPinpoint) {
      return (
        <div className="mt-4 p-5 bg-[#1B2333]/40 border border-[hsl(var(--gold))/30] rounded-2xl animate-fade-in text-left backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
            <p className="font-bold text-xl text-white">Zone identifiée : {locationInfo.cityName}</p>
          </div>
          <p className="text-base text-primary-foreground/70 leading-relaxed">
            Votre secteur est actuellement ouvert aux nouvelles adhésions. Nous privilégions votre emplacement précis
            pour optimiser la qualité de vos futures mises en relation.
          </p>
        </div>
      );
    }

    const majorCity = DEPARTMENT_TO_CITY[deptPrefix] || locationInfo.regionName;

    return (
      <div className="mt-4 p-5 bg-[#1B2333]/40 border border-white/10 rounded-2xl animate-fade-in text-left backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-6 w-6 text-[hsl(var(--gold))]" />
          <p className="font-bold text-xl text-white">
            {locationInfo.cityName} ({postalCode})
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-base text-primary-foreground/80 leading-relaxed">
            Pour assurer un volume critique de profils qualifiés, vous êtes rattaché(e) au bassin :{" "}
            <strong>{majorCity} & alentours</strong>.
          </p>

          {isWaitlist && (
            <div className="flex items-start gap-3 p-3 bg-[hsl(var(--gold))]/5 rounded-xl border border-[hsl(var(--gold))]/10">
              <BellRing className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-sm text-[hsl(var(--gold-light))] font-medium">
                Priorité d'ouverture : En validant, vous devenez membre fondateur de ce bassin. Nous vous contacterons
                dès que la masse critique de profils sera atteinte dans le {deptPrefix}.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div
        className={`flex items-center gap-0 rounded-xl overflow-hidden shadow-2xl ${isHero ? "max-w-lg mx-auto" : "max-w-md"}`}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Votre code postal"
          value={postalCode}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 h-16 px-6 outline-none tracking-widest font-semibold text-primary-foreground text-2xl bg-[#1B2333] border-none focus:ring-2 focus:ring-[hsl(var(--gold))]/50 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="h-16 px-8 bg-[hsl(var(--gold))] text-primary font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed whitespace-nowrap text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
        >
          Valider
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      {renderLocationDisplay()}

      <p
        className={`text-base mt-5 flex items-center gap-2 font-medium ${isHero ? "text-muted-foreground/60 justify-center" : "text-primary-foreground/40"}`}
      >
        <Lock className="h-4 w-4" />
        Protocole de vérification sécurisé — Standard de confidentialité élevé.
      </p>
    </div>
  );
}
