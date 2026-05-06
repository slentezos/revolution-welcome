import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Lock, Plus, Trash2, Pencil, Undo2, Home, Sparkles } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

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
  const [undoBanner, setUndoBanner] = useState<{ snapshot: Snapshot; message: string } | null>(null);

  // Tick every minute to refresh cooldown displays
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const lastSecondaryMs = profile.last_secondary_update ? new Date(profile.last_secondary_update).getTime() : null;
  const secondaryLockMsRemaining = lastSecondaryMs ? Math.max(0, lastSecondaryMs + NINETY_DAYS_MS - now) : 0;
  const canDeclareNewSecondary = !profile.secondary_city_name && secondaryLockMsRemaining === 0;

  const lastSwitchMs = profile.last_location_switch ? new Date(profile.last_location_switch).getTime() : null;
  const switchLockMsRemaining = lastSwitchMs ? Math.max(0, lastSwitchMs + SEVENTY_TWO_HOURS_MS - now) : 0;
  const switchLocked = switchLockMsRemaining > 0;

  const activeCityName =
    profile.active_location === "secondary" ? profile.secondary_city_name : profile.city_name;

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

  const showUndo = (snap: Snapshot, message: string) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoBanner({ snapshot: snap, message });
    undoTimerRef.current = setTimeout(() => setUndoBanner(null), 5 * 60 * 1000);
  };

  const persist = async (patch: Partial<ProfileLocationData>, successMessage: string, prevSnap: Snapshot) => {
    setSubmitting(true);
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", profile.id)
      .select()
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast({ title: "Erreur", description: "Enregistrement impossible.", variant: "destructive" });
      return false;
    }
    onProfileUpdated(data as ProfileLocationData);
    showUndo(prevSnap, successMessage);
    return true;
  };

  const handleAddOrEdit = async () => {
    const cleaned = postalInput.replace(/\D/g, "").slice(0, 5);
    if (cleaned.length !== 5) {
      toast({ title: "Code postal invalide", description: "Saisissez 5 chiffres.", variant: "destructive" });
      return;
    }
    const info = lookupPostalCode(cleaned);
    if (!info) {
      toast({ title: "Code postal inconnu", description: "Vérifiez votre saisie.", variant: "destructive" });
      return;
    }
    if (cleaned === profile.postal_code) {
      toast({
        title: "Adresse identique",
        description: "Votre résidence secondaire doit différer de la résidence principale.",
        variant: "destructive",
      });
      return;
    }
    const preciseCity = PINPOINT_MAPPING[cleaned] || info.cityName;
    const ok = await persist(
      {
        secondary_postal_code: cleaned,
        secondary_city_name: preciseCity,
        secondary_region_name: info.regionName,
        last_secondary_update: new Date().toISOString(),
      },
      editMode ? "Résidence secondaire mise à jour." : "Résidence secondaire ajoutée.",
      snapshot,
    );
    if (ok) {
      setAddOpen(false);
      setEditMode(false);
      setPostalInput("");
    }
  };

  const handleDelete = async () => {
    // Suppression : on garde last_secondary_update (anti-bypass)
    // Si l'active_location était secondary, on revient à primary (sans toucher au cooldown 72h)
    const ok = await persist(
      {
        secondary_postal_code: null,
        secondary_city_name: null,
        secondary_region_name: null,
        active_location: profile.active_location === "secondary" ? "primary" : profile.active_location,
      },
      "Résidence secondaire supprimée.",
      snapshot,
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
      toast({ title: "Erreur", description: "Annulation impossible.", variant: "destructive" });
      return;
    }
    onProfileUpdated(data as ProfileLocationData);
    setUndoBanner(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    toast({ title: "Action annulée", description: "Vos données précédentes ont été rétablies." });
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

  return (
    <section className="bg-secondary/40 py-16 md:py-24 border-t border-border/40">
      <div className="px-6 md:px-16 lg:px-20 xl:px-28 max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3 block text-lg">
            Géographie du club
          </span>
          <h3 className="font-heading text-3xl md:text-4xl text-foreground mb-3 leading-tight">Mes Lieux de Vie</h3>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-6" />
          <p className="text-muted-foreground leading-relaxed text-xl max-w-2xl">
            Déclarez votre résidence principale et, le cas échéant, votre résidence secondaire. Vous choisissez où votre
            profil rayonne.
          </p>
        </div>

        {/* Toggle de présence */}
        <div className="mb-10">
          <p className="font-bold text-foreground text-xl mb-4 uppercase tracking-widest">Sélecteur de Rayonnement</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-background border-2 border-border rounded-lg p-2">
            {(["primary", "secondary"] as const).map((loc) => {
              const isActive = profile.active_location === loc;
              const cityLabel = loc === "primary" ? profile.city_name : profile.secondary_city_name;
              const disabled =
                (loc === "secondary" && !profile.secondary_city_name) || (switchLocked && !isActive);
              const cooldownLabel =
                switchLocked && !isActive
                  ? `Présence maintenue à ${activeCityName} pour encore ${formatHours(switchLockMsRemaining)} h.`
                  : null;
              return (
                <button
                  key={loc}
                  type="button"
                  disabled={disabled || isActive}
                  onClick={() => setSwitchTarget(loc)}
                  className={`min-h-[64px] rounded-md px-6 py-5 text-xl font-semibold transition-all border-2 text-left ${
                    isActive
                      ? "bg-[#1B2333] text-white border-[#1B2333]"
                      : "bg-white text-foreground border-border hover:border-[hsl(var(--gold))] disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-3">
                    <Home className={`h-6 w-6 ${isActive ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`} />
                    <span className="text-2xl">
                      {loc === "primary" ? "Résidence principale" : "Résidence secondaire"}
                      {cityLabel && <span className="block font-normal opacity-80 mt-1 text-xl">{cityLabel}</span>}
                    </span>
                  </div>
                  {isActive && (
                    <span className="block mt-3 font-normal text-[hsl(var(--gold))] text-xl">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      Profil actuellement rayonnant ici
                    </span>
                  )}
                  {cooldownLabel && (
                    <span className="block mt-3 text-base font-normal text-muted-foreground">{cooldownLabel}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cartes des résidences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte 1 : Principale */}
          <div className="bg-background border-2 border-[hsl(var(--gold))/30] rounded-lg p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-7 w-7 text-[hsl(var(--gold))]" />
                <h4 className="font-heading text-2xl text-foreground">Résidence principale</h4>
              </div>
              <Lock className="h-6 w-6 text-muted-foreground" aria-label="Adresse principale verrouillée" />
            </div>
            <p className="text-foreground text-2xl font-medium">{profile.city_name || "Non renseignée"}</p>
            {profile.postal_code && (
              <p className="text-muted-foreground text-xl mt-1">
                {profile.postal_code} · {profile.region_name}
              </p>
            )}
            <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
              Votre adresse de référence reste stable pour garantir l'authenticité de votre bassin de rencontre.
            </p>
          </div>

          {/* Carte 2 : Secondaire */}
          <div className="bg-background border-2 border-border rounded-lg p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-7 w-7 text-[hsl(var(--gold))]" />
              <h4 className="font-heading text-2xl text-foreground">Résidence secondaire</h4>
            </div>

            {profile.secondary_city_name ? (
              <>
                <p className="text-foreground text-2xl font-medium">{profile.secondary_city_name}</p>
                {profile.secondary_postal_code && (
                  <p className="text-muted-foreground text-xl mt-1">
                    {profile.secondary_postal_code} · {profile.secondary_region_name}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={openEdit}
                    variant="outline"
                    className="min-h-[56px] text-lg border-2 border-foreground/20 hover:border-[hsl(var(--gold))]"
                  >
                    <Pencil className="h-5 w-5 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => setDeleteOpen(true)}
                    variant="outline"
                    className="min-h-[56px] text-lg border-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  Vous partagez votre temps entre deux régions ? Déclarez ici votre seconde adresse.
                </p>
                <div className="mt-6">
                  {canDeclareNewSecondary ? (
                    <Button
                      onClick={openAdd}
                      className="min-h-[56px] text-lg px-8 bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter une résidence secondaire
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="min-h-[56px] text-lg px-8 bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nouvelle déclaration possible dans {formatDays(secondaryLockMsRemaining)} jours
                    </Button>
                  )}
                  {!canDeclareNewSecondary && (
                    <p className="text-muted-foreground text-lg mt-3">Règle de stabilité du club.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modale Ajout / Modification */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && (setAddOpen(false), setEditMode(false))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {editMode ? "Modifier la résidence secondaire" : "Déclarer une résidence secondaire"}
            </DialogTitle>
            <DialogDescription className="text-lg leading-relaxed">
              Renseignez le code postal de votre seconde adresse. Cette déclaration s'inscrit dans un cycle de stabilité
              de 90 jours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="secondary_postal" className="text-xl font-medium">
              Code postal
            </Label>
            <Input
              id="secondary_postal"
              inputMode="numeric"
              maxLength={5}
              value={postalInput}
              onChange={(e) => setPostalInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="h-14 text-xl"
              placeholder="75001"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="min-h-[56px] text-lg">
              Annuler
            </Button>
            <Button
              onClick={handleAddOrEdit}
              disabled={submitting || postalInput.length !== 5}
              className="min-h-[56px] text-lg bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale Suppression */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Supprimer cette adresse ?</DialogTitle>
            <DialogDescription className="text-lg leading-relaxed">
              Note : Vous ne pourrez pas déclarer de nouvelle résidence secondaire avant l'expiration de votre cycle de
              90 jours
              {lastSecondaryMs
                ? ` (dans ${formatDays(Math.max(0, lastSecondaryMs + NINETY_DAYS_MS - now))} jours).`
                : "."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="min-h-[56px] text-lg">
              Conserver
            </Button>
            <Button
              onClick={handleDelete}
              disabled={submitting}
              className="min-h-[56px] text-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale Switch */}
      <Dialog open={!!switchTarget} onOpenChange={(o) => !o && setSwitchTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Signaler votre arrivée à{" "}
              {switchTarget === "secondary" ? profile.secondary_city_name : profile.city_name} ?
            </DialogTitle>
            <DialogDescription className="text-lg leading-relaxed">
              Pour garantir la qualité de vos futurs échanges locaux, votre profil rayonnera dans cette région pendant
              les 72 prochaines heures. Confirmer ce déplacement ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSwitchTarget(null)} className="min-h-[56px] text-lg">
              Annuler
            </Button>
            <Button
              onClick={handleSwitch}
              disabled={submitting}
              className="min-h-[56px] text-lg bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
            >
              Confirmer le déplacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast persistant d'annulation */}
      {undoBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1B2333] text-white shadow-[var(--shadow-luxury)] rounded-lg px-6 py-4 flex items-center gap-4 max-w-md w-[calc(100%-2rem)]">
          <span className="text-lg flex-1">{undoBanner.message}</span>
          <Button
            onClick={handleUndo}
            variant="outline"
            className="min-h-[48px] text-base border-[hsl(var(--gold))] text-[hsl(var(--gold))] bg-transparent hover:bg-[hsl(var(--gold))]/10"
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      )}
    </section>
  );
}
