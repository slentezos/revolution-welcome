import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2, BellRing, MapPin } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

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
  "76": "Rouen",
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

const PINPOINT_DEPARTMENTS = ["75", "77", "78", "90", "91", "92", "93", "94", "95"];

export default function PostalCodeInput({
  className = "",
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section";
}) {
  const [postalCode, setPostalCode] = useState("");
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(val);
    if (val.length === 5) {
      const info = lookupPostalCode(val);
      setLocationInfo(info || null);
    } else {
      setLocationInfo(null);
    }
  };

  const deptPrefix = useMemo(() => postalCode.slice(0, 2), [postalCode]);
  const isPinpoint = useMemo(() => PINPOINT_DEPARTMENTS.includes(deptPrefix), [deptPrefix]);

  const handleSubmit = () => {
    if (!locationInfo) return;
    saveLocation(locationInfo);
    if (locationInfo.isIDF) navigate("/inscription");
    else navigate(`/liste-attente?dept=${deptPrefix}&city=${encodeURIComponent(locationInfo.cityName)}`);
  };

  return (
    <div className={className}>
      <div
        className={`flex items-center rounded-xl overflow-hidden shadow-2xl border border-white/10 ${variant === "hero" ? "max-w-lg mx-auto" : "max-w-md"}`}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Code postal"
          value={postalCode}
          onChange={handleChange}
          className="flex-1 h-16 px-6 outline-none tracking-[0.2em] font-bold text-primary-foreground text-2xl bg-[#1B2333]"
        />
        <button
          onClick={handleSubmit}
          disabled={!locationInfo}
          className="h-16 px-8 bg-[hsl(var(--gold))] text-primary font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-20"
        >
          Valider <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      {locationInfo && (
        <div className="mt-4 p-5 bg-[#1B2333]/60 border border-[hsl(var(--gold))/30] rounded-2xl text-left animate-in fade-in slide-in-from-top-2">
          {/* LOGIQUE PINPOINT (75, 77, 78, 90-95) */}
          {isPinpoint ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
                <p className="font-bold text-xl text-white">Localisation précise : {locationInfo.cityName}</p>
              </div>
              <p className="text-base text-primary-foreground/80 leading-relaxed font-medium">
                Zone à haute densité validée. Votre secteur (<strong>{locationInfo.regionName}</strong>) est
                actuellement ouvert. Nous privilégions votre emplacement exact pour des rencontres de proximité
                immédiate.
              </p>
            </div>
          ) : (
            /* LOGIQUE BASSIN (Reste de la France) */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-[hsl(var(--gold))]" />
                <p className="font-bold text-xl text-white">Secteur identifié : {locationInfo.cityName}</p>
              </div>
              <p className="text-base text-primary-foreground/80 leading-relaxed font-medium">
                Afin de vous garantir un volume critique de profils qualifiés, vous êtes rattaché(e) au bassin de
                rencontre : <strong>{DEPARTMENT_TO_CITY[deptPrefix] || locationInfo.regionName} & alentours</strong>.
              </p>
              <div className="flex items-start gap-3 p-3 bg-[hsl(var(--gold))]/10 rounded-xl border border-[hsl(var(--gold))]/20">
                <BellRing className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">
                  <strong>Membre Fondateur :</strong> Votre secteur est en cours d'ouverture. Nous vous contacterons dès
                  que la masse critique sera atteinte dans le {deptPrefix}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
