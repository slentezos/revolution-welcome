import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, Crown, Check, Gift, ArrowRight, CreditCard } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import PrivilegeBadge from "@/components/location/PrivilegeBadge";
import privilegesHero from "@/assets/privileges-hero.jpg";
import giftBannerPrivileges from "@/assets/gift-banner-privileges.jpg";

// Imports pour la modale Shadcn UI (Assurez-vous d'avoir ce composant dans votre projet Lovable)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const cerclePriveFeatures = [
  "Messagerie illimitée",
  "Appels Audio & Vidéo illimités",
  "Profils vérifiés manuellement",
  "Anonymat garanti",
];

const discretionFeatures = [
  "Tout le Cercle Privé inclus",
  "Mode Invisible — Vous choisissez qui vous voit",
  "Alertes Conciergerie — SMS discrets",
];

const reassuranceItems = [
  {
    icon: Lock,
    title: "Paiement 100% sécurisé",
    description:
      "Normes bancaires françaises. Vos données financières sont protégées par les standards les plus stricts.",
  },
  {
    icon: Shield,
    title: "Transparence totale",
    description: "Aucun frais caché, aucun frais de dossier. Le montant affiché est le montant prélevé.",
  },
  {
    icon: Clock,
    title: "Désactivation libre",
    description: "Suspendez votre adhésion en un clic, sans préavis. Vous restez maître de votre engagement.",
  },
];

