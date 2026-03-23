import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft, ArrowDown } from "lucide-react";
import { computeMBTI, getDimensionScores, mbtiProfiles } from "@/data/personalityProfiles";

import personalityHero from "@/assets/personality-hero.jpg";
import personalityLove from "@/assets/personality-love.jpg";
import personalityStrengths from "@/assets/personality-strengths.jpg";
import personalityDaily from "@/assets/personality-daily.jpg";
import personalityAffinities from "@/assets/personality-affinities.jpg";
import coupleCafe from "@/assets/couple-cafe.jpg";

interface PersonalityResultPageProps {
  answers: Record<string, number>;
  onContinue: () => void;
}

const sectionImages = [personalityLove, personalityStrengths, coupleCafe, personalityDaily, personalityAffinities];

// Animation de flottement doux intégrée
const slowFloatAnimation = `
  @keyframes slowFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(12px); }
  }
  .animate-slow-float {
    animation: slowFloat 4.5s ease-in-out infinite;
  }
`;

export default function PersonalityResultPage({ answers, onContinue }: PersonalityResultPageProps) {
  const [searchParams] = useSearchParams();
  const isViewMode = searchParams.get("mode") === "view";

  const mbtiType = computeMBTI(answers);
  const profile = mbtiProfiles[mbtiType] || mbtiProfiles["ENFP"];
  const dimensions = getDimensionScores(answers);

  const introRef = useRef<HTMLDivElement>(null);

  const scrollToIntro = () => {
    if (introRef.current) {
      window.scrollTo({
        top: introRef.current.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const sections = [
  { number: 1, title: "Votre vision de l'amour", subtitle: "Votre façon d'aimer", content: [profile.loveVision] },
  {
    number: 2,
    title: "Vos forces et fragilités",
    subtitle: "Ce qui vous définit",
    content: [profile.strengthsAndFragilities]
  },
  {
    number: 3,
    title: "Vos attirances et frustrations",
    subtitle: "Ce qui vous attire",
    content: profile.attractions
  },
  {
    number: 4,
    title: "Votre quotidien et rapport au stress",
    subtitle: "Votre rythme de vie",
    content: profile.dailyLife
  },
  { number: 5, title: "Vos affinités et vos rejets", subtitle: "Vos compatibilités", content: profile.affinities }];


  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-0">
      <style>{slowFloatAnimation}</style>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img src={personalityHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(var(--navy))] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-transparent to-transparent opacity-50" />

        <div className="relative z-10 text-center px-6 py-16 max-w-5xl mx-auto w-full flex flex-col items-center">
          <p className="text-[hsl(var(--gold))] tracking-[0.3em] uppercase md:text-base font-medium mb-6 text-xl">
            Votre profil de personnalité
          </p>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[hsl(var(--cream))] leading-tight mb-8">
            {profile.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-8 mb-16">
            {dimensions.map((dim) =>
            <div
              key={dim.id}
              className="bg-[hsl(var(--cream))]/10 backdrop-blur-sm border border-[hsl(var(--cream))]/20 rounded-full px-5 md:px-7 py-2.5 md:py-3">
              
                <span className="text-[hsl(var(--cream))] md:text-lg font-medium text-xl">{dim.dominant}</span>
                <span className="text-[hsl(var(--gold))] md:text-lg font-bold ml-2 text-2xl">{dim.percent}%</span>
              </div>
            )}
          </div>

          <button onClick={scrollToIntro} className="flex flex-col items-center gap-4 group cursor-pointer mt-8">
            <span className="text-[hsl(var(--gold))] uppercase tracking-widest font-bold opacity-80 group-hover:opacity-100 transition-opacity text-xl">
              Lire votre analyse
            </span>
            <div className="w-16 h-16 rounded-full border-2 border-[hsl(var(--gold))]/30 flex items-center justify-center animate-slow-float bg-[hsl(var(--gold))]/5 group-hover:bg-[hsl(var(--gold))]/20 transition-all">
              <ArrowDown className="h-8 w-8 text-[hsl(var(--gold))]" />
            </div>
          </button>
        </div>
      </section>

      {/* ═══════════════ INTRODUCTION ═══════════════ */}
      <section ref={introRef} className="bg-[hsl(var(--cream))]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-12" />
          {profile.temperament.map((paragraph, i) =>
          <p key={i} className="font-heading text-xl md:text-2xl text-foreground leading-relaxed mb-8 last:mb-0">
              {paragraph}
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════ POINTS FORTS / FAIBLES ═══════════════ */}
      <section className="grid lg:grid-cols-2 gap-0">
        <div className="bg-[hsl(var(--cream))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
            Ce qui vous distingue
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">Vos points forts</h2>
          <ul className="space-y-5">
            {profile.strengths.map((item, i) =>
            <li key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                </span>
                <span className="text-lg md:text-xl text-foreground leading-relaxed">{item}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-[hsl(var(--navy))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
            Ce qui vous fragilise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[hsl(var(--cream))] mb-10">
            Vos points faibles
          </h2>
          <ul className="space-y-5">
            {profile.weaknesses.map((item, i) =>
            <li key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--cream))]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-[hsl(var(--cream))]/60" />
                </span>
                <span className="text-lg md:text-xl text-[hsl(var(--cream))]/85 leading-relaxed">{item}</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ═══════════════ 5 ALTERNATING SECTIONS ═══════════════ */}
      {sections.map((section, idx) => {
        const imageLeft = idx % 2 === 0;
        const image = sectionImages[idx];

        const textBlock =
        <div className="flex items-center px-8 md:px-16 lg:px-20 py-16 md:py-20 bg-[hsl(var(--cream))]">
            <div className="max-w-xl">
              <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
                {section.subtitle}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
                {section.number}. {section.title}
              </h2>
              <div className="w-12 h-px bg-[hsl(var(--gold))] mb-8" />
              {section.content.map((paragraph, i) =>
            <p key={i} className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
            )}
            </div>
          </div>;


        const imageBlock =
        <div className="relative min-h-[400px] lg:min-h-0">
            <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>;


        return (
          <section key={section.number} className="grid lg:grid-cols-2 gap-0">
            {imageLeft ?
            <>
                {imageBlock}
                {textBlock}
              </> :

            <>
                {textBlock}
                {imageBlock}
              </>
            }
          </section>);

      })}

      {/* ═══════════════ CTA FOOTER ═══════════════ */}
      <section className="bg-[hsl(var(--cream))]">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-10" />
          <p className="font-heading text-2xl md:text-3xl text-foreground mb-10">
            {isViewMode ? "Votre profil de personnalité est complet." : "Prêt·e à trouver votre partenaire idéal·e ?"}
          </p>
          {isViewMode ?
          <Button
            onClick={() => window.location.href = "/profil?tab=questionnaires"}
            className="px-12 py-6 text-lg h-auto rounded-xl gap-3"
            variant="outline">
            
              <ArrowLeft className="h-5 w-5" />
              Retour au profil
            </Button> :

          <Button onClick={onContinue} className="px-12 py-6 text-lg h-auto rounded-xl">
              Continuer mon inscription
            </Button>
          }
        </div>
      </section>
    </div>);

}