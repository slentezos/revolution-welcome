import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Lock, Plus, Trash2, Pencil, Undo2, Home, Sparkles, Clock } from "lucide-react";
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

export default function LocationsSection({ profile, onProfileUpdated }: LocationsSectionProps) {
  const [now, setNow] = useState(() => Date.now());
  const [addOpen, setAddOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [switchTarget, setSwitchTarget] = useState<"primary" | "secondary" | null>(null);
  const [postalInput, setPostalInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [undoBanner, setUndoBanner] = useState<{
    snapshot: Snapshot;
    message: string;
    target: "primary" | "secondary";
    expiresAt: number;
  } | null>(null);
  const [undoNow, setUndoNow] = useState(() => Date.now());

  // Actualisation toutes les minutes pour les cooldowns standards
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Actualisation chaque seconde si un bandeau Undo est actif
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
    const cleaned = postalInput.replace(/\D/g, "").slice(0, 5);
    if (cleaned.length !== 5) {
      toast.error("Saisissez un code postal à 5 chiffres.");
      return;
    }
    const info = lookupPostalCode(cleaned);
    if (!info) {
      toast.error("Code postal inconnu. Vérifiez votre saisie.");
      return;
    }
    if (cleaned === profile.postal_code) {
      toast.error("Votre résidence secondaire doit différer de la résidence principale.");
      return;
    }
    const preciseCity = PINPOINT_MAPPING[cleaned] || info.cityName;

    // Contexte Avant -> Après pour le Undo Banner
    const oldCity = snapshot.secondary_city_name || "Aucune";
    const successMessage = editMode
      ? `Résidence secondaire mise à jour (${oldCity} ➔ ${preciseCity}).`
      : `Résidence secondaire ajoutée (${preciseCity}).`;

    const ok = await persist(
      {
        secondary_postal_code: cleaned,
        secondary_city_name: preciseCity,
        secondary_region_name: info.regionName,
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
    }
  };

  const handleDelete = async () => {
    // Suppression : on garde last_secondary_update (anti-bypass)
    // Contexte de ce qui a été supprimé
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
    setPostalInput(profile.secondary_postal_code || "");
    setAddOpen(true);
  };

  const openAdd = () => {
    setEditMode(false);
    setPostalInput("");
    setAddOpen(true);
  };

  const renderUndoBanner = (target: "primary" | "secondary") => {
    if (!undoBanner || undoBanner.target !== target) return null;

    // Split the message to make the transition part bold (e.g., "(Paris ➔ Lyon).")
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
          <h3 className="font-heading text-3xl md:text-4xl text-[#1B2333] mb-3 leading-tight font-bold">
            Mes Lieux de Vie
          </h3>
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
      </div>

      {/* --- Modales --- */}

      {/* Modale Ajout / Modification */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && (setAddOpen(false), setEditMode(false))}>
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
            <div className="space-y-4 mb-8">
              <Label htmlFor="secondary_postal" className="text-xl font-bold text-[#1B2333]">
                Code postal
              </Label>
              <Input
                id="secondary_postal"
                inputMode="numeric"
                maxLength={5}
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="h-16 text-2xl font-medium bg-slate-50 border-2 rounded-xl focus:border-[hsl(var(--gold))] focus:ring-0"
                placeholder="Ex: 13150"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setAddOpen(false)}
                className="h-14 px-6 text-xl font-medium text-slate-500"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddOrEdit}
                disabled={submitting || postalInput.length !== 5}
                className="h-14 px-8 text-xl bg-[#1B2333] text-white hover:bg-[#1B2333]/90 font-bold rounded-xl"
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
