import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import coupleCafe from "@/assets/couple-cafe.jpg";
import coupleBeach from "@/assets/couple-beach.jpg";
import coupleGarden from "@/assets/couple-garden.jpg";
import LocationCheckModal from "@/components/location/LocationCheckModal";

const features = [
  {
    title: "Aux amoureux de la vie !",
    content: [
      "Votre carrière professionnelle s'éloigne",
      "Vos enfants sont à présent indépendants",
      "Et si c'était le moment de penser à vous !",
      "",
      "Le moment de rechercher",
      "une compagne ou un compagnon",
      "pour aborder ensemble de façon durable",
      "cette nouvelle étape de votre existence",
      "",
      "Il n'y a pas de honte à afficher",
      "son besoin d'amour",
      "d'émotions partagées",
      "de complicité heureuse",
    ],
    image: coupleCafe,
    reverse: false,
  },
  {
    title: "Vous n'avez plus de temps à perdre !",
    content: [
      "Tous ces profils sans intérêt",
      "Tous ces « likes » impersonnels",
      "Tous ces messages sans suite",
      "Toutes ces annonces fictives",
      "",
      "Toi&Moi",
      "",
      "Une plateforme simple et sérieuse pour des",
      "rencontres respectueuses et durables",
    ],
    image: coupleBeach,
    reverse: true,
  },
  {
    title: "Une approche dans le détail de nos outils d'analyse",
    content: [
      "Test de personnalité",
      "Références culturelles",
      "Centres d'intérêt et projets",
      "Valeurs personnelles",
      "",
      "pour un niveau d'affinité",
      "réciproques de 75%",
    ],
    image: coupleGarden,
    reverse: false,
  },
];

export default function FeaturesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <section className="bg-secondary">
        {features.map((feature, index) => (
          <div key={index} className="py-8 md:py-12">
            <div className="container-main mx-auto px-4 md:px-8">
              <div
                className={`flex flex-col ${
                  feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-6 lg:gap-12 items-stretch`}
              >
                {/* Text Card */}
                <div className="flex-1">
                  <div className="bg-primary text-primary-foreground p-8 md:p-10 rounded-lg h-full">
                    <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-center">
                      {feature.title}
                    </h2>
                    <div className="text-center space-y-1">
                      {feature.content.map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className={`text-primary-foreground/90 ${line === "" ? "h-4" : ""} ${
                            line === "Toi&Moi" || line.includes("80%") ? "font-semibold text-gold" : ""
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="relative rounded-lg overflow-hidden h-full min-h-[300px] md:min-h-[400px]">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8">
                <Link to="/connexion" className="text-primary font-semibold text-lg hover:underline">
                  Connexion
                </Link>
                <br />
                <button onClick={() => setModalOpen(true)} className="text-primary/70 text-sm hover:underline">
                  (devenir membre)
                </button>
              </div>
            </div>

            {/* Logo watermark */}
            <div className="flex items-center justify-end gap-1 mt-4 pr-8 opacity-60">
              <span className="font-heading text-sm text-primary">Toi</span>
              <Heart className="h-3 w-3 text-primary fill-primary" />
              <span className="font-heading text-sm text-primary">Moi</span>
            </div>
          </div>
        ))}
      </section>
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
