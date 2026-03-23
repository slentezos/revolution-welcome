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
  MessageCircle,
  Gift,
  ArrowLeft,
  Send,
  Pause,
  EyeOff,
  ShieldCheck,
  PartyPopper,
  Frown } from
"lucide-react";

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
  { name: "", email: "" }]
  );

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep("reason"), 300);
  };

  const updateGiftRow = (index: number, field: "name" | "email", value: string) => {
    setGiftRows((prev) => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  // ─── Step 1: Reason Selection ───
  if (step === "reason") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 space-y-6">
            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Heart className="h-6 w-6" />
            </div>

            <p className="text-center text-foreground text-base">
              {firstName ? `${firstName}, ` : ""}nous sommes tristes de vous voir partir.
            </p>
            <h2 className="text-center font-heading text-2xl font-bold text-[#1B2333]">
              Avant de nous quitter, pourriez-vous nous dire ce qui motive votre choix&nbsp;?
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setStep("success")}
                className="w-full flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left hover:bg-gray-100/80 transition-colors">
                <span className="text-2xl flex-shrink-0 mt-0.5">💖</span>
                <div>
                  <p className="font-semibold text-[#1B2333] text-base">
                    J'ai fait une belle rencontre sur Kalimera
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    Partagez votre bonheur avec nous
                  </p>
                </div>
              </button>

              <button
                onClick={() => setStep("retention")}
                className="w-full flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left hover:bg-gray-100/80 transition-colors">
                <span className="text-2xl flex-shrink-0 mt-0.5">🕊️</span>
                <div>
                  <p className="font-semibold text-[#1B2333] text-base">
                    Je n'ai pas fait la rencontre espérée
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    Nous aimerions vous proposer quelque chose
                  </p>
                </div>
              </button>

              <button
                onClick={() => setStep("pause")}
                className="w-full flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left hover:bg-gray-100/80 transition-colors">
                <span className="text-2xl flex-shrink-0 mt-0.5">💬</span>
                <div>
                  <p className="font-semibold text-[#1B2333] text-base">
                    Autre raison / Je souhaite faire une pause
                  </p>
                  <p className="text-gray-500 mt-1 text-sm">
                    Mettez votre profil en veille sans tout effacer
                  </p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>);
  }

  // ─── Step 2A: Success Story ───
  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="px-6 sm:px-8 py-8 space-y-6">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#1B2333] font-medium transition-colors text-base">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <PartyPopper className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading text-2xl font-bold text-[#1B2333]">
              C'est notre plus belle récompense&nbsp;!
            </h2>

            {/* Testimonial */}
            <div className="space-y-2">
              <Label className="text-[#1B2333] text-base font-semibold">
                Racontez-nous brièvement votre belle histoire
                <span className="text-gray-500 font-normal ml-1 text-sm">(facultatif)</span>
              </Label>
              <p className="leading-relaxed text-base text-[hsl(var(--gold))]">
                Vos mots donnent de l'espoir à nos membres.
              </p>
              <Textarea
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                placeholder="Nous nous sommes rencontrés grâce à…"
                className="min-h-[100px] text-base resize-none rounded-xl border-gray-200 bg-gray-50/80"
                maxLength={500} />
            </div>

            {/* Gift Legacy Card */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <Gift className="h-5 w-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="font-semibold text-[#1B2333] text-base">
                  Partagez votre bonheur
                </p>
                <p className="leading-relaxed mt-1 text-sm text-foreground">
                  Offrez 3 mois d'abonnement Premium à 3 de vos proches. C'est entièrement offert par Kalimera.
                </p>

                <div className="space-y-3 mt-4">
                  {giftRows.map((row, i) =>
                  <div key={i} className="grid grid-cols-2 gap-3">
                      <Input
                      placeholder="Prénom"
                      value={row.name}
                      onChange={(e) => updateGiftRow(i, "name", e.target.value)}
                      className="h-11 text-base bg-white rounded-xl" />
                      <Input
                      placeholder="E-mail"
                      type="email"
                      value={row.email}
                      onChange={(e) => updateGiftRow(i, "email", e.target.value)}
                      className="h-11 text-base bg-white rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
              onClick={() => {
                handleClose();
                toast({
                  title: "Merci pour votre témoignage 💛",
                  description:
                  "Les invitations ont été envoyées. Votre compte sera clôturé sous 48h."
                });
              }}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer les cadeaux et clôturer mon compte
            </Button>
          </div>
        </DialogContent>
      </Dialog>);
  }

  // ─── Step 2B: Retention ───
  if (step === "retention") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 space-y-6">
            <button
              onClick={() => setStep("reason")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#1B2333] font-medium transition-colors text-base">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Heart className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading text-2xl font-bold text-[#1B2333]">
              Notre mission n'est pas encore remplie.
            </h2>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <Sparkles className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base">
                Nous aimerions vous offrir{" "}
                <span className="font-semibold">un mois supplémentaire offert</span> pour vous
                permettre de découvrir de nouveaux profils. C'est notre manière de vous remercier
                pour votre confiance.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
                onClick={() => {
                  handleClose();
                  toast({
                    title: "Un mois offert activé 🎉",
                    description:
                    "Votre abonnement a été prolongé d'un mois gratuitement. Bonne découverte !"
                  });
                }}>
                <Sparkles className="h-4 w-4 mr-2" />
                Accepter ce mois offert
              </Button>
              <button
                onClick={() => setStep("pause")}
                className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] hover:bg-gray-50 font-medium">
                Non merci, je préfère partir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>);
  }

  // ─── Step 2C: Pause Offer ───
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="px-6 sm:px-8 py-8 space-y-6">
          <button
            onClick={() => setStep("reason")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#1B2333] font-medium transition-colors text-base">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {/* Centered icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <Pause className="h-6 w-6" />
          </div>

          <h2 className="text-center font-heading text-2xl font-bold text-[#1B2333]">
            Le saviez-vous&nbsp;?
          </h2>

          <p className="text-center text-foreground text-base">
            Vous n'êtes pas obligé(e) de tout effacer. Mettez votre profil en{" "}
            <span className="font-semibold">pause sérénité</span>.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <EyeOff className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base">
                Votre profil devient <span className="font-medium text-[#1B2333]">invisible</span> pour les autres membres.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <ShieldCheck className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed text-base">
                Vos <span className="font-medium text-[#1B2333]">messages sont sauvegardés</span> et votre facturation est suspendue.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
              onClick={() => {
                handleClose();
                toast({
                  title: "Compte mis en pause",
                  description:
                  "Votre profil est désormais en veille pour 1 mois. Nous vous préviendrons avant la réactivation."
                });
              }}>
              <Pause className="h-4 w-4 mr-2" />
              Faire une pause d'un mois à la place
            </Button>
            <button
              onClick={() => {
                handleClose();
                toast({
                  title: "Demande envoyée",
                  description:
                  "Nous avons bien reçu votre demande de suppression. Notre équipe vous contactera sous 48h.",
                  variant: "destructive"
                });
              }}
              className="w-full h-12 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 font-medium">
              Confirmer la suppression définitive
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
