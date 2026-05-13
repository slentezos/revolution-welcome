import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">Erreur 404</p>
        <h1 className="text-5xl font-bold text-navy mb-4">Page introuvable</h1>
        <p className="text-base text-muted-foreground mb-8">
          La ressource demandée n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition"
        >
          Retour au Command Center
        </Link>
      </div>
    </div>
  );
}
