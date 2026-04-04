import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ReservationPaiement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-concierge-payment", {
        body: {},
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Aucune URL de paiement reçue");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de lancer le paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="tracking-[0.3em] uppercase text-muted-foreground block mb-4 text-lg font-medium">
            Étape 3 sur 4
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-3">
            Paiement sécurisé
          </h1>
          <div className="divider-gold mx-auto mb-4" />
          <p className="text-muted-foreground text-base leading-relaxed">
            Finalisez votre réservation en toute sérénité.
          </p>
        </div>

        {/* Payment card */}
        <div className="bg-card border border-border p-8 sm:p-10 shadow-[var(--shadow-card)]">
          {/* Summary */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-border">
            <div>
              <h3 className="font-heading text-xl text-foreground mb-1">Service Conciergerie</h3>
              <p className="text-muted-foreground text-lg">Entretien privé de 45 minutes</p>
            </div>
            <span className="font-heading text-2xl text-foreground">89&nbsp;€</span>
          </div>

          {/* Trust signals */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-[hsl(var(--gold))]" />
              <span className="text-lg text-muted-foreground">Chiffrement SSL 256 bits</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[hsl(var(--gold))]" />
              <span className="text-lg text-muted-foreground">Carte bancaire, Apple Pay, Google Pay</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-[hsl(var(--gold))]" />
              <span className="text-lg text-muted-foreground">Garantie satisfait ou remboursé</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full btn-primary py-5 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirection vers Stripe…" : "Payer 89 € →"}
          </button>

          <p className="text-center text-muted-foreground text-xs mt-4">
            Vous serez redirigé vers notre partenaire de paiement Stripe.
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/reservation/calendrier")}
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm transition-colors"
          >
            ← Retour au calendrier
          </button>
        </div>
      </div>
    </div>
  );
}
