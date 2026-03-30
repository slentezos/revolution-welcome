import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Pause, EyeOff, Heart, Bell } from "lucide-react";
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Current plan */}
            <div>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-8">Offre actuelle</h3>
              <div className="bg-primary/5 p-8 border border-primary/20 mb-8 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-2xl font-semibold text-foreground">Offre Découverte</span>
                  <span className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium tracking-wide rounded-sm">
                    Actif
                  </span>
                </div>
                <p className="text-muted-foreground text-lg md:text-xl mb-2">3 mois — 60 €</p>
                <p className="text-muted-foreground text-base md:text-lg">Expire le 12 juin 2026</p>
              </div>

              <h4 className="font-medium text-foreground mb-4 text-xl md:text-2xl">Inclus dans votre offre :</h4>
              <ul className="space-y-3 text-muted-foreground text-lg">
                {[
                  "Espace personnel",
                  "Compte vérifié",
                  "Messagerie illimitée",
                  "Test de personnalité",
                  "Quiz de vos préférences",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-lg md:text-xl">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 py-5 px-10 text-lg h-auto min-h-[56px] mt-10 rounded-sm">
                Changer d'offre
              </Button>
            </div>

            {/* Pause / Cancel */}
            <div className="space-y-10">
              <div className="bg-secondary p-8 md:p-10 rounded-lg">
                <h3 className="font-heading text-2xl text-foreground mb-3 font-medium">Besoin d'une pause ?</h3>
                <p className="mb-6 leading-relaxed text-lg md:text-xl text-secondary-foreground">
                  Mettez votre compte en veille sans perdre vos données ni vos conversations.
                </p>
                <Button
                  onClick={() => setPauseOpen(true)}
                  variant="outline"
                  className="py-5 px-10 text-lg h-auto min-h-[56px] w-full border-primary/20 hover:bg-primary hover:text-white transition-colors"
                >
                  <Pause className="h-5 w-5 mr-3" />
                  Mettre mon profil en pause
                </Button>
              </div>

              <div className="bg-secondary p-8 md:p-10 rounded-lg">
                <h3 className="font-heading text-2xl text-foreground mb-3 font-medium">
                  Vous souhaitez nous quitter ?
                </h3>
                <p className="mb-6 leading-relaxed text-lg md:text-xl text-secondary-foreground">
                  Cette action est irréversible. Votre profil et toutes vos données seront définitivement supprimés.
                </p>
                <Button
                  onClick={() => setCancelOpen(true)}
                  variant="outline"
                  className="py-5 px-10 text-lg h-auto min-h-[56px] border-2 border-destructive text-destructive hover:bg-destructive hover:text-white w-full transition-colors"
                >
                  Demander la résiliation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pause Modal - REDESIGNED FOR SQUARE & ELEGANCE */}
      <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
          <div className="px-8 sm:px-12 py-10 space-y-6">
            {/* Header / Titre */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Pause className="h-6 w-6 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading font-medium text-foreground text-3xl">Prenez le temps de souffler.</h2>
              <p className="text-muted-foreground max-w-sm mx-auto text-xl">
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
                  className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary text-left"
                >
                  <item.icon className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold text-xl">{item.title}</p>
                    <p className="leading-relaxed text-muted-foreground mt-0.5 text-xl">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions - Plus aérées */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                className="w-full h-14 rounded-xl text-primary-foreground text-xl font-medium bg-primary hover:bg-primary/90 transition-all shadow-sm"
                onClick={() => {
                  setPauseOpen(false);
                  toast({
                    title: "Compte mis en pause",
                    description: "Votre profil est désormais en veille pour 1 mois.",
                  });
                }}
              >
                <Check className="h-5 w-5 mr-2" />
                Confirmer ma pause d'un mois
              </Button>
              <button
                onClick={() => setPauseOpen(false)}
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-medium transition-colors text-xl"
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
