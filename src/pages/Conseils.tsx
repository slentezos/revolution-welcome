import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, User, Shirt, Ear, Heart, Target, MessageSquare, Clock, Send } from "lucide-react";
import coupleCafe from "@/assets/couple-cafe.jpg";
import coupleBeach from "@/assets/couple-beach.jpg";
import coupleGarden from "@/assets/couple-garden.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LocationCheckModal from "@/components/location/LocationCheckModal";

const tips = [
  {
    number: "01",
    icon: MapPin,
    title: "Choix du lieu",
    content: "Un environnement calme et propice à l'échange (café, balade, lieu culturel) mais dans un lieu public.",
    highlight: "Madame, vous pouvez avoir 5 minutes de retard. Monsieur, vous ne le pouvez pas !",
  },
  {
    number: "02",
    icon: User,
    title: "Attitude et posture",
    content: "Être soi-même sans arrogance. Rester naturel tout en mettant en avant son meilleur profil.",
    highlight: "Vous êtes probablement un peu tendu… l'autre aussi. Il vaut mieux l'admettre et en sourire ensemble.",
  },
  {
    number: "03",
    icon: Shirt,
    title: "Tenue vestimentaire",
    content: "Optez pour une tenue confortable, fidèle à votre personnalité.",
    highlight: "Les vêtements que vous aimez et qui vous vont bien.",
  },
  {
    number: "04",
    icon: Ear,
    title: "Communication et écoute",
    content:
      "Un langage corporel ouvert (sourire, regard franc, posture détendue) et une écoute active (ne pas interrompre, ne pas juger).",
    highlight: "Ne vous acharnez pas sur un bout de papier pour meubler votre nervosité !",
  },
  {
    number: "05",
    icon: Heart,
    title: "Respect mutuel",
    content: "Le respect passe par l'honnêteté sur ses propres limites et la transparence sur ses intentions.",
    highlight: "Pour éviter les déconvenues ultérieures.",
  },
  {
    number: "06",
    icon: Target,
    title: "Gérer ses attentes",
    content: "Il est sain d'aborder la rencontre sans pression, ni idéalisation excessive.",
    highlight: "Chaque échange est une découverte, non un engagement.",
  },
  {
    number: "07",
    icon: MessageSquare,
    title: "Sujets de conversation",
    content:
      "Il faut à la fois du tact, de la diversité et de la gaîté. Éviter les discussions politiques, ne pas insister sur les blessures d'une séparation récente, ne pas s'apitoyer sur soi-même.",
    highlight: "Apporter un livre ou une revue peut faciliter l'entrée en matière !",
  },
  {
    number: "08",
    icon: Clock,
    title: "En fin de rencontre",
    content:
      "Vous sentirez bien si vous avez envie de vous revoir. Si ce n'est pas le cas, soyez honnête et dites-le tout de suite : avec douceur mais clairement.",
    highlight:
      "Évitez les « on se rappelle » sachant pertinemment que vous n'en ferez rien. Ce n'est pas très élégant.",
  },
  {
    number: "09",
    icon: Send,
    title: "Après la rencontre",
    content: "Un petit message de remerciement ou un retour positif valorise l'échange.",
    highlight: "En cas d'envie partagée, proposez un second rendez-vous dans un contexte plus personnel.",
  },
];

