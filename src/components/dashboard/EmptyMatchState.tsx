import { UserCheck, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyMatchState() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in [animation-duration:1000ms]">
      <div
        className="relative rounded-2xl overflow-hidden border border-gold/40 p-8 md:p-12 lg:p-16"
        style={{
          background: "linear-gradient(135deg, #2D1B33 0%, #1a1a1a 100%)",
        }}
      >
        {/* Decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="text-center max-w-2xl mx-auto">
          <h3
            className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase mb-8"
            style={{ color: "hsl(var(--gold))" }}
          >
            Savoir attendre, c'est choisir l'excellence
          </h3>

          <div className="space-y-4 text-base md:text-lg leading-relaxed text-white/75">
            <p>
              Nos experts sélectionnent vos profils avec une exigence absolue.
              Ne restez pas devant votre écran&nbsp;: profitez de votre journée,
              lisez, marchez… Vivez l'instant présent.
            </p>
            <p>
              Dès qu'une rencontre à votre mesure sera prête, vous recevrez un
              email personnel. Ici, nous cultivons la qualité, pas l'urgence.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-md mx-auto">
            <button
              onClick={() => navigate("/profil")}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gold/30 bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <UserCheck className="h-5 w-5" style={{ color: "hsl(var(--gold))" }} />
              <span className="text-white font-medium text-base">
                Parfaire mon profil
              </span>
            </button>

            <button
              onClick={() => navigate("/editorial")}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-gold/30 bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <Coffee className="h-5 w-5" style={{ color: "hsl(var(--gold))" }} />
              <span className="text-white font-medium text-base">
                Lire l'Éditorial
              </span>
            </button>
          </div>
        </div>

        {/* Decorative gold line bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
