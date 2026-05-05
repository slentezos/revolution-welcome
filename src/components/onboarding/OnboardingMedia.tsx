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
  MonitorOff,
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
      <div className="h-screen flex items-center justify-center text-xl font-medium animate-pulse">Chargement...</div>
    );

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
                onClick={() => !videoSlot?.preview && handleSlotClick(videoSlot?.id)}
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
                        handleRemoveSlot(videoSlot.id);
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
                        <p className="font-bold text-xl leading-tight">
                          {" "}
                          Vous ne savez pas comment faire ? Optez pour un accompagnement personnalisé{" "}
                        </p>
                        <p className="opacity-80 underline text-xl">Offre promotionnelle jusqu’au 30 Septembre (35€)</p>
                      </div>
                      <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4">
                <p className="text-[#1B2333]/60 italic text-xl">Votre sourire est votre plus belle signature.</p>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] rounded-full font-bold hover:bg-[hsl(var(--gold))]/20 transition-all text-xl"
                >
                  <Lightbulb className="h-5 w-5" /> Conseils vidéo
                </button>
              </div>
            </div>

            {/* PHOTOS */}
            <div className="min-h-0 grid grid-cols-2 gap-4">
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
                {uploading ? "Envoi..." : "Valider mon profil"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STUDIO EXPERT (COMPACT 1 SCREEN, NO SCROLL) */}
      <Dialog open={showStudioModal} onOpenChange={setShowStudioModal}>
        <DialogContent className="max-w-3xl border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[24px] bg-white p-0 z-[9999] overflow-hidden">
          <div className="h-2 w-full bg-[hsl(var(--gold))]" />

          <div className="px-6 py-6 lg:px-8 space-y-5 flex flex-col justify-center h-full">
            <div className="flex justify-center shrink-0">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--cream))] flex items-center justify-center border-2 border-[hsl(var(--gold))/0.3]">
                <Video className="h-8 w-8 text-[#1B2333]" />
              </div>
            </div>

            <div className="text-center space-y-2 shrink-0">
              <DialogTitle className="font-heading text-2xl lg:text-3xl font-bold text-[#1B2333] leading-tight">
                Votre voix, votre regard, votre présence… tout commence par là.
              </DialogTitle>
              <p className="text-lg lg:text-xl text-gray-600 italic">
                « Quelques secondes suffisent pour créer un premier lien : une intonation, un sourire, une façon d’être.
                »
              </p>
            </div>

            <div className="text-lg text-gray-700 leading-snug shrink-0 text-center px-4">
              <p>Inutile de jouer un rôle — soyez simplement vous-même.</p>
              <p className="font-semibold text-[#1B2333] mt-2">
                Pour vous accompagner, Kalimera vous propose une aide personnalisée :
              </p>
            </div>

            {/* GRILLE CÔTE À CÔTE POUR GAGNER DE LA HAUTEUR */}
            <div className="bg-[#1B2333]/5 rounded-2xl p-5 border border-[#1B2333]/10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="bg-[hsl(var(--gold))] rounded-full p-1.5 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xl font-bold text-[#1B2333] leading-tight">Accompagnement</p>
                </div>
                <p className="text-gray-600 text-lg leading-snug">
                  Un expert vous guide pour vos photos et vidéo : conseils, réglages et mise en confiance.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="bg-[hsl(var(--gold))] rounded-full p-1.5 shrink-0">
                    <MonitorOff className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xl font-bold text-[#1B2333] leading-tight">Confidentialité</p>
                </div>
                <p className="text-gray-600 text-lg leading-snug">
                  Rendez-vous via Google Meet.{" "}
                  <span className="font-medium text-[#1B2333]">Aucun accès à votre ordinateur</span> n'est requis.
                </p>
              </div>
            </div>

            {/* FUSION PRIX + BOUTONS SUR LA MÊME LIGNE */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-center sm:text-left shrink-0">
                <div className="inline-block bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 mb-1">
                  <span className="text-[#1B2333] font-bold text-xl">Offre : 35 €</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">(puis 70€ au 01/10/2026)</p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                <Button
                  onClick={handleStudioPayment}
                  disabled={isProcessingPayment}
                  className="h-14 w-full sm:w-auto px-6 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-lg font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin h-5 w-5" /> : <Check className="h-5 w-5" />}
                  Réserver ma séance
                </Button>
                <button
                  onClick={() => setShowStudioModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-base font-medium transition-colors"
                >
                  Essayer seul(e) d'abord
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TUTORIAL MODAL (COMPACT) */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-5xl p-0 h-auto max-h-[90vh] overflow-hidden rounded-[3rem] border border-[#E5E0D8] shadow-2xl bg-white z-[9999] outline-none">
          <button
            onClick={() => setShowVideoTutorial(false)}
            className="absolute right-6 top-6 md:right-8 md:top-8 z-[10000] p-3 rounded-full bg-white/90 border border-[#E5E0D8] text-[#1B2333] hover:bg-white transition-all shadow-md group shrink-0"
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="flex-1 p-8 lg:p-10 bg-white relative flex flex-col justify-center gap-4 h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCF9F5] rounded-full -mr-32 -mt-32 opacity-50" />

              <div className="relative z-10 flex flex-col gap-4">
                <header className="shrink-0">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.05)] mb-3">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--gold))]" />
                    <span className="font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] text-sm">
                      Guide Privé
                    </span>
                  </div>
                  <DialogTitle className="font-heading text-3xl md:text-4xl text-[#1B2333] leading-[1.1]">
                    L'art de se <span className="italic font-serif text-[hsl(var(--gold))]">présenter</span>
                  </DialogTitle>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 shrink-0">
                  {[
                    { icon: Eye, title: "Le Regard", desc: "Plongez vos yeux dans l'objectif." },
                    { icon: Sun, title: "La Lumière", desc: "Face à une fenêtre, c'est l'idéal." },
                    { icon: Heart, title: "L'Émotion", desc: "Parlez de vos vraies passions." },
                    { icon: Volume2, title: "La Sérénité", desc: "Le silence pour être écouté(e)." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-[#FCF9F5] border border-[#E5E0D8]">
                        <item.icon className="h-6 w-6 text-[#1B2333]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1B2333] text-xl leading-tight">{item.title}</h4>
                        <p className="text-[#1B2333]/60 text-lg leading-snug truncate">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-4 shrink-0 max-w-lg">
                  <Button
                    onClick={() => setShowVideoTutorial(false)}
                    className="h-14 w-full rounded-2xl bg-[#1B2333] text-white font-bold shadow-md hover:bg-[#1B2333]/90 text-lg"
                  >
                    J'ai compris, je commence seul(e)
                  </Button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVideoTutorial(false);
                      setShowStudioModal(true);
                    }}
                    className="w-full flex items-center gap-4 p-3 border-[1.5px] border-[hsl(var(--gold))] rounded-2xl bg-white group/btn transition-all hover:bg-[hsl(var(--gold)/0.03)] text-left shrink-0"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--gold)/0.1)] flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-[hsl(var(--gold))] animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="font-bold text-[hsl(var(--gold))] text-lg leading-snug whitespace-normal">
                        Accompagnement personnalisé
                      </p>
                      <p className="text-[hsl(var(--gold))] opacity-80 text-sm">On vous filme en visio (35€)</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[hsl(var(--gold))] group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-[360px] shrink-0 relative h-full">
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
