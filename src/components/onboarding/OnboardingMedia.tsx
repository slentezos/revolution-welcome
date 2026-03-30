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
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    fileInputRef.current?.click();
  };

  const handleRemoveSlot = (slotId: string) => {
    const initial = getInitialSlots().find((s) => s.id === slotId);
    if (initial) {
      setSlots((prev) => prev.map((s) => (s.id === slotId ? initial : s)));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;
    const slot = slots.find((s) => s.id === activeSlotId);
    if (!slot) return;

    if (slot.type === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      const isValid = await new Promise<boolean>((resolve) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(video.duration <= 90);
        };
      });
      if (!isValid) {
        toast({ title: "Vidéo trop longue", description: "Max 1 mn 30.", variant: "destructive" });
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
      <div className="h-full flex items-center justify-center text-xl font-medium animate-pulse">Chargement...</div>
    );

  return (
    // ICI ON TUE LE SCROLL : absolute inset-0 ou h-full absolu avec overflow-hidden global
    <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
      {/* HEADER FIXE */}
      <div className="flex-shrink-0 p-4 lg:p-6 lg:pb-2">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
          <div className="px-4 py-1.5 bg-secondary/50 rounded-xl border border-[#E5E0D8]">
            <span className="text-[#1B2333] font-bold text-xl">{uploadedCount}</span>
            <span className="text-gray-500 text-xl"> / 5</span>
          </div>
        </div>
      </div>

      {/* ZONE FLUIDE MÉDIAS (S'écrase automatiquement sans déborder) */}
      <div className="flex-1 min-h-0 px-4 lg:px-6 pb-2">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-6">
          {/* COLONNE VIDÉO */}
          <div className="flex flex-col h-full gap-3">
            <div
              className="flex-1 min-h-0 relative overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-[2rem] bg-[#FCF9F5] hover:border-[hsl(var(--gold))] transition-all duration-300"
              onClick={() => !videoSlot?.preview && handleSlotClick(videoSlot?.id)}
            >
              {videoSlot?.preview ? (
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
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#E5E0D8] flex items-center justify-center mb-3">
                    <Video className="h-8 w-8 text-[hsl(var(--gold))]" />
                  </div>
                  <span className="text-xl text-[#1B2333] font-semibold mb-6">Ajouter ma vidéo</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStudioModal(true);
                    }}
                    className="flex items-center gap-3 px-5 py-3 bg-white border border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] rounded-2xl shadow-sm hover:shadow-md transition-all group"
                  >
                    <Headphones className="h-5 w-5 animate-pulse" />
                    <div className="text-left">
                      <p className="font-bold text-sm leading-tight">Intimidé(e) ?</p>
                      <p className="text-xs opacity-80">On vous filme en visio (40€)</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center justify-between px-2">
              <p className="text-[#1B2333]/60 text-sm italic hidden lg:block">
                Votre sourire est votre plus belle signature.
              </p>
              <button
                onClick={() => setShowVideoTutorial(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold text-sm hover:bg-[hsl(var(--gold))]/20 transition-all"
              >
                <Lightbulb className="h-4 w-4" /> Conseils vidéo
              </button>
            </div>
          </div>

          {/* COLONNE PHOTOS (Grille compacte) */}
          <div className="h-full grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4">
            {photoSlots.map((slot) => (
              <div key={slot.id} className="min-h-0 flex flex-col">
                <div
                  className={cn(
                    "flex-1 min-h-0 relative overflow-hidden cursor-pointer group border border-[#E5E0D8] rounded-2xl transition-all duration-300",
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
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 border border-[#E5E0D8]">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-bold text-[#1B2333]">+ {slot.label}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER FIXE : Ne participe pas au scroll */}
      <div className="flex-shrink-0 bg-white border-t border-[#E5E0D8] p-4 lg:p-5 text-left z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer w-full sm:w-auto",
              confirmedAge ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-[#E5E0D8]",
            )}
            onClick={() => setConfirmedAge(!confirmedAge)}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-md border-2 flex items-center justify-center flex-shrink-0",
                confirmedAge ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300",
              )}
            >
              {confirmedAge && <Check className="text-white h-4 w-4" />}
            </div>
            <p className="text-sm lg:text-base font-medium text-[#1B2333]">
              Je certifie sur l'honneur que mes photos ont été prises il y a{" "}
              <span className="font-bold underline text-[hsl(var(--gold))]">moins de 18 mois</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleSave}
              className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-[#E5E0D8] font-bold text-base hidden md:flex"
            >
              Enregistrer
            </Button>
            <Button
              onClick={handleSave}
              disabled={!confirmedAge || uploading}
              className={cn(
                "flex-1 sm:flex-none h-12 px-8 rounded-xl font-bold text-base shadow-lg",
                confirmedAge ? "bg-[#1B2333] text-white" : "bg-gray-100 text-gray-400",
              )}
            >
              {uploading ? "Envoi..." : "Valider mon profil"}
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL STUDIO 40€ */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="max-w-xl p-10 rounded-[2.5rem] border-0 shadow-3xl bg-white z-[9999] outline-none">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))/0.2]">
              <Headphones className="h-10 w-10 text-[hsl(var(--gold))]" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-heading text-3xl text-[#1B2333] font-bold leading-tight text-center">
                Laissons parler votre charme.
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FCF9F5] border border-[#E5E0D8]">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold))] shrink-0" />
                <p className="text-lg text-[#1B2333]">
                  Coaching de <span className="font-bold">15 min en visio</span> pour vous guider.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FCF9F5] border border-[#E5E0D8]">
                <Check className="h-6 w-6 text-[hsl(var(--gold))] shrink-0" />
                <p className="text-lg text-[#1B2333]">
                  Montage professionnel inclus pour un <span className="font-bold">profil parfait</span>.
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Button
                disabled={isProcessingPayment}
                onClick={handleStudioPayment}
                className="h-14 w-full rounded-xl bg-[#1B2333] text-white text-lg font-bold shadow-xl flex items-center justify-center gap-3"
              >
                {isProcessingPayment ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Payer et réserver (40€)
              </Button>
              <p className="text-xs text-muted-foreground">Paiement 100% sécurisé via Stripe</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TUTORIAL MODAL - COMPACT SANS SCROLL */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-4xl p-0 h-[75vh] overflow-hidden rounded-[2.5rem] border border-[#E5E0D8] shadow-2xl bg-white z-[9999] outline-none">
          <button
            onClick={() => setShowVideoTutorial(false)}
            className="absolute right-6 top-6 z-[10000] p-2.5 rounded-full bg-white/90 border border-[#E5E0D8] text-[#1B2333] hover:bg-white transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 p-8 lg:p-10 bg-white relative flex flex-col justify-center h-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FCF9F5] rounded-full -mr-24 -mt-24 opacity-50" />

              <div className="relative z-10 flex flex-col gap-6 h-full justify-between">
                <header>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.05)] mb-3">
                    <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
                    <span className="font-bold tracking-widest uppercase text-[hsl(var(--gold))] text-xs">
                      Guide Privé
                    </span>
                  </div>
                  <DialogTitle className="font-heading text-3xl lg:text-4xl text-[#1B2333] leading-tight">
                    L'art de se <br /> <span className="italic font-serif text-[hsl(var(--gold))]">présenter</span>
                  </DialogTitle>
                </header>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {[
                    { icon: Eye, title: "Le Regard", desc: "Plongez vos yeux dans l'objectif." },
                    { icon: Sun, title: "La Lumière", desc: "Face à une fenêtre, c'est l'idéal." },
                    { icon: Heart, title: "L'Émotion", desc: "Parlez de vos vraies passions." },
                    { icon: Volume2, title: "La Sérénité", desc: "Le silence pour être écouté(e)." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FCF9F5] border border-[#E5E0D8]">
                        <item.icon className="h-4 w-4 text-[#1B2333]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B2333] text-base">{item.title}</h4>
                        <p className="text-[#1B2333]/60 leading-tight text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 max-w-sm mt-auto">
                  <Button
                    onClick={() => setShowVideoTutorial(false)}
                    className="h-12 w-full rounded-xl bg-[#1B2333] text-white text-base font-bold shadow-md"
                  >
                    J'ai compris, je commence
                  </Button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVideoTutorial(false);
                      setShowStudioModal(true);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-3 border border-[hsl(var(--gold))] rounded-xl bg-white transition-all hover:bg-[hsl(var(--gold)/0.03)]"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center">
                        <Headphones className="h-4 w-4 text-[hsl(var(--gold))] animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-[hsl(var(--gold))] text-sm leading-tight">Intimidé(e) ?</p>
                        <p className="text-[hsl(var(--gold))] opacity-80 text-xs">Nous vous filmons en visio (49€)</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--gold))]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-[350px] relative h-full">
              <img src={coupleGarden} className="absolute inset-0 w-full h-full object-cover" alt="Couple Kalimera" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2333]/30 via-transparent to-transparent" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-sm p-8 text-center rounded-[2rem] z-[9999] outline-none">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="font-heading text-2xl text-[#1B2333] font-bold">C'est enregistré !</DialogTitle>
            <Button
              onClick={() => {
                setShowSaveDialog(false);
                onComplete();
              }}
              className="w-full h-14 rounded-xl bg-[#1B2333] text-white text-lg font-bold shadow-lg"
            >
              Continuer
            </Button>
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
