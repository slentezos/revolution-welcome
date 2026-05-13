import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PublicSite() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="h-20 border-b border-border bg-card px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
        <Link to="/public" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-navy flex items-center justify-center text-gold font-bold">
            K
          </div>
          <span className="text-xl font-bold text-navy">Mon Kalimera</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-navy text-base">
            <Link to="/login">Portail</Link>
          </Button>
          <Button className="bg-gold hover:bg-gold-light text-navy font-semibold h-11 px-6 text-base">
            Rejoindre la liste
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl">
          <p className="text-sm text-gold uppercase tracking-[0.3em] font-semibold mb-6">
            Site Vitrine
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-navy tracking-tight mb-6">
            Site Public : Accueil
          </h1>
          <p className="text-xl text-muted-foreground">
            Landing page et formulaire de waitlist à venir.
          </p>
        </div>
      </main>
    </div>
  );
}
