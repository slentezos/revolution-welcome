import { useState, useEffect } from "react";
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
  Share2,
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
  const [shareSupported, setShareSupported] = useState(false);

  const inviteText =
    "J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. Voici mon invitation personnelle :";
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

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Invitation Kalimera",
        text: inviteText,
        url: inviteLink,
      });
      decrementInvites();
    } catch (err) {
      console.log("Partage annulé ou non supporté", err);
    }
  };

  // ─── Step 1: Reason Selection ───
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6 max-w-xl mx-auto">
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
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6 max-w-xl mx-auto">
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

  // ─── Step 2B: Success Gift (Light Theme, Premium 2-Column) ───
  if (step === "success_gift") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl md:max-w-4xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white max-h-[95vh] overflow-y-auto">
          <div className="px-6 sm:px-12 py-10 space-y-8">
            <button
              onClick={() => setStep("success_story")}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Gift className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Partagez votre bonheur
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Célébrez votre histoire en offrant 3 mois d'abonnement au Cercle à vos proches. C'est entièrement offert
                par Kalimera.
              </p>
            </div>

            {/* 2-Column Grid with Vertical Divider */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 pt-4">
              {/* Left Column: Direct Sharing */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-secondary pb-3">
                  <Label className="text-foreground text-base font-semibold uppercase tracking-wide">
                    Partager vous-même
                  </Label>
                  <span className="text-[11px] font-bold text-[hsl(var(--gold))] px-2.5 py-1 rounded bg-[hsl(var(--gold))/0.1] uppercase tracking-wider">
                    {invitesLeft} restante(s)
                  </span>
                </div>

                <div className="bg-secondary/20 p-5 rounded-2xl border border-secondary text-left relative overflow-hidden">
                  <p className="italic text-foreground/80 leading-relaxed text-sm md:text-base relative z-10 mb-4">
                    « J'ai fait une merveilleuse rencontre sur Kalimera et je quitte le cercle. Je te transfère mon
                    privilège : 3 mois offerts pour que tu trouves, toi aussi, la bonne personne. »
                  </p>

                  {/* Big, accessible Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={invitesLeft <= 0}
                    className={`w-full flex items-center justify-between gap-3 bg-white border border-secondary rounded-xl p-3 transition-all ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:shadow-sm" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <span className="truncate text-xs text-muted-foreground font-medium">{inviteLink}</span>
                    <div className="flex items-center gap-1.5 text-[hsl(var(--gold))] text-sm font-semibold bg-[hsl(var(--gold))]/5 px-3 py-1.5 rounded-lg">
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copié" : "Copier"}
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={invitesLeft > 0 ? `https://wa.me/?text=${encodeURIComponent(fullMessage)}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (invitesLeft <= 0) e.preventDefault();
                      else decrementInvites();
                    }}
                    className={`flex items-center justify-center gap-2 border border-secondary text-foreground rounded-xl h-12 transition-all text-sm font-medium ${invitesLeft > 0 ? "hover:border-[#25D366] hover:bg-[#25D366]/5" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <MessageCircle className="w-5 h-5 text-[#25D366]" /> WhatsApp
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
                    className={`flex items-center justify-center gap-2 border border-secondary text-foreground rounded-xl h-12 transition-all text-sm font-medium ${invitesLeft > 0 ? "hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05]" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Mail className="w-5 h-5 text-muted-foreground" /> E-mail
                  </a>
                </div>
              </div>

              {/* Vertical Divider (Hidden on Mobile) */}
              <div className="hidden md:flex flex-col items-center">
                <div className="w-px h-full bg-secondary"></div>
                <div className="absolute bg-white px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-32">
                  OU
                </div>
              </div>

              {/* Right Column: Concierge Send */}
              <div className="space-y-6">
                <div className="border-b border-secondary pb-3">
                  <Label className="text-foreground text-base font-semibold uppercase tracking-wide">
                    Confiez-nous l'envoi
                  </Label>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Saisissez leurs adresses e-mail, notre conciergerie se chargera de leur envoyer cette invitation en
                    votre nom.
                  </p>

                  <div className="space-y-3 bg-secondary/10 p-5 rounded-2xl border border-secondary">
                    {giftEmails.map((email, i) => (
                      <div key={i} className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input
                          type="email"
                          placeholder={`E-mail de l'invité ${i + 1}`}
                          value={email}
                          onChange={(e) => updateEmail(i, e.target.value)}
                          className="h-12 text-base bg-white rounded-xl border-secondary pl-10 focus:border-[hsl(var(--gold))] focus:ring-[hsl(var(--gold))] shadow-sm placeholder:text-muted-foreground/60"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-secondary mt-8 max-w-2xl mx-auto">
              <Button
                className="w-full h-14 rounded-xl text-primary-foreground text-lg font-medium bg-primary hover:bg-primary/90 transition-all shadow-md"
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Félicitations 💛",
                    description: "Vos invitations sont traitées. Votre compte sera clôturé sous 48h.",
                  });
                }}
              >
                <Send className="h-5 w-5 mr-2" />
                Valider & clôturer mon compte
              </Button>
              <button
                onClick={() => {
                  handleClose();
                  toast({
                    description: "Votre compte sera clôturé sous 48h.",
                  });
                }}
                className="w-full h-10 rounded-xl text-muted-foreground hover:text-red-500 font-medium text-sm transition-colors"
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
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-8 space-y-6 max-w-xl mx-auto">
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
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
        <div className="px-6 sm:px-10 py-8 space-y-6 max-w-xl mx-auto">
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
