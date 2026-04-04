import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Brain, Compass, Zap } from "lucide-react";

interface PersonalityResultModalProps {
  open: boolean;
  onClose: () => void;
  answers: Record<string, number>;
}

const mbtiProfiles: Record<
  string,
  { title: string; emoji: string; character: string; temperament: string; profile: string }
> = {
  ESTJ: {
    title: "Le Directeur",
    emoji: "👔",
    character: "Organisé, fiable, déterminé",
    temperament:
      "Vous êtes pragmatique et aimez structurer votre environnement. Naturellement leader, vous inspirez confiance par votre droiture.",
    profile:
      "En couple, vous êtes un pilier solide. Vous cherchez un·e partenaire qui partage vos valeurs d'engagement et de stabilité.",
  },
  ESTP: {
    title: "L'Aventurier",
    emoji: "🏄",
    character: "Audacieux, spontané, charismatique",
    temperament:
      "Vous vivez dans l'instant présent avec intensité. Votre énergie contagieuse attire naturellement les autres.",
    profile: "Vous recherchez une relation dynamique et complice, pleine de surprises et de moments partagés.",
  },
  ESFJ: {
    title: "Le Protecteur",
    emoji: "🤗",
    character: "Chaleureux, attentionné, sociable",
    temperament:
      "Vous êtes le ciment de votre entourage. Votre générosité et votre bienveillance créent des liens durables.",
    profile:
      "En amour, vous donnez sans compter. Vous rêvez d'une relation harmonieuse où chacun prend soin de l'autre.",
  },
  ESFP: {
    title: "L'Entertainer",
    emoji: "🎭",
    character: "Joyeux, expressif, généreux",
    temperament: "Vous apportez de la lumière partout où vous passez. Votre joie de vivre est un don rare et précieux.",
    profile:
      "Vous cherchez un·e partenaire qui sait profiter de la vie et partager des moments de bonheur authentique.",
  },
  ENTJ: {
    title: "Le Stratège",
    emoji: "♟️",
    character: "Visionnaire, ambitieux, décisif",
    temperament:
      "Vous avez une vision claire de l'avenir et la détermination pour y parvenir. Votre assurance inspire le respect.",
    profile: "Vous recherchez un·e partenaire intellectuellement stimulant·e qui partage vos ambitions de vie.",
  },
  ENTP: {
    title: "L'Innovateur",
    emoji: "💡",
    character: "Créatif, curieux, éloquent",
    temperament:
      "Votre esprit vif et votre curiosité insatiable font de chaque conversation une aventure intellectuelle.",
    profile: "Vous êtes attiré·e par les esprits brillants. La complicité intellectuelle est votre langage amoureux.",
  },
  ENFJ: {
    title: "Le Mentor",
    emoji: "🌟",
    character: "Inspirant, empathique, charismatique",
    temperament:
      "Vous avez le don de révéler le meilleur chez les autres. Votre empathie naturelle crée des connexions profondes.",
    profile: "En amour, vous cherchez une relation profonde et significative, basée sur la croissance mutuelle.",
  },
  ENFP: {
    title: "L'Enthousiaste",
    emoji: "🦋",
    character: "Passionné, imaginatif, authentique",
    temperament: "Votre enthousiasme est contagieux. Vous voyez la beauté et le potentiel dans chaque rencontre.",
    profile: "Vous rêvez d'une connexion authentique et intense, où l'on peut être pleinement soi-même.",
  },
  ISTJ: {
    title: "Le Gardien",
    emoji: "🏛️",
    character: "Loyal, méthodique, responsable",
    temperament: "Vous êtes la personne sur qui on peut toujours compter. Votre fiabilité est votre plus grande force.",
    profile: "Vous valorisez la fidélité et la constance. Vous construisez l'amour pierre par pierre, avec patience.",
  },
  ISTP: {
    title: "L'Artisan",
    emoji: "🔧",
    character: "Indépendant, observateur, pragmatique",
    temperament:
      "Vous êtes un esprit libre qui aime comprendre comment les choses fonctionnent. Votre calme est rassurant.",
    profile: "Vous cherchez un·e partenaire qui respecte votre indépendance tout en partageant des moments de qualité.",
  },
  ISFJ: {
    title: "Le Dévoué",
    emoji: "🕊️",
    character: "Bienveillant, discret, persévérant",
    temperament: "Votre dévouement silencieux est une forme d'amour rare. Vous mémorisez chaque détail qui compte.",
    profile: "Vous offrez un amour profond et constant. La sécurité émotionnelle est au cœur de vos relations.",
  },
  ISFP: {
    title: "Le Poète",
    emoji: "🎨",
    character: "Sensible, créatif, harmonieux",
    temperament:
      "Vous percevez le monde avec une sensibilité unique. Votre richesse intérieure est un trésor à découvrir.",
    profile: "Vous recherchez une relation douce et authentique, où les sentiments s'expriment avec délicatesse.",
  },
  INTJ: {
    title: "L'Architecte",
    emoji: "🏗️",
    character: "Stratégique, indépendant, perfectionniste",
    temperament: "Votre esprit analytique et votre vision à long terme font de vous un·e bâtisseur·se remarquable.",
    profile: "Vous cherchez un·e partenaire de vie qui comprend votre besoin de profondeur et de sens.",
  },
  INTP: {
    title: "Le Penseur",
    emoji: "🔬",
    character: "Analytique, original, réfléchi",
    temperament: "Votre monde intérieur est fascinant. Votre capacité d'analyse et votre originalité sont vos atouts.",
    profile:
      "La connexion intellectuelle est essentielle pour vous. Vous cherchez un·e partenaire qui stimule votre esprit.",
  },
  INFJ: {
    title: "L'Idéaliste",
    emoji: "🔮",
    character: "Intuitif, profond, déterminé",
    temperament:
      "Vous avez une compréhension rare des autres. Votre intuition et votre profondeur sont des dons précieux.",
    profile: "Vous recherchez une âme sœur au sens propre : une connexion rare, profonde et transformatrice.",
  },
  INFP: {
    title: "Le Rêveur",
    emoji: "🌙",
    character: "Idéaliste, empathique, créatif",
    temperament: "Votre monde intérieur est d'une richesse infinie. Votre empathie naturelle touche les cœurs.",
    profile: "Vous rêvez d'un amour qui transcende l'ordinaire, fait de compréhension mutuelle et de poésie.",
  },
};

