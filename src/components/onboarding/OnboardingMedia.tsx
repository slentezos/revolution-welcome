import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Video,
  X,
  Play,
  Pause,
  Lightbulb,
  Check,
  Sparkles,
  Eye,
  Sun,
  Heart,
  Volume2,
  VolumeX,
  Headphones,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  MonitorOff,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Assets
import coupleGarden from "@/assets/couple-garden.jpg";
import placeholderVideoBg from "@/assets/placeholder-video-bg.jpg";

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
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 Mo
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

  // États Vidéo & Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleStudioPayment = async () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowStudioModal(false);
      setShowVideoTutorial(false);
      toast({ title: "Réservation confirmée !", description: "Notre équipe vous appellera sous 24h." });
    }, 2000);
  };

  const handleSlotClick = (slotId: string) => {
    setActiveSlotId(slotId);
    setTimeout(() => fileInputRef.current?.click(), 10);
  };

  const handleRemoveSlot = (slotId: string) => {
    const initial = getInitialSlots().find((s) => s.id === slotId);
    if (initial) {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? initial : s)));
      if (slotId === "video") {
        setIsPlaying(false);
        setVideoProgress(0);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;
    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    if (file.type === "image/gif") {
      toast({
        title: "Format refusé",
        description: "Les images animées (GIF) ne sont pas autorisées.",
        variant: "destructive",
      });
      return;
    }

    if (slot.type === "video") {
      if (!file.type.startsWith("video/")) {
        toast({ title: "Erreur", description: "Veuillez choisir un fichier vidéo.", variant: "destructive" });
        return;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: "Limite de 50 Mo pour la vidéo.",
          variant: "destructive",
        });
        return;
      }
      const video = document.createElement("video");
      video.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      const isValid = await new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(video.duration <= 95); // 1mn30 + tolerance
        };
      });
      if (!isValid) {
        toast({ title: "Vidéo trop longue", description: "Max 1 mn 30.", variant: "destructive" });
        return;
      }
    } else {
      if (file.size > MAX_PHOTO_SIZE) {
        toast({ title: "Fichier trop volumineux", description: "Max 10 Mo par photo.", variant: "destructive" });
        return;
      }
      if (!ALLOWED_PHOTO_FORMATS.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
        toast({ title: "Format non supporté", description: "Utilisez JPG, PNG ou HEIC.", variant: "destructive" });
        return;
      }
    }

    const preview = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s) => (s.id === activeSlotId ? { ...s, file, preview, uploaded: false } : s)));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveSlotId(null);
  };

  // Gestion du slider vidéo
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setVideoProgress(parseFloat(e.target.value));
    }
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
          const fileName = `${session.user.id}/${slot.id}-${Date.now()}.${slot.file.name.split(".").pop()}`;
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

  if (loading)
    return <div className="h-screen flex items-center justify-center text-xl animate-pulse">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-0 min-h-0">
        <div className="flex-1 min-h-0 p-4 lg:p-10 flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-4xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            <div className="px-5 py-2 bg-secondary/50 rounded-xl border border-[#E5E0D8]">
              <span className="text-[#1B2333] font-bold text-2xl">{slots.filter((s) => s.preview).length}</span>
              <span className="text-gray-500 text-2xl"> / 5</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* SLOT VIDEO AVEC SLIDER */}
            <div className="min-h-0 flex flex-col gap-4">
              <div
                className="relative flex-1 min-h-0 overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[2.5rem] bg-[#FCF9F5] hover:border-[hsl(var(--gold))] transition-all"
                onClick={() => !videoSlot?.preview && handleSlotClick(videoSlot?.id)}
              >
                {videoSlot?.preview ? (
                  <div
                    className="relative w-full h-full group/video"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlaying) {
                        videoRef.current?.pause();
                        setIsPlaying(false);
                      } else {
                        videoRef.current?.play();
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <video
                      ref={videoRef}
                      src={videoSlot.preview}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      playsInline
                    />

                    {/* OVERLAY CONTRÔLES */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity",
                        isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-100",
                      )}
                    >
                      {!isPlaying && <Play className="h-20 w-20 text-white drop-shadow-2xl" />}
                    </div>

                    {/* BARRE DE PROGRESSION (SLIDER) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={videoProgress}
                        onChange={handleSeek}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[hsl(var(--gold))]"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(videoSlot.id);
                      }}
                      className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-full z-20 shadow-lg"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-[#E5E0D8] flex items-center justify-center mb-4">
                      <Video className="h-10 w-10 text-[hsl(var(--gold))]" />
                    </div>
                    <span className="text-2xl text-[#1B2333] font-semibold">+ Ajouter ma vidéo</span>
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
                        <p className="opacity-80 underline text-xl">Séance guidée : 35€</p>
                      </div>
                      <ArrowRight className="h-6 w-6 ml-2" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4">
                <p className="text-muted-foreground text-xl">Votre sourire est votre plus belle signature.</p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold hover:bg-[hsl(var(--gold))]/20 transition-all text-xl"
                >
                  <Lightbulb className="h-5 w-5" /> Conseils vidéo
                </button>
              </div>
            </div>

            {/* PHOTOS - DIMENSIONS FIXÉES (Aspect-Ratio Square) */}
            <div className="min-h-0 flex flex-col gap-4">
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
                {photoSlots.map((slot) => (
                  <div key={slot.id} className="relative aspect-square">
                    <div
                      className={cn(
                        "absolute inset-0 overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[1.8rem] transition-all",
                        slot.preview ? "border-transparent" : "bg-[#FCF9F5] hover:border-[hsl(var(--gold))]",
                      )}
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
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-lg font-bold text-[#1B2333]">+ {slot.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-500 text-lg leading-snug">
                  Formats : <strong className="text-slate-700">JPG, PNG, HEIC</strong>. Taille max :{" "}
                  <strong className="text-slate-700">10 Mo</strong> par photo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 bg-white border-t border-[#E5E0D8] py-8 px-6 lg:px-20 text-left shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
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
            <p className="text-xl font-medium text-[#1B2333]">
              Je certifie sur l'honneur que mes photos ont moins de{" "}
              <span className="font-bold underline text-[hsl(var(--gold))]">18 mois</span>.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleSave}
              className="h-16 px-10 rounded-2xl border-[#E5E0D8] font-bold text-xl"
            >
              Enregistrer
            </Button>
            <Button
              onClick={handleSave}
              disabled={!confirmedAge || uploading}
              className={cn(
                "h-16 px-12 rounded-2xl font-bold text-xl shadow-xl transition-all",
                confirmedAge ? "bg-[#1B2333] text-white" : "bg-gray-100 text-gray-400",
              )}
            >
              {uploading ? "Envoi..." : "Valider mon profil"}
            </Button>
          </div>
        </div>
      </div>

      <input
        key={activeSlotId}
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/jpeg,image/png,image/webp,image/heic"}
        onChange={handleFileChange}
      />

      {/* MODALES */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="max-w-2xl rounded-[24px]">
          <DialogTitle className="text-3xl font-bold text-[#1B2333] text-center mb-6">
            Accompagnement Studio
          </DialogTitle>
          <p className="text-xl text-slate-600 text-center mb-8">
            Un expert vous guide via Google Meet pour réaliser vos meilleurs clichés et votre vidéo (35€).
          </p>
          <Button
            onClick={handleStudioPayment}
            className="h-16 w-full bg-[#1B2333] text-white text-xl font-bold rounded-xl shadow-lg"
          >
            Réserver ma séance
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-5xl p-0 rounded-[3rem] overflow-hidden">
          <div className="flex h-full">
            <div className="flex-1 p-10 bg-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold)/0.1)] text-[hsl(var(--gold))] font-bold uppercase tracking-widest text-sm mb-6">
                <Sparkles className="h-4 w-4" /> Guide Privé
              </div>
              <DialogTitle className="text-4xl font-bold text-[#1B2333] mb-8">
                L'art de se <span className="italic text-[hsl(var(--gold))]">présenter</span>
              </DialogTitle>
              <div className="grid grid-cols-1 gap-6 mb-10 text-xl text-slate-600">
                <div className="flex gap-4">
                  <Eye className="text-[#1B2333] h-7 w-7" /> <p>Le Regard : face à l'objectif avec sincérité.</p>
                </div>
                <div className="flex gap-4">
                  <Sun className="text-[#1B2333] h-7 w-7" />{" "}
                  <p>La Lumière : face à une fenêtre pour un rendu naturel.</p>
                </div>
              </div>
              <Button
                onClick={() => setShowVideoTutorial(false)}
                className="h-16 w-full bg-[#1B2333] text-white font-bold rounded-2xl text-xl shadow-xl"
              >
                J'ai compris, je commence seul(e)
              </Button>
            </div>
            <img src={coupleGarden} className="hidden lg:block w-[340px] object-cover" />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md p-10 text-center rounded-[2.5rem]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <DialogTitle className="text-3xl font-bold text-[#1B2333] mb-6">C'est enregistré !</DialogTitle>
          <Button
            onClick={() => {
              setShowSaveDialog(false);
              onComplete();
            }}
            className="w-full h-16 bg-[#1B2333] text-white text-xl font-bold rounded-2xl shadow-xl"
          >
            Continuer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
