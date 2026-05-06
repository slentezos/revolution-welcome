import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2, BellRing, MapPin } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

// Dictionnaire des "Villes Phares" par département (Mode Bassin)
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
  "92": "Boulogne-Billancourt",
  "93": "Saint-Denis",
  "94": "Saint-Maur-des-Fossés",
  "95": "Cergy",
};

// Zones Pinpoint : IDF (75, 77, 78, 91-95) + Belfort (90)
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

    // Détermination du statut de la zone
    const dept = postalCode.slice(0, 2);

    if (locationInfo.isIDF) {
      // Zone Ouverte (Paris & IDF)
      navigate("/inscription");
    } else {
      // Zone en Liste d'attente (Province & 90)
      // On passe le dept dans l'URL pour vos stats futures
      navigate(`/liste-attente?dept=${dept}&city=${encodeURIComponent(locationInfo.cityName)}`);
    }
  };

  const isHero = variant === "hero";

  const renderLocationDisplay = () => {
    if (!locationInfo) return null;

    const deptPrefix = postalCode.slice(0, 2);
    const isPinpoint = PINPOINT_DEPARTMENTS.includes(deptPrefix);
    const isOpen = locationInfo.isIDF;

    return (
      <div className="mt-4 p-5 bg-[#1B2333]/40 border border-[hsl(var(--gold))/30] rounded-2xl animate-fade-in text-left backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
          <p className="font-bold text-xl text-white">
            Localisation : {locationInfo.cityName} ({postalCode})
          </p>
        </div>

        <div className="space-y-4">
          {isPinpoint ? (
            <p className="text-base text-primary-foreground/80 leading-relaxed">
              Secteur <strong>{locationInfo.regionName}</strong> identifié. En zone dense, nous privilégions votre
              emplacement exact pour des rencontres de proximité immédiate.
            </p>
          ) : (
            <p className="text-base text-primary-foreground/80 leading-relaxed">
              Pour vous garantir un volume critique de profils qualifiés, vous êtes rattaché(e) au bassin de rencontre :{" "}
              <strong>{DEPARTMENT_TO_CITY[deptPrefix] || locationInfo.regionName} & alentours</strong>.
            </p>
          )}

          {!isOpen && (
            <div className="flex items-start gap-3 p-3 bg-[hsl(var(--gold))]/10 rounded-xl border border-[hsl(var(--gold))]/20">
              <BellRing className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[hsl(var(--gold-light))] uppercase tracking-wider">
                  Priorité d'ouverture
                </p>
                <p className="text-sm text-white/90">
                  En validant, vous devenez membre fondateur du bassin {deptPrefix}. Vous recevrez une notification
                  prioritaire dès que le seuil de membres sera atteint dans votre secteur.
                </p>
              </div>
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
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onBlur={() => handleChange(postalCode)}
          className="flex-1 h-16 px-6 outline-none tracking-widest font-semibold text-primary-foreground text-2xl bg-[#1B2333] border-none focus:ring-0"
        />
        <button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="h-16 px-8 bg-[hsl(var(--gold))] text-primary font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale whitespace-nowrap text-xl"
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
        Vérification de proximité sécurisée — Confidentialité garantie.
      </p>
    </div>
  );
}