function computeMBTI(answers: Record<string, number>): string {
  const dims = [
    { sections: 1, letterHigh: "E", letterLow: "I" },
    { sections: 2, letterHigh: "N", letterLow: "S" },
    { sections: 3, letterHigh: "F", letterLow: "T" },
    { sections: 4, letterHigh: "P", letterLow: "J" },
  ];

  return dims
    .map(({ sections, letterHigh, letterLow }) => {
      let total = 0;
      let count = 0;
      for (let i = 0; i < 10; i++) {
        const val = answers[`${sections}-${i}`];
        if (val !== undefined) {
          total += val;
          count++;
        }
      }
      const avg = count > 0 ? total / count : 3;
      return avg >= 3 ? letterHigh : letterLow;
    })
    .join("");
}

function getDimensionScores(answers: Record<string, number>) {
  const dims = [
    { id: 1, label: "Extraversion", labelAlt: "Introversion", letterHigh: "E", letterLow: "I", icon: Zap },
    { id: 2, label: "Intuition", labelAlt: "Sensation", letterHigh: "N", letterLow: "S", icon: Compass },
    { id: 3, label: "Sentiment", labelAlt: "Pensée", letterHigh: "F", letterLow: "T", icon: Heart },
    { id: 4, label: "Perception", labelAlt: "Jugement", letterHigh: "P", letterLow: "J", icon: Brain },
  ];

  return dims.map((dim) => {
    let total = 0,
      count = 0;
    for (let i = 0; i < 10; i++) {
      const val = answers[`${dim.id}-${i}`];
      if (val !== undefined) {
        total += val;
        count++;
      }
    }
    const avg = count > 0 ? total / count : 3;
    const percent = Math.round(((avg - 1) / 4) * 100);
    const dominant = avg >= 3 ? dim.label : dim.labelAlt;
    const letter = avg >= 3 ? dim.letterHigh : dim.letterLow;
    return { ...dim, percent, dominant, letter };
  });
}

export default function PersonalityResultModal({ open, onClose, answers }: PersonalityResultModalProps) {
  const mbtiType = computeMBTI(answers);
  const profile = mbtiProfiles[mbtiType] || mbtiProfiles["INFP"];
  const dimensions = getDimensionScores(answers);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Hero header */}
        <div className="relative px-6 sm:px-8 pt-10 pb-8">
          <div className="absolute top-4 right-12 opacity-20">
            <Sparkles className="w-16 h-16 text-[hsl(var(--gold))]" />
          </div>

          {/* Centered icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <span className="text-2xl">{profile.emoji}</span>
          </div>

          <DialogHeader className="space-y-1">
            <p className="text-lg font-medium text-[hsl(var(--gold))] tracking-widest uppercase text-center">
              Votre profil
            </p>
            <DialogTitle className="text-center font-heading text-2xl md:text-3xl font-bold text-[#1B2333]">
              {profile.title}
            </DialogTitle>
            <p className="text-center text-foreground text-base mt-1">Type {mbtiType}</p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 pb-8 space-y-6">
          {/* Dimension bars */}
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((dim) => {
              const Icon = dim.icon;
              return (
                <div key={dim.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[hsl(var(--gold))]" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{dim.dominant}</span>
                    <span className="ml-auto text-sm font-bold text-[#1B2333]">{dim.letter}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--gold))] rounded-full transition-all duration-700"
                      style={{ width: `${dim.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{dim.percent}%</p>
                </div>
              );
            })}
          </div>

          {/* Three cards */}
          <div className="space-y-3">
            {[
              { label: "Caractère", icon: "✦", text: profile.character },
              { label: "Tempérament", icon: "◈", text: profile.temperament },
              { label: "Profil amoureux", icon: "♡", text: profile.profile },
            ].map((card) => (
              <div
                key={card.label}
                className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left"
              >
                <span className="text-[hsl(var(--gold))] text-lg mt-0.5">{card.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B2333] uppercase tracking-wider">{card.label}</h3>
                  <p className="text-base text-foreground leading-relaxed mt-1">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
          >
            Vaider mon inscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
