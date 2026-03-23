import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
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
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fonction pour remonter en haut de page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation via les flèches
  const navigateByArrow = (direction: "left" | "right") => {
    const currentIndex = legalLinks.findIndex((link) => pathname.replace(/\/$/, "") === link.href.replace(/\/$/, ""));

    if (direction === "left" && currentIndex > 0) {
      const newPath = legalLinks[currentIndex - 1].href;
      navigate(newPath);
      scrollToTop();
    } else if (direction === "right" && currentIndex < legalLinks.length - 1) {
      const newPath = legalLinks[currentIndex + 1].href;
      navigate(newPath);
      scrollToTop();
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-border py-4 shadow-sm">
      <div className="container-main mx-auto px-4 md:px-12 flex items-center gap-4">
        {/* Flèche Gauche - Change de tab */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={pathname === legalLinks[0].href}
          className={cn(
            "p-2 rounded-full transition-all shrink-0",
            pathname === legalLinks[0].href ? "opacity-20 cursor-not-allowed" : "hover:bg-gray-100 text-[#1B2333]",
          )}
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Conteneur des onglets */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap py-1 flex gap-3 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {legalLinks.map((link) => {
            const isActive = pathname.replace(/\/$/, "") === link.href.replace(/\/$/, "");

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={scrollToTop}
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

        {/* Flèche Droite - Change de tab */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={pathname === legalLinks[legalLinks.length - 1].href}
          className={cn(
            "p-2 rounded-full transition-all shrink-0",
            pathname === legalLinks[legalLinks.length - 1].href
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-gray-100 text-[#1B2333]",
          )}
          aria-label="Page suivante"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
}
