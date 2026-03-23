import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importez les icônes

const legalLinks = [
{ href: "/mentions-legales", label: "Mentions légales" },
{ href: "/politique-confidentialite", label: "Politique de confidentialité (RGPD)" },
{ href: "/cgu", label: "Conditions générales d'utilisation (CGU)" },
{ href: "/cookies", label: "Politique relative aux cookies et autres traceurs" },
{ href: "/charte-bienveillance", label: "Charte de sécurité et de bienveillance" },
{ href: "/signaler-contenu", label: "Signaler un contenu illégal" },
{ href: "/faq", label: "FAQ" }];


export default function LegalSubMenu() {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fonction pour faire défiler manuellement
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-[30px] pt-[50px] pb-[20px] my-0">
      <div className="container-main mx-auto px-4 md:px-12 flex items-center gap-2">
        {/* Flèche Gauche */}
        <button onClick={() => scroll("left")} className="p-1 hover:bg-muted rounded-full">
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Conteneur de liens (Barre de défilement cachée ici) */}
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap py-3 flex gap-2 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {legalLinks.map((link) =>
          <Link
            key={link.href}
            to={link.href}
            className={cn("inline-block px-4 py-2 font-medium rounded-full transition-colors duration-200 shrink-0 text-lg",

            pathname === link.href ?
            "bg-primary text-primary-foreground" :
            "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
            
              {link.label}
            </Link>
          )}
        </div>

        {/* Flèche Droite */}
        <button onClick={() => scroll("right")} className="p-1 hover:bg-muted rounded-full">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </nav>);

}