export default function Privileges() {
  const cardsRef = useScrollReveal<HTMLElement>();
  const expertRef = useScrollReveal<HTMLElement>();
  const giftRef = useScrollReveal<HTMLElement>();
  const reassuranceRef = useScrollReveal<HTMLElement>();
  const finalRef = useScrollReveal<HTMLElement>();

  // États pour les modales
  const [modalOpen, setModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);

  return (
    <Layout>
      {/* Bloc 1 — Hero : L'Invitation — Full-screen with background image */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={privilegesHero}
            alt="Le Cercle Kalimera"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/90" />
        </div>

        {/* Decorative blurs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-10 w-80 h-80 bg-[hsl(var(--gold-light))] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-lg md:text-xl animate-fade-in">
            L'Invitation
          </span>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-8 leading-tight animate-fade-up">
            L'accès au Cercle Kalimera
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mx-auto mb-10 animate-fade-in delay-200" />

          {/* Gold Banner */}
          <div className="inline-block border border-[hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.1)] backdrop-blur-sm px-8 py-5 md:px-12 md:py-6 mb-10 animate-fade-up delay-300">
            <p className="font-heading text-xl md:text-2xl text-[hsl(var(--gold-light))] font-medium">
              L'élégance de la confiance : Vos 3 premiers mois offerts.
            </p>
          </div>

          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-up delay-400">
            Prenez le temps de faire des rencontres authentiques. Aucune empreinte bancaire ne vous sera demandée lors
            de votre admission.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto animate-fade-up delay-500">
            {[
              { value: "90", label: "Jours de découverte offerts" },
              { value: "0€", label: "Aucune empreinte bancaire" },
              { value: "100%", label: "Profils vérifiés manuellement" },
              { value: "24/7", label: "Conciergerie à votre écoute" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${i === 0 ? "bg-primary-foreground/20" : "bg-primary-foreground/10"} backdrop-blur-sm border border-primary-foreground/20 p-6 md:p-8 text-center`}
              >
                <span className="font-heading text-3xl md:text-4xl text-[hsl(var(--gold-light))] font-medium block mb-2">
                  {stat.value}
                </span>
                <p className="text-primary-foreground/90 text-lg md:text-base leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 2 — Les Adhésions */}
      <section ref={cardsRef} className="section-luxury bg-secondary">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg"
            >
              Les Adhésions
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6"
            >
              Choisissez votre cercle
            </h2>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-8" />
          </div>

          {/* Free trial highlight banner */}
          <div data-reveal data-reveal-delay="300" className="max-w-3xl mx-auto mb-16">
            <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--gold)/0.08)] to-[hsl(var(--gold-light)/0.08)] border border-[hsl(var(--gold)/0.3)] p-6 md:p-8 text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold)/0.1)] rounded-full blur-2xl" />
              <div className="relative flex flex-col items-center gap-3">
                <PrivilegeBadge variant="light" />
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CreditCard className="h-5 w-5 text-[hsl(var(--gold))]" />
                  <p className="text-base md:text-lg font-medium">
                    Aucune carte bancaire requise — Commencez librement, décidez ensuite.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Carte Cercle Privé */}
            <div
              data-reveal
              data-reveal-delay="100"
              className="group relative bg-card border border-border p-10 md:p-12 transition-all duration-500 hover:shadow-[var(--shadow-luxury)] hover:border-primary/20 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl text-foreground">Cercle Privé</h3>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-heading text-4xl md:text-5xl text-foreground font-semibold">50€</span>
                  <span className="text-muted-foreground text-lg">/mois</span>
                </div>
                <p className="text-muted-foreground text-base">ou 120€ pour 3 mois</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {cerclePriveFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                    <span className="text-foreground text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-primary text-primary-foreground py-4 text-base font-medium tracking-wide transition-all duration-500 hover:shadow-[var(--shadow-elevated)] hover:translate-y-[-2px]"
              >
                Demander mon admission
              </button>
            </div>

            {/* Carte Discrétion Absolue — VIP */}
            <div
              data-reveal
              data-reveal-delay="250"
              className="group relative bg-card border-2 border-[hsl(var(--gold)/0.4)] p-10 md:p-12 transition-all duration-500 hover:shadow-[var(--shadow-luxury)] hover:border-[hsl(var(--gold)/0.6)] flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="absolute -top-4 right-8 bg-[hsl(var(--gold))] text-primary px-5 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
                VIP
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[hsl(var(--gold)/0.15)] flex items-center justify-center">
                  <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl text-[hsl(var(--gold))]">Discrétion Absolue</h3>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-heading text-4xl md:text-5xl text-foreground font-semibold">65€</span>
                  <span className="text-muted-foreground text-lg">/mois</span>
                </div>
                <p className="text-muted-foreground text-base">ou 150€ pour 3 mois</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {discretionFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                    <span className="text-foreground text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-[hsl(var(--gold))] text-primary py-4 text-base font-medium tracking-wide transition-all duration-500 hover:bg-[hsl(var(--gold-light))] hover:shadow-[var(--shadow-elevated)] hover:translate-y-[-2px]"
              >
                Demander mon admission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 3 — L'Expertise — Avec logique Modale ajoutée */}
      <section ref={expertRef} className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(var(--navy-light))]" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[hsl(var(--gold-light))] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <span
              data-reveal
              className="inline-block px-4 py-1.5 border border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] font-medium tracking-[0.2em] uppercase mb-8 text-sm md:text-base"
            >
              Privilège Optionnel
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-8 leading-tight"
            >
              L'Accompagnement Signature
            </h2>

            <p
              data-reveal
              data-reveal-delay="350"
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-6 max-w-4xl mx-auto"
            >
              Allez au-delà de l'algorithme. Profitez d'une expertise humaine sur-mesure pour décrypter votre test de
              personnalité ou confier la création de votre profil à notre conciergerie.
            </p>

            <p
              data-reveal
              data-reveal-delay="400"
              className="text-lg md:text-xl text-primary-foreground/60 italic mb-12"
            >
              Un service exclusif et facultatif pour nos membres les plus exigeants.
            </p>

            <div data-reveal data-reveal-delay="450">
              <button
                onClick={() => setExpertModalOpen(true)}
                className="inline-flex items-center gap-3 border border-primary-foreground/30 text-primary-foreground px-10 py-5 text-base font-medium tracking-wide transition-all duration-500 hover:bg-primary-foreground hover:text-primary group"
              >
                Découvrir ce service à la carte
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 — L'Invitation Privée (Inchangé de votre code) */}
      <section ref={giftRef} className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={giftBannerPrivileges}
            alt="Offrir une invitation élégante"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/50" />
        </div>

        <div className="relative z-10 py-20 md:py-28 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div
              data-reveal
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[hsl(var(--gold)/0.4)] mb-8"
            >
              <Gift className="w-7 h-7 text-[hsl(var(--gold))]" />
            </div>

            <div data-reveal data-reveal-delay="150" className="divider-gold mx-auto mb-8" />

            <div data-reveal data-reveal-delay="200" className="mb-8">
              <PrivilegeBadge variant="dark" />
            </div>

            <h2
              data-reveal
              data-reveal-delay="300"
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4 leading-tight"
            >
              Une personne de votre entourage mérite
              <br />
              de faire de belles rencontres ?
            </h2>

            <p
              data-reveal
              data-reveal-delay="450"
              className="font-heading text-2xl text-[hsl(var(--gold-light))] mb-10 md:text-4xl"
            >
              Invitez-la en lui offrant 3 mois gratuits.
            </p>

            <div data-reveal data-reveal-delay="600">
              <Link
                to="/parrainage"
                className="inline-block bg-primary-foreground text-secondary-foreground px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:shadow-[var(--shadow-elevated)] hover:translate-y-[-2px]"
              >
                J'invite un proche
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 5 — Sécurité & Sérénité */}
      <section ref={reassuranceRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg"
            >
              Sécurité & Sérénité
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6"
            >
              Votre tranquillité d'esprit
            </h2>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {reassuranceItems.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                data-reveal-delay={String(100 + index * 150)}
                className="group text-center p-10 bg-secondary border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-[var(--shadow-card)]"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border border-[hsl(var(--gold)/0.3)] mb-6 group-hover:border-[hsl(var(--gold)/0.6)] transition-colors">
                  <item.icon className="h-7 w-7 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 6 — Rappel Final */}
      <section ref={finalRef} className="relative py-24 md:py-32 overflow-hidden bg-secondary border-t border-border">
        <div className="container-main mx-auto px-6 md:px-12 text-center max-w-3xl relative z-10">
          <h2 data-reveal className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
            Prêt à rejoindre le Cercle ?
          </h2>
          <div data-reveal data-reveal-delay="150" className="divider-gold mx-auto mb-8" />
          <p
            data-reveal
            data-reveal-delay="250"
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10"
          >
            Profitez de vos 90 jours de découverte sans engagement.
          </p>
          <div data-reveal data-reveal-delay="350">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:shadow-[var(--shadow-elevated)] hover:translate-y-[-2px]"
            >
              Demander mon admission
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* --- MODALES --- */}

      {/* Modale d'admission classique (Existante) */}
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* NOUVELLE Modale Teaser Expertise (Service à la carte) */}
      <Dialog open={expertModalOpen} onOpenChange={setExpertModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-[hsl(var(--gold)/0.2)] p-8">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[hsl(var(--navy-light))/0.05] rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
            </div>
            <DialogTitle className="font-heading text-2xl md:text-3xl text-primary mb-2">
              Un privilège réservé à nos membres
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 leading-relaxed pt-2">
              Pour garantir la qualité de notre accompagnement, l'accès à la Conciergerie est{" "}
              <strong>exclusivement réservé aux membres admis</strong> du Cercle Kalimera.
              <br />
              <br />
              Ce service est entièrement facultatif et peut être sollicité à tout moment dès la validation de votre
              profil.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                setExpertModalOpen(false);
                setTimeout(() => setModalOpen(true), 150); // Ouvre la modale d'admission juste après
              }}
              className="w-full bg-primary text-white py-4 font-medium tracking-wide hover:bg-primary/90 transition-colors shadow-sm"
            >
              Demander mon admission pour accéder au service
            </button>
            <button
              onClick={() => setExpertModalOpen(false)}
              className="w-full py-3 text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            >
              Continuer la découverte du site
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
