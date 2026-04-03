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
  const [interimText, setInterimText] = useState(""); // NOUVEAU: Le texte en temps réel
  const [giftEmails, setGiftEmails] = useState(["", "", ""]);
  const [invitesLeft, setInvitesLeft] = useState(3);
  const [copied, setCopied] = useState(false);

  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const inviteText =
    "J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. Voici mon invitation personnelle :";
  const inviteLink = "https://kalimera.fr/cercle/invitation-privee";
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

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...giftEmails];
    newEmails[index] = value;
    setGiftEmails(newEmails);
  };

  const decrementInvites = () => {
    if (invitesLeft > 0) setInvitesLeft((prev) => prev - 1);
  };

  const handleCopy = async () => {
    if (invitesLeft <= 0) return;
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      decrementInvites();
      toast({ description: "Invitation copiée dans le presse-papier." });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de copier.", variant: "destructive" });
    }
  };

  // ─── Native Dictation Setup (AVEC TEMPS RÉEL) ───
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Crucial pour le temps réel
      recognition.lang = "fr-FR";

      recognition.onresult = (event: any) => {
        let finalSegment = "";
        let interimSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += transcript + " ";
          } else {
            interimSegment += transcript; // Capture les mots à la volée
          }
        }

        if (finalSegment) {
          setTestimony((prev) => prev + finalSegment);
        }
        // Met à jour l'écran instantanément avec les mots en cours de prononciation
        setInterimText(interimSegment);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setInterimText("");
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText(""); // Nettoie le texte temporaire quand ça coupe
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleDictation = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (recognitionRef.current) {
        // Ajoute un espace propre avant de commencer à dicter si on reprend
        setTestimony((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " "));
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        toast({
          title: "Non supporté",
          description: "La dictée vocale n'est pas supportée sur ce navigateur.",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // S'il restait des mots non finalisés, on les pousse dans le texte principal
      if (interimText) {
        setTestimony((prev) => prev + interimText + " ");
      }
      setInterimText("");
    }
  };

  // ─── Step 1: Reason Selection ───
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-muted-foreground uppercase tracking-widest font-medium text-xl">
                {firstName ? `${firstName}, ` : ""}nous sommes tristes de vous voir partir
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Avant de nous quitter, pourriez-vous nous dire ce qui motive votre choix ?
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => setStep("success_story")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">💖</span>
                <div>
                  <p className="font-semibold text-foreground text-2xl">J'ai fait une belle rencontre sur Kalimera</p>
                  <p className="text-muted-foreground mt-1 text-xl">Partagez votre bonheur avec nous</p>
                </div>
              </button>
              <button
                onClick={() => setStep("retention")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">🕊️</span>
                <div>
                  <p className="font-semibold text-foreground text-2xl">Je n'ai pas fait la rencontre espérée</p>
                  <p className="text-muted-foreground mt-1 text-xl">Nous aimerions vous proposer quelque chose</p>
                </div>
              </button>
              <button
                onClick={() => setStep("pause")}
                className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] bg-secondary/40 border border-secondary text-left hover:border-primary/20 hover:bg-secondary transition-all group"
              >
                <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">💬</span>
                <div>
                  <p className="font-semibold text-foreground text-2xl">Autre raison / Je souhaite faire une pause</p>
                  <p className="text-muted-foreground mt-1 text-xl">Mettez votre profil en veille sans tout effacer</p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2A: Success Story (With Real-Time Dictation) ───
  if (step === "success_story") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-3xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-6 max-w-3xl mx-auto w-full">
            <button
              onClick={() => {
                stopRecording();
                setStep("reason");
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-5 w-5" /> Retour
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
                <PartyPopper className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                C'est notre plus belle récompense !
              </h2>
            </div>

            <div className="space-y-4 bg-secondary/30 p-6 md:p-8 rounded-[1.5rem] border border-secondary">
              <Label className="text-foreground text-xl font-medium block">
                Racontez-nous votre belle histoire
                <span className="text-muted-foreground font-normal ml-2 text-lg">(facultatif)</span>
              </Label>

              <div className="flex flex-col gap-4">
                {/* La valeur affichée est maintenant la combinaison du texte final ET du texte dicté en temps réel */}
                <Textarea
                  value={testimony + interimText}
                  onChange={(e) => {
                    setTestimony(e.target.value);
                    setInterimText(""); // Nettoie l'interim si l'utilisateur tape au clavier
                  }}
                  placeholder="Nous nous sommes rencontrés le..."
                  className="min-h-[160px] text-xl resize-none rounded-2xl border-secondary bg-white focus:ring-[hsl(var(--gold))] p-5 shadow-inner"
                  maxLength={500}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`min-h-[48px] px-6 w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 rounded-xl transition-all duration-300 text-lg font-semibold shrink-0 ${
                      isRecording
                        ? "bg-[hsl(var(--gold))] text-white animate-pulse [animation-duration:3s] shadow-[0_0_16px_hsl(var(--gold)/0.4)]"
                        : "bg-[#1B2333] text-white hover:bg-[#1B2333]/90"
                    }`}
                    aria-label={isRecording ? "Arrêter de dicter" : "Dictée vocale"}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    {isRecording ? "Arrêter de dicter" : "Dicter mon histoire"}
                  </button>

                  <div className="min-h-[1.5rem] flex items-center justify-center md:justify-end">
                    {isRecording ? (
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-xl md:text-2xl" style={{ color: "hsl(var(--gold))" }}>
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
                      <p className="italic text-lg" style={{ color: "hsl(var(--gold))" }}>
                        ✍️ Votre brouillon est sauvegardé
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 text-center max-w-md mx-auto">
              <Button
                onClick={() => {
                  stopRecording();
                  setStep("success_gift");
                }}
                className="w-full h-14 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
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

  // ─── Step 2B: Success Gift (No Scroll, Dynamic Counter) ───
  if (step === "success_gift") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
            <button
              onClick={() => setStep("success_story")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-5 w-5" /> Retour
            </button>

            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
                <Gift className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>

              <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-[hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.05)] text-[hsl(var(--gold))] mb-2">
                <Ticket className="w-5 h-5" />
                <span className="font-semibold text-lg tracking-widest uppercase">
                  {invitesLeft} invitation{invitesLeft > 1 ? "s" : ""} restante{invitesLeft > 1 ? "s" : ""}
                </span>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Partagez votre bonheur
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl">
                Célébrez votre histoire en offrant 3 mois d'abonnement au Cercle à vos proches.
              </p>
            </div>

            <div className="bg-secondary/20 p-6 rounded-[1.5rem] border border-secondary text-center relative overflow-hidden">
              <p className="italic text-foreground/80 leading-relaxed text-lg md:text-xl relative z-10">
                « J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon
                privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. »
              </p>
              <div className="mt-4 inline-flex items-center justify-center bg-white border border-secondary rounded-xl px-4 py-2 text-muted-foreground font-medium text-base w-full overflow-hidden">
                <span className="truncate text-xl">{inviteLink}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Label className="text-foreground text-xl font-medium block text-center mb-4">
                {invitesLeft > 0
                  ? `Comment souhaitez-vous envoyer vos ${invitesLeft} invitation${invitesLeft > 1 ? "s" : ""} ?`
                  : "Toutes vos invitations ont été envoyées. Merci !"}
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={invitesLeft > 0 ? `https://wa.me/?text=${encodeURIComponent(fullMessage)}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (invitesLeft <= 0) e.preventDefault();
                    else decrementInvites();
                  }}
                  className={`flex flex-col items-center justify-center gap-2 border border-secondary rounded-2xl h-24 transition-all ${invitesLeft > 0 ? "hover:border-[#25D366] hover:bg-[#25D366]/5 text-foreground" : "opacity-40 cursor-not-allowed text-muted-foreground"}`}
                >
                  <MessageCircle className={`w-8 h-8 ${invitesLeft > 0 ? "text-[#25D366]" : ""}`} />
                  <span className="text-base font-semibold">WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={invitesLeft <= 0}
                  className={`flex flex-col items-center justify-center gap-2 border border-secondary rounded-2xl h-24 transition-all ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05] text-foreground" : "opacity-40 cursor-not-allowed text-muted-foreground"}`}
                >
                  {copied ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : (
                    <Copy className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span className="text-base font-semibold">{copied ? "Copié !" : "Copier"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("success_gift_email")}
                  disabled={invitesLeft <= 0}
                  className={`flex flex-col items-center justify-center gap-2 border border-secondary rounded-2xl h-24 transition-all ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05] text-foreground" : "opacity-40 cursor-not-allowed text-muted-foreground"}`}
                >
                  <Mail className="w-8 h-8 text-muted-foreground" />
                  <span className="text-base font-semibold">Par E-mail</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-secondary mt-6 text-center">
              <button
                onClick={() => {
                  handleClose();
                  toast({ description: "Votre compte sera clôturé sous 48h." });
                }}
                className="w-full h-14 rounded-2xl text-[#E53935] hover:bg-red-50 font-medium text-xl transition-colors"
              >
                J'ai terminé, clôturer mon compte
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2C: Success Gift Email Form ───
  if (step === "success_gift_email") {
    const activeEmails = giftEmails.slice(0, invitesLeft);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
            <button
              onClick={() => setStep("success_gift")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-5 w-5" /> Retour
            </button>

            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
                <Mail className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">Confiez-nous l'envoi</h2>
              <p className="text-muted-foreground text-lg md:text-xl">
                Saisissez l'adresse e-mail de vos {invitesLeft} proches, nous nous chargeons de leur envoyer
                l'invitation.
              </p>
            </div>

            <div className="space-y-4 pt-2 bg-secondary/20 p-6 rounded-[1.5rem] border border-secondary">
              {activeEmails.map((email, i) => (
                <div key={i} className="relative">
                  <Input
                    type="email"
                    placeholder={`E-mail de l'invité n°${i + 1}`}
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    className="h-16 text-xl bg-white rounded-2xl border-secondary focus:border-[hsl(var(--gold))] focus:ring-[hsl(var(--gold))] shadow-sm placeholder:text-muted-foreground/60 px-6"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-5 text-center">
              <Button
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Félicitations 💛",
                    description: "Vos invitations sont envoyées. Votre compte sera clôturé sous 48h.",
                  });
                }}
                className="w-full h-14 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
              >
                <Send className="h-6 w-6 mr-3" />
                Valider & clôturer mon compte
              </Button>
              <button
                onClick={() => {
                  handleClose();
                  toast({ description: "Votre compte sera clôturé sous 48h." });
                }}
                className="w-full text-[#E53935] hover:text-[#C62828] font-medium text-lg transition-colors"
              >
                Passer cette étape et clôturer mon compte
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 3: Retention ───
  if (step === "retention") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-5 w-5" /> Retour
            </button>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Notre mission n'est pas encore remplie.
              </h2>
            </div>
            <div className="flex items-start gap-5 p-6 rounded-[1.5rem] bg-secondary/50 border border-secondary text-left">
              <Sparkles className="h-8 w-8 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg md:text-xl">
                Nous aimerions vous offrir{" "}
                <span className="font-semibold text-primary">un mois supplémentaire totalement offert</span> pour vous
                permettre de découvrir de nouveaux profils.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-4 text-center">
              <Button
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Un mois offert activé 🎉",
                    description: "Votre abonnement a été prolongé d'un mois gratuitement.",
                  });
                }}
                className="w-full h-16 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
              >
                <Sparkles className="h-6 w-6 mr-3" /> Accepter mon mois offert
              </Button>
              <button
                onClick={() => setStep("pause")}
                className="w-full text-muted-foreground hover:text-foreground font-medium text-lg transition-colors"
              >
                Non merci, je préfère partir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 4: Pause Offer ───
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
        <div className="px-6 sm:px-12 py-10 space-y-8 max-w-2xl mx-auto">
          <button
            onClick={() => setStep("reason")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
          >
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
              <Pause className="h-8 w-8 text-[hsl(var(--gold))]" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">Le saviez-vous ?</h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Vous n'êtes pas obligé(e) de tout effacer. Mettez votre profil en{" "}
              <span className="font-medium text-foreground">pause sérénité</span>.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-5 p-5 rounded-[1.5rem] bg-secondary/50 border border-secondary text-left">
              <EyeOff className="h-7 w-7 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg">
                Votre profil devient <span className="font-medium">totalement invisible</span> pour les autres membres.
              </p>
            </div>
            <div className="flex items-start gap-5 p-5 rounded-[1.5rem] bg-secondary/50 border border-secondary text-left">
              <ShieldCheck className="h-7 w-7 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg">
                Vos <span className="font-medium">messages sont sauvegardés</span> et votre facturation suspendue.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 pt-4 text-center">
            <Button
              onClick={() => {
                handleClose();
                toast({ title: "Compte mis en pause", description: "Votre profil est en veille." });
              }}
              className="w-full h-16 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
            >
              <Pause className="h-6 w-6 mr-3" /> Faire une pause d'un mois
            </Button>
            <button
              onClick={() => {
                handleClose();
                toast({
                  title: "Demande envoyée",
                  description: "Votre compte sera clôturé sous 48h.",
                  variant: "destructive",
                });
              }}
              className="w-full text-[#E53935] hover:text-[#C62828] font-medium text-lg transition-colors"
            >
              Confirmer la suppression définitive
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
