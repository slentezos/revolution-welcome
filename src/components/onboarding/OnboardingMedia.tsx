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

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const ALLOWED_PHOTO_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export default function OnboardingMedia({ profileId, onComplete }: OnboardingMediaProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(getInitialSlots());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExistingMedia = async () => {
      try {
        const { data: existingMedia } = await supabase
          .from("profile_media")
          .select("*")
          .eq("profile_id", profileId)
          .order("display_order");
        if (existingMedia && existingMedia.length > 0) {
          setSlots((prev) => {
            const updated = [...prev];
            existingMedia.forEach((media) => {
              let idx = -1;
              if (media.media_type === "video") idx = 0;
              else if (media.media_type === "portrait") idx = 1;
              else if (media.media_type === "silhouette") idx = 2;
              else if (media.media_type === "misc") {
                if (!updated[3].preview) idx = 3;
                else if (!updated[4].preview) idx = 4;
              }
              if (idx >= 0) {
                const {
                  data: { publicUrl },
                } = supabase.storage.from("profile-media").getPublicUrl(media.file_path);
                updated[idx] = { ...updated[idx], preview: publicUrl, uploaded: true };
              }
            });
            return updated;
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadExistingMedia();
  }, [profileId]);

  useEffect(() => {
    if (activeSlotId && fileInputRef.current) fileInputRef.current.click();
  }, [activeSlotId]);

  const handleSlotClick = (id: string) => {
    setActiveSlotId(null);
    setTimeout(() => setActiveSlotId(id), 10);
  };

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
    if (!file || !activeSlotId) {
      setActiveSlotId(null);
      return;
    }
    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    if (file.type === "image/gif") {
      toast({ title: "Format refusé", description: "Les GIFs ne sont pas autorisés.", variant: "destructive" });
      setActiveSlotId(null);
      return;
    }

    if (slot.type === "video") {
      if (!file.type.startsWith("video/")) {
        toast({ title: "Erreur", description: "Veuillez choisir une vidéo.", variant: "destructive" });
        setActiveSlotId(null);
        return;
      }
    } else {
      if (file.size > MAX_PHOTO_SIZE) {
        toast({ title: "Fichier trop lourd", description: "Maximum 10 Mo par photo.", variant: "destructive" });
        setActiveSlotId(null);
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
      toast({ title: "Action requise", description: "Certifiez l'ancienneté de vos photos.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
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
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const photoSlots = slots.slice(1, 5);

  if (loading)
    return <div className="h-screen flex items-center justify-center animate-pulse text-[#1B2333]">Chargement...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white overflow-hidden">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 p-6 lg:p-10 min-h-0">
        {/* SECTION VIDÉO */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="font-heading text-4xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            <div className="px-5 py-2 bg-[#FCF9F5] rounded-xl border border-[#E5E0D8]">
              <span className="text-[#1B2333] font-bold text-2xl">{slots.filter((s) => s.preview).length}</span>
              <span className="text-gray-400 text-2xl"> / 5</span>
            </div>
          </div>

          <div
            className="relative flex-1 rounded-[2.5rem] overflow-hidden border-2 border-[#E5E0D8] bg-[#FCF9F5] hover:border-[hsl(var(--gold))] transition-all cursor-pointer group shadow-sm"
            onClick={() => !slots[0].preview && handleSlotClick("video")}
          >
            {slots[0].preview ? (
              <div className="relative w-full h-full" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  src={slots[0].preview}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl scale-110">
                      <Play className="h-12 w-12 text-white fill-white" />
                    </div>
                  </div>
                )}
                {/* SON FONCTIONNEL ICI */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-8 left-8 p-4 bg-black/50 backdrop-blur-md text-white rounded-2xl hover:bg-black/70 transition-all z-10 shadow-lg"
                >
                  {isMuted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlots((prev) =>
                      prev.map((s) => (s.id === "video" ? { ...s, preview: undefined, file: undefined } : s)),
                    );
                    setIsPlaying(false);
                  }}
                  className="absolute top-8 right-8 p-4 bg-red-500/90 text-white rounded-full z-10 shadow-xl hover:bg-red-600 transition-all"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center shadow-sm">
                  <Video className="h-10 w-10 text-[hsl(var(--gold))]" />
                </div>
                <span className="text-3xl font-bold text-[#1B2333]">+ Ajouter ma vidéo</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStudioModal(true);
                  }}
                  className="flex items-center gap-4 px-8 py-5 bg-white border border-[hsl(var(--gold))/0.4] text-[hsl(var(--gold))] rounded-2xl shadow-sm hover:shadow-lg transition-all"
                >
                  <Headphones className="h-7 w-7 animate-pulse" />
                  <div className="text-left">
                    <p className="font-bold text-xl leading-tight">Besoin d'aide ?</p>
                    <p className="opacity-80 underline text-lg">Séance guidée : 35€</p>
                  </div>
                  <ArrowRight className="h-6 w-6 ml-2" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-4 shrink-0">
            <p className="text-slate-500 text-xl italic font-medium">Votre sourire est votre plus belle signature.</p>
            <button
              onClick={() => setShowVideoTutorial(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold text-xl hover:bg-[hsl(var(--gold))]/20 transition-all"
            >
              <Lightbulb className="h-5 w-5" /> Conseils vidéo
            </button>
          </div>
        </div>

        {/* SECTION PHOTOS - GRILLE FIXE SANS OVERLAP */}
        <div className="flex flex-col gap-10 h-full overflow-hidden pb-10">
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-6 min-h-0">
            {photoSlots.map((slot) => (
              <div
                key={slot.id}
                className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-[#E5E0D8] bg-[#FCF9F5] hover:border-[hsl(var(--gold))] transition-all cursor-pointer group shadow-sm"
                onClick={() => handleSlotClick(slot.id)}
              >
                {slot.preview ? (
                  <>
                    <img src={slot.preview} alt={slot.label} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlots((prev) =>
                          prev.map((s) => (s.id === slot.id ? { ...s, preview: undefined, file: undefined } : s)),
                        );
                      }}
                      className="absolute top-4 right-4 p-2.5 bg-red-500/90 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center mb-3 shadow-sm">
                      <Camera className="h-7 w-7 text-slate-400" />
                    </div>
                    <span className="text-xl font-bold text-[#1B2333]">+ {slot.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#FCF9F5] border border-[#E5E0D8] p-6 rounded-3xl flex items-start gap-4 shadow-sm shrink-0">
            <Info className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-1" />
            <div className="text-slate-600 text-lg leading-snug font-medium">
              <p>
                Formats acceptés : <strong className="text-[#1B2333]">JPG, PNG, HEIC</strong> (pas de GIF).
              </p>
              <p>
                Taille maximale : <strong className="text-[#1B2333]">10 Mo</strong> par photo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t border-[#E5E0D8] py-8 px-10 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div
            className={cn(
              "flex items-center gap-6 p-6 rounded-3xl border-2 transition-all cursor-pointer w-full md:w-auto shadow-sm",
              confirmedAge ? "bg-emerald-50 border-emerald-300" : "bg-white border-[#E5E0D8]",
            )}
            onClick={() => setConfirmedAge(!confirmedAge)}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all",
                confirmedAge ? "bg-emerald-600 border-emerald-600 shadow-md" : "bg-white border-slate-300",
              )}
            >
              {confirmedAge && <Check className="text-white h-6 w-6 stroke-[3px]" />}
            </div>
            <p className="text-xl font-bold text-[#1B2333]">
              Je certifie sur l'honneur que mes photos ont{" "}
              <span className="underline text-[hsl(var(--gold))]">moins de 18 mois</span>.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleSave}
              className="h-16 px-10 rounded-2xl border-[#E5E0D8] font-bold text-xl hover:bg-slate-50 text-[#1B2333]"
            >
              Enregistrer
            </Button>
            <Button
              onClick={handleSave}
              disabled={!confirmedAge || uploading}
              className={cn(
                "h-16 px-12 rounded-2xl font-bold text-xl shadow-xl transition-all flex-1 md:flex-none",
                confirmedAge
                  ? "bg-[#1B2333] text-white hover:bg-[#1B2333]/90 shadow-[#1B2333]/20"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              {uploading ? <Loader2 className="animate-spin h-6 w-6" /> : "Valider mon profil"}
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

      {/* MODALE CONSEILS VIDÉO RÉACTIVÉE */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[3rem] border-0 shadow-3xl bg-white">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 p-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] font-bold tracking-widest text-sm uppercase">
                <Sparkles className="h-4 w-4" /> Guide Privé
              </div>
              <DialogTitle className="text-4xl font-bold text-[#1B2333] leading-tight">
                L'art de se <span className="italic text-[hsl(var(--gold))]">présenter</span>
              </DialogTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Eye className="text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">Le Regard</p>
                    <p className="text-slate-500">Fixez l'objectif avec naturel.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Sun className="text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">La Lumière</p>
                    <p className="text-slate-500">Face à une fenêtre, c'est l'idéal.</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowVideoTutorial(false)}
                className="h-16 w-full bg-[#1B2333] text-white text-xl font-bold rounded-2xl shadow-xl"
              >
                J'ai compris, je commence seul(e)
              </Button>
            </div>
            <div className="hidden lg:block w-[320px] shrink-0">
              <img src={coupleGarden} className="h-full object-cover" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODALE STUDIO EXPERT RÉACTIVÉE */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="sm:max-w-2xl rounded-[2rem] p-10 text-center">
          <DialogTitle className="text-3xl font-bold text-[#1B2333] mb-4">Accompagnement VIP</DialogTitle>
          <p className="text-xl text-slate-600 mb-8">
            Un expert Kalimera vous guide en visioconférence pour réaliser vos photos et vidéo sous votre meilleur jour.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <ShieldCheck className="text-[hsl(var(--gold))] mb-2" />
              <p className="font-bold">Expertise</p>
              <p className="text-sm text-slate-500">Pose, cadrage et lumière.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <MonitorOff className="text-[hsl(var(--gold))] mb-2" />
              <p className="font-bold">Privé</p>
              <p className="text-sm text-slate-500">Séance 100% confidentielle.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setIsProcessingPayment(true);
                setTimeout(() => {
                  setIsProcessingPayment(false);
                  setShowStudioModal(false);
                  toast({ title: "Réservation confirmée", description: "Nous vous rappelons sous 24h." });
                }, 1500);
              }}
              className="h-16 bg-[#1B2333] text-white text-xl font-bold rounded-xl shadow-lg"
            >
              {isProcessingPayment ? <Loader2 className="animate-spin" /> : "Réserver ma séance (35€)"}
            </Button>
            <button
              onClick={() => setShowStudioModal(false)}
              className="text-slate-400 font-medium hover:text-[#1B2333] transition-colors py-2"
            >
              Essayer seul(e) d'abord
            </button>
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
