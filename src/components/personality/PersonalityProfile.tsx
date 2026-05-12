import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowDown } from "lucide-react";
import { getProfile, genderize, type Gender, type PersonalityProfileData } from "@/data/personalityDatabase";

// Fallback imagery
import fallbackHero from "@/assets/personality-hero.jpg";
import fallbackLove from "@/assets/personality-love.jpg";
import fallbackStrengths from "@/assets/personality-strengths.jpg";
import fallbackDaily from "@/assets/personality-daily.jpg";
import fallbackAffinities from "@/assets/personality-affinities.jpg";
import fallbackCouple from "@/assets/couple-cafe.jpg";

interface PersonalityProfileProps {
  profileId: string;
  gender: Gender;
  onContinue?: () => void;
}

const slowFloatAnimation = `
  @keyframes slowFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
  .animate-slow-float { animation: slowFloat 4.5s ease-in-out infinite; }
`;

function imageUrl(slug: string | undefined, gender: Gender, suffix: string, fallback: string) {
  if (!slug) return fallback;
  return `/assets/personalities/${gender}/${slug}-${suffix}.jpg`;
}

export default function PersonalityProfile({ profileId, gender, onContinue }: PersonalityProfileProps) {
  const profile: PersonalityProfileData | undefined = getProfile(profileId);
  const introRef = useRef<HTMLDivElement>(null);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">Profil de personnalité introuvable.</div>
    );
  }

  const g = (t: string) => genderize(t, gender);

  const scrollToIntro = () => {
    if (introRef.current) {
      window.scrollTo({ top: introRef.current.offsetTop - 80, behavior: "smooth" });
    }
  };

  const heroSrc = imageUrl(profile.imageSlug, gender, "hero", fallbackHero);

  const handleImgError = (fallback: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.src !== window.location.origin + fallback) {
      e.currentTarget.src = fallback;
    }
  };

  const sections = [
    {
      title: "Votre fonctionnement",
      paragraphs: profile.fonctionnement ? profile.fonctionnement.split("\n\n") : [],
      image: imageUrl(profile.imageSlug, gender, "strengths", fallbackStrengths),
    },
    {
      title: "Votre rapport aux autres",
      paragraphs: profile.rapportAuxAutres ? profile.rapportAuxAutres.split("\n\n") : [],
      image: imageUrl(profile.imageSlug, gender, "affinities", fallbackAffinities),
    },
    {
      title: "Votre équilibre",
      paragraphs: profile.equilibre ? profile.equilibre.split("\n\n") : [],
      image: imageUrl(profile.imageSlug, gender, "daily", fallbackDaily),
    },
    {
      title: "Votre vision de l'amour",
      paragraphs: profile.visionAmour ? profile.visionAmour.split("\n\n") : [],
      image: imageUrl(profile.imageSlug, gender, "love", fallbackLove),
    },
  ];

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-0">
      <style>{slowFloatAnimation}</style>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          decoding="async"
          src={heroSrc}
          onError={handleImgError(fallbackHero)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[hsl(var(--navy))] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6 py-16 max-w-5xl mx-auto w-full flex flex-col items-center">
          <p className="text-[hsl(var(--gold))] tracking-[0.3em] uppercase font-medium mb-4 md:mb-6 text-sm md:text-lg lg:text-xl">
            Votre profil de personnalité
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[hsl(var(--cream))] leading-tight mb-10">
            {profile.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-6 mb-16">
            {profile.metrics?.map((m) => (
              <div
                key={m.label}
                className="bg-[hsl(var(--cream))]/10 backdrop-blur-md border border-[hsl(var(--cream))]/20 rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg"
              >
                <span className="text-[hsl(var(--cream))] text-lg md:text-xl font-medium">{m.label}</span>
                <span className="text-[hsl(var(--gold))] text-lg md:text-xl font-bold ml-3">{m.value}%</span>
              </div>
            ))}
          </div>
          <button onClick={scrollToIntro} className="flex flex-col items-center gap-4 group cursor-pointer mt-8">
            <span className="text-[hsl(var(--gold))] uppercase tracking-widest font-bold opacity-80 group-hover:opacity-100 transition-opacity text-sm md:text-base">
              Lire votre analyse
            </span>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[hsl(var(--gold))]/30 flex items-center justify-center animate-slow-float bg-[hsl(var(--gold))]/5 group-hover:bg-[hsl(var(--gold))]/20 transition-all shadow-[0_0_15px_rgba(var(--gold),0.1)]">
              <ArrowDown className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--gold))]" />
            </div>
          </button>
        </div>
      </section>

      <div ref={introRef} />

      {/* 2. LES 4 SECTIONS TEXTUELLES */}
      {sections.map((section, idx) => {
        const imageLeft = idx % 2 === 0;
        return (
          <section key={section.title} className="grid lg:grid-cols-2 gap-0">
            {imageLeft ? (
              <>
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-0">
                  <img
                    src={section.image}
                    onError={handleImgError(fallbackLove)}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex items-center px-8 md:px-16 lg:px-20 py-16 md:py-20 bg-[hsl(var(--cream))]">
                  <div className="max-w-xl">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
                      {section.title}
                    </h2>
                    <div className="w-12 h-px bg-[hsl(var(--gold))] mb-8" />
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-xl text-muted-foreground leading-relaxed mb-6 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center px-8 md:px-16 lg:px-20 py-16 md:py-20 bg-[hsl(var(--cream))]">
                  <div className="max-w-xl">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
                      {section.title}
                    </h2>
                    <div className="w-12 h-px bg-[hsl(var(--gold))] mb-8" />
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-xl text-muted-foreground leading-relaxed mb-6 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-0">
                  <img
                    src={section.image}
                    onError={handleImgError(fallbackLove)}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </>
            )}
          </section>
        );
      })}

      {/* NOURRITURE VISUELLE : IMAGE DE TRANSITION PLEINE LARGEUR AVEC OVERLAY SOMBRE */}
      <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden border-y border-[hsl(var(--gold))]/20">
        <img
          src={imageUrl(profile.imageSlug, gender, "transition", fallbackHero)}
          onError={handleImgError(fallbackHero)}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay sombre */}
      </section>

      {/* 3. VOS POINTS FORTS / VOS FRAGILITÉS */}
      <section className="grid lg:grid-cols-2 gap-0">
        <div className="bg-[hsl(var(--cream))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">Vos points forts</h2>
          <ul className="space-y-5">
            {profile.pointsForts?.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                </span>
                <span className="text-xl text-foreground leading-relaxed">{g(item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[hsl(var(--navy))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[hsl(var(--cream))] mb-10">Vos fragilités</h2>
          <ul className="space-y-5">
            {profile.fragilites?.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--cream))]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-[hsl(var(--cream))]/60" />
                </span>
                <span className="text-xl text-[hsl(var(--cream))]/85 leading-relaxed">{g(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. VOS ATTIRANCES / FRUSTRATIONS */}
      <section className="grid lg:grid-cols-2 gap-0">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
          <img
            src={imageUrl(profile.imageSlug, gender, "attractions", fallbackCouple)}
            onError={handleImgError(fallbackCouple)}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="bg-[hsl(var(--cream))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <h3 className="font-heading font-semibold text-foreground mb-8 text-3xl md:text-4xl">
            Vous vous sentez bien avec des personnes ou les situations
          </h3>
          <ul className="space-y-4 mb-12">
            {profile.attractions?.comfort?.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                </span>
                <span className="text-xl text-muted-foreground leading-relaxed">{g(item)}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-heading font-semibold text-foreground mb-8 text-3xl md:text-4xl">
            Vous vous épuisez avec les personnes ou les situations
          </h3>
          <ul className="space-y-4">
            {profile.attractions?.drain?.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-1">
                  <X className="w-4 h-4 text-foreground/60" />
                </span>
                <span className="text-xl text-muted-foreground leading-relaxed">{g(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. SIGNATURE */}
      <section className="bg-[hsl(var(--cream))] border-t border-[hsl(var(--gold))]/20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 text-center">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-12" />
          <p className="font-heading text-2xl md:text-4xl text-foreground leading-relaxed italic">
            « {profile.signature} »
          </p>
        </div>
      </section>

      {/* 6. CTA FOOTER */}
      <section className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-10" />
          <p className="font-heading text-2xl md:text-3xl text-foreground mb-10 font-sans">
            Prêt·e à trouver votre partenaire idéal·e ?
          </p>
          <Button onClick={onContinue} className="px-12 py-6 text-lg h-auto rounded-xl">
            Continuer mon inscription
          </Button>
        </div>
      </section>
    </div>
  );
}
