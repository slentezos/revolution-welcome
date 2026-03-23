import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IntroSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-main mx-auto text-center">
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Tous ces likes impersonnels. Tous ces messages sans suite. Toutes ces annonces fictives.
          <br />
          <strong className="text-foreground">Toi & Moi</strong>, une plateforme sûre et sérieuse pour des rencontres
          durables et respectueuses.
        </p>

        <div className="mb-12">
          <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
            Retrouvez la qualité de relations sincères, et la surprise d'histoires qui naissent.
          </h3>
        </div>

        <div className="inline-block">
          <span className="badge-navy mb-4">Nos services</span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-6">Our Core Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            We have a range of fitness services and nutrition plans with our personalized in-store fitness functions.
          </p>
          <Link to="/notre-démarche">
            <Button className="btn-outline">
              En savoir plus
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
