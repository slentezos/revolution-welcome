import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2, BellRing, MapPin } from "lucide-react";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";

// 1. Dictionnaire de précision IDF (91, 92, 93, 94, 95)
const PINPOINT_MAPPING: Record<string, string> = {
  // Paris Arrondissements
  "75001": "Paris 1er",
  "75002": "Paris 2e",
  "75003": "Paris 3e",
  "75004": "Paris 4e",
  "75005": "Paris 5e",
  "75006": "Paris 6e",
  "75007": "Paris 7e",
  "75008": "Paris 8e",
  "75009": "Paris 9e",
  "75010": "Paris 10e",
  "75011": "Paris 11e",
  "75012": "Paris 12e",
  "75013": "Paris 13e",
  "75014": "Paris 14e",
  "75015": "Paris 15e",
  "75016": "Paris 16e",
  "75017": "Paris 17e",
  "75018": "Paris 18e",
  "75019": "Paris 19e",
  "75020": "Paris 20e",
  // Hauts-de-Seine (92)
  "92160": "Antony",
  "92600": "Asnières-sur-Seine",
  "92220": "Bagneux",
  "92270": "Bois-Colombes",
  "92100": "Boulogne-Billancourt",
  "92340": "Bourg-la-Reine",
  "92290": "Châtenay-Malabry",
  "92320": "Châtillon",
  "92370": "Chaville",
  "92140": "Clamart",
  "92110": "Clichy",
  "92700": "Colombes",
  "92400": "Courbevoie",
  "92260": "Fontenay-aux-Roses",
  "92380": "Garches",
  "92250": "La Garenne-Colombes",
  "92230": "Gennevilliers",
  "92130": "Issy-les-Moulineaux",
  "92300": "Levallois-Perret",
  "92240": "Malakoff",
  "92430": "Marnes-la-Coquette",
  "92190": "Meudon",
  "92120": "Montrouge",
  "92000": "Nanterre",
  "92200": "Neuilly-sur-Seine",
  "92350": "Le Plessis-Robinson",
  "92800": "Puteaux",
  "92500": "Rueil-Malmaison",
  "92210": "Saint-Cloud",
  "92330": "Sceaux",
  "92310": "Sèvres",
  "92150": "Suresnes",
  "92170": "Vanves",
  "92420": "Vaucresson",
  "92410": "Ville-d'Avray",
  "92390": "Villeneuve-la-Garenne",
  // Seine-Saint-Denis (93)
  "93300": "Aubervilliers",
  "93600": "Aulnay-sous-Bois",
  "93170": "Bagnolet",
  "93150": "Le Blanc-Mesnil",
  "93000": "Bobigny",
  "93140": "Bondy",
  "93350": "Le Bourget",
  "93390": "Clichy-sous-Bois",
  "93470": "Coubron",
  "93120": "La Courneuve",
  "93700": "Drancy",
  "93440": "Dugny",
  "93800": "Épinay-sur-Seine",
  "93220": "Gagny",
  "93460": "Gournay-sur-Marne",
  "93450": "L'Île-Saint-Denis",
  "93260": "Les Lilas",
  "93190": "Livry-Gargan",
  "93370": "Montfermeil",
  "93100": "Montreuil",
  "93360": "Neuilly-Plaisance",
  "93330": "Neuilly-sur-Marne",
  "93160": "Noisy-le-Grand",
  "93130": "Noisy-le-Sec",
  "93500": "Pantin",
  "93320": "Les Pavillons-sous-Bois",
  "93380": "Pierrefitte-sur-Seine",
  "93310": "Le Pré-Saint-Gervais",
  "93340": "Le Raincy",
  "93230": "Romainville",
  "93110": "Rosny-sous-Bois",
  "93200": "Saint-Denis",
  "93400": "Saint-Ouen-sur-Seine",
  "93270": "Sevran",
  "93240": "Stains",
  "93290": "Tremblay-en-France",
  "93410": "Vaujours",
  "93250": "Villemomble",
  "93420": "Villepinte",
  "93430": "Villetaneuse",
  // Val-de-Marne (94)
  "94480": "Ablon-sur-Seine",
  "94140": "Alfortville",
  "94110": "Arcueil",
  "94470": "Boissy-Saint-Léger",
  "94380": "Bonneuil-sur-Marne",
  "94360": "Bry-sur-Marne",
  "94230": "Cachan",
  "94500": "Champigny-sur-Marne",
  "94220": "Charenton-le-Pont",
  "94430": "Chennevières-sur-Marne",
  "94550": "Chevilly-Larue",
  "94600": "Choisy-le-Roi",
  "94000": "Créteil",
  "94120": "Fontenay-sous-Bois",
  "94260": "Fresnes",
  "94250": "Gentilly",
  "94240": "L'Haÿ-les-Roses",
  "94200": "Ivry-sur-Seine",
  "94340": "Joinville-le-Pont",
  "94270": "Le Kremlin-Bicêtre",
  "94450": "Limeil-Brévannes",
  "94700": "Maisons-Alfort",
  "94520": "Mandres-les-Roses",
  "94440": "Marolles-en-Brie",
  "94130": "Nogent-sur-Marne",
  "94880": "Noiseau",
  "94310": "Orly",
  "94490": "Ormesson-sur-Marne",
  "94170": "Le Perreux-sur-Marne",
  "94420": "Le Plessis-Trévise",
  "94510": "La Queue-en-Brie",
  "94150": "Rungis",
  "94160": "Saint-Mandé",
  "94100": "Saint-Maur-des-Fossés",
  "94410": "Saint-Maurice",
  "94370": "Sucy-en-Brie",
  "94320": "Thiais",
  "94460": "Valenton",
  "94800": "Villejuif",
  "94290": "Villeneuve-le-Roi",
  "94190": "Villeneuve-Saint-Georges",
  "94350": "Villiers-sur-Marne",
  "94300": "Vincennes",
  "94400": "Vitry-sur-Seine",
  // Essonne & Val d'Oise spécifiques (91, 95)
  "91200": "Athis-Mons",
  "91260": "Juvisy-sur-Orge",
  "91420": "Morangis",
  "91550": "Paray-Vieille-Poste",
  "91600": "Savigny-sur-Orge",
  "91170": "Viry-Châtillon",
  "95100": "Argenteuil",
  "90000": "Belfort",
};

