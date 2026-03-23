import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border my-[20px] py-[40px]">
      <div className="container-main mx-auto px-4 md:px-12">
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide py-3 flex gap-2">
          {legalLinks.map((link) =>
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "inline-block px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 shrink-0",
              pathname === link.href ?
              "bg-primary text-primary-foreground" :
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
            
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </nav>);

}