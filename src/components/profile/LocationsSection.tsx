import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Lock,
  Plus,
  Trash2,
  Pencil,
  Undo2,
  Home,
  Sparkles,
  Clock,
  Info,
  CheckCircle2,
  Globe,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lookupPostalCode } from "@/data/frenchPostalCodes";
import { PINPOINT_MAPPING } from "@/data/locationData";
import { toast } from "sonner";

export interface ProfileLocationData {
  id: string;
  postal_code: string | null;
  city_name: string | null;
  region_name: string | null;
  other_city_1: string | null;
  other_postal_code_1: string | null;
  other_city_2: string | null;
  other_postal_code_2: string | null;
}

interface LocationsSectionProps {
  profile: ProfileLocationData;
  onProfileUpdated: (next: ProfileLocationData) => void;
}

// Composant de succès pour le code postal
function LocationSuccessDisplay({
  postalCode,
  cityName,
  regionName,
}: {
  postalCode: string;
  cityName: string;
  regionName: string;
}) {
  const isPinpoint = !!PINPOINT_MAPPING[postalCode];
  const displayCity = PINPOINT_MAPPING[postalCode] || cityName;

  return (
    <div className="bg-[#1B2333] border border-[hsl(var(--gold))] p-6 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-start gap-4">
        <div className="bg-[hsl(var(--gold))]/20 p-2 rounded-full mt-1 shrink-0">
          <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
        </div>
        <div>
          <h4 className="text-white font-bold text-xl mb-1 flex items-center gap-2">Localisation : {displayCity}</h4>
          {isPinpoint ? (
            <p className="text-slate-300 text-lg leading-relaxed">
              Votre code postal ({postalCode}) a bien été identifié. Vous bénéficiez d'un{" "}
              <strong className="text-[hsl(var(--gold))]">accès prioritaire</strong> pour le secteur de{" "}
              <strong className="text-white">{displayCity}</strong>.
            </p>
          ) : (
            <p className="text-slate-300 text-lg leading-relaxed">
              Votre code postal ({postalCode}) a bien été identifié. Vous êtes rattaché(e) au bassin de rencontre de{" "}
              <strong className="text-white">{regionName}</strong> et ses alentours.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LocationsSection({ profile, onProfileUpdated }: LocationsSectionProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // États du formulaire
  const [editSlot, setEditSlot] = useState<1 | 2>(1);
  const [destType, setDestType] = useState<"france" | "international">("france");
  const [cityInput, setCityInput] = useState("");
  const [postalInput, setPostalInput] = useState("");
  const [validatedLocation, setValidatedLocation] = useState<{ cityName: string; regionName: string } | null>(null);

  // Auto-majuscule
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 0) {
      setCityInput(val.charAt(0).toUpperCase() + val.slice(1));
    } else {
      setCityInput("");
    }
  };

  // Traitement du code postal avec pré-remplissage du nom de la ville
  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalInput(val);

    if (val.length === 5) {
      const info = lookupPostalCode(val);
      if (info) {
        setValidatedLocation({ cityName: info.cityName, regionName: info.regionName });
        // Pré-remplir la ville, mais l'utilisateur pourra modifier ce champ ensuite s'il le souhaite
        setCityInput(PINPOINT_MAPPING[val] || info.cityName);
      } else {
        setValidatedLocation(null);
      }
    } else {
      setValidatedLocation(null);
    }
  };

  const openAdd = (slot: 1 | 2) => {
    setEditSlot(slot);
    setDestType("france");
    setCityInput("");
    setPostalInput("");
    setValidatedLocation(null);
    setAddOpen(true);
  };

  const openEdit = (slot: 1 | 2) => {
    setEditSlot(slot);
    const city = slot === 1 ? profile.other_city_1 || "" : profile.other_city_2 || "";
    const postal = slot === 1 ? profile.other_postal_code_1 || "" : profile.other_postal_code_2 || "";

    setCityInput(city);
    setPostalInput(postal);

    // Si un code postal existe, c'est une adresse en France
    if (postal && postal.length === 5) {
      setDestType("france");
      const info = lookupPostalCode(postal);
      if (info) setValidatedLocation({ cityName: info.cityName, regionName: info.regionName });
    } else if (city) {
      // Sinon, c'est à l'étranger
      setDestType("international");
      setValidatedLocation(null);
    } else {
      setDestType("france");
      setValidatedLocation(null);
    }

    setAddOpen(true);
  };

  const handleSave = async () => {
    const isFrance = destType === "france";

    // Validations
    if (isFrance) {
      if (postalInput.length !== 5 || !validatedLocation) {
        toast.error("Veuillez saisir un code postal français valide.");
        return;
      }
      if (postalInput === profile.postal_code) {
        toast.error("Cette destination doit être différente de votre résidence principale.");
        return;
      }
    }

    if (!cityInput.trim()) {
      toast.error("Veuillez indiquer le nom de la destination.");
      return;
    }

    setSubmitting(true);

    const finalCity = cityInput.trim();
    const finalPostal = isFrance ? postalInput.trim() : null; // On annule le CP si c'est à l'étranger

    const patch =
      editSlot === 1
        ? { other_city_1: finalCity, other_postal_code_1: finalPostal }
        : { other_city_2: finalCity, other_postal_code_2: finalPostal };

    const { data, error } = await supabase.from("profiles").update(patch).eq("id", profile.id).select().single();
    setSubmitting(false);

    if (error || !data) {
      toast.error("Erreur lors de l'enregistrement.");
      return;
    }

    onProfileUpdated(data as unknown as ProfileLocationData);
    setAddOpen(false);
    toast.success(`La destination ${finalCity} a été enregistrée.`);
  };

  const handleDelete = async (slot: 1 | 2) => {
    setSubmitting(true);
    const patch =
      slot === 1
        ? { other_city_1: null, other_postal_code_1: null }
        : { other_city_2: null, other_postal_code_2: null };

    const { data, error } = await supabase.from("profiles").update(patch).eq("id", profile.id).select().single();
    setSubmitting(false);

    if (error || !data) {
      toast.error("Erreur lors de la suppression.");
      return;
    }

    onProfileUpdated(data as unknown as ProfileLocationData);
    toast.success("Destination retirée de votre profil.");
  };

  // Conditions d'activation du bouton de sauvegarde
  const isSaveDisabled =
    submitting ||
    (destType === "france"
      ? postalInput.length !== 5 || !validatedLocation || cityInput.trim() === ""
      : cityInput.trim() === "");

  const renderDestinationSlot = (slot: 1 | 2) => {
    const city = slot === 1 ? profile.other_city_1 : profile.other_city_2;
    const postal = slot === 1 ? profile.other_postal_code_1 : profile.other_postal_code_2;

    if (city) {
      return (
        <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl mb-4 transition-all hover:border-[hsl(var(--gold))/50]">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Plane className="h-6 w-6 text-[hsl(var(--gold-dark))]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#1B2333]">{city}</p>
              {postal ? (
                <p className="text-slate-500 font-medium">🇫🇷 {postal}</p>
              ) : (
                <p className="text-slate-500 font-medium">🌍 International</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEdit(slot)}
              className="p-3 text-slate-400 hover:text-[#1B2333] transition-colors rounded-lg hover:bg-slate-200"
              title="Modifier"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(slot)}
              className="p-3 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      );
    }

    if (slot === 2 && !profile.other_city_1) return null;

    return (
      <Button
        onClick={() => openAdd(slot)}
        variant="outline"
        className="w-full min-h-[72px] text-xl font-bold border-2 border-dashed border-slate-300 text-slate-500 hover:border-[hsl(var(--gold))] hover:text-[#1B2333] bg-transparent hover:bg-slate-50 rounded-xl mb-4 transition-all"
      >
        <Plus className="h-6 w-6 mr-3" />
        {slot === 1 ? "Ajouter une destination" : "Ajouter une deuxième destination"}
      </Button>
    );
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24 border-t border-slate-200">
      <div className="px-6 md:px-16 lg:px-20 xl:px-28 max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="font-medium tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-3 block text-lg">
            Géographie & Style de vie
          </span>
          <h3 className="font-heading text-3xl md:text-4xl text-[#1B2333] leading-tight font-bold mb-4">
            Mes Lieux de Vie
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-6" />
          <p className="text-slate-500 leading-relaxed text-xl max-w-2xl font-medium">
            Votre résidence principale définit votre zone de rencontre. Partagez également vos autres destinations
            habituelles pour enrichir votre profil.
          </p>
        </div>

        {/* --- Cartes --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte 1 : Principale (Algorithme) */}
          <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <MapPin className="w-32 h-32 text-[#1B2333]" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold uppercase tracking-widest mb-8 text-xl">
                  <Lock className="w-4 h-4" /> Résidence Principale
                </div>
                <h4 className="font-heading text-3xl font-bold text-[#1B2333] mb-2">
                  {profile.city_name || "Non renseignée"}
                </h4>
                {profile.postal_code && (
                  <p className="text-slate-500 font-medium text-xl mb-8">
                    {profile.postal_code} · {profile.region_name}
                  </p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-6 mt-auto">
                <p className="text-slate-500 leading-relaxed text-xl">
                  C'est autour de cette adresse certifiée que notre algorithme vous propose en priorité des profils
                  compatibles.
                </p>
              </div>
            </div>
          </div>

          {/* Carte 2 : Destinations Habituelles (Europe / International) */}
          <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 shadow-sm flex flex-col">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold-dark))] font-bold uppercase tracking-widest mb-6 text-xl">
                <Globe className="w-4 h-4" /> Autres destination(s) habituelle(s)
              </div>
              <p className="text-slate-500 text-xl leading-relaxed">
                Vous voyagez souvent ? Une maison de campagne, un pied-à-terre en Europe ou à l'étranger ? Ajoutez
                jusqu'à 2 destinations.
              </p>
            </div>

            <div className="mt-auto">
              {renderDestinationSlot(1)}
              {renderDestinationSlot(2)}
            </div>
          </div>
        </div>

        {/* --- Encart d'Information --- */}
        <div className="mt-12 p-8 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-slate-50 rounded-full shrink-0 mt-1">
              <Info className="h-8 w-8 text-[#1B2333]" />
            </div>
            <div>
              <h4 className="text-[#1B2333] font-bold mb-2 text-2xl">Comment fonctionne la localisation ?</h4>
              <p className="text-slate-500 leading-relaxed text-xl">
                Découvrez pourquoi nous séparons votre adresse principale de vos destinations de cœur, et comment cela
                impacte vos futures rencontres.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setInfoModalOpen(true)}
            variant="outline"
            className="shrink-0 min-h-[56px] px-8 text-xl font-bold border-2 border-[#1B2333] text-[#1B2333] hover:bg-[#1B2333] hover:text-white transition-all w-full md:w-auto"
          >
            Lire les détails
          </Button>
        </div>
      </div>

      {/* --- Modales --- */}

      {/* Modale Ajout / Modification */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setPostalInput("");
            setCityInput("");
            setValidatedLocation(null);
          }
        }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 rounded-[24px]">
          <div className="bg-[#1B2333] px-8 py-6">
            <DialogTitle className="font-heading text-3xl text-white font-bold">Une destination régulière</DialogTitle>
          </div>
          <div className="p-8">
            {/* Toggle France / International */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => {
                  setDestType("france");
                  setValidatedLocation(null);
                }}
                className={`h-14 rounded-xl text-lg font-bold border-2 transition-all ${
                  destType === "france"
                    ? "bg-[#1B2333] text-white border-[#1B2333]"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                🇫🇷 En France
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestType("international");
                  setPostalInput("");
                  setValidatedLocation(null);
                }}
                className={`h-14 rounded-xl text-2lg font-bold border-2 transition-all ${
                  destType === "international"
                    ? "bg-[#1B2333] text-white border-[#1B2333]"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                🌍 À l'étranger
              </button>
            </div>

            <div className="space-y-6 mb-8">
              {destType === "france" ? (
                <>
                  <div className="space-y-3">
                    <Label className="text-2xl font-bold text-[#1B2333]">Code postal *</Label>
                    <Input
                      id="secondary_postal"
                      inputMode="numeric"
                      maxLength={5}
                      value={postalInput}
                      onChange={handlePostalChange}
                      className="h-16 text-2xl font-medium bg-slate-50 border-2 rounded-xl focus:border-[hsl(var(--gold))] focus:ring-0"
                      placeholder="Ex: 13150"
                    />
                  </div>

                  {/* Bloc de confirmation visible uniquement si le CP est valide */}
                  {validatedLocation && (
                    <LocationSuccessDisplay
                      postalCode={postalInput}
                      cityName={validatedLocation.cityName}
                      regionName={validatedLocation.regionName}
                    />
                  )}

                  {/* Nom de la ville (qui se pré-remplit mais reste modifiable) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <Label className="text-xl font-bold text-[#1B2333]">Nom de la ville *</Label>
                    <Input
                      value={cityInput}
                      onChange={handleCityChange}
                      className="h-16 text-xl bg-white border-2 rounded-xl focus:border-[hsl(var(--gold))] focus:ring-0"
                      placeholder="La ville précise..."
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Mode International */}
                  <div className="space-y-3">
                    <Label className="text-xl font-bold text-[#1B2333]">Nom de la ville ou du pays *</Label>
                    <Input
                      value={cityInput}
                      onChange={handleCityChange}
                      className="h-16 text-2xl font-medium bg-slate-50 border-2 rounded-xl focus:border-[hsl(var(--gold))] focus:ring-0"
                      placeholder="Ex: Genève, Rome, New York..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="ghost"
                onClick={() => setAddOpen(false)}
                className="h-14 px-6 text-xl font-medium text-slate-500"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className="h-14 px-8 text-xl bg-[#1B2333] text-white hover:bg-[#1B2333]/90 font-bold rounded-xl disabled:opacity-50"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modale d'Information (Guide) */}
      <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-0 rounded-[28px] shadow-2xl">
          <div className="bg-[#1B2333] px-10 py-8">
            <DialogTitle className="font-heading text-3xl font-bold text-white mb-2">
              Comprendre la Localisation
            </DialogTitle>
            <DialogDescription className="text-xl text-slate-300 leading-relaxed">
              Notre club repose sur la sincérité. Voici comment nous gérons vos lieux de vie.
            </DialogDescription>
          </div>
          <div className="p-10 max-h-[70vh] overflow-y-auto bg-slate-50/50">
            {/* Bloc 1 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-7 w-7 text-[hsl(var(--gold))]" />
                <h4 className="text-2xl font-bold text-[#1B2333]">1. La Résidence Principale (L'Algorithme)</h4>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed">
                C'est votre point d'ancrage officiel. C'est à partir de ce code postal que notre algorithme calcule les
                distances et vous présente des profils de votre région en priorité. Cette adresse est protégée pour
                garantir l'intégrité de la communauté locale.
              </p>
            </div>

            {/* Bloc 2 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-7 w-7 text-[hsl(var(--gold))]" />
                <h4 className="text-2xl font-bold text-[#1B2333]">2. Les Destinations Régulières (Le Style de Vie)</h4>
              </div>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Il s'agit des lieux où vous vous rendez fréquemment (maison de vacances, ville d'origine, destination
                fétiche à l'étranger).
              </p>
              <div className="bg-slate-50 border-l-4 border-[#1B2333] p-5 rounded-r-xl">
                <p className="text-xl text-[#1B2333] font-medium">Pourquoi les ajouter ?</p>
                <p className="text-lg text-slate-600 mt-2">
                  Ces villes s'affichent sur votre profil et créent d'excellents points de discussion ("Vous allez
                  souvent à Rome ? Moi aussi !"). Bien qu'elles ne modifient pas votre bassin de rencontre immédiat,
                  elles nous permettent d'affiner vos affinités pour l'avenir.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setInfoModalOpen(false)}
              className="w-full h-16 bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-xl font-bold rounded-xl shadow-md transition-all"
            >
              Fermer le guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
