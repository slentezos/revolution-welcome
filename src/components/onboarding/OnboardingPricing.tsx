import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Rocket } from "lucide-react";
import heroCouple from "@/assets/hero-couple.jpg";

interface OnboardingPricingProps {
  onComplete: (selectedPlan?: string) => void;
  onSkip: () => void;
}

const features = ["Tableau de bord", "Compte verifié", "Messagerie", "Test de personnalité", "Satisfait ou remboursé"];

const plans = [
  {
    id: "3months",
    duration: "3 Mois",
    price: 60,
    originalPrice: 90,
    badge: null,
  },
  {
    id: "6months",
    duration: "6 Mois",
    price: 90,
    originalPrice: 120,
    badge: "ÉCONOMISEZ 25%",
  },
];

export default function OnboardingPricing({ onComplete, onSkip }: OnboardingPricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    // Simulate processing - in real app, this would trigger Stripe checkout
    setTimeout(() => {
      setLoading(false);
      onComplete(planId);
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex relative">
      {/* LEFT SIDEBAR - Brand message */}
      <div className="hidden lg:flex lg:w-[340px] bg-primary p-10 flex-shrink-0 flex-col rounded-2xl m-4">
        <div className="sticky top-10">
          <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-4">TOI & MOI</h3>
          <p className="text-primary-foreground/90 text-lg font-medium leading-relaxed mb-10">
            Une tarification transparente sans engagement
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <span className="text-lg">•</span>
              <span className="text-base">Un paiement unique</span>
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <span className="text-lg">•</span>
              <span className="text-base">Pas de mensualités</span>
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <span className="text-lg">•</span>
              <span className="text-base">Pas de reconduction tacite</span>
            </li>
            <li className="flex items-center gap-3 text-primary-foreground/90">
              <span className="text-lg">•</span>
              <span className="text-base">Pas d'options payantes</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CENTER: Pricing Cards */}
      <div className="flex-1 bg-white p-6 md:p-10 lg:p-12 overflow-y-auto pb-32">
        {/* Mobile brand message */}
        <div className="lg:hidden bg-primary rounded-xl p-6 mb-8">
          <h3 className="font-heading text-xl font-bold text-primary-foreground mb-2">TOI & MOI</h3>
          <p className="text-primary-foreground/90 text-sm">Une tarification transparente sans engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative bg-white rounded-2xl p-6 lg:p-8 border-2 transition-all
                ${
                  selectedPlan === plan.id
                    ? "border-primary shadow-lg"
                    : "border-border/30 hover:border-primary/30 hover:shadow-md"
                }
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {plan.badge}
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  plan.badge ? "bg-[hsl(35,25%,90%)]" : "bg-[hsl(35,20%,96%)]"
                }`}
              >
                <Rocket className={`h-7 w-7 ${plan.badge ? "text-primary" : "text-foreground"}`} />
              </div>

              {/* Title */}
              <h4 className="font-heading text-2xl font-semibold text-foreground mb-3">offre spéciale</h4>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Un taux d'affinités réciproques d'au moins 75 % grâce à notre approche pluridisciplinaire et à nos
                outils d'analyse.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl lg:text-5xl font-bold text-foreground">{plan.price}€</span>
                <span className="text-xl text-muted-foreground/50 line-through">{plan.originalPrice}€</span>
                <span className="text-lg text-foreground font-medium">pour {plan.duration}</span>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading}
                className={`w-full py-4 text-base h-auto rounded-full font-medium ${
                  plan.badge ? "btn-primary" : "bg-white border-2 border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {loading && selectedPlan === plan.id ? "Traitement..." : "Continuer"}
              </Button>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Image Panel */}
      <div className="hidden lg:flex lg:w-[300px] flex-col flex-shrink-0 relative">
        <div className="absolute inset-0">
          <img src={heroCouple} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/30" />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 p-8 mt-auto mb-32">
          <p className="text-foreground/80 text-sm font-medium leading-relaxed">
            "Nous croyons en des rencontres authentiques, basées sur des valeurs partagées et une vraie compatibilité."
          </p>
          <p className="text-primary font-semibold text-sm mt-3">— L'équipe TOI & MOI</p>
        </div>

        {/* Buttons at bottom right corner */}
        <div className="mt-auto p-6 relative z-10 flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={onSkip}
            className="w-full py-4 text-base h-auto bg-white/90 hover:bg-white border-border/50"
          >
            Plus tard
          </Button>
          <Button
            onClick={() => handleSelectPlan("3months")}
            disabled={loading}
            className="btn-primary w-full py-4 text-base h-auto"
          >
            Choisir une offre
          </Button>
        </div>
      </div>

      {/* Mobile floating buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border/30 p-4 z-50 shadow-lg">
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onSkip} className="flex-1 py-4 text-base h-auto border-border/50">
            Plus tard
          </Button>
          <Button
            onClick={() => handleSelectPlan("3months")}
            disabled={loading}
            className="flex-1 btn-primary py-4 text-base h-auto"
          >
            Choisir une offre
          </Button>
        </div>
      </div>
    </div>
  );
}
