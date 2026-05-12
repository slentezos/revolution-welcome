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
  VolumeX,
  Headphones,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  MonitorOff,
  Info,
  User,
  Smartphone,
  Clock,
  Mic,
  MessageCircle,
  RotateCcw,
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

// Constantes pour la validation
const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_PHOTO_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export default function OnboardingMedia({ profileId, onComplete }: OnboardingMediaProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(getInitialSlots());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // États Vidéo
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoCurrent, setVideoCurrent] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = v;
      setVideoCurrent(v);
    }
  };

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

  const handleStudioPayment = async () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowStudioModal(false);
      setShowVideoTutorial(false);
      toast({
        title: "Réservation confirmée !",
        description: "Notre équipe vous appellera dans les prochaines 24h.",
      });
    }, 2000);
  };

  const handleSlotClick = (slotId: string) => {
    setActiveSlotId(slotId);
    // Timeout pour laisser le DOM appliquer le bon "accept" sur l'input avant le clic
    setTimeout(() => fileInputRef.current?.click(), 10);
  };

  const handleRemoveSlot = (slotId: string) => {
    const initial = getInitialSlots().find((s) => s.id === slotId);
    if (initial) {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? initial : s)));
      if (slotId === "video") setIsPlaying(false);
    }
  };

  // Logique lecture vidéo
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;
    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    // VALIDATION VIDEO STRICTE (Max 50 Mo)
    if (slot.type === "video") {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Action impossible",
          description: "Veuillez sélectionner un fichier vidéo.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "Vidéo trop lourde", description: "La taille maximale est de 50 Mo.", variant: "destructive" });
        return;
      }

      const video = document.createElement("video");
      video.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      const isValid = await new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(video.duration <= 95);
        };
      });
      if (!isValid) {
        toast({ title: "Vidéo trop longue", description: "La durée maximale est de 1 mn 30.", variant: "destructive" });
        return;
      }
    }
    // VALIDATION PHOTO STRICTE (Max 10 Mo, Pas de GIF)
    else {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        toast({
          title: "Action impossible",
          description: "Veuillez choisir une photo valide (pas de vidéo ni de GIF).",
          variant: "destructive",
        });
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: "Pour garantir une qualité optimale, merci de choisir une photo de moins de 10 Mo.",
          variant: "destructive",
        });
        return;
      }
      if (!ALLOWED_PHOTO_FORMATS.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
        toast({
          title: "Format non supporté",
          description: "Merci d'utiliser les formats JPG, PNG ou HEIC.",
          variant: "destructive",
        });
        return;
      }
    }

    const preview = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s) => (s.id === activeSlotId ? { ...s, file, preview, uploaded: false } : s)));
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
    return (
      <div className="h-screen flex items-center justify-center text-xl font-medium animate-pulse">Chargement...</div>
    );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 min-h-0">
        <div className="flex-1 min-h-0 p-4 lg:p-10 flex flex-col gap-6 text-left py-0 my-0">
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
                onClick={() => !videoSlot?.preview && handleSlotClick(videoSlot?.id)}
              >
                {videoSlot?.preview ? (
                  <div className="relative w-full h-full" onClick={togglePlay}>
                    <video
                      ref={videoRef}
                      src={videoSlot.preview}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      playsInline
                      onEnded={() => setIsPlaying(false)}
                      onTimeUpdate={(e) => setVideoCurrent(e.currentTarget.currentTime)}
                      onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Play className="h-20 w-20 text-white drop-shadow-2xl" />
                      </div>
                    )}
                    {/* SEEK BAR */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/70 to-transparent z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 text-white text-lg font-medium">
                        <span className="tabular-nums w-12">{formatTime(videoCurrent)}</span>
                        <input
                          type="range"
                          min={0}
                          max={videoDuration || 0}
                          step={0.1}
                          value={videoCurrent}
                          onChange={handleSeek}
                          className="flex-1 h-2 rounded-full appearance-none bg-white/30 accent-[hsl(var(--gold))] cursor-pointer"
                        />
                        <span className="tabular-nums w-12 text-right">{formatTime(videoDuration)}</span>
                      </div>
                    </div>
                    {/* BOUTON SON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-md text-white rounded-2xl hover:bg-black/60 transition-all z-10"
                    >
                      {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(videoSlot.id);
                      }}
                      className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-full z-10"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
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
                        <p className="leading-tight text-2xl font-semibold">
                          Vous ne savez pas comment faire ? Optez pour un accompagnement personnalisé
                        </p>
                        <p className="opacity-80 underline text-primary font-medium text-2xl text-[#1a2232]">
                          Offre promotionnelle jusqu’au 30 Septembre (35€)
                        </p>
                      </div>
                      <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-0 my-0">
                <p className="text-muted-foreground mb-8 text-2xl">
                </p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold hover:bg-[hsl(var(--gold))]/20 transition-all text-xl bg-[#1a2232]"
                >
                  <Lightbulb className="h-5 w-5" /> Conseils vidéo
                </button>
              </div>
            </div>

            {/* PHOTOS */}
            <div className="min-h-0 flex flex-col gap-4">
              <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-4 h-full">
                {photoSlots.map((slot) => (
                  <div key={slot.id} className="min-h-0 h-full flex flex-col gap-2">
                    <div
                      className={cn(
                        "relative flex-1 min-h-0 h-full w-full aspect-square overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[1.8rem] transition-all duration-500",
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
                            className="absolute inset-0 w-full h-full object-cover"
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
                          <span className="font-bold text-[#1B2333] text-2xl">+ {slot.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* INFORMATION FORMAT ET TAILLE */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-slate-500 leading-snug text-xl">
                  Formats acceptés : <strong className="text-slate-700">JPG, PNG, HEIC</strong>. Taille maximale :{" "}
                  <strong className="text-slate-700">10 Mo</strong> par photo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 bg-white border-t border-[#E5E0D8] px-6 lg:px-20 text-left shadow-[0_-10px_40px_rgba(0,0,0,0.02)] py-0">
        <div className="max-w-5xl mx-auto space-y-6">
          <div
            className={cn(
              "flex items-center gap-5 p-6 rounded-3xl border transition-all cursor-pointer py-0 my-0",
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
            <p className="font-medium text-[#1B2333] select-none text-2xl">
              Je certifie que mes photos ont été prises il y a{" "}
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
                {uploading ? "Envoi..." : "Valider mon profil"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STUDIO EXPERT */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[92vh] border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[24px] bg-white p-0 z-[9999] overflow-hidden gap-0">
          <div className="h-2 w-full bg-[hsl(var(--gold))]" />

          <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[hsl(var(--cream))] flex items-center justify-center border-2 border-[hsl(var(--gold))]/40 shrink-0">
                <Video className="h-7 w-7 text-[#1B2333]" />
              </div>
              <DialogTitle className="tracking-tight font-heading font-bold text-[#1B2333] leading-tight text-3xl sm:text-4xl">
                Votre voix, votre regard, votre présence
              </DialogTitle>
              <p className="text-[#1B2333]/80 leading-snug text-2xl">
                Pour vous accompagner, Kalimera vous propose une aide personnalisée.
              </p>
            </div>

            <div className="bg-[#1B2333]/5 rounded-2xl p-4 sm:p-5 border border-[#1B2333]/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-[hsl(var(--gold))] rounded-full p-2 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#1B2333] leading-tight text-2xl">Accompagnement</p>
                  <p className="text-[#1B2333]/70 leading-snug mt-1 text-2xl">
                    Un expert vous guide pour vos photos et vidéo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[hsl(var(--gold))] rounded-full p-2 shrink-0">
                  <MonitorOff className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#1B2333] leading-tight text-2xl">Confidentialité</p>
                  <p className="text-[#1B2333]/70 leading-snug mt-1 text-2xl">
                    Nous enregistrons la vidéo avec vous. Aucun accès à votre ordinateur.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="inline-flex items-baseline gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                <span className="text-[#1B2333] font-bold text-2xl">35 €</span>
                <span className="text-[#1B2333]/60 text-2xl">puis 70 € au 01/10/2026</span>
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleStudioPayment}
                disabled={isProcessingPayment}
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 h-16 w-full rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 text-2xl"
              >
                {isProcessingPayment ? <Loader2 className="animate-spin h-6 w-6" /> : <Check className="h-6 w-6" />}
                Réserver ma séance (35€)
              </Button>
              <button
                onClick={() => setShowStudioModal(false)}
                className="h-14 w-full rounded-xl border border-[#1B2333]/15 text-[#1B2333] hover:bg-gray-50 font-medium transition-colors text-2xl"
              >
                Essayer seul(e) d'abord
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TUTORIAL MODAL */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-5xl p-0 h-auto max-h-[90vh] overflow-hidden rounded-[3rem] border border-[#E5E0D8] shadow-2xl bg-white z-[9999] outline-none">
          <button
            onClick={() => setShowVideoTutorial(false)}
            className="absolute right-6 top-6 md:right-8 md:top-8 z-[10000] p-3 rounded-full bg-white/90 border border-[#E5E0D8] text-[#1B2333] hover:bg-white transition-all shadow-md group shrink-0"
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-hidden">
            <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCF9F5] rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none" />

              <header className="relative z-10 px-8 lg:px-10 pt-8 lg:pt-10 pb-4 shrink-0">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.05)] mb-3">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] text-xl">
                    Guide Privé
                  </span>
                </div>
                <DialogTitle className="font-heading text-4xl md:text-5xl text-[#1B2333] leading-[1.1]">
                  L'art de se <span className="italic font-serif text-[hsl(var(--gold))]">présenter</span>
                </DialogTitle>
              </header>

              <div className="relative z-10 flex-1 overflow-y-auto px-8 lg:px-10 py-2">
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: User, title: "L'essentiel, c'est vous", desc: "Votre visage, votre voix, votre expression." },
                    { icon: Sun, title: "La Lumière", desc: "Arrière-plan neutre, environnement calme, lumière vers vous. Ne soyez pas à contre-jour." },
                    { icon: Smartphone, title: "Le Cadrage", desc: "Pour une meilleure visualisation, choisissez l'orientation horizontale de votre mobile." },
                    { icon: Eye, title: "Le Regard", desc: "Regardez votre interlocuteur, évitez les yeux baissés." },
                    { icon: Clock, title: "Le Tempo", desc: "Prenez votre temps : avec l'émotion, on a tendance à s'emballer." },
                    { icon: Mic, title: "Le Naturel", desc: "Soyez naturel, vivant, changez de rythme. Surtout, ne lisez pas un texte." },
                    { icon: MessageCircle, title: "Évitez les banalités", desc: '"Je recherche l\'amour, le compagnon fidèle…" — allez plus loin.' },
                    { icon: Heart, title: "Racontez-vous", desc: "Une anecdote, un projet, une activité qui vous tient à cœur. Imaginez un dialogue, la personne en face de vous." },
                    { icon: RotateCcw, title: "Recommencez", desc: "N'hésitez pas à refaire votre prise autant de fois qu'il le faut." },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-3 rounded-2xl border border-[#E5E0D8]/60 bg-white/60">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#FCF9F5] border border-[#E5E0D8]">
                        <item.icon className="h-6 w-6 text-[hsl(var(--gold))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1B2333] leading-tight text-2xl">{item.title}</h4>
                        <p className="text-[#1B2333]/70 leading-snug mt-0.5 text-xl">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 flex flex-col gap-3 px-8 lg:px-10 py-5 border-t border-[#E5E0D8] bg-white shrink-0">
                <Button
                  onClick={() => setShowVideoTutorial(false)}
                  className="h-16 w-full rounded-2xl bg-[#1B2333] text-white font-bold shadow-md hover:bg-[#1B2333]/90 text-xl"
                >
                  J'ai compris, je commence seul(e)
                </Button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVideoTutorial(false);
                    setShowStudioModal(true);
                  }}
                  className="w-full flex items-center gap-4 p-4 border-[1.5px] border-[hsl(var(--gold))] rounded-2xl bg-white group/btn transition-all hover:bg-[hsl(var(--gold)/0.03)] text-left shrink-0 min-h-[64px]"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-[hsl(var(--gold))] animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="font-bold text-[hsl(var(--gold))] text-xl leading-snug whitespace-normal">
                      Accompagnement personnalisé
                    </p>
                    <p className="text-[hsl(var(--gold))] opacity-80 text-primary font-semibold text-xl">Nous vous filmons en visio (35€)</p>
                  </div>
                  <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="hidden lg:block w-[360px] shrink-0 relative">
              <img
                decoding="async"
                src={coupleGarden}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Couple"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2333]/30 via-transparent to-transparent" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md p-10 text-center rounded-[2.5rem] z-[9999] outline-none">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="h-10 w-10 text-emerald-600" />
            </div>
            <DialogTitle className="font-heading text-3xl text-[#1B2333] font-bold">C'est enregistré !</DialogTitle>
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

      {/* INPUT TECHNIQUE : KEY POUR FORCER LE RAFRAICHISSEMENT DU TYPE */}
      <input
        key={activeSlotId}
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/jpeg,image/png,image/webp,image/heic"}
        onChange={handleFileChange}
      />
    </div>
  );
}
