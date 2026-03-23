import { useMemo } from "react";
import greetingMorning from "@/assets/greeting-morning.jpg";
import greetingLunch from "@/assets/greeting-lunch.jpg";
import greetingAfternoon from "@/assets/greeting-afternoon.jpg";
import greetingEvening from "@/assets/greeting-evening.jpg";

interface DashboardGreetingProps {
  firstName: string | null;
}

const greetings = [
  {
    range: [6, 11] as const,
    title: (n: string) => `Bonjour ${n}.`,
    message:
      "Une nouvelle journée s'annonce. Quelques mouvements de gymnastique. Prenez un café. Un peu de rangement et profitez de votre matinée en toute sérénité.",
    image: greetingMorning,
    accent: "from-amber-900/70 via-amber-800/40 to-transparent",
  },
  {
    range: [11, 14] as const,
    title: (n: string) => `Bon appétit ${n},`,
    message:
      "C'est le moment de faire un break. Quoi de réjouissant au menu ? Nous sommes ravis de vous retrouver aujourd'hui.",
    image: greetingLunch,
    accent: "from-emerald-900/70 via-emerald-800/40 to-transparent",
  },
  {
    range: [14, 18] as const,
    title: (n: string) => `Hello ${n},`,
    message: "Promenade, lecture, quelques courses… À moins que ce soit le jour des petits-enfants. Détendez-vous.",
    image: greetingAfternoon,
    accent: "from-violet-900/70 via-violet-800/40 to-transparent",
  },
  {
    range: [18, 24] as const,
    title: (n: string) => `Bonsoir ${n},`,
    message:
      "La journée s'achève. C'est le moment d'organiser votre soirée. Vous avez des projets ? C'est souvent l'heure des confidences ! Bientôt vous serez deux !",
    image: greetingEvening,
    accent: "from-navy/80 via-navy/50 to-transparent",
  },
];

function getConfig(hour: number) {
  return (
    greetings.find((g) => hour >= g.range[0] && hour < g.range[1]) ?? greetings[3] // evening fallback for 0-5
  );
}

export default function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  const config = useMemo(() => getConfig(new Date().getHours()), []);
  const name = firstName || "";

  return (
    <div data-reveal className="relative mb-8 rounded-2xl overflow-hidden shadow-luxury h-[220px] md:h-[150px]">
      {/* Background image */}
      <img src={config.image} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.accent}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-2 drop-shadow-md">
            {config.title(name)}
          </h1>
          <p className="text-white/90 text-base leading-relaxed drop-shadow-sm md:text-lg">{config.message}</p>
        </div>
      </div>

      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
    </div>
  );
}
