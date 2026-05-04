import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, Crown, Check, Gift, ArrowRight, CreditCard } from "lucide-react";
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

          {/* Les Cartes */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto items-center">
            {/* Carte Cercle Privé (OFFRE ACTIVE) */}
            <div
              data-reveal
              data-reveal-delay="200"
              className="group bg-white border border-slate-200/60 shadow-sm p-10 md:p-12 transition-all duration-500 hover:shadow-lg flex flex-col h-full z-20 relative"
            >
              {/* Badge Membre Fondateur */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-white px-6 py-1.5 text-base font-bold tracking-[0.2em] uppercase rounded-full shadow-md">
                Invitation Privilège
              </div>

              <div className="flex items-center gap-4 mb-8 mt-2">
                <div className="w-12 h-12 border border-slate-200 flex items-center justify-center rounded-sm">
                  <Sparkles className="h-5 w-5 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-2xl text-foreground md:text-4xl">Cercle Privé</h3>
              </div>

              <div className="mb-10 pb-8 border-b border-slate-100">
                <div className="mb-4 text-center">
                  {/* CORRECTION ICI : Retrait du /30 sur la couleur de décoration */}
                  <span className="font-heading text-5xl text-foreground line-through decoration-[#1B2333] decoration-[3px] text-center">
                    50€
                  </span>
                </div>
                <p className="text-[hsl(var(--gold))] font-bold tracking-widest uppercase mb-1 text-xl">
                  ACCÈS GRATUIT PENDANT 3 MOIS SANS ENGAGEMENT
                </p>
                <p className="text-muted-foreground tracking-widest uppercase text-lg">
                  Puis 50€/mois (ou 120€ / 3 mois)
                </p>
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {cerclePriveFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-relaxed text-xl">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-foreground text-white py-4 text-lg uppercase tracking-widest font-medium transition-all duration-300 hover:bg-[hsl(var(--gold))] hover:text-white flex items-center justify-center gap-2 shadow-md"
              >
                Accepter mon invitation <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Carte Discrétion Absolue (VIP) - FLOUTÉE / TEASING */}
            <div
              data-reveal
              data-reveal-delay="300"
              className="group relative bg-primary border border-[hsl(var(--gold)/0.3)] shadow-2xl p-10 md:p-14 flex flex-col h-full md:scale-105 z-10 overflow-hidden"
            >
              {/* LE MESSAGE D'ATTENTE NET (Par-dessus le flou) */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 bg-primary/20 backdrop-blur-[1px]">
                <div className="w-16 h-16 bg-primary/80 border border-[hsl(var(--gold)/0.5)] flex items-center justify-center rounded-full mb-6 shadow-xl">
                  <Crown className="h-8 w-8 text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-heading text-3xl md:text-4xl text-white mb-4">Le Carré VIP</h3>
                <p className="text-[hsl(var(--gold))] font-bold tracking-widest uppercase mb-6 border-b border-[hsl(var(--gold)/0.3)] pb-2 text-lg">
                  Bientôt ouvert
                </p>
                <p className="text-white/90 leading-relaxed max-w-[280px] text-xl">
                  Afin de garantir l'excellence absolue de nos mises en relation, ce service d'exception ouvrira ses
                  portes très prochainement.
                </p>
              </div>

              {/* LE CONTENU INITIAL FLOUTÉ ET INCLIQUABLE */}
              <div
                className="flex-1 flex flex-col blur-[6px] opacity-30 select-none pointer-events-none"
                aria-hidden="true"
              >
                <div className="absolute top-0 right-8 bg-[hsl(var(--gold))] text-primary px-4 py-2 font-bold tracking-[0.2em] uppercase rounded-b-sm text-base">
                  Privilège
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[hsl(var(--gold)/0.1)] border border-[hsl(var(--gold)/0.3)] flex items-center justify-center rounded-sm">
                    <Crown className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </div>
                  <h3 className="font-heading text-2xl text-white md:text-4xl">Discrétion Absolue</h3>
                </div>

                <div className="mb-10 pb-8 border-b border-white/10">
                  <div className="mb-4">
                    <span className="font-heading text-5xl text-white line-through decoration-white decoration-2">
                      65€
                    </span>
                  </div>
                  <p className="text-[12px] text-[hsl(var(--gold))] font-bold tracking-widest uppercase mb-1">
                    ACCÈS GRATUIT PENDANT 3 MOIS SANS ENGAGEMENT
                  </p>
                  <p className="text-[11px] text-white/50 tracking-widest uppercase">
                    Puis 65€/mois (ou 150€ / 3 mois)
                  </p>
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                  {discretionFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-4">
                      <Check className="h-5 w-5 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                      <span className="text-white/90 leading-relaxed text-xl">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  tabIndex={-1}
                  className="w-full bg-[hsl(var(--gold))] text-primary py-4 text-lg uppercase tracking-widest font-bold"
                >
                  Demander mon admission VIP
                </button>
              </div>
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
              L'Accompagnement Signature
            </h2>

            <p
              data-reveal
              data-reveal-delay="350"
              className="text-lg text-primary-foreground/80 leading-relaxed mb-6 max-w-4xl mx-auto md:text-2xl"
            >
              Allez au-delà de l'algorithme. Profitez d'une expertise humaine sur-mesure pour décrypter votre test de
              personnalité ou confier la création de votre profil à notre conciergerie.
            </p>

            <p
              data-reveal
              data-reveal-delay="400"
              className="text-lg text-primary-foreground/60 italic mb-12 md:text-2xl"
            >
              Un service exclusif et facultatif pour nos membres les plus exigeants.
            </p>

            <div data-reveal data-reveal-delay="450">
              {/* Le bouton déclenche maintenant directement l'admission (modalOpen) */}
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-3 border border-primary-foreground/30 text-primary-foreground px-10 py-5 text-base font-medium tracking-wide transition-all duration-500 hover:bg-primary-foreground hover:text-primary group"
              >
                Demander mon admission
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
