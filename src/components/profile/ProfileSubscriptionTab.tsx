import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Pause, EyeOff, Heart, Bell, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CancellationFlow from "./CancellationFlow";
import profileSubscriptionImg from "@/assets/profile-subscription.jpg";

interface ProfileSubscriptionTabProps {
  firstName?: string | null;
}

export default function ProfileSubscriptionTab({ firstName }: ProfileSubscriptionTabProps) {
  const [pauseOpen, setPauseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div>
      {/* Hero split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh]">
          <img src={profileSubscriptionImg} alt="Votre abonnement" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-lg md:text-xl">
            Votre engagement
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Mon Abonnement
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-xl md:text-2xl">
            Gérez votre abonnement, mettez votre profil en pause, ou explorez de nouvelles options.
          </p>
        </div>
      </section>

      {/* Subscription details */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Current plan - DESIGN LUXE BLANC COHÉRENT */}
            <div className="flex flex-col h-full">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-6">Offre actuelle</h3>

              <div className="bg-white border border-secondary shadow-sm p-8 md:p-10 transition-all duration-500 hover:shadow-md flex flex-col flex-1 rounded-[2rem]">
                {/* En-tête avec Badge Intégré */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border border-secondary flex items-center justify-center rounded-2xl bg-secondary/20">
                      <Sparkles className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <h3 className="font-heading text-3xl text-foreground md:text-4xl">Offre Découverte</h3>
                  </div>
                </div>

                {/* Badge Statut & Prix */}
                <div className="mb-8 pb-8 border-b border-secondary">
                  <div className="inline-flex items-center justify-center bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] px-4 py-1.5 text-sm font-bold tracking-[0.15em] uppercase rounded-lg mb-6">
                    Offre Active
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-heading text-5xl md:text-6xl text-foreground">60€</span>
                    <span className="text-xl text-muted-foreground font-medium">/ 3 mois</span>
                  </div>
                  <p className="text-muted-foreground tracking-widest uppercase text-sm font-medium mt-3">
                    Expire le 12 juin 2026
                  </p>
                </div>

                {/* Fonctionnalités */}
                <h4 className="font-medium text-foreground mb-5 text-xl">Inclus dans votre offre :</h4>
                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Espace personnel",
                    "Compte vérifié",
                    "Messagerie illimitée",
                    "Test de personnalité",
                    "Quiz de vos préférences",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <Check className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                      <span className="text-foreground/80 leading-relaxed text-lg">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton d'action */}
                <button className="w-full bg-[#1B2333] text-white py-5 text-base uppercase tracking-widest font-medium transition-all duration-300 hover:bg-[hsl(var(--gold))] hover:text-white flex items-center justify-center gap-3 shadow-md rounded-2xl">
                  Changer d'offre <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pause / Cancel - HARMONISÉ AVEC LE MÊME BORDER-RADIUS */}
            <div className="flex flex-col h-full pt-14 lg:pt-0 space-y-8">
              <div className="bg-secondary/30 p-8 md:p-10 rounded-[2rem] border border-secondary flex flex-col justify-center">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-3">Besoin d'une pause ?</h3>
                <p className="mb-6 leading-relaxed text-lg text-muted-foreground">
                  Mettez votre compte en veille pendant 1 mois sans perdre vos données ni vos conversations.
                </p>
                <Button
                  onClick={() => setPauseOpen(true)}
                  variant="outline"
                  className="py-6 px-8 text-lg h-auto w-full border-secondary hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05] hover:text-[hsl(var(--gold))] transition-colors rounded-2xl bg-white"
                >
                  <Pause className="h-5 w-5 mr-3" />
                  Mettre mon profil en pause
                </Button>
              </div>

              <div className="bg-secondary/30 p-8 md:p-10 rounded-[2rem] border border-secondary flex flex-col justify-center">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-3">
                  Vous souhaitez nous quitter ?
                </h3>
                <p className="mb-6 leading-relaxed text-lg text-muted-foreground">
                  Cette action est irréversible. Votre profil et toutes vos données seront définitivement supprimés.
                </p>
                <Button
                  onClick={() => setCancelOpen(true)}
                  variant="outline"
                  className="py-6 px-8 text-lg h-auto w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors rounded-2xl bg-white"
                >
                  Demander la résiliation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pause Modal - SQUARE & ELEGANCE */}
      <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-8 sm:px-12 py-10 space-y-8">
            {/* Header / Titre */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Pause className="h-8 w-8 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-foreground text-3xl md:text-4xl leading-tight">
                Prenez le temps de souffler.
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
                Mettez votre compte en veille pendant 1 mois. Voici comment cela fonctionne :
              </p>
            </div>

            {/* Infos - Compact & Elegant */}
            <div className="space-y-4 py-2">
              {[
                {
                  icon: EyeOff,
                  title: "Discrétion absolue",
                  desc: "Votre profil devient instantanément invisible pour les autres membres.",
                },
                {
                  icon: Heart,
                  title: "Données conservées",
                  desc: "Vous gardez l'accès à vos messages jusqu'à la fin du mois réglé.",
                },
                {
                  icon: Bell,
                  title: "Zéro mauvaise surprise",
                  desc: "Nous vous enverrons un e-mail pour vous prévenir avant la réactivation.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-5 p-5 rounded-3xl bg-secondary/40 border border-secondary text-left"
                >
                  <item.icon className="h-7 w-7 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold text-xl">{item.title}</p>
                    <p className="leading-relaxed text-muted-foreground mt-1 text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4 text-center">
              <Button
                className="w-full h-16 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
                onClick={() => {
                  setPauseOpen(false);
                  toast({
                    title: "Compte mis en pause",
                    description: "Votre profil est désormais en veille pour 1 mois.",
                  });
                }}
              >
                <Check className="h-6 w-6 mr-3" />
                Confirmer ma pause d'un mois
              </Button>
              <button
                onClick={() => setPauseOpen(false)}
                className="w-full h-12 rounded-2xl text-muted-foreground hover:text-foreground font-medium transition-colors text-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CancellationFlow open={cancelOpen} onOpenChange={setCancelOpen} firstName={firstName} />
    </div>
  );
}
