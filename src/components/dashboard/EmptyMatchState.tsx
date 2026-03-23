import { useMemo } from "react";
import { UserCheck, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emptyMorning from "@/assets/empty-morning.jpg";
import emptyLunch from "@/assets/empty-lunch.jpg";
import emptyAfternoon from "@/assets/empty-afternoon.jpg";
import emptyEvening from "@/assets/empty-evening.jpg";

const themes = [
  { range: [6, 11] as const, image: emptyMorning, overlay: "from-amber-900/80 via-amber-900/60 to-amber-950/80" },
  { range: [11, 14] as const, image: emptyLunch, overlay: "from-emerald-900/80 via-emerald-900/60 to-emerald-950/80" },
  { range: [14, 18] as const, image: emptyAfternoon, overlay: "from-violet-900/80 via-violet-900/60 to-violet-950/80" },
  { range: [18, 24] as const, image: emptyEvening, overlay: "from-navy/90 via-navy/70 to-navy/90" },
];

function getTheme(hour: number) {
  return themes.find((t) => hour >= t.range[0] && hour < t.range[1]) ?? themes[3];
}

export default function EmptyMatchState() {
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme(new Date().getHours()), []);

  return (
    <div className="animate-fade-in [animation-duration:1000ms]">
      <div className="relative rounded-2xl overflow-hidden border border-gold/40">
        {/* Background image */}
        <img
          src={theme.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={512}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.overlay}`} />

        {/* Decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center max-w-2xl mx-auto">
          <h3
            className="font-heading text-4xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase mb-8"
            style={{ color: "hsl(var(--text-white))" }}
          >
            Savoir attendre, c'est choisir l'excellence
          </h3>

          <p className="text-base md:text-xl leading-relaxed text-white/80">
            Nos experts sélectionnent vos profils avec soin. Profitez de votre journée, lisez, marchez… Vivez l'instant
            présent. Vous recevrez un email dès qu'une action sera requise.
          </p>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-md mx-auto">
            <button
              onClick={() => navigate("/profil")}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gold/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors duration-1000"
            >
              <UserCheck className="h-6 w-6 text-gold" />
              <span className="text-white font-medium text-xl">Parfaire mon profil</span>{" "}
            </button>

            <button
              onClick={() => navigate("/editorial")}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gold/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors duration-1000"
            >
              <Coffee className="h-6 w-6 text-gold" />
              <span className="text-white font-medium text-xl">Lire l'Éditorial</span>{" "}
            </button>
          </div>
        </div>

        {/* Decorative gold line bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
