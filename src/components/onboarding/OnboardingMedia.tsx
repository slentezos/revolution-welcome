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

  // CHARGEMENT INITIAL
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
        console.error("Error loading media:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExistingMedia();
  }, [profileId]);

  // FIX : Trigger du clic après mise à jour de l'état "accept"
  useEffect(() => {
    if (activeSlotId && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [activeSlotId]);

  const handleSlotClick = (slotId: string) => {
    setActiveSlotId(slotId);
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

    // VALIDATION VIDÉO
    if (slot.type === "video") {
      if (!file.type.startsWith("video/")) {
        toast({ title: "Format incorrect", description: "Veuillez sélectionner une vidéo.", variant: "destructive" });
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
          resolve(video.duration <= 95); // Marge technique de 5s
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
      if (file.size > MAX_PHOTO_SIZE) {
        toast({
          title: "Fichier trop lourd",
          description: "Merci de choisir une photo de moins de 10 Mo.",
          variant: "destructive",
        });
        setActiveSlotId(null);
        return;
      }
    }

    const preview = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s) => (s.id === activeSlotId ? { ...s, file, preview, uploaded: false } : s)));

    // Reset technique
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
      if (!session) throw new Error("Session expirée");

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
    return <div className="h-screen flex items-center justify-center animate-pulse text-xl">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 min-h-0">
        <div className="flex-1 min-h-0 p-4 lg:p-10 flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-4xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            <div className="px-5 py-2 bg-slate-50 rounded-xl border border-[#E5E0D8]">
              <span className="text-[#1B2333] font-bold text-2xl">{uploadedCount}</span>
              <span className="text-gray-400 text-2xl"> / 5</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* ZONE VIDÉO */}
            <div className="min-h-0 flex flex-col gap-4">
              <div
                className="relative flex-1 min-h-0 overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[2.5rem] bg-[#FCF9F5] hover:border-[#C5A059] transition-all"
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
                        <Video className="h-10 w-10 text-[#C5A059]" />
                      </div>
                      <span className="text-2xl text-[#1B2333] font-bold">+ Ajouter ma vidéo</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStudioModal(true);
                      }}
                      className="flex items-center gap-4 px-8 py-5 bg-white border border-[#C5A059]/40 text-[#C5A059] rounded-2xl shadow-sm hover:shadow-lg transition-all"
                    >
                      <Headphones className="h-7 w-7 animate-pulse" />
                      <div className="text-left">
                        <p className="font-bold text-xl leading-tight">Besoin d'aide ? Optez pour un accompagnement</p>
                        <p className="opacity-80 underline text-lg">Offre promotionnelle : 35€</p>
                      </div>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4">
                <p className="text-slate-500 text-xl italic">Votre sourire est votre plus belle signature.</p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059] rounded-full font-bold text-xl hover:bg-[#C5A059]/20 transition-all"
                >
                  <Lightbulb className="h-5 w-5" /> Conseils vidéo
                </button>
              </div>
            </div>

            {/* ZONE PHOTOS */}
            <div className="min-h-0 flex flex-col gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                {photoSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="relative overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[1.8rem] bg-[#FCF9F5] hover:border-[#C5A059] transition-all"
                    onClick={() => handleSlotClick(slot.id)}
                  >
                    {slot.preview ? (
                      <>
                        <img src={slot.preview} alt={slot.label} className="w-full h-full object-cover" />
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
                          <Camera className="h-6 w-6 text-slate-400" />
                        </div>
                        <span className="text-lg font-bold text-[#1B2333]">+ {slot.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-500 text-lg">
                  Formats : <strong className="text-slate-700">JPG, PNG, HEIC</strong>. Max :{" "}
                  <strong className="text-slate-700">10 Mo</strong> / photo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 bg-white border-t border-[#E5E0D8] py-8 px-6 lg:px-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div
            className={cn(
              "flex items-center gap-5 p-6 rounded-3xl border transition-all cursor-pointer",
              confirmedAge ? "bg-emerald-50 border-emerald-200" : "bg-white border-[#E5E0D8]",
            )}
            onClick={() => setConfirmedAge(!confirmedAge)}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all",
                confirmedAge ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300",
              )}
            >
              {confirmedAge && <Check className="text-white h-6 w-6" />}
            </div>
            <p className="text-xl font-bold text-[#1B2333]">
              Je certifie que mes photos ont <span className="underline text-[#C5A059]">moins de 18 mois</span>.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-400 font-bold text-2xl hidden md:block">Votre sécurité est notre priorité.</p>
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
                  confirmedAge ? "bg-[#1B2333] text-white hover:bg-[#1B2333]/90" : "bg-slate-100 text-slate-400",
                )}
              >
                {uploading ? <Loader2 className="animate-spin" /> : "Valider mon profil"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT CACHÉ DYNAMIQUE */}
      <input
        key={activeSlotId} // Force le rafraîchissement des attributs
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/jpeg,image/png,image/webp,image/heic"}
        onChange={handleFileChange}
      />

      {/* MODALS (STUDIO & TUTORIAL) */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="sm:max-w-2xl rounded-[24px] p-8">
          <DialogTitle className="text-3xl font-bold text-[#1B2333] mb-4 text-center">
            Accompagnement personnalisé
          </DialogTitle>
          <p className="text-xl text-slate-600 mb-8 text-center">
            Un expert vous guide via Google Meet pour réaliser vos meilleurs clichés et votre vidéo de présentation.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setIsProcessingPayment(true);
                setTimeout(() => {
                  setIsProcessingPayment(false);
                  setShowStudioModal(false);
                  toast({ title: "Réservation confirmée" });
                }, 1500);
              }}
              className="h-16 bg-[#1B2333] text-white text-xl font-bold rounded-xl"
            >
              {isProcessingPayment ? <Loader2 className="animate-spin" /> : "Réserver ma séance (35€)"}
            </Button>
            <Button variant="ghost" onClick={() => setShowStudioModal(false)} className="h-14 text-slate-500 text-lg">
              Essayer seul(e) d'abord
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md p-10 text-center rounded-[2.5rem]">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="h-10 w-10 text-emerald-600" />
            </div>
            <DialogTitle className="text-3xl font-bold text-[#1B2333]">Profil enregistré !</DialogTitle>
            <Button
              onClick={() => {
                setShowSaveDialog(false);
                onComplete();
              }}
              className="w-full h-16 rounded-2xl bg-[#1B2333] text-white text-xl font-bold shadow-xl"
            >
              Continuer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
