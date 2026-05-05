import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, Crown, Check, Gift, ArrowRight, CreditCard, PhoneCall, Video } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import PrivilegeBadge from "@/components/location/PrivilegeBadge";
import privilegesHero from "@/assets/privileges-hero.jpg";
import giftBannerPrivileges from "@/assets/gift-banner-privileges.jpg";

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

  // État unique pour la demande d'admission (plus besoin de l'état expertModal)
  const [modalOpen, setModalOpen] = useState(false);

  const handleVIPWaitlist = () => {
    setModalOpen(true);
  };

  return (
    <Layout>
      {/* Bloc 1 — Hero : L'Invitation */}
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

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-10 w-80 h-80 bg-[hsl(var(--gold-light))] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-xl animate-fade-in md:text-2xl">
            L'Invitation
          </span>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-8 leading-tight animate-fade-up">
            L'accès au Cercle Kalimera
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mx-auto mb-10 animate-fade-in delay-200" />

          <div className="inline-block border border-[hsl(var(--gold)/0.4)] bg-[hsl(var(--gold)/0.1)] backdrop-blur-sm px-8 py-5 md:px-12 md:py-6 mb-10 animate-fade-up delay-300">
            <p className="font-heading text-xl md:text-4xl text-[hsl(var(--gold-light))] font-medium">
              L'élégance de la confiance :
              <br />
              Vos 3 premiers mois offerts
            </p>
          </div>

          <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-up delay-400 text-primary-foreground font-medium md:text-2xl">
            Prenez le temps de faire des rencontres authentiques. Aucune empreinte bancaire ne vous sera demandée lors
            de votre admission.
          </p>

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
                <p className="text-primary-foreground/90 text-xl leading-snug md:text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 2 — Les Adhésions */}
      <section ref={cardsRef} className="section-luxury bg-[#FCF9F5] py-24 md:py-32">
        <div className="container-main mx-auto px-4 md:px-8">
          {/* Titre et Signature 3 mois */}
          <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
            <h2 data-reveal className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
              Choisissez votre cercle
            </h2>

            <div
              data-reveal
              data-reveal-delay="150"
              className="flex flex-col md:flex-row items-center justify-center gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[hsl(var(--gold))] hidden md:block" />
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-[hsl(var(--gold))]" />
                <p className="text-xl text-foreground font-heading tracking-wide md:text-3xl">
                  Vos 3 premiers mois offerts.
                  <br />
                  Pour toute adhésion validée d'ici le 30 septembre 2026
                </p>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[hsl(var(--gold))] hidden md:block" />
            </div>
          </div>

          {/* Bloc Cercle Privé : 2 formules + VIP */}
          <div className="max-w-6xl mx-auto">
            {/* Wrapper Cercle Privé */}
            <div
              data-reveal
              data-reveal-delay="200"
              className="bg-white border border-slate-200/60 shadow-sm p-8 md:p-12 mb-10 relative"
            >
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-white px-6 py-1.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-md">
                Invitation Privilège
              </div>

              <div className="flex items-center justify-center gap-4 mb-3 mt-2">
                <div className="w-12 h-12 border border-slate-200 flex items-center justify-center rounded-sm">
                  <Sparkles className="h-5 w-5 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-3xl text-foreground md:text-4xl">Cercle Privé</h3>
              </div>
              <p className="text-center text-[hsl(var(--gold))] font-bold tracking-widest uppercase text-base md:text-lg mb-10">
                3 mois offerts — sans engagement
              </p>

              {/* Les 2 formules */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
                {/* Formule Mensuelle */}
                <div className="border-2 border-slate-200 p-8 md:p-10 flex flex-col rounded-sm transition-all hover:border-[hsl(var(--gold)/0.5)]">
                  <p className="font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 text-base md:text-lg">
                    Adhésion mensuelle
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-heading text-5xl md:text-6xl text-foreground">50€</span>
                    <span className="text-xl text-muted-foreground">/ mois</span>
                  </div>
                  <p className="text-muted-foreground text-lg mb-8">Liberté totale, mois par mois.</p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto w-full bg-white border-2 border-foreground text-foreground py-5 text-base uppercase tracking-widest font-medium transition-all hover:bg-foreground hover:text-white flex items-center justify-center gap-2"
                  >
                    Choisir la mensuelle <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Formule Trimestrielle (recommandée) */}
                <div className="relative border-2 border-[hsl(var(--gold))] p-8 md:p-10 flex flex-col rounded-sm bg-[hsl(var(--gold)/0.04)] shadow-md">
                  <div className="absolute -top-3 right-6 bg-[hsl(var(--gold))] text-primary px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase rounded-full">
                    Recommandé · -30€
                  </div>
                  <p className="font-medium tracking-[0.2em] uppercase text-[hsl(var(--gold))] mb-4 text-base md:text-lg">
                    Adhésion trimestrielle
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-heading text-5xl md:text-6xl text-foreground">120€</span>
                    <span className="text-xl text-muted-foreground">/ 3 mois</span>
                  </div>
                  <p className="text-muted-foreground text-lg mb-8">Soit 40€/mois — économisez 30€.</p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto w-full bg-foreground text-white py-5 text-base uppercase tracking-widest font-medium transition-all hover:bg-[hsl(var(--gold))] hover:text-white flex items-center justify-center gap-2 shadow-md"
                  >
                    Choisir la trimestrielle <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Avantages communs */}
              <div className="border-t border-slate-100 pt-8">
                <p className="text-center font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6 text-base">
                  Inclus dans les deux formules
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
                  {cerclePriveFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-1" />
                      <span className="text-foreground/80 leading-relaxed text-xl">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Carré VIP */}
            <div
              data-reveal
              data-reveal-delay="300"
              className="relative bg-primary border border-[hsl(var(--gold)/0.3)] shadow-2xl p-10 md:p-14 flex flex-col max-w-3xl mx-auto rounded-sm"
            >
              {/* Badge "Bientôt disponible" */}
              <div className="absolute -top-4 right-8 bg-white/10 text-white px-5 py-1.5 text-base font-medium tracking-[0.2em] uppercase rounded-full backdrop-blur-sm border border-white/20">
                Bientôt disponible
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[hsl(var(--gold)/0.1)] border border-[hsl(var(--gold)/0.3)] flex items-center justify-center rounded-sm">
                  <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-3xl text-white md:text-4xl">Le Carré VIP</h3>
              </div>

              {/* Pricing */}
              <div className="mb-4 pb-8 border-b border-white/10">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-heading text-5xl md:text-6xl text-white">12€</span>
                  <span className="font-heading text-3xl text-white/50 line-through">24€</span>
                  <span className="text-xl text-white/70">/ mois</span>
                </div>
                <p className="text-[hsl(var(--gold))] font-bold tracking-widest uppercase text-lg">
                  Sans engagement
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-5 mb-10 mt-8 flex-1">
                {[
                  "Inclus dans les deux formules +",
                  "Mode Invisible — Vous choisissez qui vous voit",
                  "Confirmation de lecture — Savoir si on a lu votre message",
                  "Alertes Conciergerie — Notifications par SMS discrets",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                    <span className="text-white/90 leading-relaxed text-xl">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleVIPWaitlist}
                className="w-full bg-[hsl(var(--gold))] text-primary py-5 text-lg uppercase tracking-widest font-bold transition-all hover:bg-[hsl(var(--gold-light))] min-h-[64px] flex items-center justify-center gap-2"
              >
                Rejoindre la liste d'attente VIP
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 3 — L'Expertise */}
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
              className="inline-block px-4 py-1.5 border border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] font-medium tracking-[0.2em] uppercase mb-8 md:text-base text-xl"
            >
              Privilège Optionnel
            </span>
            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-8 leading-tight"
            >
              Services Optionnels
            </h2>

            <p
              data-reveal
              data-reveal-delay="350"
              className="text-lg text-primary-foreground/80 leading-relaxed mb-12 max-w-4xl mx-auto md:text-2xl"
            >
              Allez au-delà de l'algorithme. Profitez d'une expertise humaine sur-mesure pour vous accompagner dans la création de votre profil.
            </p>
          </div>

          {/* Grille 2 cartes Services Optionnels */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto text-left">
            {/* Card 1 — Pack Clé en main */}
            <div
              data-reveal
              data-reveal-delay="200"
              className="bg-white/5 border border-[hsl(var(--gold)/0.3)] backdrop-blur-sm p-10 flex flex-col rounded-sm shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[hsl(var(--gold)/0.1)] border border-[hsl(var(--gold)/0.3)] flex items-center justify-center rounded-sm">
                  <PhoneCall className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-3xl text-primary-foreground md:text-4xl">Pack "Clé en main"</h3>
              </div>

              <p className="text-primary-foreground/80 text-xl leading-relaxed mb-8 flex-1">
                Notre équipe vous appelle et remplit l'intégralité de votre profil pour vous (questionnaire de personnalité + infos). Coaching vidéo inclus.
              </p>

              <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-white/10">
                <span className="font-heading text-5xl md:text-6xl text-primary-foreground">89€</span>
                <span className="font-heading text-3xl text-primary-foreground/50 line-through">129€</span>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-[hsl(var(--gold))] text-primary py-5 text-lg uppercase tracking-widest font-bold transition-all hover:bg-[hsl(var(--gold-light))] min-h-[64px] flex items-center justify-center gap-2"
              >
                Ajouter le pack
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Card 2 — Coaching Vidéo */}
            <div
              data-reveal
              data-reveal-delay="350"
              className="bg-white/5 border border-[hsl(var(--gold)/0.3)] backdrop-blur-sm p-10 flex flex-col rounded-sm shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[hsl(var(--gold)/0.1)] border border-[hsl(var(--gold)/0.3)] flex items-center justify-center rounded-sm">
                  <Video className="h-6 w-6 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-3xl text-primary-foreground md:text-4xl">Coaching Vidéo</h3>
              </div>

              <p className="text-primary-foreground/80 text-xl leading-relaxed mb-8 flex-1">
                Un expert vous guide en direct via Google Meet (sans accès à votre ordinateur) pour réaliser des photos et une vidéo d'une qualité optimale.
              </p>

              <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-white/10">
                <span className="font-heading text-5xl md:text-6xl text-primary-foreground">35€</span>
                <span className="font-heading text-3xl text-primary-foreground/50 line-through">70€</span>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-[hsl(var(--gold))] text-primary py-5 text-lg uppercase tracking-widest font-bold transition-all hover:bg-[hsl(var(--gold-light))] min-h-[64px] flex items-center justify-center gap-2"
              >
                Ajouter le coaching
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 (Ex-Bloc 5) — Sécurité & Sérénité (Remonté avant le parrainage) */}
      <section ref={reassuranceRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl"
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
                <h3 className="font-heading text-xl text-foreground mb-4 md:text-3xl">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 5 (Ex-Bloc 4) — L'Invitation Privée (Descendu après la sécurité) */}
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
                className="inline-block bg-primary-foreground text-secondary-foreground px-12 py-5 text-xl font-medium tracking-wide transition-all duration-500 hover:shadow-[var(--shadow-elevated)] hover:translate-y-[-2px]"
              >
                J'invite un proche
              </Link>
            </div>
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
            className="text-lg text-muted-foreground leading-relaxed mb-10 md:text-2xl"
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

      {/* Modale d'admission classique (Unique point d'entrée) */}
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
