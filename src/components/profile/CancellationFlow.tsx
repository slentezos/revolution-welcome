import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Heart,
  Sparkles,
  Gift,
  ArrowLeft,
  Send,
  Pause,
  EyeOff,
  ShieldCheck,
  PartyPopper,
  Mic,
  MicOff,
  Mail,
  MessageCircle,
  Copy,
  CheckCircle2,
  Ticket,
  Check,
} from "lucide-react";

type Step = "reason" | "success_story" | "success_gift" | "success_gift_email" | "retention" | "pause";

interface CancellationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName?: string | null;
}

export default function CancellationFlow({ open, onOpenChange, firstName }: CancellationFlowProps) {
  const [step, setStep] = useState<Step>("reason");
  const [testimony, setTestimony] = useState("");
  const [interimText, setInterimText] = useState("");
  const [giftEmails, setGiftEmails] = useState(["", "", ""]);
  const [invitesLeft, setInvitesLeft] = useState(3);
  const [copied, setCopied] = useState(false);

  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const inviteLink = "https://kalimera.fr/cercle/invitation-privee";
  const inviteText = "J'ai fait une merveilleuse rencontre sur Kalimera...";
  const fullMessage = `${inviteText} \n${inviteLink}`;

  const handleClose = () => {
    if (isRecording) stopRecording();
    onOpenChange(false);
    setTimeout(() => {
      setStep("reason");
      setGiftEmails(["", "", ""]);
      setTestimony("");
      setInterimText("");
      setInvitesLeft(3);
      setCopied(false);
    }, 300);
  };

  // ─── Native Dictation Logic (Accurate to chat) ───
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "fr-FR";

      recognition.onresult = (event: any) => {
        let finalSegment = "";
        let interimSegment = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalSegment += transcript + " ";
          else interimSegment += transcript;
        }
        if (finalSegment) setTestimony((prev) => prev + finalSegment);
        setInterimText(interimSegment);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleDictation = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (recognitionRef.current) {
        setTestimony((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " "));
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        toast({ title: "Non supporté", description: "Navigateur incompatible.", variant: "destructive" });
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (interimText) setTestimony((prev) => prev + interimText + " ");
      setInterimText("");
    }
  };

  // Render logic...
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
            {/* Header with Heart Icon */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-muted-foreground uppercase tracking-widest font-medium text-base">
                {firstName ? `${firstName}, ` : ""}nous sommes tristes de vous voir partir
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Avant de nous quitter, pourriez-vous nous dire ce qui motive votre choix ?
              </h2>
            </div>
            {/* Buttons list */}
            <div className="space-y-4 pt-2">
              <button
                onClick={() => setStep("success_story")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-4xl">💖</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">J'ai fait une belle rencontre sur Kalimera</p>
                </div>
              </button>
              <button
                onClick={() => setStep("retention")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-4xl">🕊️</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">Je n'ai pas fait la rencontre espérée</p>
                </div>
              </button>
              <button
                onClick={() => setStep("pause")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-primary/20 hover:bg-secondary transition-all group"
              >
                <span className="text-4xl">💬</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">Faire une pause</p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "success_story") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-3xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-6 max-w-3xl mx-auto w-full">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-5 w-5" /> Retour
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                <PartyPopper className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                C'est notre plus belle récompense !
              </h2>
            </div>

            <div className="space-y-4 bg-secondary/30 p-6 md:p-8 rounded-[2rem] border border-secondary">
              <Label className="text-foreground text-xl font-medium block">
                Racontez-nous votre belle histoire{" "}
                <span className="text-muted-foreground font-normal ml-2 text-lg">(facultatif)</span>
              </Label>

              {/* ═══ BLOCK DICTÉE (SYNCHRONISÉ AVEC CHAT) ═══ */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <button
                    onClick={toggleDictation}
                    className={`min-h-[48px] px-4 w-auto min-w-[120px] flex items-center justify-center gap-2 rounded-xl transition-all duration-300 text-xl font-semibold shrink-0 ${
                      isRecording
                        ? "bg-[hsl(var(--gold))] text-white animate-pulse [animation-duration:3s] shadow-[0_0_16px_hsl(var(--gold)/0.4)]"
                        : "bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
                    }`}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    {isRecording ? "Arrêter de dicter" : "Dicter"}
                  </button>

                  <div className="flex-1">
                    <Textarea
                      value={testimony + interimText}
                      onChange={(e) => {
                        setTestimony(e.target.value);
                        setInterimText("");
                      }}
                      placeholder="Nous nous sommes rencontrés le..."
                      className="w-full min-h-[120px] max-h-[300px] resize-none bg-white border border-amber-100/60 rounded-xl font-medium text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--gold))] focus:ring-0 text-xl py-3 px-4"
                    />
                  </div>
                </div>

                {/* VISUAL FEEDBACK (SYNCHRONISÉ) */}
                <div className="min-h-[2.5rem]">
                  {isRecording ? (
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-3xl text-[#e2a036]" style={{ color: "hsl(var(--gold))" }}>
                        Je vous écoute...
                      </p>
                      <div className="flex items-end gap-1 h-5">
                        <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "60%", animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "100%", animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                          style={{ height: "40%", animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  ) : testimony.length > 0 ? (
                    <p className="italic text-right text-lg" style={{ color: "hsl(var(--gold))" }}>
                      ✍️ Votre brouillon est sauvegardé
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 text-center max-w-md mx-auto">
              <Button
                onClick={() => {
                  stopRecording();
                  setStep("success_gift");
                }}
                className="w-full h-14 rounded-2xl text-primary-foreground text-xl font-semibold bg-[#1B2333] hover:bg-[#1B2333]/90 shadow-md"
              >
                Continuer vers la clôture
              </Button>
              <button
                onClick={() => {
                  stopRecording();
                  setStep("success_gift");
                }}
                className="w-full text-muted-foreground hover:text-foreground font-medium text-lg transition-colors"
              >
                Passer cette étape
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Final default return for other steps...
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
        <div className="px-6 sm:px-12 py-10 text-center">
          <h2 className="font-heading text-3xl">Traitement en cours...</h2>
          <Button onClick={handleClose} className="mt-6">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
