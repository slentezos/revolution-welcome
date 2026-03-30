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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import coupleGarden from "@/assets/couple-garden.jpg";
import placeholderVideoBg from "@/assets/placeholder-video-bg.jpg";
import placeholderPhotoBg from "@/assets/placeholder-photo-bg.jpg";

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

export default function OnboardingMedia({ profileId, onComplete }: OnboardingMediaProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(getInitialSlots());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const [showStudioModal, setShowStudioModal] = useState(false); // État pour l'offre Studio
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
            for (const media of existingMedia) {
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
            }
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

  const handleSlotClick = (slotId: string) => {
    setActiveSlotId(slotId);
    fileInputRef.current?.click();
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...getInitialSlots().find((i) => i.id === slotId)! } : s)));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;

    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    const isVideo = slot.type === "video";
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];

    if (isVideo && !validVideoTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez choisir une vidéo (MP4, MOV, WebM)",
        variant: "destructive",
      });
      return;
    }
    if (!isVideo && !validImageTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez choisir une image (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      const valid = await new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          if (video.duration > 90) {
            toast({
              title: "Vidéo trop longue",
              description: "La durée maximale est de 1 minute 30 secondes",
              variant: "destructive",
            });
            resolve(false);
          } else resolve(true);
        };
      });
      if (!valid) return;
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
        description: "Veuillez certifier que vos photos ont moins de 18 mois.",
        variant: "destructive",
      });
      return;
    }

    const hasFiles = slots.some((s) => s.file && !s.uploaded);
    if (!hasFiles) {
      setShowSaveDialog(true);
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
          const { error: uploadError } = await supabase.storage.from("profile-media").upload(fileName, slot.file);
          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase.from("profile_media").insert({
            user_id: session.user.id,
            profile_id: profileId,
            media_type: slot.type,
            file_path: fileName,
            display_order: slots.indexOf(slot),
          });
          if (dbError) throw dbError;
        }
      }
      setShowSaveDialog(true);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadedCount = slots.filter((s) => s.file || s.uploaded).length;
  const videoSlot = slots[0];
  const photoSlots = slots.slice(1, 5);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-xl font-medium">Chargement de vos médias...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px-64px)] lg:h-[calc(100vh-80px-64px)] flex flex-col overflow-hidden bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 min-h-0">
        <div className="flex-1 min-h-0 p-4 lg:p-6 xl:p-8 flex flex-col gap-4 lg:gap-5 text-left">
          <div className="flex items-center justify-between flex-shrink-0">
            <h2 className="font-heading text-3xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl">
              <span className="text-[#1B2333] font-bold text-xl">{uploadedCount}</span>
              <span className="text-gray-500 text-xl">/ 5</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 lg:gap-6">
            <div className="min-h-0 flex flex-col gap-3">
              <div
                className="relative flex-1 min-h-0 overflow-hidden cursor-pointer group border-2 border-dashed border-[#E5E0D8] rounded-[2rem] hover:border-[hsl(var(--gold))] transition-all duration-300"
                onClick={() => !videoSlot.preview && handleSlotClick(videoSlot.id)}
              >
                {videoSlot.preview ? (
                  <>
                    <video src={videoSlot.preview} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white drop-shadow-xl" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(videoSlot.id);
                      }}
                      className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#FCF9F5]">
                    <img src={placeholderVideoBg} alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Video className="h-10 w-10 text-[hsl(var(--gold))]" />
                        </div>
                        <span className="text-xl text-foreground font-semibold">+ Ajouter une vidéo</span>
                      </div>

                      {/* SERVICE STUDIO EXPRESS INTEGRATION */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStudioModal(true);
                        }}
                        className="flex items-center gap-3 px-6 py-4 bg-white border border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] rounded-2xl shadow-sm hover:shadow-md transition-all group/studio"
                      >
                        <Headphones className="h-6 w-6 animate-pulse" />
                        <div className="text-left">
                          <p className="font-bold leading-tight text-xl">Intimidé(e) ?</p>
                          <p className="opacity-80 text-xl">Nous vous filmons en visio (49€)</p>
                        </div>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover/studio:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between flex-shrink-0 px-2">
                <p className="text-foreground font-semibold text-xl">Vidéo de présentation</p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full hover:bg-[hsl(var(--gold))]/20 transition-all font-bold text-xl"
                >
                  <Lightbulb className="h-5 w-5" />
                  Conseils vidéo
                </button>
              </div>
            </div>

            <div className="min-h-0 grid grid-cols-2 gap-4 lg:gap-5">
              {photoSlots.map((slot) => (
                <div key={slot.id} className="min-h-0 flex flex-col gap-2">
                  <div
                    className={cn(
                      "relative flex-1 min-h-0 overflow-hidden cursor-pointer group border-2 border-dashed rounded-[1.5rem] transition-all duration-300",
                      slot.preview
                        ? "border-transparent"
                        : "border-[#E5E0D8] bg-[#FCF9F5] hover:border-[hsl(var(--gold))]",
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
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-base font-bold">+ Photo*</span>
                      </div>
                    )}
                  </div>
                  <p className="text-foreground font-medium text-base px-1 truncate">
                    {slot.label} <span className="text-muted-foreground font-normal text-sm">— {slot.hint}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-100 z-50 py-6 px-6 lg:px-20 text-left">
        <div className="max-w-5xl mx-auto space-y-6">
          <div
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer",
              confirmedAge ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/30 border-red-100",
            )}
            onClick={() => setConfirmedAge(!confirmedAge)}
          >
            <Checkbox
              id="age-confirm"
              checked={confirmedAge}
              onCheckedChange={(val) => setConfirmedAge(val as boolean)}
              className="h-7 w-7 rounded-lg border-2 border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <label
              htmlFor="age-confirm"
              className="text-lg md:text-xl font-medium text-[#1B2333] cursor-pointer select-none"
            >
              Je certifie sur l'honneur que mes photos ont été prises il y a{" "}
              <span className="font-bold underline">moins de 18 mois</span>.
            </label>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-500 hidden md:block">{uploadedCount} / 5 médias ajoutés</p>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-gray-200 text-[#1B2333] hover:bg-gray-50 font-bold text-lg"
              >
                Enregistrer
              </Button>
              <Button
                onClick={handleSave}
                disabled={uploading || !confirmedAge}
                className={cn(
                  "flex-1 md:flex-none h-14 px-10 rounded-2xl font-bold text-lg shadow-lg transition-all",
                  confirmedAge
                    ? "bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none",
                )}
              >
                {uploading ? "Téléchargement..." : "Valider et continuer"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STUDIO EXPRESS - 2026 LUXURY STYLE */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-3xl bg-white">
          <div className="p-10 lg:p-14 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--gold))]/10 mb-8">
              <Headphones className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <DialogHeader className="mb-8">
              <DialogTitle className="font-heading text-3xl lg:text-4xl text-[#1B2333] font-bold leading-tight">
                Laissons parler votre charme, on s'occupe du reste.
              </DialogTitle>
              <DialogDescription className="text-xl text-muted-foreground mt-4">
                La technique ne doit pas être un frein à votre bonheur.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 text-left mb-10">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-1" />
                <p className="text-lg text-[#1B2333]">
                  Un membre de notre équipe vous appelle en <span className="font-bold">visioconférence (15 min)</span>.
                </p>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30">
                <Check className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-1" />
                <p className="text-lg text-[#1B2333]">
                  Il vous guide pour le cadrage, la lumière et{" "}
                  <span className="font-bold">enregistre votre plus beau profil</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button className="h-16 w-full rounded-2xl bg-[#1B2333] text-white text-xl font-bold shadow-xl hover:bg-[#1B2333]/90 transition-all">
                Réserver ma session (49€)
              </Button>
              <button
                onClick={() => setShowStudioModal(false)}
                className="text-muted-foreground hover:text-[#1B2333] font-medium text-lg transition-colors py-2"
              >
                Je vais essayer seul(e) d'abord
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TUTORIAL MODAL */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-3xl bg-white">
          <div className="flex flex-col lg:flex-row text-left">
            <div className="flex-1 p-10 lg:p-14 bg-white">
              <DialogHeader className="mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 mb-4">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <DialogTitle className="font-heading text-3xl lg:text-5xl text-[#1B2333] leading-tight font-bold">
                  Réussir votre vidéo
                </DialogTitle>
                <DialogDescription className="text-xl italic text-[hsl(var(--gold))] font-medium mt-2">
                  « Soyez simplement vous-même, c'est ce qui charme. »
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary/50 p-2 rounded-lg">
                    <Eye className="h-6 w-6 text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2333] text-lg">Regard sincère</p>
                    <p className="text-[#1B2333]/70 text-lg leading-snug">
                      Regardez l'objectif, comme si c'était lui ou elle.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary/50 p-2 rounded-lg">
                    <Sun className="h-6 w-6 text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2333] text-lg">Lumière douce</p>
                    <p className="text-[#1B2333]/70 text-lg leading-snug">Face à une fenêtre pour un teint éclatant.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary/50 p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2333] text-lg">Authenticité</p>
                    <p className="text-[#1B2333]/70 text-lg leading-snug">
                      Parlez d'une passion ou d'un petit bonheur.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-secondary/50 p-2 rounded-lg">
                    <Volume2 className="h-6 w-6 text-[#1B2333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2333] text-lg">Calme absolu</p>
                    <p className="text-[#1B2333]/70 text-lg leading-snug">
                      Évitez les bruits de fond pour bien vous entendre.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowVideoTutorial(false)}
                className="mt-12 w-full md:w-auto h-16 px-12 rounded-2xl bg-[#1B2333] text-white text-xl font-bold shadow-lg"
              >
                C'est compris
              </Button>
            </div>
            <div className="hidden lg:block w-[340px] relative">
              <img src={coupleGarden} alt="Couple Kalimera" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2333]/20 to-transparent" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
    </div>
  );
}
