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

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

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
    <nav className="sticky top-16 md:top-20 z-40 bg-secondary/80 backdrop-blur-md border-b border-border py-4 shadow-[var(--shadow-soft)]">
      <div className="container-main mx-auto px-4 flex items-center relative">
        {/* Left Arrow */}
        <button
          onClick={() => navigateByArrow("left")}
          disabled={currentIndex <= 0}
          className={cn(
            "absolute left-1 z-20 p-1.5 rounded-full bg-card border border-border shadow-sm transition-all duration-300",
            currentIndex <= 0 ? "opacity-20 cursor-not-allowed" : "hover:scale-105 hover:border-primary/30 active:scale-95",
          )}
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>

        {/* Scroll Area */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap flex gap-2.5 flex-1 scrollbar-hide scroll-smooth px-10 md:px-14"
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
                  "inline-block px-5 py-2 text-[13px] uppercase tracking-wider font-medium rounded-full transition-all duration-500 shrink-0 border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="min-w-[60px] h-1 shrink-0" />
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => navigateByArrow("right")}
          disabled={currentIndex >= legalLinks.length - 1}
          className={cn(
            "absolute right-1 z-20 p-1.5 rounded-full bg-card border border-border shadow-sm transition-all duration-300",
            currentIndex >= legalLinks.length - 1
              ? "opacity-20 cursor-not-allowed"
              : "hover:scale-105 hover:border-primary/30 active:scale-95",
          )}
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </nav>
  );
}