import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import profileGiftImg from "@/assets/profile-gift.jpg";

const plans = [
{ label: "Découverte", duration: "3 mois", price: "60 €" },
{ label: "Sérénité", duration: "6 mois", price: "90 €" },
{ label: "Engagement", duration: "12 mois", price: "120 €" }];


export default function ProfileGiftTab() {
  const [selectedPlan, setSelectedPlan] = useState(0);

  const handleSubmit = () => {
    toast({ title: "Cadeau envoyé !", description: "Le destinataire recevra un email personnalisé." });
  };

  return (
    <div>
      {/* Hero split – reversed */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24 order-2 lg:order-1">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Faites plaisir
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Offrir un abonnement
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Offrez à un proche l'opportunité de faire de belles rencontres. Nous lui enverrons un email personnalisé avec votre message.
          </p>
        </div>
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh] order-1 lg:order-2">
          <img src={profileGiftImg} alt="Offrir un abonnement" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Gift form */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground">Informations du destinataire</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Nom du destinataire</Label>
                  <Input
                    placeholder="Ex : Marie Dupont"
                    className="h-14 border-2 border-muted bg-background focus:border-primary rounded-none text-xl" />
                  
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-medium text-foreground">Email du destinataire</Label>
                  <Input
                    type="email"
                    placeholder="marie@exemple.fr"
                    className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                  
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-medium text-foreground">Votre message personnel (optionnel)</Label>
                  <Input
                    placeholder="Un petit mot pour accompagner le cadeau…"
                    className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                  
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground">Choisissez une formule</h3>
              <div className="space-y-4">
                {plans.map((plan, i) =>
                <button
                  key={plan.label}
                  onClick={() => setSelectedPlan(i)}
                  className={`w-full text-left p-6 md:p-8 transition-all duration-300 min-h-[80px] ${
                  selectedPlan === i ?
                  "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]" :
                  "bg-secondary hover:bg-secondary/80 text-foreground"}`
                  }>
                  
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading text-xl md:text-2xl font-semibold">{plan.label}</p>
                        <p className={`text-lg ${selectedPlan === i ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {plan.duration}
                        </p>
                      </div>
                      <span className="font-heading text-2xl md:text-3xl font-semibold">{plan.price}</span>
                    </div>
                  </button>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                className="btn-primary py-5 px-10 text-lg h-auto min-h-[56px] w-full">
                
                <Gift className="h-5 w-5 mr-3" />
                Offrir cet abonnement
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>);

}