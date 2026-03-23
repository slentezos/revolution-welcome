import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

  return (
    <nav className="sticky top-16 md:top-20 z-40 bg-[hsl(var(--cream)/.90)] backdrop-blur-md border-b border-border">
      <div className="container-main mx-auto px-4 md:px-12">
        <div
          className={cn(
            "flex gap-6 md:gap-8 py-4",
            "overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            "md:flex-wrap md:justify-center md:whitespace-normal"
          )}
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "inline-block text-sm uppercase tracking-wider font-medium transition-colors duration-300 shrink-0 text-center",
                pathname === link.href
                  ? "text-[hsl(var(--gold))] border-b-2 border-[hsl(var(--gold))] pb-1"
                  : "text-muted-foreground hover:text-foreground pb-1 border-b-2 border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
