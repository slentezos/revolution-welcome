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

  // Centrage chirurgical de l'onglet actif SANS faire bouger l'écran
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const activeTab = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeTab) {
        const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [pathname]);

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
    <nav className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3">
      <div className="container-main mx-auto flex items-center relative group">
        {/* Dégradé de masquage Gauche (Premium effect) */}
        <div className="absolute left-10 w-16 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Flèche Gauche */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={pathname === legalLinks[0].href}
          className={cn(
            "z-20 p-2 rounded-full bg-white/90 border border-gray-100 shadow-sm transition-all ml-2",
            pathname === legalLinks[0].href ? "opacity-0 invisible" : "hover:bg-gray-50 text-[#1B2333] hover:scale-105",
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* ZONE DE SCROLL ULTRA-FLUIDE */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap flex gap-6 flex-1 scrollbar-hide scroll-smooth px-12"
        >
          {legalLinks.map((link) => {
            const isActive = pathname.replace(/\/$/, "") === link.href.replace(/\/$/, "");
            return (
              <Link
                key={link.href}
                to={link.href}
                data-active={isActive}
                onClick={scrollToTop}
                className={cn(
                  "inline-block px-2 py-2 transition-all duration-500 shrink-0 text-sm md:text-base tracking-wide relative",
                  isActive ? "text-[#1B2333] font-bold" : "text-gray-400 hover:text-gray-600 font-medium",
                )}
              >
                {link.label}
                {/* Ligne de soulignement élégante pour l'état actif */}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1B2333] rounded-full transition-all duration-500" />
                )}
              </Link>
            );
          })}
          {/* Padding de fin invisible */}
          <div className="min-w-[100px] h-1 shrink-0" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={pathname === legalLinks[legalLinks.length - 1].href}
          className={cn(
            "z-20 p-2 rounded-full bg-white/90 border border-gray-100 shadow-sm transition-all mr-2",
            pathname === legalLinks[legalLinks.length - 1].href
              ? "opacity-0 invisible"
              : "hover:bg-gray-50 text-[#1B2333] hover:scale-105",
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dégradé de masquage Droite (Premium effect) */}
        <div className="absolute right-10 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </nav>
  );
}
