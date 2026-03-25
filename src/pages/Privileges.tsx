import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, Crown, Check, Gift } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import GiftBannerSection from "@/components/home/GiftBannerSection";

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
    description: "Normes bancaires françaises. Vos données financières sont protégées par les standards les plus stricts.",
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
  const heroRef = useScrollReveal<HTMLElement>();
  const cardsRef = useScrollReveal<HTMLElement>();
  const expertRef = useScrollReveal<HTMLElement>();
  const reassuranceRef = useScrollReveal<HTMLElement>();
  const finalRef = useScrollReveal<HTMLElement>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Layout>
      {/* Bloc 1 — Hero : L'Invitation */}
      <section ref={heroRef} className="section-luxury bg-background pt-32 md:pt-40">
        <div className="container-main mx-auto px-6 md:px-12 text-center max-w-4xl">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg">
            L'Invitation
          </span>
          <h1 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
            L'accès au Cercle Kalimera
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-10" />

          {/* Encart Or */}
          <div
            data-reveal
            data-reveal-delay="350"
            className="inline-block border border-gold/40 bg-gold/5 px-8 py-5 md:px-12 md:py-6 mb-10"
          >
            <p className="font-heading text-xl md:text-2xl text-gold font-medium">
              L'élégance de la confiance : Vos 3 premiers mois offerts.
            </p>
          </div>

          <p data-reveal data-reveal-delay="450" className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Prenez le temps de faire des rencontres authentiques. Aucune empreinte bancaire ne vous sera demandée lors de votre admission.
          </p>
        </div>
      </section>

      {/* Bloc 2 — Les Adhésions */}
      <section ref={cardsRef} className="section-luxury bg-secondary">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg">
              Les Adhésions
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Choisissez votre cercle
            </h2>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Carte Cercle Privé */}
            <div
              data-reveal
              data-reveal-delay="100"
              className="group bg-card border border-border p-10 md:p-12 transition-all duration-500 hover:shadow-card hover:border-primary/20 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
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
                    <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-primary text-primary-foreground py-4 text-base font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px]"
              >
                Demander mon admission
              </button>
            </div>

            {/* Carte Discrétion Absolue — VIP */}
            <div
              data-reveal
              data-reveal-delay="250"
              className="group relative bg-card border-2 border-gold/40 p-10 md:p-12 transition-all duration-500 hover:shadow-luxury hover:border-gold/60 flex flex-col"
            >
              {/* VIP Badge */}
              <div className="absolute -top-4 right-8 bg-gold text-primary px-5 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
                VIP
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-6 w-6 text-gold" />
                <h3 className="font-heading text-2xl md:text-3xl text-gold">Discrétion Absolue</h3>
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
                    <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground text-lg">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-gold text-primary py-4 text-base font-medium tracking-wide transition-all duration-500 hover:bg-gold-light hover:shadow-elevated hover:translate-y-[-2px]"
              >
                Demander mon admission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 3 — L'Expertise */}
      <section ref={expertRef} className="bg-primary text-primary-foreground">
        <div className="container-main mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <span data-reveal className="font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-6 block text-lg">
              L'Expertise
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6 leading-tight">
              Optimisez vos rencontres
            </h2>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-8" />
            <p data-reveal data-reveal-delay="350" className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-10 max-w-3xl mx-auto">
              Réservez un entretien privé avec nos experts pour décrypter votre test de personnalité et maximiser la qualité de vos rencontres.
            </p>
            <div data-reveal data-reveal-delay="450">
              <Link
                to="/contact"
                className="inline-block border border-primary-foreground/30 text-primary-foreground px-10 py-4 text-base font-medium tracking-wide transition-all duration-500 hover:bg-primary-foreground hover:text-primary"
              >
                Découvrir ce service à la carte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 — L'Invitation Privée (GiftBannerSection réutilisé) */}
      <GiftBannerSection />

      {/* Bloc 5 — Sécurité & Sérénité */}
      <section ref={reassuranceRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg">
              Sécurité & Sérénité
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
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
                className="group text-center p-10 bg-secondary border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-card"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold/30 mb-6 group-hover:border-gold/60 transition-colors">
                  <item.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 6 — Rappel Final */}
      <section ref={finalRef} className="bg-secondary border-t border-border">
        <div className="container-main mx-auto px-6 md:px-12 py-20 md:py-28 text-center max-w-3xl">
          <h2 data-reveal className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
            Prêt à rejoindre le Cercle ?
          </h2>
          <div data-reveal data-reveal-delay="150" className="divider-gold mx-auto mb-8" />
          <p data-reveal data-reveal-delay="250" className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            Profitez de vos 90 jours de découverte sans engagement.
          </p>
          <div data-reveal data-reveal-delay="350">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block bg-primary text-primary-foreground px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px]"
            >
              Demander mon admission
            </button>
          </div>
        </div>
      </section>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
