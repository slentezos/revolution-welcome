import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Video,
  X,
  Play,
  Lightbulb,
  Check,
  Sparkles,
  Eye,
  Sun,
  Heart,
  Volume2,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Loader2,
  MonitorOff,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Assets
import coupleGarden from "@/assets/couple-garden.jpg";

interface OnboardingMediaProps {
  profileId: string;
  onComplete: () => void;
}

type MediaSlot = {
  id: string;
  type: "video" | "portrait" | "silhouette" | "misc";
  label: string;
  hint: string;
  required: boolean;
  file?: File;
  preview?: string;
  uploaded?: boolean;
};

const getInitialSlots = (): MediaSlot[] => [
  { id: "video", type: "video", label: "Vidéo", hint: "Max 1 mn 30", required: false },
  { id: "portrait", type: "portrait", label: "Portrait", hint: "Obligatoire", required: true },
  { id: "silhouette", type: "silhouette", label: "Silhouette", hint: "En pied", required: false },
  { id: "misc1", type: "misc", label: "Divers", hint: "Loisirs…", required: false },
  { id: "misc2", type: "misc", label: "Divers", hint: "Passions…", required: false },
];

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_PHOTO_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export default function OnboardingMedia({ profileId, onComplete }: OnboardingMediaProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(getInitialSlots());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExistingMedia = async () => {
      try {
        const { data: existingMedia, error } = await supabase
          .from("profile_media")
          .select("*")
          .eq("profile_id", profileId)
          .order("display_order");

        if (error) throw error;

        if (existingMedia && existingMedia.length > 0) {
          setSlots((prev) => {
            const updated = [...prev];
            existingMedia.forEach((media) => {
              let slotIndex = -1;
              if (media.media_type === "video") slotIndex = 0;
              else if (media.media_type === "portrait") slotIndex = 1;
              else if (media.media_type === "silhouette") slotIndex = 2;
              else if (media.media_type === "misc") {
                if (!updated[3].uploaded && !updated[3].preview) slotIndex = 3;
                else if (!updated[4].uploaded && !updated[4].preview) slotIndex = 4;
              }
              if (slotIndex >= 0) {
                const {
                  data: { publicUrl },
                } = supabase.storage.from("profile-media").getPublicUrl(media.file_path);
                updated[slotIndex] = { ...updated[slotIndex], preview: publicUrl, uploaded: true };
              }
            });
            return updated;
          });
        }
      } catch (error) {
        console.error("Error loading existing media:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExistingMedia();
  }, [profileId]);

  // FIX TECHNIQUE : On déclenche le clic seulement APRES que le format 'accept' soit mis à jour
  useEffect(() => {
    if (activeSlotId && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [activeSlotId]);

  const handleSlotClick = (slotId: string) => {
    // On réinitialise d'abord pour forcer le useEffect si on reclique sur le même type
    setActiveSlotId(null);
    setTimeout(() => setActiveSlotId(slotId), 10);
  };

  const handleRemoveSlot = (slotId: string) => {
    const initial = getInitialSlots().find((s) => s.id === slotId);
    if (initial) {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? initial : s)));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) {
      setActiveSlotId(null);
      return;
    }

    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    // PROTECTION STRICTE : AUCUN GIF AUTORISÉ
    if (file.type === "image/gif") {
      toast({
        title: "Format non autorisé",
        description: "Les images animées (GIF) ne sont pas acceptées.",
        variant: "destructive",
      });
      setActiveSlotId(null);
      return;
    }

    // VALIDATION VIDÉO
    if (slot.type === "video") {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Action impossible",
          description: "Ce slot est réservé aux vidéos uniquement.",
          variant: "destructive",
        });
        setActiveSlotId(null);
        return;
      }
      const video = document.createElement("video");
      video.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      const isValid = await new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(video.duration <= 95); // 1mn30 + 5s de tolérance
        };
      });
      if (!isValid) {
        toast({ title: "Vidéo trop longue", description: "La durée maximale est de 1 mn 30.", variant: "destructive" });
        setActiveSlotId(null);
        return;
      }
    }
    // VALIDATION PHOTO
    else {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        toast({
          title: "Action impossible",
          description: "Ce slot est réservé aux photos uniquement.",
          variant: "destructive",
        });
        setActiveSlotId(null);
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: "Merci de choisir une photo de moins de 10 Mo.",
          variant: "destructive",
        });
        setActiveSlotId(null);
        return;
      }
      if (!ALLOWED_PHOTO_FORMATS.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
        toast({
          title: "Format non supporté",
          description: "Veuillez utiliser JPG, PNG ou HEIC.",
          variant: "destructive",
        });
        setActiveSlotId(null);
        return;
      }
    }

    const preview = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s) => (s.id === activeSlotId ? { ...s, file, preview, uploaded: false } : s)));

    // Reset pour permettre de re-sélectionner le même fichier si besoin
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveSlotId(null);
  };

  const handleSave = async () => {
    if (!confirmedAge) {
      toast({
        title: "Action requise",
        description: "Certifiez que vos photos ont moins de 18 mois.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");
      for (const slot of slots) {
        if (slot.file && !slot.uploaded) {
          const fileExt = slot.file.name.split(".").pop();
          const fileName = `${session.user.id}/${slot.id}-${Date.now()}.${fileExt}`;
          await supabase.storage.from("profile-media").upload(fileName, slot.file);
          await supabase.from("profile_media").insert({
            user_id: session.user.id,
            profile_id: profileId,
            media_type: slot.type,
            file_path: fileName,
            display_order: slots.indexOf(slot),
          });
        }
      }
      setShowSaveDialog(true);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const videoSlot = slots[0];
  const photoSlots = slots.slice(1, 5);
  const uploadedCount = slots.filter((s) => s.file || s.uploaded).length;

  if (loading)
    return <div className="h-screen flex items-center justify-center text-xl animate-pulse">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 min-h-0">
        <div className="flex-1 min-h-0 p-4 lg:p-10 flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-4xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            <div className="px-5 py-2 bg-secondary/50 rounded-xl border border-[#E5E0D8]">
              <span className="text-[#1B2333] font-bold text-2xl">{uploadedCount}</span>
              <span className="text-gray-500 text-2xl"> / 5</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* SLOT VIDEO */}
            <div className="min-h-0 flex flex-col gap-4">
              <div
                className="relative flex-1 min-h-0 overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[2.5rem] bg-[#FCF9F5] hover:border-[hsl(var(--gold))] transition-all duration-500"
                onClick={() => !videoSlot?.preview && handleSlotClick("video")}
              >
                {videoSlot?.preview ? (
                  <>
                    <video src={videoSlot.preview} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Play className="h-20 w-20 text-white drop-shadow-2xl" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot("video");
                      }}
                      className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-[#E5E0D8] flex items-center justify-center mb-4">
                        <Video className="h-10 w-10 text-[hsl(var(--gold))]" />
                      </div>
                      <span className="text-2xl text-[#1B2333] font-semibold">+ Ajouter ma vidéo</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStudioModal(true);
                      }}
                      className="flex items-center gap-4 px-8 py-5 bg-white border border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] rounded-2xl shadow-sm hover:shadow-lg transition-all group"
                    >
                      <Headphones className="h-7 w-7 animate-pulse" />
                      <div className="text-left">
                        <p className="font-bold text-xl leading-tight">Besoin d'aide ? Optez pour un accompagnement</p>
                        <p className="opacity-80 underline text-xl">Offre promotionnelle : 35€</p>
                      </div>
                      <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4">
                <p className="text-muted-foreground mb-8 text-xl">Votre sourire est votre plus belle signature.</p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold hover:bg-[hsl(var(--gold))]/20 transition-all text-xl"
                >
                  <Lightbulb className="h-5 w-5" /> Conseils vidéo
                </button>
              </div>
            </div>

            {/* PHOTOS */}
            <div className="min-h-0 flex flex-col gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                {photoSlots.map((slot) => (
                  <div key={slot.id} className="min-h-0 flex flex-col gap-2">
                    <div
                      className={cn(
                        "relative flex-1 min-h-0 overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[1.8rem] transition-all duration-500",
                        slot.preview ? "border-transparent" : "bg-[#FCF9F5] hover:border-[hsl(var(--gold))]",
                      )}
                      onClick={() => handleSlotClick(slot.id)}
                    >
                      {slot.preview ? (
                        <>
                          <img
                            decoding="async"
                            src={slot.preview}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSlot(slot.id);
                            }}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-2 border border-[#E5E0D8]">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-lg font-bold text-[#1B2333]">+ {slot.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* INFORMATION FORMAT ET TAILLE */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-500 text-lg leading-snug">
                  Formats acceptés : <strong className="text-slate-700">JPG, PNG, HEIC</strong> (pas de GIF). <br />
                  Taille maximale : <strong className="text-slate-700">10 Mo</strong> par photo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 bg-white border-t border-[#E5E0D8] py-8 px-6 lg:px-20 text-left shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div
            className={cn(
              "flex items-center gap-5 p-6 rounded-3xl border transition-all cursor-pointer",
              confirmedAge ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-[#E5E0D8]",
            )}
            onClick={() => setConfirmedAge(!confirmedAge)}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all",
                confirmedAge ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300",
              )}
            >
              {confirmedAge && <Check className="text-white h-6 w-6" />}
            </div>
            <p className="text-xl font-medium text-[#1B2333] select-none">
              Je certifie sur l'honneur que mes photos ont été prises il y a{" "}
              <span className="font-bold underline text-[hsl(var(--gold))]">moins de 18 mois</span>.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-400 hidden md:block text-2xl">
              Votre sécurité est notre priorité absolue.
            </p>
            <div className="flex gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleSave}
                className="flex-1 md:flex-none h-16 px-10 rounded-2xl border-[#E5E0D8] font-bold text-xl"
              >
                Enregistrer
              </Button>
              <Button
                onClick={handleSave}
                disabled={!confirmedAge || uploading}
                className={cn(
                  "flex-1 md:flex-none h-16 px-12 rounded-2xl font-bold text-xl shadow-xl transition-all",
                  confirmedAge ? "bg-[#1B2333] text-white" : "bg-gray-100 text-gray-400",
                )}
              >
                {uploading ? <Loader2 className="animate-spin" /> : "Valider mon profil"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT TECHNIQUE CACHÉ */}
      <input
        key={activeSlotId} // Force le rafraîchissement des attributs système
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/jpeg,image/png,image/webp,image/heic"}
        onChange={handleFileChange}
      />

      {/* MODALES EXISTANTES (STUDIO, TUTORIAL, SAVE) ... */}
    </div>
  );
}
