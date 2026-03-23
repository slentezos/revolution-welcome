import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface MatchCelebrationProps {
  show: boolean;
  matchName: string;
  onDone: () => void;
}

export default function MatchCelebration({ show, matchName, onDone }: MatchCelebrationProps) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
      const doneTimer = setTimeout(() => {
        setVisible(false);
        onDone();
      }, 2700);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop — no blur */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-[hsl(var(--gold))]/30 animate-bounce"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${20 + (i * 13) % 60}%`,
              width: `${20 + (i % 4) * 8}px`,
              height: `${20 + (i % 4) * 8}px`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.5 + (i % 3) * 0.5}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-scale-in bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40 p-8 sm:p-10 mx-4 max-w-md">
        {/* Centered icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center text-[#1B2333]">
          <Heart className="h-6 w-6" fill="currentColor" />
        </div>

        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333]">
            C'est un match !
          </h2>
          <p className="text-foreground text-base max-w-md">
            Vous pouvez maintenant discuter avec{" "}
            <span className="font-semibold text-[#1B2333]">{matchName}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
