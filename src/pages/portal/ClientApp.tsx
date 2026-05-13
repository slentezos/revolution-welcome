import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function ClientApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="h-20 border-b border-border bg-card px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
        <Link to="/app" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-navy flex items-center justify-center text-gold font-bold">
            K
          </div>
          <span className="text-xl font-bold text-navy">Mon Kalimera</span>
        </Link>
        <Button variant="outline" className="h-11 px-5 text-base border-navy/20 text-navy">
          <User className="mr-2 h-4 w-4" />
          Mon Profil
        </Button>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl">
          <p className="text-sm text-gold uppercase tracking-[0.3em] font-semibold mb-6">
            Espace membre
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-navy tracking-tight mb-6">
            Espace Client Privé
          </h1>
          <p className="text-xl text-muted-foreground">
            Bienvenue. Votre tableau de bord apparaîtra ici.
          </p>
        </div>
      </main>
    </div>
  );
}
