import { useState } from "react";
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
  Mail,
  MessageCircle,
  Copy,
  CheckCircle2,
} from "lucide-react";

type Step = "reason" | "success_story" | "success_gift" | "retention" | "pause";

interface CancellationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName?: string | null;
}

export default function CancellationFlow({ open, onOpenChange, firstName }: CancellationFlowProps) {
  const [step, setStep] = useState<Step>("reason");
  const [testimony, setTestimony] = useState("");
  const [giftEmails, setGiftEmails] = useState(["", "", ""]);
  const [invitesLeft, setInvitesLeft] = useState(3);
  const [copied, setCopied] = useState(false);

  const inviteText =
    "J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. Voici mon invitation personnelle :";
  const inviteLink = "https://kalimera.fr/cercle/invitation-privee";
  const fullMessage = `${inviteText} ${inviteLink}`;

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("reason");
      setGiftEmails(["", "", ""]);
      setTestimony("");
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
      toast({ title: "Erreur", description: "Impossible de copier le lien.", variant: "destructive" });
    }
  };

  // ─── Step 1: Reason Selection ───
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-muted-foreground uppercase tracking-widest font-medium text-sm md:text-base">
                {firstName ? `${firstName}, ` : ""}nous sommes tristes de vous voir partir
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">
                Avant de nous quitter, pourriez-vous nous dire ce qui motive votre choix ?
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setStep("success_story")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">💖</span>
                <div>
                  <p className="font-semibold text-foreground text-lg">J'ai fait une belle rencontre sur Kalimera</p>
                  <p className="text-muted-foreground mt-0.5 text-base">Partagez votre bonheur avec nous</p>
                </div>
              </button>

              <button
                onClick={() => setStep("retention")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">🕊️</span>
                <div>
                  <p className="font-semibold text-foreground text-lg">Je n'ai pas fait la rencontre espérée</p>
                  <p className="text-muted-foreground mt-0.5 text-base">Nous aimerions vous proposer quelque chose</p>
                </div>
              </button>

              <button
                onClick={() => setStep("pause")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-primary/20 hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">💬</span>
                <div>
                  <p className="font-semibold text-foreground text-lg">Autre raison / Je souhaite faire une pause</p>
                  <p className="text-muted-foreground mt-0.5 text-base">
                    Mettez votre profil en veille sans tout effacer
                  </p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2A: Success Story (with Dictation) ───
  if (step === "success_story") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
                <PartyPopper className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">
                C'est notre plus belle récompense !
              </h2>
            </div>

            <div className="space-y-3 bg-secondary/30 p-5 rounded-2xl border border-secondary">
              <Label className="text-foreground text-base font-medium block">
                Racontez-nous votre belle histoire
                <span className="text-muted-foreground font-normal ml-2 text-sm">(facultatif)</span>
              </Label>
              <div className="relative">
                <Textarea
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  placeholder="Nous nous sommes rencontrés le..."
                  className="min-h-[120px] pb-14 text-base resize-none rounded-xl border-secondary bg-white focus:ring-[hsl(var(--gold))]"
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    type="button"
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-muted-foreground hover:text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.15)] transition-colors"
                    title="Dicter mon message"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full h-12 rounded-xl text-primary-foreground text-base font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
                onClick={() => setStep("success_gift")}
              >
                Continuer vers la clôture
              </Button>
              <button
                onClick={() => setStep("success_gift")}
                className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
              >
                Passer cette étape
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2B: Success Gift (Direct Share & Email Inputs) ───
  if (step === "success_gift") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white max-h-[95vh] overflow-y-auto">
          <div className="px-6 sm:px-10 py-8 space-y-6">
            <button
              onClick={() => setStep("success_story")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
                <Gift className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">
                Partagez votre bonheur
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto md:text-lg">
                Célébrez votre belle histoire en offrant 3 mois d'abonnement à vos proches. C'est offert par Kalimera.
              </p>
            </div>

            {/* Message Preview */}
            <div className="bg-secondary/30 p-4 rounded-2xl border border-secondary text-left relative overflow-hidden">
              <p className="italic text-foreground/80 leading-relaxed relative z-10 text-sm md:text-lg">
                « J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon
                privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. Voici mon invitation :{" "}
                {inviteLink} »
              </p>
            </div>

            {/* Native Sharing Row */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-foreground text-sm md:text-base font-medium">Partager via votre appareil</Label>
                <span className="font-bold text-[hsl(var(--gold))] px-2 py-0.5 rounded bg-[hsl(var(--gold))/0.1] text-lg">
                  {invitesLeft} restante(s)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={invitesLeft > 0 ? `https://wa.me/?text=${encodeURIComponent(fullMessage)}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (invitesLeft <= 0) e.preventDefault();
                    else decrementInvites();
                  }}
                  className={`flex items-center justify-center gap-1.5 border border-secondary text-foreground rounded-xl h-11 transition-all text-lg font-medium ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05]" : "opacity-50 cursor-not-allowed"}`}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                </a>
                <a
                  href={
                    invitesLeft > 0
                      ? `mailto:?subject=${encodeURIComponent("Mon cadeau pour toi : Une invitation privée Kalimera")}&body=${encodeURIComponent(fullMessage)}`
                      : "#"
                  }
                  onClick={(e) => {
                    if (invitesLeft <= 0) e.preventDefault();
                    else decrementInvites();
                  }}
                  className={`flex items-center justify-center gap-1.5 border border-secondary text-foreground rounded-xl h-11 transition-all text-lg font-medium ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05]" : "opacity-50 cursor-not-allowed"}`}
                >
                  <Mail className="w-4 h-4 text-muted-foreground" /> E-mail
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={invitesLeft <= 0}
                  className={`flex items-center justify-center gap-1.5 border border-secondary text-foreground rounded-xl h-11 transition-all text-lg font-medium ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05]" : "opacity-50 cursor-not-allowed"}`}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground md:text-base">
                  Ou confiez-nous l'envoi
                </span>
              </div>
            </div>

            {/* Email Inputs */}
            <div className="space-y-3">
              {giftEmails.map((email, i) => (
                <div key={i} className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    type="email"
                    placeholder={`Adresse e-mail du proche n°${i + 1}`}
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    className="h-11 text-sm md:text-base bg-secondary/30 rounded-xl border-secondary pl-10 focus:border-[hsl(var(--gold))] focus:ring-[hsl(var(--gold))]"
                  />
                </div>
              ))}
            </div>

            {/* Final Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-secondary">
              <Button
                className="w-full h-12 rounded-xl text-primary-foreground text-base font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Félicitations 💛",
                    description: "Vos invitations sont traitées. Votre compte sera clôturé sous 48h.",
                  });
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Valider & clôturer mon compte
              </Button>
              <button
                onClick={() => {
                  handleClose();
                  toast({
                    description: "Votre compte sera clôturé sous 48h.",
                  });
                }}
                className="w-full h-10 rounded-xl text-muted-foreground hover:text-red-500 font-medium transition-colors text-lg"
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
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">
                Notre mission n'est pas encore remplie.
              </h2>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <Sparkles className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base md:text-lg">
                Nous aimerions vous offrir{" "}
                <span className="font-semibold text-primary">un mois supplémentaire totalement offert</span> pour vous
                permettre de découvrir de nouveaux profils. C'est notre manière de vous remercier pour votre confiance.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full h-12 rounded-xl text-primary-foreground text-base font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Un mois offert activé 🎉",
                    description: "Votre abonnement a été prolongé d'un mois gratuitement. Bonne découverte !",
                  });
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Accepter mon mois offert
              </Button>
              <button
                onClick={() => setStep("pause")}
                className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground font-medium text-base transition-colors"
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
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
        <div className="px-6 sm:px-10 py-8 space-y-6">
          <button
            onClick={() => setStep("reason")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>

          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-1">
              <Pause className="h-5 w-5 text-[hsl(var(--gold))]" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">Le saviez-vous ?</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Vous n'êtes pas obligé(e) de tout effacer. Mettez simplement votre profil en{" "}
              <span className="font-medium text-foreground">pause sérénité</span>.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <EyeOff className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base">
                Votre profil devient <span className="font-medium">totalement invisible</span> pour les autres membres.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base">
                Vos <span className="font-medium">messages sont sauvegardés</span> et votre facturation est suspendue.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full h-12 rounded-xl text-primary-foreground text-base font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
              onClick={() => {
                handleClose();
                toast({
                  title: "Compte mis en pause",
                  description: "Votre profil est désormais en veille. Nous vous préviendrons avant la réactivation.",
                });
              }}
            >
              <Pause className="h-4 w-4 mr-2" />
              Faire une pause d'un mois à la place
            </Button>
            <button
              onClick={() => {
                handleClose();
                toast({
                  title: "Demande envoyée",
                  description: "Nous avons bien reçu votre demande. Notre équipe vous contactera sous 48h.",
                  variant: "destructive",
                });
              }}
              className="w-full h-11 rounded-xl text-destructive hover:text-destructive/80 font-medium text-base transition-colors"
            >
              Confirmer la suppression définitive
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
