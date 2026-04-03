import { ArrowDown } from "lucide-react";
import heroCouple from "@/assets/hero-couple.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PrivilegeBadge from "@/components/location/PrivilegeBadge";
import PostalCodeInput from "@/components/location/PostalCodeInput";

export default function HeroSection() {
  const revealRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });

  return (
    <section ref={revealRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen background */}
      <div className="absolute inset-0">
        <img src={heroCouple} alt="Couple senior heureux" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent opacity-100" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div data-reveal className="flex items-center justify-center gap-4 mb-10">
          <span className="font-heading text-6xl md:text-8xl lg:text-9xl font-medium text-primary">Kalimera</span>
        </div>

        {/* Privilege Badge */}
        <div data-reveal data-reveal-delay="300" className="mb-8">
          <PrivilegeBadge />
        </div>

        <h1
          data-reveal
          data-reveal-delay="400"
          className="font-heading text-2xl md:text-3xl lg:text-5xl text-foreground mb-6 leading-relaxed font-semibold"
        >
          L'élégance des rencontres après 60 ans.
          <br className="hidden lg:block" />
          <span className="lg:whitespace-nowrap">Déjà disponible en Île-de-France, bientôt chez&nbsp;vous.</span>
        </h1>

        <p data-reveal data-reveal-delay="600" className="text-lg mb-10 md:text-2xl text-foreground/80 font-medium">
          L'amour ou l'amitié, en toute sérénité. 
          <br />
          Profils vérifiés manuellement et 75% d'affinités garanties.
        </p>

        {/* Postal Code Input replaces "Devenir membre" */}
        <div data-reveal data-reveal-delay="800">
          <PostalCodeInput variant="hero" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
}
