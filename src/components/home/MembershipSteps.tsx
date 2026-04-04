import { UserPlus, FileText, Heart, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "1",
    title: "Inscription",
    description: "Créez votre profil en quelques minutes avec vos informations personnelles.",
  },
  {
    icon: FileText,
    number: "2",
    title: "Test de personnalité",
    description: "Répondez à notre questionnaire pour affiner vos critères de compatibilité.",
  },
  {
    icon: Heart,
    number: "3",
    title: "Matching",
    description: "Recevez des profils compatibles avec un taux d'affinité minimum de 80%.",
  },
  {
    icon: MessageCircle,
    number: "4",
    title: "Rencontre",
    description: "Échangez et rencontrez les personnes qui vous correspondent vraiment.",
  },
];

export default function MembershipSteps() {
  return (
    <section className="section-padding bg-background">
      <div className="container-main mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Mon adhésion en 4 étapes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un processus simple et efficace pour trouver l'amour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-border" />
              )}
              
              {/* Icon with number */}
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-primary text-base font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
