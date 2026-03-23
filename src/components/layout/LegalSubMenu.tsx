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
  const activeRef = useRef<HTMLAnchorElement>(null);

  // 1. SCROLL AUTO : Centre l'onglet actif dès qu'on change de page
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Crucial : cela centre le bouton dans la barre
        block: "nearest",
      });
    }
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2. NAVIGATION FLÈCHES : Change de page et déclenche le scroll auto
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
    <nav className="sticky top-16 md:top-20 z-40 bg-gray-50 border-y border-gray-200 py-5 shadow-md">
      <div className="container-main mx-auto px-4 flex items-center relative">
        {/* Flèche Gauche */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={pathname === legalLinks[0].href}
          className={cn(
            "absolute left-2 z-20 p-2 rounded-full bg-white border border-gray-200 shadow-lg transition-all",
            pathname === legalLinks[0].href ? "opacity-10 cursor-not-allowed" : "hover:scale-110 active:scale-95",
          )}
        >
          <ChevronLeft className="h-6 w-6 text-[#1B2333]" />
        </button>

        {/* ZONE DE SCROLL - Masquée mais fonctionnelle */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap flex gap-4 flex-1 scrollbar-hide scroll-smooth px-12 md:px-20"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {legalLinks.map((link) => {
            const isActive = pathname.replace(/\/$/, "") === link.href.replace(/\/$/, "");
            return (
              <Link
                key={link.href}
                to={link.href}
                ref={isActive ? activeRef : null}
                onClick={scrollToTop}
                className={cn(
                  "inline-block px-8 py-3 font-bold rounded-full transition-all duration-300 shrink-0 text-base md:text-lg border-2",
                  isActive
                    ? "bg-[#1B2333] text-white border-[#1B2333] shadow-xl scale-105"
                    : "bg-white text-gray-500 border-gray-100 hover:border-[#1B2333] hover:text-[#1B2333]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Espace de fin pour permettre le centrage du dernier item */}
          <div className="min-w-[100px] h-1 shrink-0" />
        </div>

        {/* Flèche Droite */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={pathname === legalLinks[legalLinks.length - 1].href}
          className={cn(
            "absolute right-2 z-20 p-2 rounded-full bg-white border border-gray-200 shadow-lg transition-all",
            pathname === legalLinks[legalLinks.length - 1].href
              ? "opacity-10 cursor-not-allowed"
              : "hover:scale-110 active:scale-95",
          )}
        >
          <ChevronRight className="h-6 w-6 text-[#1B2333]" />
        </button>
      </div>
    </nav>
  );
}
