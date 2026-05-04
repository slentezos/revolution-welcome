import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Quote } from "lucide-react";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerAPropos from "@/assets/gift-banner-apropos.jpg";
import coupleGarden from "@/assets/couple-garden.jpg";
import coupleCovidOrigin from "@/assets/couple-covid-origin.jpg";
import couplePromenade from "@/assets/couple-promenade.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";

const testimonials = [
{
  name: "Diane",
  quote:
  "Après 15 ans, la routine a usé notre couple. Il n'était plus l'homme que j'avais connu : pantoufles, télé, mots croisés et toujours pendu à mes basques. Alors un jour j'ai explosé et il est parti. Au début, ça été un vrai soulagement mais très vite le poids de la solitude…"
},
{
  name: "Marie",
  quote:
  "J'J'ai découvert sa liaison avec une plus jeune. Quand ça arrive aux autres, ça fait sourire. Mais quand ça vous arrive, tout s'effondre. On finit par douter de soi, de sa féminité, de sa capacité d'être aimée. Colère, déprime, confiance trahie. Plus jamais ça…"
},
{
  name: "Éric",
  quote:
  "En 2018, j'ai perdu ma femme d'un cancer foudroyant. Plusieurs mois, nous avons lutté ensemble et puis elle est partie. Quatre ans au fond du trou avant de commencer à remonter la pente…"
},
{
  name: "Jean",
  quote:
  "Douze ans ensemble, vitrine parfaite mais vide de sens. Tout dans un paraître. Tendresse de façade. On s'est séparés calmement, presque naturellement. Soulagement, oui. Mais à présent, le silence…"
}];


