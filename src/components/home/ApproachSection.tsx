import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import coupleBeach from "@/assets/couple-beach.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  { number: "01", title: "Test de personnalité", description: "Une analyse approfondie de votre tempérament" },
  { number: "02", title: "Références culturelles", description: "Vos goûts, vos passions, vos intérêts" },
  { number: "03", title: "Centres d'intérêt", description: "Projets de vie et aspirations communes" },
  { number: "04", title: "Valeurs personnelles", description: "Ce qui compte vraiment pour vous" },
];

export default function ApproachSection() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={revealRef} className="min-h-screen grid lg:grid-cols-2">
      {/* Image */}
      <div className="relative min-h-[60vh] lg:min-h-screen order-2 lg:order-1">
        <img
          data-reveal
          src={coupleBeach}
          alt="Couple senior sur la plage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        <div data-reveal data-reveal-delay="300" className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
          <div className="text-primary-foreground">
            <span className="font-heading text-7xl md:text-8xl font-medium">75%</span>
            <p className="text-xl mt-2 text-primary-foreground/80">d'affinités réciproques</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-secondary order-1 lg:order-2">
        <div className="max-w-lg w-full">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-8 block text-xl">
            03 — Notre approche
          </span>

          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl text-foreground mb-8 leading-tight"
          >
            Une approche
            <br />
            <span className="text-primary">dans le détail</span>
          </h2>

          <div data-reveal data-reveal-delay="250" className="divider-gold mb-12" />

          <div className="space-y-8 mb-12">
            {features.map((feature, i) => (
              <div
                key={feature.number}
                data-reveal
                data-reveal-delay={String(300 + i * 120)}
                className="flex gap-6 group"
              >
                <span className="font-medium text-muted-foreground/50 pt-1 text-base">{feature.number}</span>
                <div>
                  <h3 className="font-heading text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal data-reveal-delay="800">
            <Link to="/notre-démarche" className="inline-flex items-center gap-3 text-primary font-medium group">
              <span className="link-underline text-xl">Découvrir notre démarche</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
