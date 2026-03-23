import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useLayoutEffect } from "react";
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

  // 1. RESTAURATION INSTANTANÉE (Zéro saut visuel)
  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem("legalMenuScroll");
    if (scrollRef.current && savedScroll) {
      scrollRef.current.scrollLeft = parseInt(savedScroll, 10);
    }
  }, []);

  // 2. CENTRAGE "CHUCHOTÉ" (Lent et fluide)
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const activeTab = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeTab) {
        // Calcul pour placer l'élément au centre exact
        const targetScroll = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;

        // On utilise un timeout léger pour laisser le temps au rendu de se stabiliser
        const timeout = setTimeout(() => {
          container.scrollTo({ left: targetScroll, behavior: "smooth" });
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [pathname]);

  const handleScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem("legalMenuScroll", scrollRef.current.scrollLeft.toString());
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentIndex = legalLinks.findIndex((link) => pathname.replace(/\/$/, "") === link.href.replace(/\/$/, ""));

  const navigateByArrow = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      navigate(legalLinks[currentIndex - 1].href);
      scrollToTop();
    } else if (direction === "right" && currentIndex < legalLinks.length - 1) {
      navigate(legalLinks[currentIndex + 1].href);
      scrollToTop();
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100 py-5 transition-all duration-1000 ease-in-out">
      <div className="container-main mx-auto flex items-center relative px-2">
        {/* Dégradés de masquage ultra-doux */}
        <div className="absolute left-12 w-20 h-full bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none" />

        {/* Flèche Gauche - Style minimaliste luxe */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={currentIndex <= 0}
          className={cn(
            "z-20 p-2.5 rounded-full bg-white/80 border border-gray-100 shadow-sm transition-all duration-700 ease-out ml-2",
            currentIndex <= 0 ? "opacity-0 scale-75" : "hover:bg-white hover:scale-110 hover:shadow-md text-[#1B2333]",
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* ZONE DE DÉFILEMENT */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto whitespace-nowrap flex gap-8 flex-1 scrollbar-hide px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                  "inline-block py-2 text-[13px] uppercase tracking-[0.2em] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) shrink-0 relative",
                  isActive
                    ? "text-[#1B2333] font-bold opacity-100"
                    : "text-gray-400 hover:text-gray-600 font-medium opacity-70 hover:opacity-100",
                )}
              >
                {link.label}
                {/* Ligne d'accentuation Dorée/Marine qui s'anime en douceur */}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[1.5px] bg-[#C5A059] transition-all duration-1000 ease-in-out",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0",
                  )}
                />
              </Link>
            );
          })}
          <div className="min-w-[150px] h-1 shrink-0" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={currentIndex >= legalLinks.length - 1}
          className={cn(
            "z-20 p-2.5 rounded-full bg-white/80 border border-gray-100 shadow-sm transition-all duration-700 ease-out mr-2",
            currentIndex >= legalLinks.length - 1
              ? "opacity-0 scale-75"
              : "hover:bg-white hover:scale-110 hover:shadow-md text-[#1B2333]",
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute right-12 w-20 h-full bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none" />
      </div>
    </nav>
  );
}
