import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerMethode from "@/assets/gift-banner-methode.jpg";
import { ArrowRight, Heart, ClipboardList, Brain, Sparkles, Camera, MessageCircle, Shield } from "lucide-react";
const coupleGarden = "/lovable-uploads/88a7b9a9-987f-414e-8dd3-c5776cf09eac.jpg";
import coupleCafe from "@/assets/couple-cafe.jpg";
const coupleBeach = "/lovable-uploads/eb96eab1-2397-44f4-b556-4e31801e48fe.jpg";
import couplePhotos from "@/assets/couple-photos.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";

const steps = [
  {
    number: "01",
    icon: Brain,
    title: "Quiz des 3 préférences",
    description:
      "Un quiz ludique pour partager vos centres d'intérêt, vos goûts et quelques références culturelles qui vous définissent.",
    image: coupleBeach,
  },
  {
    number: "02",
    icon: Camera,
    title: "Photos & Vidéo",
    description:
      "Des photos et une vidéo pour donner un aperçu vivant de vous-même : votre regard, votre voix, votre présence, votre sourire.",
    image: couplePhotos,
  },
  {
    number: "03",
    icon: ClipboardList,
    title: "Questionnaire approfondi",
    description:
      "50 questions pour déterminer votre profil et les valeurs que vous souhaitez retrouver chez l'autre. Notre approche privilégie la complémentarité plutôt que la similarité.",
    image: coupleCafe,
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Test de personnalité",
    description:
      "Une analyse en profondeur sur votre manière de fonctionner, pour une meilleure connaissance de vous-même et des conseils adaptés à votre tempérament.",
    image: coupleGarden,
  },
];

const principles = [
  {
    title: "La nature humaine",
    description:
      "Il n’existe ni bon ni mauvais profil, et aucune méthode n’est infaillible. La nature humaine est trop riche et trop complexe pour se laisser réduire à une simple équation. Mais lorsqu’elles sont utilisées avec justesse, certaines approches permettent d’affiner sensiblement la pertinence des affinités.",
  },
  {
    title: "Notre préoccupation",
    description:
      "Privilégier la qualité plutôt que la quantité. Chaque demande d'adhésion est examinée par nos équipes pour vérifier qu'elle correspond à la ligne éditoriale de Kalimera.",
  },
];