// 2. Bassins de province (Référentiel par département)
const DEPARTMENT_FALLBACK: Record<string, string> = {
  "01": "Bourg-en-Bresse",
  "06": "Nice",
  "13": "Marseille",
  "31": "Toulouse",
  "33": "Bordeaux",
  "34": "Montpellier",
  "35": "Rennes",
  "44": "Nantes",
  "59": "Lille",
  "67": "Strasbourg",
  "69": "Lyon",
  "83": "Toulon",
  "84": "Avignon",
  // ... peut être complété selon les besoins
};

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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(val);
    if (val.length === 5) {
      const info = lookupPostalCode(val);
      if (info) setLocationInfo(info);
    } else {
      setLocationInfo(null);
    }
  }, []);

  const handleSubmit = () => {
    if (!locationInfo) return;
    saveLocation(locationInfo);
    if (locationInfo.isIDF) navigate("/inscription");
    else
      navigate(
        `/liste-attente?dept=${postalCode.slice(0, 2)}&city=${encodeURIComponent(PINPOINT_MAPPING[postalCode] || locationInfo.cityName)}`,
      );
  };

  const isPinpoint = useMemo(() => !!PINPOINT_MAPPING[postalCode], [postalCode]);
  const cityName = PINPOINT_MAPPING[postalCode] || locationInfo?.cityName;

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
          {isPinpoint ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
                <p className="font-bold text-xl text-white">Localisation précise : {cityName}</p>
              </div>
              <p className="text-base text-primary-foreground/80 leading-relaxed font-medium">
                Secteur à haute densité validé. Votre zone ({locationInfo.regionName}) est ouverte. Nous optimisons vos
                mises en relation sur ce périmètre géographique.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-[hsl(var(--gold))]" />
                <p className="font-bold text-xl text-white">Secteur identifié : {cityName}</p>
              </div>
              <p className="text-base text-primary-foreground/80 leading-relaxed font-medium">
                Pour vous garantir un volume critique de profils qualifiés, vous êtes rattaché(e) au bassin de rencontre
                : <strong>{DEPARTMENT_FALLBACK[postalCode.slice(0, 2)] || locationInfo.regionName} & alentours</strong>.
              </p>
              <div className="flex items-start gap-3 p-3 bg-[hsl(var(--gold))]/10 rounded-xl border border-[hsl(var(--gold))]/20">
                <BellRing className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                <p className="text-sm text-white/90">
                  <strong>Membre Fondateur :</strong> Votre secteur est en cours d'ouverture. Vous serez notifié(e) dès
                  que la masse critique sera atteinte.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
