import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, UserCheck, Eye, HeartHandshake } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";

const commitments = [
  { icon: UserCheck, title: "Contrôle des inscriptions", description: "Chaque demande d'adhésion fait l'objet d'un contrôle manuel systématique et approfondi par notre équipe basée en France." },
  { icon: Shield, title: "Protection des données", description: "Vos informations restent confidentielles, jamais partagées sans votre accord préalable." },
  { icon: Eye, title: "Profils vérifiés", description: "Les comptes inactifs, suspects et demandes fantaisistes sont supprimés." },
  { icon: HeartHandshake, title: "Accompagnement", description: "Des conseils personnalisés et une analyse approfondie de votre profil." },
];

export default function CommitmentsSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span data-reveal className="text-center font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6 text-xl">
              04 — Nos engagements
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              La confiance au cœur
              <br />
              de notre démarche
            </h2>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto" />
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
            {commitments.map((commitment, index) => (
              <div
                key={index}
                data-reveal
                data-reveal-delay={String(100 + index * 150)}
                className="group p-10 bg-secondary border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-card"
              >
                <commitment.icon className="h-8 w-8 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="font-heading text-foreground mb-4 text-3xl">{commitment.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">{commitment.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div data-reveal data-reveal-delay="200" className="text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block bg-primary text-primary-foreground px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px]"
            >
              Rejoindre Kalimera
            </button>
            <p className="mt-6 text-muted-foreground">
              <Link to="/connexion" className="link-underline hover:text-primary transition-colors text-2xl">
                Déjà membre ? Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </section>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
