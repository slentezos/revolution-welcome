import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowDown } from "lucide-react";
import { getProfile, genderize, type Gender, type PersonalityProfileData } from "@/data/personalityDatabase";

// Fallback imagery (existing assets). Real per-profile images can be dropped at
// /public/assets/personalities/{gender}/{slug}-hero.jpg etc. and will be picked up automatically.
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
  // Public assets: served as-is. If file is missing, the <img> onError swap to fallback.
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

  // Alternating sections (text + short image), matching the screenshot order.
  const sections: { subtitle: string; title: string; paragraphs: string[]; image: string }[] = [
    {
      subtitle: "Votre façon d'aimer",
      title: "1. Votre vision de l'amour",
      paragraphs: [g(profile.loveVision)],
      image: imageUrl(profile.imageSlug, gender, "love", fallbackLove),
    },
    {
      subtitle: "Ce qui vous définit",
      title: "2. Vos forces et fragilités",
      paragraphs: [g(profile.intro)],
      image: imageUrl(profile.imageSlug, gender, "strengths", fallbackStrengths),
    },
    // Section 3 is rendered separately (two-column lists)
    {
      subtitle: "Votre rythme de vie",
      title: "4. Votre quotidien et rapport au stress",
      paragraphs: [g(profile.balanceStress)],
      image: imageUrl(profile.imageSlug, gender, "daily", fallbackDaily),
    },
    {
      subtitle: "Vos compatibilités",
      title: "5. Vos affinités et vos rejets",
      paragraphs: [g(profile.rapportToOthers)],
      image: imageUrl(profile.imageSlug, gender, "affinities", fallbackAffinities),
    },
  ];

  const attractionsImage = imageUrl(profile.imageSlug, gender, "attractions", fallbackCouple);

  const handleImgError = (fallback: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.src !== window.location.origin + fallback) {
      e.currentTarget.src = fallback;
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-0">
      <style>{slowFloatAnimation}</style>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          decoding="async"
          src={heroSrc}
          onError={handleImgError(fallbackHero)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[hsl(var(--navy))] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-transparent to-transparent opacity-50" />

        <div className="relative z-10 text-center px-6 py-16 max-w-5xl mx-auto w-full flex flex-col items-center">
          <p className="text-[hsl(var(--gold))] tracking-[0.3em] uppercase font-medium mb-6 text-xl">
            Votre profil de personnalité
          </p>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[hsl(var(--cream))] leading-tight mb-8">
            {profile.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-8 mb-16">
            {profile.metrics.map((m) => (
              <div
                key={m.label}
                className="bg-[hsl(var(--cream))]/10 backdrop-blur-sm border border-[hsl(var(--cream))]/20 rounded-full px-5 md:px-7 py-2.5 md:py-3"
              >
                <span className="text-[hsl(var(--cream))] text-2xl md:text-lg font-medium">{m.label}</span>
                <span className="text-[hsl(var(--gold))] text-2xl md:text-lg font-bold ml-2">{m.value}%</span>
              </div>
            ))}
          </div>

          <button onClick={scrollToIntro} className="flex flex-col items-center gap-4 group cursor-pointer mt-8">
            <span className="text-[hsl(var(--gold))] uppercase tracking-widest font-bold opacity-80 group-hover:opacity-100 transition-opacity text-2xl">
              Lire votre analyse
            </span>
            <div className="w-16 h-16 rounded-full border-2 border-[hsl(var(--gold))]/30 flex items-center justify-center animate-slow-float bg-[hsl(var(--gold))]/5 group-hover:bg-[hsl(var(--gold))]/20 transition-all">
              <ArrowDown className="h-8 w-8 text-[hsl(var(--gold))]" />
            </div>
          </button>
        </div>
      </section>

      {/* INTRO / SIGNATURE */}
      <section ref={introRef} className="bg-[hsl(var(--cream))]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-12" />
          <p className="font-heading text-2xl md:text-4xl text-foreground leading-relaxed italic">
            « {profile.signature} »
          </p>
        </div>
      </section>

      {/* CE QUI VOUS DISTINGUE — Strengths (gold) / Weaknesses (dark) */}
      <section className="grid lg:grid-cols-2 gap-0">
        <div className="bg-[hsl(var(--cream))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
          <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
            Ce qui vous distingue
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">Vos points forts</h2>
          <ul className="space-y-5">
            {profile.strengths.map((item, i) => (
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
          <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
            Ce qui vous fragilise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[hsl(var(--cream))] mb-10">
            Vos points faibles
          </h2>
          <ul className="space-y-5">
            {profile.weaknesses.map((item, i) => (
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

      {/* ALTERNATING SECTIONS (1, 2, 4, 5) */}
      {sections.map((section, idx) => {
        const imageLeft = idx % 2 === 0;
        const textBlock = (
          <div className="flex items-center px-8 md:px-16 lg:px-20 py-16 md:py-20 bg-[hsl(var(--cream))]">
            <div className="max-w-xl">
              <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
                {section.subtitle}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">{section.title}</h2>
              <div className="w-12 h-px bg-[hsl(var(--gold))] mb-8" />
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-xl text-muted-foreground leading-relaxed mb-6 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        );

        const imageBlock = (
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-0">
            <img
              decoding="async"
              src={section.image}
              onError={handleImgError(fallbackLove)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        );

        // Insert section 3 (Attractions: comfort/drain) between idx=1 (section 2) and idx=2 (section 4)
        const block = (
          <section key={section.title} className="grid lg:grid-cols-2 gap-0">
            {imageLeft ? (
              <>
                {imageBlock}
                {textBlock}
              </>
            ) : (
              <>
                {textBlock}
                {imageBlock}
              </>
            )}
          </section>
        );

        if (idx === 1) {
          return (
            <div key={section.title}>
              {block}
              {/* SECTION 3 — Attractions / Frustrations (two lists) */}
              <section className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
                  <img
                    decoding="async"
                    src={attractionsImage}
                    onError={handleImgError(fallbackCouple)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[hsl(var(--cream))] px-8 md:px-16 lg:px-20 py-16 md:py-20">
                  <p className="text-[hsl(var(--gold))] tracking-[0.25em] uppercase font-medium mb-4 text-xl">
                    Ce qui vous attire
                  </p>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
                    3. Vos attirances et frustrations
                  </h2>
                  <div className="w-12 h-px bg-[hsl(var(--gold))] mb-10" />

                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-5">
                    {profile.attractions.comfortTitle}
                  </h3>
                  <ul className="space-y-4 mb-10">
                    {profile.attractions.comfort.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                        </span>
                        <span className="text-xl text-muted-foreground leading-relaxed">{g(item)}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-5">
                    {profile.attractions.drainTitle}
                  </h3>
                  <ul className="space-y-4">
                    {profile.attractions.drain.map((item, i) => (
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
            </div>
          );
        }

        return block;
      })}

      {/* CTA FOOTER */}
      <section className="bg-[hsl(var(--cream))]">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="w-16 h-px bg-[hsl(var(--gold))] mx-auto mb-10" />
          <p className="font-heading text-2xl md:text-3xl text-foreground mb-10">
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
