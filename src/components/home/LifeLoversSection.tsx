import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function LifeLoversSection() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={revealRef} className="min-h-screen grid lg:grid-cols-2">
      {/* Image */}
      <div className="relative min-h-[60vh] lg:min-h-screen order-2 lg:order-1">
        <img
          data-reveal
          alt="Couple senior épanoui dans un jardin"
          className="absolute inset-0 w-full h-full object-cover"
          src="/lovable-uploads/7fe00c53-758e-4105-80d8-0beb25a0a44d.jpg"
        />
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-background order-1 lg:order-2">
        <div className="max-w-lg">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-8 block text-xl">
            01 — Notre philosophie
          </span>

          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight"
          >
            Aux amoureux
            <br />
            <span className="text-primary">de la vie</span>
          </h2>

          <div data-reveal data-reveal-delay="250" className="divider-gold mb-10" />

          <div data-reveal data-reveal-delay="350" className="space-y-8 text-muted-foreground text-lg leading-relaxed">
            <p className="text-xl">
              Votre carrière professionnelle s'éloigne. Vos enfants sont à présent indépendants.
              <strong className="text-foreground font-bold"> Et si c'était le moment de penser à vous ?</strong>
            </p>
            <p className="text-xl">
              Le moment de rechercher une compagne ou un compagnon pour aborder ensemble, de façon durable, cette
              nouvelle étape de votre existence.
            </p>
            <p className="text-xl">
              Il n'y a pas de honte à afficher son besoin d'amour, d'émotions partagées, de complicité heureuse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
