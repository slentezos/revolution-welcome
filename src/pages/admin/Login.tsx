export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-gold flex items-center justify-center text-navy font-bold text-xl">
            K
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">Mon Kalimera</h1>
            <p className="text-sm text-gold uppercase tracking-wider font-medium">Admin Console</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-navy mb-2">Connexion</h2>
        <p className="text-base text-muted-foreground mb-6">
          Espace réservé à l'équipe d'administration.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex items-center justify-center text-muted-foreground">
          Formulaire de connexion
        </div>
      </div>
    </div>
  );
}
