import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Shield,
  Clock,
  Sparkles,
  Crown,
  Check,
  Gift,
  ArrowRight,
  CreditCard,
  Info,
  UserCheck,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import PrivilegeBadge from "@/components/location/PrivilegeBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// ... (Gardez vos constantes features et reassuranceItems inchangées)

export default function Privileges() {
  const cardsRef = useScrollReveal<HTMLElement>();
  const expertRef = useScrollReveal<HTMLElement>();
  const giftRef = useScrollReveal<HTMLElement>();
  const reassuranceRef = useScrollReveal<HTMLElement>();
  const finalRef = useScrollReveal<HTMLElement>();

  const [modalOpen, setModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false); // Modal spécifique pour l'expertise

  return (
    <Layout>
      {/* Bloc 1 — Hero : L'Invitation (Inchangé) */}
      {/* ... Votre code actuel ... */}

      {/* Bloc 2 — Les Adhésions (Inchangé) */}
      {/* ... Votre code actuel ... */}

      {/* Bloc 3 — L'Expertise : L'Accompagnement Signature */}
      <section ref={expertRef} className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(var(--navy-light))]" />

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div data-reveal className="mb-6">
              <span className="text-[hsl(var(--gold-light))] text-sm font-bold tracking-[0.2em] uppercase bg-[hsl(var(--gold)/0.1)] px-4 py-1 border border-[hsl(var(--gold)/0.2)]">
                Privilège Optionnel
              </span>
            </div>

            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-3xl md:text-4xl lg:text-6xl text-primary-foreground mb-6 leading-tight"
            >
              L'Accompagnement Signature
            </h2>

            <p
              data-reveal
              data-reveal-delay="350"
              className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-12 max-w-3xl mx-auto"
            >
              Allez au-delà de l'algorithme. Profitez d'une expertise humaine sur-mesure pour décrypter votre test de
              personnalité ou confier la création de votre profil à notre conciergerie.
              <span className="block mt-4 italic text-primary-foreground/50">
                Un service exclusif et facultatif pour nos membres les plus exigeants.
              </span>
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

      {/* Bloc 4 — L'Invitation Privée (Ciblage Proches/Enfants) */}
      <section ref={giftRef} className="bg-secondary py-24 border-y border-border relative overflow-hidden">
        <div className="container-main mx-auto px-6 md:px-12 text-center relative z-10">
          <div
            data-reveal
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-[hsl(var(--gold)/0.3)] mb-8"
          >
            <Gift className="w-7 h-7 text-[hsl(var(--gold))]" />
          </div>

          <h2 data-reveal data-reveal-delay="150" className="font-heading text-3xl md:text-4xl text-foreground mb-6">
            Vous souhaitez recommander Kalimera ?
          </h2>

          <p
            data-reveal
            data-reveal-delay="250"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Vous avez un parent ou un ami de plus de 60 ans qui mérite de faire de belles rencontres en toute sécurité ?
            Envoyez-lui une invitation personnelle : nous l'accueillerons avec{" "}
            <strong>3 mois de privilèges offerts</strong>, sans engagement.
          </p>

          <div data-reveal data-reveal-delay="350">
            <Link
              to="/parrainage"
              className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 text-base font-medium tracking-wide transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
            >
              Envoyer une invitation élégante
              <UserCheck className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc 5 — Sécurité & Sérénité (Les 3 Boîtes inchangées) */}
      {/* ... Votre code actuel pour reassuranceRef ... */}

      {/* Bloc 6 — Rappel Final (Bottom CTA) */}
      {/* ... Votre code actuel pour finalRef ... */}

      {/* --- MODALES DE LOGIQUE --- */}

      {/* Modal Teaser Expertise (Service à la carte) */}
      <Dialog open={expertModalOpen} onOpenChange={setExpertModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-[hsl(var(--gold)/0.2)] p-8">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
            </div>
            <DialogTitle className="font-heading text-2xl md:text-3xl text-primary mb-2">
              Un privilège réservé à nos membres
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 leading-relaxed">
              Pour garantir la confidentialité de nos experts et la qualité de notre accompagnement, l'accès à la
              Conciergerie est <strong>exclusivement réservé aux membres admis</strong> du Cercle Kalimera.
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
                setModalOpen(true);
              }}
              className="w-full bg-primary text-white py-4 rounded-none font-medium hover:bg-primary/90 transition-colors"
            >
              Demander mon admission pour accéder au service
            </button>
            <button
              onClick={() => setExpertModalOpen(false)}
              className="w-full text-slate-400 text-sm hover:text-primary transition-colors"
            >
              Continuer la découverte
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
