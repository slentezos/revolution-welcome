import { useNavigate } from "react-router-dom";

// TODO: Replace with your actual Cal.com event URL
const CALCOM_EMBED_URL = "https://cal.com/YOUR_USERNAME/concierge-45min";

export default function ReservationCalendrier() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="text-center pt-16 pb-8 px-6">
        <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-4 text-sm font-medium">
          Étape 2 sur 4
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">
          Choisissez votre créneau
        </h1>
        <div className="divider-gold mx-auto mb-4" />
        <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
          Sélectionnez le jour et l'heure qui vous conviennent pour votre entretien téléphonique de 45 minutes.
        </p>
      </div>

      {/* Cal.com embed */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
        <div className="bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden h-[600px]">
          <iframe
            src={`${CALCOM_EMBED_URL}?embed=true&theme=light&hideEventTypeDetails=1&layout=month_view`}
            className="w-full h-full border-0"
            title="Réservation d'un créneau"
            loading="lazy"
          />
        </div>
      </div>

      {/* Navigation info */}
      <div className="text-center pb-12 px-6">
        <p className="text-muted-foreground text-sm mb-4">
          Après avoir confirmé votre créneau, vous serez redirigé vers le paiement sécurisé.
        </p>
        <button
          onClick={() => navigate("/reservation/paiement")}
          className="btn-primary px-10 py-4 text-base"
        >
          Continuer vers le paiement →
        </button>
        <div className="mt-4">
          <button
            onClick={() => navigate("/reservation")}
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
}
