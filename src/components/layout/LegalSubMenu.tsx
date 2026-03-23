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
}