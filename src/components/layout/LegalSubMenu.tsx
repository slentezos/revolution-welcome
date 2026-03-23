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

  // 1. Centrage Manuel & Premium : On ne fait bouger QUE le conteneur, pas la page.
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      // On cherche l'élément actif par son attribut data-active
      const activeTab = container.querySelector('[data-active="true"]') as HTMLElement;

      if (activeTab) {
        const containerWidth = container.offsetWidth;
        const tabOffset = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;

        // Calcul précis pour centrer l'onglet dans la zone visible
        const targetScroll = tabOffset - containerWidth / 2 + tabWidth / 2;

        container.scrollTo({
          left: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [pathname]);

  // 2. Remontée en haut de page (uniquement le contenu principal)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentIndex = legalLinks.findIndex((link) => pathname.replace(/\/$/, "") === link.href.replace(/\/$/, ""));

  // 3. Navigation par flèches : change de route, ce qui déclenche le useEffect de scroll
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
    <nav className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-md border-b border-border py-4 shadow-sm">
      <div className="container-main mx-auto flex items-center relative group">
        {/* Flèche Gauche */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={currentIndex <= 0}
          className={cn(
            "z-20 p-2 rounded-full bg-white border border-border shadow-sm transition-all duration-300 ml-2",
            currentIndex <= 0 ? "opacity-0 invisible" : "hover:scale-110 hover:border-primary active:scale-95",
          )}
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* ZONE DE SCROLL FLUIDE AVEC EFFET FADE */}
        <div className="relative flex-1 flex items-center overflow-hidden">
          {/* Dégradés élégants pour ne pas couper le texte net */}
          <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="overflow-x-auto whitespace-nowrap flex gap-4 flex-1 scrollbar-hide scroll-smooth px-10"
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
                    "inline-block px-6 py-2.5 text-[13px] uppercase tracking-widest font-bold rounded-full transition-all duration-500 shrink-0 border-2",
                    isActive
                      ? "bg-[#1B2333] text-white border-[#1B2333] shadow-lg scale-105"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:border-gray-200",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Espace de fin pour équilibrer le scroll */}
            <div className="min-w-[50px] h-1 shrink-0" />
          </div>

          <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={currentIndex >= legalLinks.length - 1}
          className={cn(
            "z-20 p-2 rounded-full bg-white border border-border shadow-sm transition-all duration-300 mr-2",
            currentIndex >= legalLinks.length - 1
              ? "opacity-0 invisible"
              : "hover:scale-110 hover:border-primary active:scale-95",
          )}
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </nav>
  );
}
