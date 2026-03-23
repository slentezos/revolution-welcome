import { useState, useRef, useEffect } from "react";
import { Camera, Video, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
{ id: "misc2", type: "misc", label: "Divers", hint: "Passions…", required: false }];


export default function OnboardingMedia({ profileId, onComplete }: OnboardingMediaProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(getInitialSlots());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showVideoTutorial, setShowVideoTutorial] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExistingMedia = async () => {
      try {
        const { data: existingMedia, error } = await supabase.
        from("profile_media").
        select("*").
        eq("profile_id", profileId).
        order("display_order");

        if (error) throw error;

        if (existingMedia && existingMedia.length > 0) {
          setSlots((prev) => {
            const updated = [...prev];
            for (const media of existingMedia) {
              let slotIndex = -1;
              if (media.media_type === "video") slotIndex = 0;else
              if (media.media_type === "portrait") slotIndex = 1;else
              if (media.media_type === "silhouette") slotIndex = 2;else
              if (media.media_type === "misc") {
                if (!updated[3].uploaded && !updated[3].preview) slotIndex = 3;else
                if (!updated[4].uploaded && !updated[4].preview) slotIndex = 4;
              }
              if (slotIndex >= 0) {
                const {
                  data: { publicUrl }
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
    setSlots((prev) => prev.map((s) => s.id === slotId ? { ...getInitialSlots().find((i) => i.id === slotId)! } : s));
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
        variant: "destructive"
      });
      return;
    }
    if (!isVideo && !validImageTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez choisir une image (JPEG, PNG, WebP)",
        variant: "destructive"
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
              variant: "destructive"
            });
            resolve(false);
          } else {
            resolve(true);
          }
        };
      });
      if (!valid) return;
    }

    const preview = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s) => s.id === activeSlotId ? { ...s, file, preview, uploaded: false } : s));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveSlotId(null);
  };

  const handleSave = async () => {
    const hasFiles = slots.some((s) => s.file && !s.uploaded);
    if (!hasFiles) {
      setShowSaveDialog(true);
      return;
    }

    setUploading(true);
    try {
      const {
        data: { session }
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
            display_order: slots.indexOf(slot)
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
        variant: "destructive"
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
        <div className="animate-pulse text-muted-foreground text-lg">Chargement de vos médias...</div>
      </div>);

  }

  return (
    <div className="h-[calc(100vh-64px-64px)] lg:h-[calc(100vh-80px-64px)] flex flex-col overflow-hidden">
      {/* Main content — single screen, no scroll */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 min-h-0">
        {/* Left: Video + Photos grid */}
        <div className="flex-1 min-h-0 p-4 lg:p-6 xl:p-8 flex flex-col gap-4 lg:gap-5">
          {/* Title row */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-3xl font-bold text-[#1B2333]">Vos photos & vidéo</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
              <span className="text-[#1B2333] font-semibold text-lg">{uploadedCount}</span>
              <span className="text-gray-500 text-lg">/ 5</span>
            </div>
          </div>

          {/* Media grid: video left, 4 photos right */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 lg:gap-5">
            {/* Video slot — tall */}
            <div className="min-h-0 flex flex-col gap-2">
              <div
                className="relative flex-1 min-h-0 overflow-hidden cursor-pointer group border-2 border-dashed border-border hover:border-primary/40 transition-all duration-300"
                onClick={() => !videoSlot.preview && handleSlotClick(videoSlot.id)}>
                
                {videoSlot.preview ?
                <>
                    <video src={videoSlot.preview} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                      <Play className="h-14 w-14 text-primary-foreground drop-shadow-lg" />
                    </div>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(videoSlot.id);
                    }}
                    className="absolute top-3 right-3 p-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center">
                    
                      <X className="h-5 w-5" />
                    </button>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSlotClick(videoSlot.id);
                    }}
                    className="absolute bottom-3 right-3 px-5 py-3 bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 transition-colors min-h-[48px]">
                    
                      Remplacer
                    </button>
                  </> :

                <div className="absolute inset-0">
                    <img src={placeholderVideoBg} alt="" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Video className="h-8 w-8 lg:h-10 lg:w-10 text-primary/60" />
                      </div>
                      <span className="text-lg lg:text-xl text-foreground font-medium mb-1">+ Ajouter une vidéo</span>
                      <span className="text-base text-muted-foreground">MP4, MOV ou WebM · Max 1 mn 30</span>
                    </div>
                  </div>
                }
              </div>
              <div className="flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-foreground font-medium text-lg">Vidéo de présentation</p>
                </div>
                <button
                  onClick={() => setShowVideoTutorial(true)}
                  className="hover:underline transition-colors whitespace-nowrap text-xl bg-[#e2a336] text-black font-normal">
                  
                  Conseils vidéo
                </button>
              </div>
            </div>

            {/* Photos 2x2 grid */}
            <div className="min-h-0 grid grid-cols-2 gap-3 lg:gap-4">
              {photoSlots.map((slot, index) =>
              <div key={slot.id} className="min-h-0 flex flex-col gap-1.5">
                  <div
                  className={`relative flex-1 min-h-0 overflow-hidden cursor-pointer group border-2 border-dashed transition-all duration-300 ${
                  slot.preview ?
                  "border-transparent" :
                  index === 0 ?
                  "border-primary/40 hover:border-primary/60" :
                  "border-border hover:border-primary/30"}`
                  }
                  onClick={() => handleSlotClick(slot.id)}>
                  
                    {slot.preview ?
                  <>
                        <img src={slot.preview} alt={slot.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                        <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(slot.id);
                      }}
                      className="absolute top-2 right-2 p-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                      
                          <X className="h-4 w-4" />
                        </button>
                      </> :

                  <div className="absolute inset-0">
                        <img src={placeholderPhotoBg} alt="" className="w-full h-full object-cover opacity-30" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        index === 0 ? "bg-primary/15" : "bg-primary/10"}`
                        }>
                        
                            <Camera className={`h-5 w-5 ${index === 0 ? "text-primary" : "text-primary/50"}`} />
                          </div>
                          <span
                        className={`text-base font-medium ${index === 0 ? "text-primary" : "text-muted-foreground"}`}>
                        
                            + Ajouter*
                          </span>
                          {index === 0}
                        </div>
                      </div>
                  }
                  </div>
                  <p className="text-foreground font-medium text-base flex-shrink-0">
                    {slot.label} <span className="text-muted-foreground font-normal text-sm">— {slot.hint}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — always visible */}
      <div
        className="flex-shrink-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] py-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 hidden sm:block">{uploadedCount} / 5 médias ajoutés</p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={uploading}
              className="h-11 px-5 rounded-lg border-gray-300 text-[#1B2333] hover:bg-gray-50 font-medium">
              
              Enregistrer
            </Button>
            <Button
              onClick={handleSave}
              disabled={uploading}
              className="h-11 px-6 rounded-lg bg-[#1B2333] hover:bg-[#1B2333]/90 text-white font-medium">
              
              {uploading ? "Téléchargement..." : "Enregistrer et continuer"}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Tutorial Modal */}
      <Dialog open={showVideoTutorial} onOpenChange={setShowVideoTutorial}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="flex">
            <div className="flex-1 p-8 lg:p-10">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-heading text-2xl lg:text-3xl font-semibold text-foreground">
                  Tutoriel vidéo
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-lg italic mt-2">
                  L'essentiel : c'est vous.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-lg">
                <p>
                  <span className="font-semibold">Vous avant tout</span> : votre visage, voix, expression, attitude.
                </p>
                <p>
                  <span className="font-semibold">Setup clean</span> : fond neutre, calme, lumière face à vous.
                </p>
                <p>
                  <span className="font-semibold">Regard caméra</span> : évitez les yeux baissés.
                </p>
                <p>
                  <span className="font-semibold">Tempo maîtrisé</span> : Respirez, articulez, variez le rythme.
                </p>
                <p>
                  <span className="font-semibold">Soyez vivant</span> : ne lisez pas. Racontez une anecdote.
                </p>
                <p>
                  <span className="font-semibold">Pas de clichés</span> : bannir les banalités.
                </p>
              </div>
              <p className="text-muted-foreground mt-8 text-lg">Refaites si besoin : plusieurs prises, c'est normal.</p>
            </div>
            <div className="hidden lg:block w-[280px] relative">
              <img src={coupleGarden} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save confirmation dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md p-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="font-heading text-3xl text-foreground">Enregistré !</DialogTitle>
              <DialogDescription className="text-muted-foreground text-lg mt-2">
                Vos photos et vidéo ont bien été sauvegardées.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 w-full mt-2">
              <Button
                onClick={() => {
                  setShowSaveDialog(false);
                  onComplete();
                }}
                className="btn-primary w-full py-5 text-lg h-auto min-h-[56px]">
                
                Continuer vers le Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false);
                  window.location.href = "/profil";
                }}
                className="w-full py-5 text-lg h-auto min-h-[56px] border-2 border-border">
                
                Retour à Mon Profil
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={activeSlotId === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange} />
      
    </div>);

}