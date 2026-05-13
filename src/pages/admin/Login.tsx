import { Link } from "react-router-dom";
import { Globe, User, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PortalCard {
  title: string;
  subtitle: string;
  icon: typeof Globe;
  to: string;
  cta: string;
}

const portals: PortalCard[] = [
  {
    title: "Site Vitrine Public",
    subtitle: "Landing page et Waitlist",
    icon: Globe,
    to: "/public",
    cta: "Accéder au site",
  },
  {
    title: "Espace Client",
    subtitle: "Dashboard senior et onboarding",
    icon: User,
    to: "/dashboard",
    cta: "Entrer dans l'espace",
  },
  {
    title: "Command Center",
    subtitle: "Back-office sécurisé",
    icon: Shield,
    to: "/admin",
    cta: "Ouvrir l'admin",
  },
];

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-8 flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-navy flex items-center justify-center text-gold font-bold text-xl">
          K
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy leading-none">Mon Kalimera</h1>
          <p className="text-xs text-gold uppercase tracking-[0.2em] font-semibold mt-1">
            System Portal
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4 tracking-tight">
            Master Gateway
          </h2>
          <p className="text-lg text-muted-foreground">
            Sélectionnez l'environnement auquel vous souhaitez accéder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {portals.map(({ title, subtitle, icon: Icon, to, cta }) => (
            <Card
              key={to}
              className="group relative overflow-hidden border-2 border-border hover:border-gold transition-all duration-300 hover:shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.3)] hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-4">
                <div className="h-16 w-16 rounded-2xl bg-navy flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                  <Icon className="h-8 w-8 text-gold group-hover:text-navy transition-colors" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-2xl text-navy">{title}</CardTitle>
                <CardDescription className="text-base">{subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-navy hover:bg-navy-light text-white h-12 text-base">
                  <Link to={to}>
                    {cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground uppercase tracking-[0.2em]">
          Espace réservé · Accès interne
        </p>
      </main>
    </div>
  );
}
