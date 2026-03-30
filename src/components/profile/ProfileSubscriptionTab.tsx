import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Votre engagement
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Mon Abonnement
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
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
              <div className="bg-primary/5 p-8 border border-primary/20 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-2xl font-semibold text-foreground">Offre Découverte</span>
                  <span className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium tracking-wide">
                    Actif
                  </span>
                </div>
                <p className="text-muted-foreground text-xl mb-2">3 mois — 60 €</p>
                <p className="text-muted-foreground text-lg">Expire le 12 juin 2026</p>
              </div>

              <h4 className="font-medium text-foreground mb-4 text-2xl">Inclus dans votre offre :</h4>
              <ul className="space-y-3 text-muted-foreground text-lg">
                {["Espace personnel", "Compte vérifié", "Messagerie illimitée", "Test de personnalité", "Quiz de vos préférences"].map((item) =>
                <li key={item} className="flex items-center gap-3 text-xl">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))]" />
                    {item}
                  </li>
                )}
              </ul>

              <Button className="btn-primary py-5 px-10 text-lg h-auto min-h-[56px] mt-10">
                Changer d'offre
              </Button>
            </div>

            {/* Pause / Cancel */}
            <div className="space-y-10">
              <div className="bg-secondary p-8 md:p-10">
                <h3 className="font-heading text-2xl text-foreground mb-3 font-medium">Besoin d'une pause ?</h3>
                <p className="mb-6 leading-relaxed text-xl text-secondary-foreground">
                  Mettez votre compte en veille sans perdre vos données ni vos conversations.
                </p>
                <Button
                  onClick={() => setPauseOpen(true)}
                  className="btn-outline py-5 px-10 text-lg h-auto min-h-[56px] w-full">
                  <Pause className="h-5 w-5 mr-3" />
                  Mettre mon profil en pause
                </Button>
              </div>

              <div className="bg-secondary p-8 md:p-10">
                <h3 className="font-heading text-2xl text-foreground mb-3 font-medium">Vous souhaitez nous quitter ?</h3>
                <p className="mb-6 leading-relaxed text-xl text-secondary-foreground">
                  Cette action est irréversible. Votre profil et toutes vos données seront définitivement supprimés.
                </p>
                <Button
                  onClick={() => setCancelOpen(true)}
                  variant="outline"
                  className="py-5 px-10 text-lg h-auto min-h-[56px] border-2 border-destructive text-destructive hover:bg-destructive/5 w-full rounded-none">
                  Demander la résiliation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pause Modal */}
      <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 space-y-6">
            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Pause className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading font-bold text-[#1B2333] text-3xl">
              Prenez le temps de souffler.
            </h2>
            <p className="text-center text-foreground mb-6 text-2xl">
              Mettez votre compte en veille pendant 1 mois. Voici comment cela fonctionne :
            </p>

            <div className="space-y-3">
              {[
              { icon: EyeOff, title: "Discrétion absolue", desc: "Dès aujourd'hui, votre profil devient invisible pour les nouvelles rencontres." },
              { icon: Heart, title: "Vos données sont gardées au chaud", desc: "Vous gardez l'accès à vos messages jusqu'à la fin de votre mois déjà réglé. Au-delà, votre messagerie sera mise en veille." },
              { icon: Bell, title: "Zéro mauvaise surprise", desc: "Nous vous enverrons deux petits mots par e-mail pour vous prévenir avant la réactivation." }].
              map((item) =>
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
                  <item.icon className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#1B2333] font-semibold text-xl">{item.title}</p>
                    <p className="leading-relaxed text-foreground text-xl">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
                onClick={() => {
                  setPauseOpen(false);
                  toast({ title: "Compte mis en pause", description: "Votre profil est désormais en veille pour 1 mois." });
                }}>
                <Check className="h-4 w-4 mr-2" />
                Confirmer ma pause d'un mois
              </Button>
              <button
                onClick={() => setPauseOpen(false)}
                className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] hover:bg-gray-50 font-medium text-xl">
                Annuler
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CancellationFlow open={cancelOpen} onOpenChange={setCancelOpen} firstName={firstName} />
    </div>);
}