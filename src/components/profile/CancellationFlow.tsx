import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  Ticket,
  Share2,
  Copy,
  CheckCircle2,
  MessageCircle,
  Mail,
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
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  const invitesLeft = 3;
  const inviteText =
    "Bonjour, je te partage ce nouveau site de rencontres, Kalimera. C'est très sérieux et élégant. J'ai une invitation qui t'offre les 3 premiers mois si tu veux regarder. Voici mon lien :";
  const inviteLink = "https://kalimera.fr/cercle/invitation-privee";
  const fullMessage = `${inviteText} ${inviteLink}`;

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setShareSupported(true);
    }
  }, []);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("reason");
      setCopied(false);
    }, 300);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      toast({ description: "Message copié dans le presse-papier." });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de copier le lien.", variant: "destructive" });
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Invitation Kalimera",
        text: inviteText,
        url: inviteLink,
      });
    } catch (err) {
      console.log("Partage annulé ou non supporté", err);
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

            <div className="space-y-3 bg-secondary/30 p-5 rounded-2xl">
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
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-[hsl(var(--gold)/0.15)] transition-colors"
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

  // ─── Step 2B: Success Gift (Dark Mode Native Share UI) ───
  if (step === "success_gift") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-[#1B2333]">
          <div className="px-6 sm:px-10 py-8 space-y-6">
            <button
              onClick={() => setStep("success_story")}
              className="flex items-center gap-1.5 text-white/50 hover:text-white font-medium transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.1)]">
                <Ticket className="w-4 h-4 text-[hsl(var(--gold))] mr-2" />
                <span className="text-[hsl(var(--gold))] font-medium uppercase tracking-widest text-xs">
                  Votre allocation : {invitesLeft} invitations
                </span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-white leading-tight">Transmettez vos privilèges</h2>
            </div>

            <div className="border border-[hsl(var(--gold)/0.2)] bg-white/5 rounded-xl p-6 relative overflow-hidden">
              <Gift className="w-24 h-24 text-[hsl(var(--gold)/0.05)] absolute -top-4 -right-4" />
              <p className="italic text-white/90 text-base leading-relaxed relative z-10 mb-5">« {inviteText} »</p>
              <div className="inline-block border border-[hsl(var(--gold)/0.2)] bg-[hsl(var(--gold)/0.08)] text-[hsl(var(--gold))] px-4 py-2 rounded font-medium text-sm relative z-10 w-full truncate">
                {inviteLink}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {shareSupported ? (
                <button
                  onClick={handleNativeShare}
                  className="w-full bg-white text-[#1B2333] py-4 rounded-xl text-base font-medium tracking-wide transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Transmettre cette invitation
                </button>
              ) : (
                <button
                  onClick={handleCopy}
                  className="w-full bg-white text-[#1B2333] py-4 rounded-xl text-base font-medium tracking-wide transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Copié avec succès !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copier l'invitation
                    </>
                  )}
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-white/20 text-white rounded-xl py-3 transition-all hover:border-[hsl(var(--gold)/0.4)] hover:bg-white/5 text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4 text-[hsl(var(--gold))]" /> WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent("Une invitation privée Kalimera")}&body=${encodeURIComponent(fullMessage)}`}
                  className="flex items-center justify-center gap-2 border border-white/20 text-white rounded-xl py-3 transition-all hover:border-[hsl(var(--gold)/0.4)] hover:bg-white/5 text-sm font-medium"
                >
                  <Mail className="w-4 h-4 text-[hsl(var(--gold))]" /> E-mail
                </a>
              </div>
            </div>

            {/* Final Cancellation Action */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Demande envoyée",
                    description: "Votre compte sera clôturé sous 48h.",
                    variant: "destructive",
                  });
                }}
                className="text-white/40 hover:text-red-400 text-sm font-medium transition-colors"
              >
                J'ai terminé. Clôturer définitivement mon compte.
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
