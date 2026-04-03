import { useState } from "react";
import coupleCafe from "@/assets/couple-cafe.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PostalCodeInput from "@/components/location/PostalCodeInput";
import LocationCheckModal from "@/components/location/LocationCheckModal";

export default function NoTimeToLoseSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section ref={revealRef} className="min-h-screen grid lg:grid-cols-2">
        {/* Content */}
        <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-primary text-primary-foreground">
          <div className="max-w-lg">
            <span data-reveal className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-xl">
              02 — Le constat
            </span>

            <h2 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              Vous n'avez plus
              <br />
              de temps à perdre
            </h2>

            <div data-reveal data-reveal-delay="250" className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-10" />

            <div data-reveal data-reveal-delay="350" className="space-y-4 text-primary-foreground/80 text-lg mb-12">
              <p className="text-lg">Tous ces profils sans intérêt</p>
              <p>Tous ces « likes » impersonnels</p>
              <p>Tous ces messages sans suite</p>
              <p>Toutes ces annonces fictives</p>
            </div>

            <div data-reveal data-reveal-delay="450" className="flex items-center gap-3 mb-8">
              <span className="font-heading text-2xl"></span>
              <span className="font-heading text-2xl">Kalimera</span>
            </div>

            <p data-reveal data-reveal-delay="500" className="text-lg text-primary-foreground/90 mb-10">
              Une plateforme simple et sérieuse pour des rencontres respectueuses et durables.
            </p>

            <div data-reveal data-reveal-delay="600">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-block bg-primary-foreground text-primary px-10 py-4 font-medium tracking-wide transition-all duration-500 hover:shadow-lg text-xl"
              >
                Découvrir
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[60vh] lg:min-h-screen">
          <img
            data-reveal
            src={coupleCafe}
            alt="Couple senior souriant"
            className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