export default function Conseils() {
  const [modalOpen, setModalOpen] = useState(false);
  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const introRef = useScrollReveal<HTMLElement>();
  const tipsGridRef = useScrollReveal<HTMLElement>();
  const ctaRef = useScrollReveal<HTMLElement>();
  const tip1Ref = useScrollReveal<HTMLDivElement>();
  const tip2Ref = useScrollReveal<HTMLDivElement>();
  const tip3Ref = useScrollReveal<HTMLDivElement>();

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={coupleCafe} alt="Premier rendez-vous" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 block text-2xl"
          >
            Conseils
          </span>

          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-8 leading-tight"
          >
            9 conseils
            <br />
            <span className="italic">pour un bon départ</span>
          </h1>

          <div
            data-reveal
            data-reveal-delay="300"
            className="w-16 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent mx-auto mb-8"
          />

          <p data-reveal data-reveal-delay="450" className="text-primary-foreground/90 max-w-2xl mx-auto text-2xl">
            Les premiers instants sont essentiels car c'est la première impression que l'on donne qui a tendance à
            rester.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section ref={introRef} className="py-20 md:py-28 bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p data-reveal className="text-2xl text-muted-foreground leading-relaxed md:text-2xl">
              Il ne s'agit pas de séduire à tout prix mais de favoriser un rapport authentique dans un cadre{" "}
              <strong className="text-foreground">respectueux et bienveillant</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* First 3 tips with large images */}
      <section className="bg-secondary">
        {/* Tip 1 */}
        <div ref={tip1Ref} className="min-h-[80vh] grid lg:grid-cols-2">
          <div className="relative min-h-[40vh] lg:min-h-full">
            <img
              data-reveal
              alt="Choix du lieu"
              className="absolute inset-0 w-full h-full object-cover"
              src="/lovable-uploads/f05347d8-d69d-4427-a1b4-540f27c45676.png"
            />
            <div className="absolute top-10 left-10">
              <span className="font-heading text-8xl font-medium text-white/20">01</span>
            </div>
          </div>
          <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-background">
            <div className="max-w-md">
              <div data-reveal className="w-14 h-14 bg-primary flex items-center justify-center mb-8">
                <MapPin className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2
                data-reveal
                data-reveal-delay="150"
                className="font-heading text-3xl md:text-4xl text-foreground mb-6"
              >
                Choix du lieu
              </h2>
              <div data-reveal data-reveal-delay="250" className="divider-gold mb-8" />
              <p data-reveal data-reveal-delay="350" className="text-muted-foreground leading-relaxed mb-6 text-xl">
                Un environnement calme et propice à l'échange (café, balade, lieu culturel) mais dans un lieu public.
              </p>
              <p data-reveal data-reveal-delay="450" className="text-primary font-medium italic text-xl">
                Madame, vous pouvez avoir 5 minutes de retard. Monsieur, vous ne le pouvez pas !
              </p>
            </div>
          </div>
        </div>

        {/* Tip 2 */}
        <div ref={tip2Ref} className="min-h-[80vh] grid lg:grid-cols-2">
          <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-primary text-primary-foreground order-2 lg:order-1">
            <div className="max-w-md">
              <div
                data-reveal
                className="w-14 h-14 border border-primary-foreground/30 flex items-center justify-center mb-8"
              >
                <User className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 data-reveal data-reveal-delay="150" className="font-heading text-3xl md:text-4xl mb-6">
                Attitude et posture
              </h2>
              <div
                data-reveal
                data-reveal-delay="250"
                className="w-16 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent mb-8"
              />
              <p
                data-reveal
                data-reveal-delay="350"
                className="text-primary-foreground/80 leading-relaxed mb-6 text-xl"
              >
                Être soi-même sans arrogance. Rester naturel tout en mettant en avant son meilleur profil.
              </p>
              <p data-reveal data-reveal-delay="450" className="text-primary-foreground font-medium italic text-xl">
                Vous êtes probablement un peu tendu… l'autre aussi. Il vaut mieux l'admettre et en sourire ensemble.
              </p>
            </div>
          </div>
          <div className="relative min-h-[40vh] lg:min-h-full order-1 lg:order-2">
            <img
              data-reveal
              alt="Attitude naturelle"
              className="absolute inset-0 w-full h-full object-cover"
              src="/lovable-uploads/93d1a4e4-1ae1-4877-833e-2837edaa9aaf.jpg"
            />
            <div className="absolute top-10 right-10">
              <span className="font-heading text-8xl font-medium text-white/20">02</span>
            </div>
          </div>
        </div>

        {/* Tip 3 */}
        <div ref={tip3Ref} className="min-h-[80vh] grid lg:grid-cols-2">
          <div className="relative min-h-[40vh] lg:min-h-full">
            <img
              data-reveal
              alt="Tenue vestimentaire"
              className="absolute inset-0 w-full h-full object-cover"
              src="/lovable-uploads/44f0837a-3c91-4cf2-9770-be878baca5a9.png"
            />
            <div className="absolute top-10 left-10">
              <span className="font-heading text-8xl font-medium text-white/20">03</span>
            </div>
          </div>
          <div className="flex items-center justify-center p-10 md:p-16 lg:p-20 bg-secondary">
            <div className="max-w-md">
              <div data-reveal className="w-14 h-14 bg-primary flex items-center justify-center mb-8">
                <Shirt className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2
                data-reveal
                data-reveal-delay="150"
                className="font-heading text-3xl md:text-4xl text-foreground mb-6"
              >
                Tenue vestimentaire
              </h2>
              <div data-reveal data-reveal-delay="250" className="divider-gold mb-8" />
              <p data-reveal data-reveal-delay="350" className="text-muted-foreground leading-relaxed mb-6 text-xl">
                Optez pour une tenue confortable, fidèle à votre personnalité.
              </p>
              <p data-reveal data-reveal-delay="450" className="text-primary font-medium italic text-xl">
                Les vêtements que vous aimez et qui vous vont bien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining tips - Grid layout */}
      <section ref={tipsGridRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-xl"
            >
              Pour aller plus loin
            </span>
            <h2 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl text-foreground">
              Conseils complémentaires
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.slice(3).map((tip, i) => (
              <div
                key={tip.number}
                data-reveal
                data-reveal-delay={String(100 + i * 120)}
                className="group p-8 md:p-10 bg-secondary border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-card"
              >
                <div className="flex items-start justify-between mb-6">
                  <tip.icon className="h-7 w-7 text-primary" />
                  <span className="font-heading text-3xl text-muted-foreground/30">{tip.number}</span>
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-4">{tip.title}</h3>
                <p className="leading-relaxed mb-4 text-muted-foreground text-xl">{tip.content}</p>
                <p className="text-primary font-medium italic text-lg">{tip.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="container-main mx-auto px-6 md:px-12 text-center">
          <h2 data-reveal className="font-heading text-4xl md:text-5xl mb-6">
            Prêt à mettre ces conseils
            <br />
            en pratique ?
          </h2>
          <p data-reveal data-reveal-delay="150" className="text-primary-foreground/70 mb-12 max-w-2xl mx-auto text-xl">
            Rejoignez notre communauté et trouvez des personnes partageant vos valeurs.
          </p>
          <div data-reveal data-reveal-delay="300">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-10 py-5 font-medium tracking-wide transition-all duration-500 hover:shadow-lg text-lg"
            >
              Créer mon profil
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
