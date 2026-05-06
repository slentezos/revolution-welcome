import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Pause, EyeOff, Heart, Bell, Sparkles, ArrowRight, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CancellationFlow from "./CancellationFlow";
import profileSubscriptionImg from "@/assets/profile-subscription.jpg";

interface ProfileSubscriptionTabProps {
  firstName?: string | null;
  /** Plan currently active */
  currentPlan?: "trimestrielle" | "mensuelle" | "vip";
  /** Date the user subscribed (ISO). Defaults to today. */
  subscribedAt?: string;
  /** True if the user benefits from the 3 free months offer from the home page */
  hasFreeTrial?: boolean;
}

const PLAN_LABELS: Record<"trimestrielle" | "mensuelle" | "vip", string> = {
  trimestrielle: "Cercle Privé — Trimestrielle",
  mensuelle: "Cercle Privé — Mensuelle",
  vip: "Carré VIP",
};

const PLAN_PRICE: Record<"trimestrielle" | "mensuelle" | "vip", { amount: string; period: string; note: string }> = {
  trimestrielle: { amount: "120€", period: "/ 3 mois", note: "Soit 40€/mois" },
  mensuelle: { amount: "50€", period: "/ mois", note: "Sans engagement" },
  vip: { amount: "62€", period: "/ mois", note: "Cercle Privé + Carré VIP" },
};

