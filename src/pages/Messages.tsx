import { useState } from "react";
import { Mic, Send, Phone, Video, Shield, Clock, Sparkles, Lock, Info } from "lucide-react";
import { toast } from "sonner";

export default function EmptyChat() {
  const [message, setMessage] = useState("");

  // Sécurité anti-brouteur : Notification fluide, longue et en bas à gauche
  const handleLockedFeature = () => {
    toast(
      "🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés (au moins 5 messages chacun).",
      {
        position: "bottom-left", // Position discrète
        duration: 7000, // Reste 7 secondes pour les seniors
        className: "bg-[#1b2333] text-white border border-[hsl(var(--gold))] text-base p-4 shadow-xl transition-all",
      },
    );
  };

  // Remplir le champ de texte avec une suggestion
  const handleSparkleClick = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-[#FAFAFA] font-sans relative">
      {/* 1. HEADER (L'En-tête avec les options sécurisées) */}
      <header className="bg-white border-b border-border/50 p-4 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
              alt="Catherine"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            {/* Point vert "En ligne" */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="font-heading text-xl text-foreground m-0 leading-none">Catherine, 71</h2>
            <span className="text-green-600 text-xs font-medium mt-1 inline-block">En ligne</span>
          </div>
        </div>

        <div className="flex items-center gap-3 hidden sm:flex">
          <button
            onClick={handleLockedFeature}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-100 transition-colors relative group"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium text-sm">Appeler</span>
            <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
          </button>

          <button
            onClick={handleLockedFeature}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-100 transition-colors relative group"
          >
            <Video className="w-4 h-4" />
            <span className="font-medium text-sm">Vidéo</span>
            <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
          </button>
        </div>
      </header>

      {/* 2. ZONE CENTRALE (Casser la glace élégamment) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center space-y-8">
        {/* Carte de Compatibilité */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 max-w-xl w-full text-center">
          <div className="w-10 h-10 bg-[hsl(var(--gold)/0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-[hsl(var(--gold))]" />
          </div>
          <h3 className="font-heading text-xl text-foreground mb-2">Vous avez un profil compatible</h3>
          <p className="text-slate-500 text-base leading-relaxed font-light">
            D'après notre Conciergerie, vous et Catherine partagez une belle affinité pour les{" "}
            <strong>voyages en Europe</strong> et les <strong>soirées calmes</strong>.
          </p>
        </div>

        {/* Le Compte à rebours élégant (La règle des 6 jours) */}
        <div className="flex items-start sm:items-center gap-4 bg-[hsl(var(--gold)/0.05)] border border-[hsl(var(--gold)/0.2)] p-4 rounded-sm max-w-xl w-full">
          <Clock className="w-5 h-5 text-[hsl(var(--gold))] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
            <strong className="text-foreground font-medium">Le temps est précieux.</strong> Sans premier échange de
            votre part d'ici 6 jours, cette mise en relation sera discrètement archivée.
          </p>
        </div>

        {/* Les Suggestions (Étincelles) - Textes réduits */}
        <div className="w-full max-w-xl space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-slate-400">
              L'étincelle de la Conciergerie
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              "Bonjour Catherine ! J'ai vu que vous aimiez voyager, quelle a été votre dernière belle découverte ?",
              "Ravi de faire votre connaissance. Vous êtes plutôt thé ou café pour vos lectures du dimanche ?",
              "Bonjour ! Votre profil a retenu mon attention. Comment se passe votre semaine ?",
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSparkleClick(suggestion)}
                className="text-left p-4 bg-white border border-slate-200 rounded-sm hover:border-[hsl(var(--gold))] hover:shadow-sm transition-all text-slate-600 text-base font-light leading-snug group"
              >
                <span className="text-[hsl(var(--gold))] font-serif text-xl mr-2 leading-none">"</span>
                {suggestion}
                <span className="text-[hsl(var(--gold))] font-serif text-xl ml-2 leading-none">"</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOOTER : ZONE DE SAISIE */}
      <footer className="bg-white border-t border-border p-4 md:p-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Guide d'utilisation doux */}
          <p className="text-slate-400 text-xs sm:text-sm font-light italic flex items-center gap-2 ml-1 mb-1">
            <Info className="w-3.5 h-3.5 opacity-70" />
            Rédigez votre message ou utilisez "Dicter" pour parler naturellement.
          </p>

          <div className="flex items-end gap-3 w-full">
            {/* Bouton Dicter */}
            <button className="flex items-center justify-center gap-2 bg-[#1b2333] hover:bg-[#2a364a] text-white px-4 sm:px-6 py-3 rounded-sm transition-colors shrink-0 h-[56px]">
              <Mic className="w-5 h-5" />
              <span className="font-medium text-base hidden sm:inline tracking-wide">Dicter</span>
            </button>

            {/* Champ de texte dynamique - Taille réduite à text-base */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 min-h-[56px] max-h-[120px] p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-sm resize-none text-base text-foreground font-light leading-relaxed focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))]/50 transition-all placeholder:text-slate-400"
            />

            {/* Bouton Envoyer */}
            <button
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-sm transition-all duration-300 shrink-0 h-[56px] ${
                message.trim().length > 0
                  ? "bg-[hsl(var(--gold))] text-[#1b2333] hover:brightness-110 shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-bold text-base hidden sm:inline tracking-wide">Envoyer</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
