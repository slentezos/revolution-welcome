import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Lock, Plus, Trash2, Pencil, Undo2, Home, Sparkles, Clock, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lookupPostalCode } from "@/data/frenchPostalCodes";
import { PINPOINT_MAPPING } from "@/data/locationData";
import { toast } from "sonner";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const SEVENTY_TWO_HOURS_MS = 72 * 60 * 60 * 1000;

export interface ProfileLocationData {
  id: string;
  postal_code: string | null;
  city_name: string | null;
  region_name: string | null;
  secondary_postal_code: string | null;
  secondary_city_name: string | null;
  secondary_region_name: string | null;
  last_secondary_update: string | null;
  active_location: "primary" | "secondary";
  last_location_switch: string | null;
}

interface LocationsSectionProps {
  profile: ProfileLocationData;
  onProfileUpdated: (next: ProfileLocationData) => void;
}

type Snapshot = Pick<
  ProfileLocationData,
  | "secondary_postal_code"
  | "secondary_city_name"
  | "secondary_region_name"
  | "last_secondary_update"
  | "active_location"
  | "last_location_switch"
>;

const formatDays = (ms: number) => Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
const formatHours = (ms: number) => Math.max(1, Math.ceil(ms / (60 * 60 * 1000)));

// Composant interne pour afficher le message de succès façon HomePage
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
    <div className="bg-[#1B2333] border border-[hsl(var(--gold))] p-6 rounded-xl shadow-lg mt-4 animate-in fade-in zoom-in-95 duration-300">
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
  const [now, setNow] = useState(() => Date.now());
  const [addOpen, setAddOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [switchTarget, setSwitchTarget] = useState<"primary" | "secondary" | null>(null);

  // State for the postal input and its validation
  const [postalInput, setPostalInput] = useState("");
  const [validatedLocation, setValidatedLocation] = useState<{ cityName: string; regionName: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [undoBanner, setUndoBanner] = useState<{
    snapshot: Snapshot;
    message: string;
    target: "primary" | "secondary";
    expiresAt: number;
  } | null>(null);
  const [undoNow, setUndoNow] = useState(() => Date.now());

  // Handle Postal Code Input with instant lookup
  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPostalInput(val);

    if (val.length === 5) {
      const info = lookupPostalCode(val);
      if (info) {
        setValidatedLocation({ cityName: info.cityName, regionName: info.regionName });
      } else {
        setValidatedLocation(null);
      }
    } else {
      setValidatedLocation(null);
    }
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!undoBanner) return;
    setUndoNow(Date.now());
    const t = setInterval(() => setUndoNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [undoBanner]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const undoRemainingMs = undoBanner ? Math.max(0, undoBanner.expiresAt - undoNow) : 0;
  const undoCountdownLabel = (() => {
    const total = Math.ceil(undoRemainingMs / 1000);
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  })();

  const lastSecondaryMs = profile.last_secondary_update ? new Date(profile.last_secondary_update).getTime() : null;
  const secondaryLockMsRemaining = lastSecondaryMs ? Math.max(0, lastSecondaryMs + NINETY_DAYS_MS - now) : 0;
  const canDeclareNewSecondary = !profile.secondary_city_name && secondaryLockMsRemaining === 0;

  const lastSwitchMs = profile.last_location_switch ? new Date(profile.last_location_switch).getTime() : null;
  const switchLockMsRemaining = lastSwitchMs ? Math.max(0, lastSwitchMs + SEVENTY_TWO_HOURS_MS - now) : 0;
  const switchLocked = switchLockMsRemaining > 0;

  const activeCityName = profile.active_location === "secondary" ? profile.secondary_city_name : profile.city_name;

  const snapshot: Snapshot = useMemo(
    () => ({
      secondary_postal_code: profile.secondary_postal_code,
      secondary_city_name: profile.secondary_city_name,
      secondary_region_name: profile.secondary_region_name,
      last_secondary_update: profile.last_secondary_update,
      active_location: profile.active_location,
      last_location_switch: profile.last_location_switch,
    }),
    [profile],
  );

  const showUndo = (snap: Snapshot, message: string, target: "primary" | "secondary") => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    const expiresAt = Date.now() + 5 * 60 * 1000;
    setUndoBanner({ snapshot: snap, message, target, expiresAt });
    undoTimerRef.current = setTimeout(() => setUndoBanner(null), 5 * 60 * 1000);
  };

  const persist = async (
    patch: Partial<ProfileLocationData>,
    successMessage: string,
    prevSnap: Snapshot,
    target: "primary" | "secondary",
  ) => {
    setSubmitting(true);
    const { data, error } = await supabase.from("profiles").update(patch).eq("id", profile.id).select().single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Enregistrement impossible.");
      return false;
    }
    onProfileUpdated(data as ProfileLocationData);
    showUndo(prevSnap, successMessage, target);
    return true;
  };

  const handleAddOrEdit = async () => {
    if (!validatedLocation || postalInput.length !== 5) {
      return;
    }
    if (postalInput === profile.postal_code) {
      toast.error("Votre résidence secondaire doit différer de la résidence principale.");
      return;
    }

    const preciseCity = PINPOINT_MAPPING[postalInput] || validatedLocation.cityName;

    const oldCity = snapshot.secondary_city_name || "Aucune";
    const successMessage = editMode
      ? `Résidence secondaire mise à jour (${oldCity} ➔ ${preciseCity}).`
      : `Résidence secondaire ajoutée (${preciseCity}).`;

    const ok = await persist(
      {
        secondary_postal_code: postalInput,
        secondary_city_name: preciseCity,
        secondary_region_name: validatedLocation.regionName,
        last_secondary_update: new Date().toISOString(),
      },
      successMessage,
      snapshot,
      "secondary",
    );
    if (ok) {
      setAddOpen(false);
      setEditMode(false);
      setPostalInput("");
      setValidatedLocation(null);
    }
  };

  const handleDelete = async () => {
    const oldCity = snapshot.secondary_city_name;
    const successMessage = `Résidence secondaire supprimée (${oldCity}).`;

    const ok = await persist(
      {
        secondary_postal_code: null,
        secondary_city_name: null,
        secondary_region_name: null,
        active_location: profile.active_location === "secondary" ? "primary" : profile.active_location,
      },
      successMessage,
      snapshot,
      "secondary",
    );
    if (ok) setDeleteOpen(false);
  };

  const handleSwitch = async () => {
    if (!switchTarget) return;
    if (switchTarget === "secondary" && !profile.secondary_city_name) return;
    const ok = await persist(
      {
        active_location: switchTarget,
        last_location_switch: new Date().toISOString(),
      },
      `Présence active : ${switchTarget === "secondary" ? profile.secondary_city_name : profile.city_name}.`,
      snapshot,
      switchTarget,
    );
    if (ok) setSwitchTarget(null);
  };

  const handleUndo = async () => {
    if (!undoBanner) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("profiles")
      .update(undoBanner.snapshot)
      .eq("id", profile.id)
      .select()
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Annulation impossible.");
      return;
    }
    onProfileUpdated(data as ProfileLocationData);
    setUndoBanner(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    toast.success("Action annulée. Vos données ont été rétablies.");
  };

  const openEdit = () => {
    setEditMode(true);
    const cp = profile.secondary_postal_code || "";
    setPostalInput(cp);
    if (cp.length === 5) {
      const info = lookupPostalCode(cp);
      if (info) setValidatedLocation({ cityName: info.cityName, regionName: info.regionName });
    }
    setAddOpen(true);
  };

  const openAdd = () => {
    setEditMode(false);
    setPostalInput("");
    setValidatedLocation(null);
    setAddOpen(true);
  };

  const renderUndoBanner = (target: "primary" | "secondary") => {
    if (!undoBanner || undoBanner.target !== target) return null;

    const messageParts = undoBanner.message.split("(");
    const mainText = messageParts[0];
    const transitionText = messageParts.length > 1 ? `(${messageParts[1]}` : "";

    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-6 rounded-xl border-2 border-[hsl(var(--gold))]/30 bg-slate-50 px-6 py-5 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm"
      >
        <span className="text-foreground leading-relaxed flex-1 min-w-[200px] text-xl">
          {mainText}
          {transitionText && <strong className="ml-1 text-[#1B2333] font-bold">{transitionText}</strong>}
        </span>
        <button
          type="button"
          onClick={handleUndo}
          disabled={submitting}
          className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-md font-bold text-[#1B2333] hover:text-[hsl(var(--gold))] transition-colors disabled:opacity-50 text-xl"
        >
          <Undo2 className="h-5 w-5" />
          Annuler ({undoCountdownLabel})
        </button>
      </div>
    );
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24 border-t border-slate-200">
      <div className="px-6 md:px-16 lg:px-20 xl:px-28 max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="font-medium tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-3 block text-lg">
            Géographie du club
          </span>
          <div className="mb-3">
            <h3 className="font-heading text-3xl md:text-4xl text-[#1B2333] leading-tight font-bold">
              Mes Lieux de Vie
            </h3>
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-6" />
          <p className="text-slate-500 leading-relaxed text-xl max-w-2xl font-medium">
            Déclarez votre résidence principale et, le cas échéant, votre résidence secondaire. Vous choisissez où votre
            profil rayonne.
          </p>
        </div>

        {/* --- Toggle de présence --- */}
        <div className="mb-14">
          <p className="font-bold text-[#1B2333] text-xl mb-4 uppercase tracking-widest">Sélecteur de Rayonnement</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-transparent border-0 border-transparent">
            {(["primary", "secondary"] as const).map((loc) => {
              const isActive = profile.active_location === loc;
              const cityLabel = loc === "primary" ? profile.city_name : profile.secondary_city_name;
              const disabled = (loc === "secondary" && !profile.secondary_city_name) || (switchLocked && !isActive);

              return (
                <button
                  key={loc}
                  type="button"
                  disabled={disabled || isActive}
                  onClick={() => setSwitchTarget(loc)}
                  className={`relative overflow-hidden min-h-[80px] rounded-xl px-6 py-5 text-xl font-bold transition-all border-2 text-left flex items-center justify-between ${
                    isActive
                      ? "bg-[#1B2333] text-white border-[#1B2333] shadow-md"
                      : "bg-white text-[#1B2333] border-slate-200 hover:border-[hsl(var(--gold))] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-4 z-10 relative">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
                      <Home className={`h-6 w-6 ${isActive ? "text-[hsl(var(--gold))]" : "text-slate-500"}`} />
                    </div>
                    <span>
                      {loc === "primary" ? "Résidence principale" : "Résidence secondaire"}
                      {cityLabel && (
                        <span
                          className={`block font-medium mt-1 ${isActive ? "text-white/80" : "text-slate-500"} text-lg`}
                        >
                          {cityLabel}
                        </span>
                      )}
                    </span>
                  </div>
                  {isActive && <Sparkles className="h-6 w-6 text-[hsl(var(--gold))] absolute right-6 opacity-80" />}
                </button>
              );
            })}
          </div>

          {/* ELEGANT COOLDOWN INDICATOR FOR SWITCH */}
          {switchLocked && (
            <div className="mt-4 flex items-start gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xl text-blue-800 leading-relaxed font-medium">
                Votre profil est actuellement verrouillé sur la zone de{" "}
                <span className="font-bold">{activeCityName}</span>. <br />
                Prochain changement possible dans{" "}
                <span className="font-bold">{formatHours(switchLockMsRemaining)} heures</span>.
              </p>
            </div>
          )}
        </div>

        {/* --- Cartes des résidences --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte 1 : Principale */}
          <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <MapPin className="w-32 h-32 text-[#1B2333]" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-widest mb-6">
                <Lock className="w-4 h-4" /> Principale
              </div>
              <h4 className="font-heading text-3xl font-bold text-[#1B2333] mb-2">
                {profile.city_name || "Non renseignée"}
              </h4>
              {profile.postal_code && (
                <p className="text-slate-500 font-medium text-xl mb-8">
                  {profile.postal_code} · {profile.region_name}
                </p>
              )}
              <p className="text-slate-500 leading-relaxed text-lg border-t border-slate-100 pt-6">
                Votre adresse de référence reste stable pour garantir l'authenticité de votre profil.
              </p>
            </div>
            {renderUndoBanner("primary")}
          </div>

          {/* Carte 2 : Secondaire */}
          <div className="bg-white border-2 border-slate-200 rounded-[24px] p-8 shadow-sm flex flex-col justify-between">
            {profile.secondary_city_name ? (
              <>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold-dark))] text-sm font-bold uppercase tracking-widest mb-6">
                    <Home className="w-4 h-4" /> Secondaire
                  </div>
                  <h4 className="font-heading text-3xl font-bold text-[#1B2333] mb-2">{profile.secondary_city_name}</h4>
                  {profile.secondary_postal_code && (
                    <p className="text-slate-500 font-medium text-xl mb-8">
                      {profile.secondary_postal_code} · {profile.secondary_region_name}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-100 pt-6">
                  <Button
                    onClick={openEdit}
                    variant="outline"
                    className="flex-1 min-h-[56px] text-lg font-bold border-2 border-slate-200 text-[#1B2333] hover:border-[hsl(var(--gold))]"
                  >
                    <Pencil className="h-5 w-5 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => setDeleteOpen(true)}
                    variant="outline"
                    className="min-h-[56px] px-6 text-lg font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                {renderUndoBanner("secondary")}
              </>
            ) : (
              <div className="h-full flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-sm font-bold uppercase tracking-widest mb-6 w-fit">
                  <Home className="w-4 h-4" /> Secondaire
                </div>
                <p className="text-slate-500 text-xl leading-relaxed mb-8">
                  Vous partagez votre temps entre deux régions ? Déclarez ici votre seconde adresse.
                </p>

                {canDeclareNewSecondary ? (
                  <Button
                    onClick={openAdd}
                    className="min-h-[64px] text-xl font-bold px-8 bg-[#1B2333] text-white hover:bg-[#1B2333]/90 w-full rounded-xl shadow-md"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    Ajouter une adresse
                  </Button>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-[#1B2333] font-bold text-xl mb-1">Période de stabilisation</p>
                    <p className="text-slate-500 text-lg">
                      Nouvelle déclaration possible dans{" "}
                      <span className="font-bold">{formatDays(secondaryLockMsRemaining)} jours</span>.
                    </p>
                  </div>
                )}
                {renderUndoBanner("secondary")}
              </div>
            )}
          </div>
        </div>

        {/* --- Encart d'Information / Aide --- */}
        <div className="mt-12 p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm shrink-0 mt-1">
              <Info className="h-8 w-8 text-[hsl(var(--gold-dark))]" />
            </div>
            <div>
              <h4 className="text-[#1B2333] text-xl font-bold mb-1">
                Besoin de comprendre comment fonctionne la localisation ?
              </h4>
              <p className="text-slate-500 text-lg leading-relaxed">
                Découvrez notre guide détaillé sur les règles de maintien de présence (72h) et d'ancrage (90 jours) pour
                garantir la qualité de vos échanges.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setInfoModalOpen(true)}
            variant="outline"
            className="shrink-0 min-h-[56px] px-8 text-xl font-bold border-2 border-[#1B2333] text-[#1B2333] hover:bg-[#1B2333] hover:text-white transition-all w-full md:w-auto"
          >
            Lire le guide complet
          </Button>
        </div>
      </div>

      {/* --- Modales --- */}

      {/* Modale d'Information (Guide de Mobilité) */}
      <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-0 rounded-[28px] shadow-2xl">
          <div className="bg-[#1B2333] px-10 py-8">
            <DialogTitle className="font-heading text-3xl font-bold text-white mb-2">
              Guide de Mobilité : Rayonnement & Stabilité
            </DialogTitle>
            <DialogDescription className="text-xl text-slate-300 leading-relaxed">
              Pour préserver l'excellence de notre réseau et garantir des rencontres authentiques, votre localisation
              répond à des règles de stabilité algorithmique.
            </DialogDescription>
          </div>
          <div className="p-10 max-h-[70vh] overflow-y-auto bg-slate-50/50">
            {/* Bloc 1 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8 shadow-sm">
              <h4 className="text-2xl font-bold text-[#1B2333] mb-4">1. L'Ancrage de 90 jours (Déclaration)</h4>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                L'ajout ou la modification d'une résidence secondaire verrouille cette adresse pour une durée de 90
                jours. Cela empêche le tourisme virtuel et garantit aux autres membres que vous fréquentez réellement
                cette région.
              </p>
              <div className="bg-slate-50 border-l-4 border-[hsl(var(--gold))] p-5 rounded-r-xl">
                <p className="text-xl text-slate-700 italic">
                  Exemple : Si vous déclarez une adresse à Deauville le 1er Juin, celle-ci restera votre résidence
                  secondaire officielle jusqu'au 1er Septembre. Vous ne pourrez pas la remplacer par Cannes entre-temps.
                </p>
              </div>
            </div>

            {/* Bloc 2 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8 shadow-sm">
              <h4 className="text-2xl font-bold text-[#1B2333] mb-4">2. Le Maintien de 72 heures (Déplacement)</h4>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Lorsque vous signalez votre arrivée dans l'une de vos deux résidences, votre profil rayonne
                exclusivement dans cette zone. Ce choix est maintenu pour un minimum de 72 heures.
              </p>
              <div className="bg-slate-50 border-l-4 border-[hsl(var(--gold))] p-5 rounded-r-xl">
                <p className="text-xl text-slate-700 italic">
                  Exemple : Vous arrivez à Deauville un vendredi et l'indiquez sur votre profil. Vous serez visible
                  exclusivement par les membres de cette région durant tout le week-end, attestant de votre présence
                  réelle sur place.
                </p>
              </div>
            </div>

            {/* Bloc 3 */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8 shadow-sm">
              <h4 className="text-2xl font-bold text-[#1B2333] mb-4">3. Suppression & Intégrité</h4>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Vous conservez le droit de supprimer votre résidence secondaire à tout moment pour ne plus y apparaître.
                Toutefois, cette suppression n'annule pas le délai de 90 jours en cours.
              </p>
              <div className="bg-slate-50 border-l-4 border-[hsl(var(--gold))] p-5 rounded-r-xl">
                <p className="text-xl text-slate-700 italic">
                  Exemple : Si vous supprimez votre adresse secondaire après seulement 30 jours, il vous faudra tout de
                  même patienter 60 jours supplémentaires avant de pouvoir en déclarer une nouvelle.
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

      {/* Modale Ajout / Modification */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setEditMode(false);
            setPostalInput("");
            setValidatedLocation(null);
          }
        }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 rounded-[24px]">
          <div className="bg-[#1B2333] px-8 py-6">
            <DialogTitle className="font-heading text-2xl text-white font-bold">
              {editMode ? "Modifier la résidence" : "Ajouter une résidence"}
            </DialogTitle>
          </div>
          <div className="p-8">
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Pour assurer la stabilité des rencontres, cette adresse sera définie comme votre résidence secondaire
              officielle pour les <strong className="text-[#1B2333]">90 prochains jours</strong>.
            </p>
            <div className="space-y-4 mb-4">
              <Label htmlFor="secondary_postal" className="text-xl font-bold text-[#1B2333]">
                Code postal
              </Label>
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

            <div className="min-h-[140px]">
              {validatedLocation && (
                <LocationSuccessDisplay
                  postalCode={postalInput}
                  cityName={validatedLocation.cityName}
                  regionName={validatedLocation.regionName}
                />
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
                onClick={handleAddOrEdit}
                disabled={submitting || !validatedLocation}
                className="h-14 px-8 text-xl bg-[#1B2333] text-white hover:bg-[#1B2333]/90 font-bold rounded-xl disabled:opacity-50"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modale Suppression */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 rounded-[24px]">
          <div className="bg-red-500 px-8 py-6">
            <DialogTitle className="font-heading text-2xl text-white font-bold">Supprimer l'adresse ?</DialogTitle>
          </div>
          <div className="p-8">
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Votre résidence secondaire sera effacée. Pour préserver l'intégrité de la plateforme, vous ne pourrez pas
              déclarer de nouvelle adresse avant
              {lastSecondaryMs ? (
                <strong className="text-red-500">
                  {" "}
                  {formatDays(Math.max(0, lastSecondaryMs + NINETY_DAYS_MS - now))} jours
                </strong>
              ) : (
                " 90 jours"
              )}
              .
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setDeleteOpen(false)}
                className="h-14 px-6 text-xl font-medium text-slate-500"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={submitting}
                className="h-14 px-8 text-xl bg-red-500 text-white hover:bg-red-600 font-bold rounded-xl"
              >
                Oui, supprimer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modale Switch */}
      <Dialog open={!!switchTarget} onOpenChange={(o) => !o && setSwitchTarget(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 rounded-[24px]">
          <div className="bg-[#1B2333] px-8 py-6">
            <DialogTitle className="font-heading text-2xl text-white font-bold">Confirmer le déplacement</DialogTitle>
          </div>
          <div className="p-8">
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Pour garantir la qualité de vos échanges locaux, votre profil rayonnera exclusivement autour de{" "}
              <strong className="text-[#1B2333]">
                {switchTarget === "secondary" ? profile.secondary_city_name : profile.city_name}
              </strong>{" "}
              pendant les <strong className="text-[#1B2333]">72 prochaines heures</strong>.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setSwitchTarget(null)}
                className="h-14 px-6 text-xl font-medium text-slate-500"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSwitch}
                disabled={submitting}
                className="h-14 px-8 text-xl bg-[#1B2333] text-white hover:bg-[#1B2333]/90 font-bold rounded-xl"
              >
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