export default function NotreMethode() {
  const [modalOpen, setModalOpen] = useState(false);
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const stepsHeaderRef = useScrollReveal<HTMLElement>();
  const matchingRef = useScrollReveal<HTMLElement>();
  const principlesRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img decoding="async" src={coupleGarden} alt="Couple heureux" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/90" />
        </div>

        {/* Main title */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mb-16">
          <span
            data-reveal
            className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block md:text-xl"
          >
            Notre démarche
          </span>

          <div data-reveal data-reveal-delay="150" className="flex items-center justify-center gap-4 mb-8">
            <span className="font-heading text-5xl md:text-7xl font-medium text-primary-foreground">Kalimera</span>
          </div>

          <p
            data-reveal
            data-reveal-delay="300"
            className="text-2xl md:text-3xl text-primary-foreground/90 leading-relaxed mb-12"
          >
            Une approche scientifique et humaine
            <br />
            pour des rencontres sincères et durables
          </p>

          {/* Notre approche - 4 points */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { value: "60+", label: "Seniors en Île-de-France" },
              { value: "300", label: "Critères de valeurs communes" },
              { value: "75%", label: "Affinités réciproques minimum" },
              { value: "IDF", label: "Bientôt partout en France" },
            ].map((stat, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(400 + i * 120)}
                className={`${i === 1 ? "bg-primary-foreground/20" : "bg-primary-foreground/10"} backdrop-blur-sm border border-primary-foreground/20 p-6 md:p-8 text-center`}
              >
                <span className="font-heading text-4xl md:text-5xl text-[hsl(var(--gold-light))] font-medium block mb-3">
                  {stat.value}
                </span>
                <p className="text-primary-foreground/90 text-base leading-snug md:text-2xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Header */}
      <section ref={stepsHeaderRef} className="section-luxury bg-background text-center">
        <div className="container-main mx-auto px-6 md:px-12">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl">
            Le processus
          </span>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-8"
          >
            Votre adhésion en 4 étapes
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          {/* Steps Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={step.number}
                data-reveal
                data-reveal-delay={String(300 + i * 120)}
                className="group text-center"
              >
                <span className="font-heading text-4xl font-medium text-[hsl(var(--gold))] block mb-3 md:text-6xl">
                  {step.number}
                </span>
                <div className="w-8 h-px bg-[hsl(var(--gold)/0.4)] mx-auto mb-3 group-hover:w-12 transition-all duration-300" />
                <h3 className="font-heading text-lg text-foreground leading-tight px-px md:text-3xl">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps - Large visual blocks */}
      {steps.map((step, index) => {
        const stepRef = useScrollReveal<HTMLElement>();
        return (
          <section ref={stepRef} key={step.number} className="min-h-screen grid lg:grid-cols-2">
            {/* Image */}
            <div
              className={`relative min-h-[50vh] lg:min-h-screen ${index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}`}
            >
              <img
                data-reveal
                src={step.image}
                alt={step.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Number overlay */}
              <div className="absolute top-10 left-10 md:top-16 md:left-16">
                <span className="font-heading text-8xl md:text-9xl font-medium text-white/20">{step.number}</span>
              </div>
            </div>

            {/* Content */}
            <div
              className={`flex items-center justify-center p-10 md:p-16 lg:p-20 ${
                index % 2 === 0 ? "bg-background order-2" : "bg-secondary order-2 lg:order-1"
              }`}
            >
              <div className="max-w-lg">
                <div data-reveal className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground text-lg">
                    Étape {step.number}
                  </span>
                </div>

                <h2
                  data-reveal
                  data-reveal-delay="150"
                  className="font-heading text-4xl md:text-5xl text-foreground mb-6 leading-tight"
                >
                  {step.title}
                </h2>

                <div data-reveal data-reveal-delay="250" className="divider-gold mb-8" />

                <p data-reveal data-reveal-delay="350" className="text-muted-foreground leading-relaxed text-xl">
                  {step.description}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Matching section */}
      <section ref={matchingRef} className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(var(--navy-light))]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[hsl(var(--gold-light))] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container-main mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <span
              data-reveal
              className="inline-block px-6 py-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 font-medium tracking-[0.3em] uppercase text-primary-foreground/70 mb-8 text-lg"
            >
              Le matching
            </span>

            <h2
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight"
            >
              Nos mises en contact
            </h2>

            <p data-reveal data-reveal-delay="300" className="text-primary-foreground/60 max-w-2xl mx-auto text-xl">
              Un processus transparent et respectueux pour des rencontres authentiques
            </p>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: MessageCircle,
                value: "75%",
                title: "Affinités réciproques",
                desc: "Les propositions de matching sont communiquées dès qu'il y a un degré d'affinités réciproques de 75%.",
              },
              {
                icon: Shield,
                value: null,
                title: "Accord mutuel",
                desc: "Chaque proposition fait l'objet d'un accord ou d'un refus. Il est important de fournir une réponse par courtoisie.",
              },
              {
                icon: Heart,
                value: null,
                title: "Communication libre",
                desc: "Dès approbation mutuelle, vous pouvez communiquer librement, sans frais supplémentaires.",
              },
            ].map((card, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String(100 + i * 150)}
                className="group relative bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 p-10 transition-all duration-500 hover:bg-primary-foreground/10 hover:border-primary-foreground/20"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[hsl(var(--gold)/0.2)] flex items-center justify-center">
                    <card.icon className="h-7 w-7 text-[hsl(var(--gold-light))]" />
                  </div>
                  {card.value && (
                    <span className="font-heading text-5xl font-medium text-[hsl(var(--gold-light))]">
                      {card.value}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-2xl text-primary-foreground mb-4">{card.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed text-xl">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Confidentiality Banner */}
          <div
            data-reveal
            data-reveal-delay="200"
            className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--gold)/0.1)] to-[hsl(var(--gold-light)/0.1)] border border-[hsl(var(--gold)/0.3)] p-8 md:p-10"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold)/0.1)] rounded-full blur-2xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <Shield className="h-8 w-8 text-[hsl(var(--gold-light))]" />
              <p className="text-primary-foreground/90 font-medium text-xl">
                Toutes les informations sont confidentielles. Aucun élément n'est partagé sans votre consentement
                préalable. Profitez de vos échanges en toute sérénité. Chaque inscription est validée avec soin par
                notre équipe afin de préserver la qualité et la bienveillance de notre communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section ref={principlesRef} className="section-luxury bg-secondary">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl"
            >
              Nos considérations
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl text-foreground">
              Ce que nous croyons
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {principles.map((principle, index) => (
              <div
                key={index}
                data-reveal
                data-reveal-delay={String(100 + index * 150)}
                className="bg-background p-10 md:p-12"
              >
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-6">{principle.title}</h3>
                <div className="divider-gold mb-6" />
                <p className="text-muted-foreground leading-relaxed text-xl">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <h2 data-reveal className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Prêt à nous rejoindre ?
          </h2>
          <p data-reveal data-reveal-delay="150" className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl">
            Rejoignez notre communauté et découvrez des profils qui vous correspondent vraiment.
          </p>
          <div data-reveal data-reveal-delay="300">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px] text-xl"
            >
              Devenir membre
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <GiftBannerSection image={giftBannerMethode} />
    </Layout>
  );
}
