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

  // 1. MÉMOIREinstantanée : On restaure la position AVANT le premier rendu visuel
  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem("legalMenuScroll");
    if (scrollRef.current && savedScroll) {
      scrollRef.current.scrollLeft = parseInt(savedScroll, 10);
    }
  }, []);

  // 2. CENTRAGE DOUX : Une fois monté, on ajuste pour centrer l'onglet actif
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const activeTab = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeTab) {
        const targetScroll = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
    }
  }, [pathname]);

  // 3. SAUVEGARDE : On note la position à chaque mouvement
  const handleScroll = () => {
    if (scrollRef.current) {
      sessionStorage.setItem("legalMenuScroll", scrollRef.current.scrollLeft.toString());
    }
  };

  const scrollToTop = () => {
    // On remonte la page, mais on laisse le menu gérer son propre scroll horizontal
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
    <nav className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-[26px] my-0 pt-[50px]">
      <div className="container-main mx-auto flex items-center relative">
        {/* Flèche Gauche */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={currentIndex <= 0}
          className={cn(
            "z-20 p-2 rounded-full bg-white border border-gray-200 shadow-sm transition-all ml-2",
            currentIndex <= 0 ? "opacity-0 invisible" : "hover:bg-gray-50 text-[#1B2333] hover:scale-105",
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* ZONE DE SCROLL AVEC MÉMOIRE */}
        <div className="relative flex-1 flex items-center overflow-hidden">
          {/* Dégradés premium pour masquer la coupe du texte */}
          <div className="absolute left-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-x-auto whitespace-nowrap flex gap-4 flex-1 scrollbar-hide px-12"
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
                    "inline-block px-5 py-2.5 text-[13px] uppercase tracking-widest font-bold rounded-full transition-all duration-1000 shrink-0 border-2",
                    isActive
                      ? "bg-[#1B2333] text-white border-[#1B2333] shadow-lg"
                      : "bg-transparent text-gray-400 border-transparent hover:text-[#1B2333] hover:border-gray-200",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="min-w-[80px] h-1 shrink-0" />
          </div>

          <div className="absolute right-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={currentIndex >= legalLinks.length - 1}
          className={cn(
            "z-20 p-2 rounded-full bg-white border border-gray-100 shadow-sm transition-all mr-2",
            currentIndex >= legalLinks.length - 1
              ? "opacity-0 invisible"
              : "hover:bg-gray-50 text-[#1B2333] hover:scale-105",
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