export default function APropos() {
  const [modalOpen, setModalOpen] = useState(false);
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const originRef = useScrollReveal<HTMLElement>();
  const testimonialsRef = useScrollReveal<HTMLElement>();
  const firstStepsRef = useScrollReveal<HTMLElement>();
  const whyRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={coupleGarden} alt="Notre histoire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-xl">
            
            Qui sommes-nous ?
          </span>

          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-8 leading-tight">
            
            Notre histoire,
            <br />
            <span className="italic">simplement</span>
          </h1>

          <div
            data-reveal
            data-reveal-delay="300"
            className="w-16 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto" />
          
        </div>
      </section>

      {/* Origin Story */}
      <section ref={originRef} className="min-h-screen grid lg:grid-cols-2">
        {/* Content */}
        <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-background order-2 lg:order-1">
          <div className="max-w-lg">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-8 block text-xl">
              
              2020 — Le déclic
            </span>

            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              
              Nés au cœur
              <br />
              <span className="text-primary">du Covid</span>
            </h2>

            <div data-reveal data-reveal-delay="250" className="divider-gold mb-10" />

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p data-reveal data-reveal-delay="350" className="font-sans text-xl">
                <strong className="text-foreground"> Kalimera </strong> est né en 2020, au cœur du Covid.
              </p>

              <p data-reveal data-reveal-delay="450" className="font-sans text-xl">
                Quatre amis, deux générations, un même constat :{" "}
                <strong className="text-foreground text-lg">la solitude.</strong>
              </p>

              <p data-reveal data-reveal-delay="550" className="font-sans text-xl">
                Chez nos grands-parents, des couples se sont défaits, des vies se sont refermées.
              </p>

              <p data-reveal data-reveal-delay="650" className="font-sans text-xl">
                Malgré le confinement, on se retrouvait volontiers autour d'un verre pour parler comme on a plaisir à le
                faire entre étudiants. Le moral de nos grands-parents nous inquiétait.
              </p>

              <p data-reveal data-reveal-delay="750" className="font-sans text-xl font-normal text-[#676f7e]">
                Ils vivaient leur situation comme un échec. Un sentiment profond d'amertume. Progressivement, ils se
                repliaient sur eux-mêmes.
              </p>

              <p data-reveal data-reveal-delay="850" className="font-sans text-xl font-normal text-[#737987]">
                Il fallait réagir.
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[50vh] lg:min-h-screen order-1 lg:order-2">
          <img
            src={coupleCovidOrigin}
            alt="L'origine de Toi&Moi"
            className="absolute inset-0 w-full h-full object-cover" />
          
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="section-luxury bg-primary text-primary-foreground">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-6 block text-xl">
              
              Témoignages
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8">
              Ces voix qui
              <br />
              nous ont réveillés
            </h2>
            <div
              data-reveal
              data-reveal-delay="250"
              className="w-16 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent mx-auto" />
            
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-16">
            {testimonials.map((testimonial, index) =>
            <div
              key={index}
              data-reveal
              data-reveal-delay={String(100 + index * 150)}
              className="relative p-8 md:p-10 border border-primary-foreground/10 bg-primary-foreground/5">
              
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-foreground/10" />
                <p className="text-primary-foreground/80 leading-relaxed mb-6 italic text-xl">"{testimonial.quote}"</p>
                <p className="font-heading text-xl text-primary-foreground">— {testimonial.name}</p>
              </div>
            )}
          </div>

          <div data-reveal data-reveal-delay="200" className="text-center max-w-2xl mx-auto">
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Ces récits sont ceux de nos aînés. Ils ont mis des mots sur une réalité.
              <strong className="text-primary-foreground"> On peut avoir tout vécu et ressentir encore le besoin de vibrer pour quelqu'un.

              </strong>
            </p>
            <p className="mt-6 font-heading text-2xl text-primary-foreground">Il n'y a pas d'âge pour aimer.</p>
          </div>
        </div>
      </section>

      {/* First Attempts */}
      <section ref={firstStepsRef} className="min-h-screen grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative min-h-[50vh] lg:min-h-screen">
          <img
            data-reveal
            src={couplePromenade}
            alt="Nos premiers pas"
            className="absolute inset-0 w-full h-full object-cover" />
          
        </div>

        {/* Content */}
        <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-secondary">
          <div className="max-w-lg">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-8 block text-xl">
              
              L'expérience
            </span>

            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              
              Nos premiers
              <br />
              <span className="text-primary">pas</span>
            </h2>

            <div data-reveal data-reveal-delay="250" className="divider-gold mb-10" />

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p data-reveal data-reveal-delay="350" className="text-xl">Logique de jeunes : nous avons inscrit nos grands-parents sur des sites de rencontres pour seniors et encouragé des rencontres.


              </p>

              <p data-reveal data-reveal-delay="450" className="text-xl">
                <strong className="text-foreground">Résultat :</strong> une avalanche de « profils compatibles », de «
                cœurs », de « likes », de photos aguichantes...
              </p>

              <p data-reveal data-reveal-delay="550" className="text-xl">
                <strong className="text-foreground">Bilan de l'opération :</strong> des espoirs déçus, beaucoup de temps
                perdu, une frustration face à une mécanique impersonnelle de masse.
              </p>

              <div
                data-reveal
                data-reveal-delay="650"
                className="py-6 px-8 bg-background border-l-4 border-primary mt-8">
                
                <p className="text-foreground font-heading text-2xl">
                  L'amour et l'amitié ne sont pas des promos de grandes surfaces !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Toi&Moi */}
      <section ref={whyRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
                
                Notre vision
              </span>
              <h2
                data-reveal
                data-reveal-delay="150"
                className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                
                Alors, pourquoi
                <br />
                <span className="text-primary">Kalimera?</span>
              </h2>
              <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              {/* What we're NOT */}
              <div data-reveal data-reveal-delay="300" className="p-10 bg-secondary">
                <h3 className="font-heading text-foreground mb-6 text-3xl">
                  Parce qu'il fallait une approche sélective
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="flex items-start gap-3 text-xl font-medium">
                    <span className="text-primary font-bold">×</span>
                    Pas une usine à profils !
                  </p>
                  <p className="flex items-start gap-3 text-xl font-medium">
                    <span className="text-primary font-bold">×</span>
                    Pas pour rivaliser avec ces grands groupes aux millions d'adhérents.
                  </p>
                </div>
              </div>

              {/* What we ARE */}
              <div data-reveal data-reveal-delay="450" className="p-10 bg-primary text-primary-foreground">
                <h3 className="font-heading mb-6 text-3xl">Bien au contraire</h3>
                <div className="space-y-4 text-primary-foreground/90">
                  <p className="flex items-start gap-3 text-lg">
                    <Heart className="h-5 w-5 mt-1 flex-shrink-0 fill-current" />
                    Une structure à taille humaine pour des évaluations approfondies et personnalisées
                  </p>
                  <p className="flex items-start gap-3 text-lg">
                    <Heart className="h-5 w-5 mt-1 flex-shrink-0 fill-current" />
                    Une écoute authentique et des mises en relation vraiment pertinentes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-24 md:py-32 bg-secondary">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <div data-reveal className="flex items-center justify-center gap-4 mb-8">
            <span className="font-heading text-4xl md:text-5xl text-foreground">Kalimera</span>
          </div>

          <p data-reveal data-reveal-delay="150" className="text-muted-foreground mb-12 max-w-2xl mx-auto text-2xl">
            Rejoignez une communauté où chaque rencontre est pensée pour durer.
          </p>

          <div
            data-reveal
            data-reveal-delay="300"
            className="flex flex-col sm:flex-row items-center justify-center gap-6">
            
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-xl">
              
              Devenir membre
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/notre-démarche"
              className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-5 font-medium tracking-wide transition-all duration-500 hover:bg-primary hover:text-primary-foreground">
              
              Découvrir notre démarche
            </Link>
          </div>
        </div>
      </section>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <GiftBannerSection image={giftBannerAPropos} />
    </Layout>);

}
