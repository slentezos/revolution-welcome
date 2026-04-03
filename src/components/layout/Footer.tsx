import { useState } from "react";
import { Link } from "react-router-dom";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import VisualComfortToggle from "./VisualComfortToggle";

const footerLinks = {
  discover: [
    { href: "/notre-démarche", label: "Notre méthode" },
    { href: "/a-propos", label: "Notre histoire" },
    { href: "/editorial", label: "L'éditorial" },
    { href: "/conseils", label: "Conseils" },
    { href: "/privileges", label: "Privilèges" },
    { href: "/contact", label: "Contact" },
  ],

  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/politique-confidentialite", label: "Politique de confidentialité (RGPD)" },
    { href: "/cgu", label: "Conditions générales d'utilisation (CGU)" },
    { href: "/cookies", label: "Politique relative aux cookies" },
    { href: "/charte-bienveillance", label: "Charte de sécurité et de bienveillance" },
    { href: "/signaler-contenu", label: "Signaler un contenu illégal" },
    { href: "/faq", label: "FAQ" },
  ],

  member: [
    { href: "/inscription", label: "Devenir membre" },
    { href: "/connexion", label: "Connexion" },
  ],
};

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <footer className="bg-primary text-primary-foreground">
        {/* Main Footer */}
        <div className="container-main mx-auto md:px-12 py-20 md:py-28 px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1 mx-px">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <span className="font-heading text-3xl font-medium">Kalimera</span>
              </Link>
              <p className="text-primary-foreground/60 leading-relaxed mb-8 text-xl">
                La plateforme d'élégance des rencontres après 60 ans. Déjà disponible en Île-de-France, bientôt chez
                vous.
              </p>
              <div className="text-neutral-400 text-xl">75% d'affinités réciproques</div>
            </div>

            {/* Découvrir */}
            <div>
              <h4 className="font-medium tracking-[0.2em] uppercase mb-6 text-xl text-neutral-400">Découvrir</h4>
              <ul className="space-y-4">
                {footerLinks.discover.map((link) => (
                  <li key={link.href} className="text-xl">
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div className="text-lg">
              <h4 className="font-medium tracking-[0.2em] uppercase mb-6 text-xl text-neutral-400">Légal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.href} className="text-xl">
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Membre */}
            <div className="text-lg">
              <h4 className="font-medium tracking-[0.2em] uppercase mb-6 text-xl text-neutral-400">Espace membre</h4>
              <ul className="space-y-4 mb-8 text-xl">
                {footerLinks.member.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-block border border-primary-foreground/30 text-primary-foreground px-6 py-3 font-medium tracking-wide transition-all duration-300 hover:bg-primary-foreground hover:text-primary text-xl"
              >
                Rejoindre le cercle
              </button>
              <div className="mt-6">
                <VisualComfortToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/10">
          <div className="container-main mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/40 text-lg">© 2026 Kalimera. Tous droits réservés.</p>
            <p className="text-primary-foreground/40 text-lg">Conçu avec amour pour les seniors</p>
          </div>
        </div>
      </footer>
    </>
  );
}
