import { useLocation, Link } from "react-router-dom";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll to active link when pathname changes
  useEffect(() => {
    if (activeLinkRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeEl = activeLinkRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      const scrollLeft =
        activeRect.left -
        containerRect.left -
        containerRect.width / 2 +
        activeRect.width / 2 +
        container.scrollLeft;

      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [pathname]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-[30px] pt-[50px] pb-[20px] my-0">
      <div className="container-main mx-auto px-4 md:px-12 flex items-center gap-2">
        <button onClick={() => scroll("left")} className="p-1 hover:bg-muted rounded-full">
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap py-3 flex gap-2 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {legalLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                ref={isActive ? activeLinkRef : undefined}
                className={cn(
                  "inline-block px-4 py-2 font-medium rounded-full transition-colors duration-200 shrink-0 text-lg",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button onClick={() => scroll("right")} className="p-1 hover:bg-muted rounded-full">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
}
