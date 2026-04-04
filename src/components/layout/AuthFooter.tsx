import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings, CreditCard, FileText, MessageCircle, Gift, LogOut } from "lucide-react";

const authLinks = [
  { href: "/profil", label: "Mon profil", icon: Settings },
  { href: "/profil?tab=abonnement", label: "Mon abonnement", icon: CreditCard },
  { href: "/profil?tab=conditions", label: "Conditions générales", icon: FileText },
  { href: "/contact", label: "Nous contacter", icon: MessageCircle },
  { href: "/profil?gift=true", label: "Offrir un abonnement", icon: Gift },
];

export default function AuthFooter() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="w-full px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Link to="/dashboard" className="font-heading text-2xl font-medium">
            Kalimera
          </Link>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 transition-colors duration-300 text-primary-foreground text-lg"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 transition-colors duration-300 text-orange-300 text-lg"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-main mx-auto px-6 md:px-12 py-6 text-primary-foreground/40 text-lg">
          © 2026 Kalimera. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
