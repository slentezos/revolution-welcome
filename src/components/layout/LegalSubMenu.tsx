import { useLocation, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateByArrow = (direction: "left" | "right") => {
    const currentIndex = legalLinks.findIndex((link) => pathname.replace(/\/$/, "") === link.href.replace(/\/$/, ""));

    if (direction === "left" && currentIndex > 0) {
      navigate(legalLinks[currentIndex - 1].href);
      scrollToTop();
    } else if (direction === "right" && currentIndex < legalLinks.length - 1) {
      navigate(legalLinks[currentIndex + 1].href);
      scrollToTop();
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-gray-50/95 backdrop-blur-sm border-y border-gray-200 py-4 shadow-sm">
      <div className="container-main mx-auto px-2 md:px-6 flex items-center">
        {/* Flèche Gauche */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={pathname === legalLinks[0].href}
          className={cn(
            "p-2 rounded-full transition-all shrink-0 bg-white border border-gray-200 shadow-sm z-10",
            pathname === legalLinks[0].href ? "opacity-20 cursor-not-allowed" : "hover:bg-gray-100 text-[#1B2333]",
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Zone de Scroll avec Padding augmenté */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap flex gap-4 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth py-2 px-10"
        >
          {legalLinks.map((link) => {
            const isActive = pathname.replace(/\/$/, "") === link.href.replace(/\/$/, "");
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={scrollToTop}
                className={cn(
                  "inline-block px-6 py-2.5 font-semibold rounded-full transition-all duration-300 shrink-0 text-sm md:text-base border",
                  isActive
                    ? "bg-[#1B2333] text-white border-[#1B2333] shadow-md scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1B2333] hover:text-[#1B2333]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Petit espace vide à la fin pour ne pas que le dernier item soit collé */}
          <div className="w-10 shrink-0" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={pathname === legalLinks[legalLinks.length - 1].href}
          className={cn(
            "p-2 rounded-full transition-all shrink-0 bg-white border border-gray-200 shadow-sm z-10",
            pathname === legalLinks[legalLinks.length - 1].href
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-gray-100 text-[#1B2333]",
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
