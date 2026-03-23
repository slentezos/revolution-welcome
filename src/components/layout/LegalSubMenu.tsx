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
    <nav className="sticky top-16 md:top-20 z-40 bg-gradient-to-b from-[hsl(var(--navy))] to-[hsl(var(--navy-light))] shadow-elevated border-b border-[hsl(var(--gold)/0.15)]">
      <div className="container-main mx-auto px-4 md:px-12">
        <div
          className={cn(
            "flex gap-1 md:gap-0 py-0",
            "overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            "md:flex-wrap md:justify-center md:whitespace-normal"
          )}
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative inline-flex items-center px-4 md:px-5 py-3.5 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shrink-0 text-center",
                pathname === link.href
                  ? "text-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.1)]"
                  : "text-[hsl(var(--cream)/0.7)] hover:text-[hsl(var(--cream))] hover:bg-[hsl(var(--cream)/0.05)]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
