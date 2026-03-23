import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité (RGPD)" },
  { href: "/cgu", label: "Conditions générales d'utilisation (CGU)" },
  { href: "/cookies", label: "Politique relative aux cookies et autres traceurs" },
  { href: "/charte-bienveillance", label: "Charte de sécurité et de bienveillance" },
  { href: "/signaler-contenu", label: "Signaler un contenu illégal" },
  { href: "/faq", label: "FAQ" },
];

export default function LegalSubMenu() {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fonction pour remonter en haut de page lors du clic
  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // "smooth" pour une remontée douce, "instant" pour un saut immédiat
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-border py-4 shadow-sm transition-all duration-500">
      <div className="container-main mx-auto px-4 md:px-12 flex items-center gap-2">
        {/* Flèche Gauche */}
        <button
          onClick={() => scroll("left")}
          className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Conteneur des onglets */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap py-1 flex gap-3 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {legalLinks.map((link) => {
            // Normalisation des slashes pour une comparaison robuste
            const isActive = pathname.replace(/\/$/, "") === link.href.replace(/\/$/, "");

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={handleLinkClick}
                className={cn(
                  "inline-block px-6 py-2.5 font-medium rounded-full transition-all duration-300 shrink-0 text-base md:text-lg",
                  isActive
                    ? "bg-[#1B2333] text-white shadow-md scale-105"
                    : "text-muted-foreground hover:text-[#1B2333] hover:bg-gray-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => scroll("right")}
          className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
          aria-label="Défiler à droite"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
}