function formatFrenchDate(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfileSubscriptionTab({
  firstName,
  currentPlan = "trimestrielle",
  subscribedAt,
  hasFreeTrial = true,
}: ProfileSubscriptionTabProps) {
  const [pauseOpen, setPauseOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"trimestrielle" | "mensuelle" | "vip">(currentPlan);

  // Compute next renewal / expiration date
  const startDate = subscribedAt ? new Date(subscribedAt) : new Date();
  const expiryDate = new Date(startDate);
  if (hasFreeTrial) expiryDate.setMonth(expiryDate.getMonth() + 3);
  if (currentPlan === "trimestrielle") expiryDate.setMonth(expiryDate.getMonth() + 3);
  else expiryDate.setMonth(expiryDate.getMonth() + 1);

  const planLabel = PLAN_LABELS[currentPlan];
  const planPrice = PLAN_PRICE[currentPlan];

  return (
    <div>
      {/* Hero split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh]">
          <img
            decoding="async"
            src={profileSubscriptionImg}
            alt="Votre abonnement"
            className="w-full h-full object-cover"
          />
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
                    <h3 className="font-heading text-3xl text-foreground md:text-4xl">{planLabel}</h3>
                  </div>
                </div>

                {/* Badge Statut & Prix */}
                <div className="mb-8 pb-8 border-b border-secondary">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="inline-flex items-center justify-center bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] px-4 py-1.5 font-bold tracking-[0.15em] uppercase rounded-lg text-lg">
                      Formule active
                    </div>
                    {hasFreeTrial && (
                      <div className="inline-flex items-center justify-center bg-[hsl(var(--gold))] text-primary px-4 py-1.5 font-bold tracking-[0.15em] uppercase rounded-lg text-lg">
                        3 mois offerts
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-heading text-5xl md:text-6xl text-foreground">{planPrice.amount}</span>
                    <span className="text-muted-foreground font-medium text-2xl">{planPrice.period}</span>
                  </div>
                  <p className="text-muted-foreground tracking-widest uppercase font-medium mt-3 text-xl">
                    {planPrice.note}
                  </p>
                  <p className="text-foreground font-semibold mt-4 text-xl">
                    {hasFreeTrial ? "Fin de la période offerte" : "Prochain prélèvement"} le {formatFrenchDate(expiryDate)}
                  </p>
                </div>

                {/* Fonctionnalités */}
                <h4 className="font-medium text-foreground mb-5 text-2xl">Inclus dans votre offre :</h4>
                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Messagerie illimitée",
                    "Appels Audio & Vidéo illimités",
                    "Profils vérifiés manuellement",
                    "Anonymat garanti",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <Check className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                      <span className="text-foreground/80 leading-relaxed text-xl">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Options souscrites */}
                <div className="mb-8 pt-6 border-t border-secondary">
                  <h4 className="font-medium text-foreground mb-5 text-2xl">Options souscrites :</h4>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Conciergerie — Création de profil",
                        desc: "Accompagnement personnalisé par notre équipe",
                        price: "89€",
                      },
                      {
                        title: "Studio Vidéo Professionnel",
                        desc: "Tournage de votre vidéo de présentation",
                        price: "49€",
                      },
                    ].map((opt) => (
                      <li
                        key={opt.title}
                        className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-secondary"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <Sparkles className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-foreground font-semibold text-xl leading-snug">{opt.title}</p>
                            <p className="text-muted-foreground text-lg mt-1 leading-relaxed">{opt.desc}</p>
                          </div>
                        </div>
                        <span className="font-heading text-2xl text-foreground shrink-0">{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton d'action */}
                <button
                  onClick={() => setChangeOpen(true)}
                  className="w-full bg-[#1B2333] text-white py-5 text-base uppercase tracking-widest font-medium transition-all duration-300 hover:bg-[hsl(var(--gold))] hover:text-white flex items-center justify-center gap-3 shadow-md rounded-2xl"
                >
                  Changer d'offre <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pause / Cancel - HARMONISÉ AVEC LE MÊME BORDER-RADIUS */}
            <div className="flex flex-col h-full pt-14 lg:pt-0 space-y-8">
              <div className="bg-secondary/30 p-8 md:p-10 rounded-[2rem] border border-secondary flex flex-col justify-center">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-3">Besoin d'une pause ?</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground text-xl">
                  Mettez votre compte en veille pendant 1 mois sans perdre vos données ni vos conversations.
                </p>
                <Button
                  onClick={() => setPauseOpen(true)}
                  variant="outline"
                  className="py-6 px-8 text-xl h-auto w-full border-secondary hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))/0.05] hover:text-[hsl(var(--gold))] transition-colors rounded-2xl bg-white"
                >
                  <Pause className="h-5 w-5 mr-3" />
                  Mettre mon profil en pause
                </Button>
              </div>

              <div className="bg-secondary/30 p-8 md:p-10 rounded-[2rem] border border-secondary flex flex-col justify-center">
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-3">
                  Vous souhaitez nous quitter ?
                </h3>
                <p className="mb-6 leading-relaxed text-muted-foreground text-xl">
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
              <p className="text-muted-foreground text-lg md:text-2xl max-w-md mx-auto">
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
                    <p className="leading-relaxed text-muted-foreground mt-1 text-xl">{item.desc}</p>
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
                className="w-full h-12 rounded-2xl text-muted-foreground hover:text-foreground font-medium transition-colors text-xl"
              >
                Annuler
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Plan Modal */}
      <Dialog open={changeOpen} onOpenChange={setChangeOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl bg-white">
          <div className="px-6 sm:px-10 py-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-2">
                <Sparkles className="h-8 w-8 text-[hsl(var(--gold))]" />
              </div>
              <h2 className="font-heading text-foreground text-3xl md:text-4xl leading-tight">Changer d'offre</h2>
              <p className="text-muted-foreground text-lg md:text-2xl max-w-md mx-auto">
                Choisissez la formule qui vous correspond le mieux.
              </p>
            </div>

            {/* Current subscription summary */}
            <div className="rounded-3xl border-2 border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--gold))]/15 flex items-center justify-center shrink-0">
                  <Check className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <div>
                  <p className="font-medium tracking-[0.15em] uppercase text-muted-foreground text-base mb-1">
                    Votre offre actuelle
                  </p>
                  <p className="font-heading text-2xl md:text-3xl text-foreground leading-tight">{planLabel}</p>
                  <p className="text-muted-foreground text-lg mt-2">
                    {hasFreeTrial ? "Période offerte jusqu'au" : "Expire le"}{" "}
                    <span className="text-foreground font-semibold">{formatFrenchDate(expiryDate)}</span>
                  </p>
                </div>
              </div>
              {hasFreeTrial && (
                <div className="inline-flex items-center justify-center bg-[hsl(var(--gold))] text-primary px-4 py-2 font-bold tracking-[0.15em] uppercase rounded-lg text-base shrink-0">
                  3 mois offerts
                </div>
              )}
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Trimestrielle */}
              <button
                type="button"
                onClick={() => setSelectedPlan("trimestrielle")}
                className={`text-left p-6 rounded-3xl border-2 transition-all relative ${
                  selectedPlan === "trimestrielle"
                    ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-md"
                    : "border-secondary bg-white hover:border-[hsl(var(--gold))]/40"
                }`}
              >
                <div className="absolute -top-3 right-6 bg-[hsl(var(--gold))] text-primary px-3 py-1 font-bold tracking-[0.15em] uppercase rounded-full text-base">
                  Recommandé
                </div>
                <p className="font-medium tracking-[0.15em] uppercase text-muted-foreground mb-3 text-base">
                  Adhésion trimestrielle
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-heading text-4xl md:text-5xl text-foreground">120€</span>
                  <span className="text-muted-foreground text-xl">/ 3 mois</span>
                </div>
                <p className="text-muted-foreground text-lg mb-4">Soit 40€/mois — économisez 30€.</p>
                {selectedPlan === "trimestrielle" && (
                  <div className="flex items-center gap-2 text-[hsl(var(--gold))] font-medium text-lg">
                    <Check className="h-5 w-5" /> Sélectionnée
                  </div>
                )}
              </button>

              {/* Mensuelle */}
              <button
                type="button"
                onClick={() => setSelectedPlan("mensuelle")}
                className={`text-left p-6 rounded-3xl border-2 transition-all ${
                  selectedPlan === "mensuelle"
                    ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-md"
                    : "border-secondary bg-white hover:border-[hsl(var(--gold))]/40"
                }`}
              >
                <p className="font-medium tracking-[0.15em] uppercase text-muted-foreground mb-3 text-base">
                  Adhésion mensuelle
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-heading text-4xl md:text-5xl text-foreground">50€</span>
                  <span className="text-muted-foreground text-xl">/ mois</span>
                </div>
                <p className="text-muted-foreground text-lg mb-4">Liberté totale, mois par mois.</p>
                {selectedPlan === "mensuelle" && (
                  <div className="flex items-center gap-2 text-[hsl(var(--gold))] font-medium text-lg">
                    <Check className="h-5 w-5" /> Sélectionnée
                  </div>
                )}
              </button>
            </div>

            {/* VIP add-on */}
            <button
              type="button"
              onClick={() => setSelectedPlan("vip")}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all relative ${
                selectedPlan === "vip"
                  ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-md"
                  : "border-secondary bg-white hover:border-[hsl(var(--gold))]/40"
              }`}
            >
              <div className="absolute -top-3 right-6 bg-foreground text-white px-3 py-1 font-bold tracking-[0.15em] uppercase rounded-full text-base">
                Bientôt disponible
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
                <p className="font-medium tracking-[0.15em] uppercase text-foreground text-base">
                  Ajouter le Carré VIP
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-heading text-3xl md:text-4xl text-foreground">+12€</span>
                <span className="text-muted-foreground text-xl">/ mois</span>
              </div>
              <p className="text-muted-foreground text-lg">Mode Invisible, accusés de lecture, alertes Conciergerie.</p>
            </button>

            {/* Reassurance */}
            <p className="text-center text-muted-foreground leading-relaxed text-xl">
              Désactivation libre · Aucun frais caché · Paiement sécurisé
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full h-16 rounded-2xl text-primary-foreground text-xl font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all shadow-md"
                onClick={() => {
                  setChangeOpen(false);
                  toast({
                    title: "Demande enregistrée",
                    description:
                      selectedPlan === "vip"
                        ? "Vous serez informé(e) dès l'ouverture du Carré VIP."
                        : "Votre nouvelle formule sera appliquée à la prochaine échéance.",
                  });
                }}
              >
                <Check className="h-6 w-6 mr-3" />
                Confirmer mon choix
              </Button>
              <button
                onClick={() => setChangeOpen(false)}
                className="w-full h-12 rounded-2xl text-muted-foreground hover:text-foreground font-medium transition-colors text-xl"
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
