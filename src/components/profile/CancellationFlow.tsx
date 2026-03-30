import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Heart, Sparkles, Gift, ArrowLeft, Send, Pause, EyeOff, ShieldCheck, PartyPopper } from "lucide-react";

type Step = "reason" | "success" | "retention" | "pause";

interface CancellationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName?: string | null;
}

export default function CancellationFlow({ open, onOpenChange, firstName }: CancellationFlowProps) {
  const [step, setStep] = useState<Step>("reason");
  const [testimony, setTestimony] = useState("");
  const [giftRows, setGiftRows] = useState([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" },
  ]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep("reason"), 300);
  };

  const updateGiftRow = (index: number, field: "name" | "email", value: string) => {
    setGiftRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  // ─── Step 1: Reason Selection ───
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-8 sm:px-12 py-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-muted-foreground uppercase tracking-widest font-medium text-xl">
                {firstName ? `${firstName}, ` : ""}nous sommes tristes de vous voir partir
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Avant de nous quitter, pourriez-vous nous dire ce qui motive votre choix ?
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4">
              <button
                onClick={() => setStep("success")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">💖</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">J'ai fait une belle rencontre sur Kalimera</p>
                  <p className="text-muted-foreground mt-0.5 text-xl">Partagez votre bonheur avec nous</p>
                </div>
              </button>

              <button
                onClick={() => setStep("retention")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-[hsl(var(--gold)/0.5)] hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">🕊️</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">Je n'ai pas fait la rencontre espérée</p>
                  <p className="text-muted-foreground mt-0.5 text-xl">Nous aimerions vous proposer quelque chose</p>
                </div>
              </button>

              <button
                onClick={() => setStep("pause")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left hover:border-primary/20 hover:bg-secondary transition-all group"
              >
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">💬</span>
                <div>
                  <p className="font-semibold text-foreground text-xl">Autre raison / Je souhaite faire une pause</p>
                  <p className="text-muted-foreground mt-0.5 text-xl">
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

  // ─── Step 2A: Success Story ───
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          <div className="px-8 sm:px-12 py-10 space-y-8">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <PartyPopper className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                C'est notre plus belle récompense !
              </h2>
            </div>

            {/* Testimonial */}
            <div className="space-y-3 bg-secondary/30 p-6 rounded-2xl">
              <Label className="text-foreground text-lg font-medium block">
                Racontez-nous brièvement votre belle histoire
                <span className="text-muted-foreground font-normal ml-2 text-sm">(facultatif)</span>
              </Label>
              <p className="text-[hsl(var(--gold))] text-base">Vos mots donnent de l'espoir à l'ensemble du cercle.</p>
              <Textarea
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                placeholder="Nous nous sommes rencontrés le..."
                className="min-h-[120px] text-lg resize-none rounded-xl border-secondary bg-white focus:ring-[hsl(var(--gold))]"
                maxLength={500}
              />
            </div>

            {/* Gift Legacy Card */}
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-6 w-6 text-[hsl(var(--gold))] flex-shrink-0" />
                <p className="font-heading text-2xl text-primary">Partagez votre bonheur</p>
              </div>
              <p className="leading-relaxed text-base text-foreground mb-6">
                Offrez 3 mois d'abonnement au cercle à 3 de vos proches. C'est entièrement offert par Kalimera pour
                célébrer votre rencontre.
              </p>

              <div className="space-y-3">
                {giftRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Prénom"
                      value={row.name}
                      onChange={(e) => updateGiftRow(i, "name", e.target.value)}
                      className="h-12 text-base bg-white rounded-xl border-secondary"
                    />
                    <Input
                      placeholder="E-mail"
                      type="email"
                      value={row.email}
                      onChange={(e) => updateGiftRow(i, "email", e.target.value)}
                      className="h-12 text-base bg-white rounded-xl border-secondary"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-14 rounded-xl text-primary-foreground text-lg font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
              onClick={() => {
                handleClose();
                toast({
                  title: "Merci pour votre témoignage 💛",
                  description: "Les invitations ont été envoyées. Votre compte sera clôturé sous 48h.",
                });
              }}
            >
              <Send className="h-5 w-5 mr-2" />
              Envoyer les invitations & clôturer mon compte
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2B: Retention ───
  if (step === "retention") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-8 sm:px-12 py-10 space-y-8">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">
                Notre mission n'est pas encore remplie.
              </h2>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <Sparkles className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg">
                Nous aimerions vous offrir{" "}
                <span className="font-semibold text-primary">un mois supplémentaire totalement offert</span> pour vous
                permettre de découvrir de nouveaux profils en toute sérénité. C'est notre manière de vous remercier pour
                votre confiance.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full h-14 rounded-xl text-primary-foreground text-lg font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Un mois offert activé 🎉",
                    description: "Votre abonnement a été prolongé d'un mois gratuitement. Bonne découverte !",
                  });
                }}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Accepter mon mois offert
              </Button>
              <button
                onClick={() => setStep("pause")}
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-medium text-lg transition-colors"
              >
                Non merci, je préfère partir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Step 2C: Pause Offer ───
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
        <div className="px-8 sm:px-12 py-10 space-y-8">
          <button
            onClick={() => setStep("reason")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-base uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </button>

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
              <Pause className="h-6 w-6 text-[hsl(var(--gold))]" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground leading-tight">Le saviez-vous ?</h2>
            <p className="text-muted-foreground text-lg">
              Vous n'êtes pas obligé(e) de tout effacer. Mettez simplement votre profil en{" "}
              <span className="font-medium text-foreground">pause sérénité</span>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <EyeOff className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg">
                Votre profil devient <span className="font-medium">totalement invisible</span> pour les autres membres.
              </p>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/50 border border-secondary text-left">
              <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-lg">
                Vos <span className="font-medium">messages sont sauvegardés</span> et votre facturation est suspendue.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="w-full h-14 rounded-xl text-primary-foreground text-lg font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
              onClick={() => {
                handleClose();
                toast({
                  title: "Compte mis en pause",
                  description: "Votre profil est désormais en veille. Nous vous préviendrons avant la réactivation.",
                });
              }}
            >
              <Pause className="h-5 w-5 mr-2" />
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
              className="w-full h-12 rounded-xl text-destructive hover:text-destructive/80 font-medium text-lg transition-colors"
            >
              Confirmer la suppression définitive
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
