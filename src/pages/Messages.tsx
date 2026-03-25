import { useState } from "react";
import { Mic, Send, Phone, Video, Shield, Clock, Sparkles, Lock, Info } from "lucide-react";
import { toast } from "sonner";

export default function EmptyChat() {
  const [message, setMessage] = useState("");

  // Sécurité anti-brouteur : Les appels sont bloqués au début
  const handleLockedFeature = () => {
    toast("🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés.", {
      className: "bg-[#1b2333] text-white border border-[hsl(var(--gold))] text-base p-4",
      duration: 5000,
    });
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
              className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            {/* Point vert "En ligne" */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="font-heading text-2xl text-foreground m-0 leading-none">Catherine, 71</h2>
            <span className="text-green-600 text-sm font-medium mt-1 inline-block">En ligne</span>
          </div>
        </div>

        <div className="flex items-center gap-3 hidden sm:flex">
          <button
            onClick={handleLockedFeature}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-100 transition-colors relative group"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">Appeler</span>
            <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
          </button>

          <button
            onClick={handleLockedFeature}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-100 transition-colors relative group"
          >
            <Video className="w-4 h-4" />
            <span className="font-medium">Vidéo</span>
            <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
          </button>
        </div>
      </header>

      {/* 2. ZONE CENTRALE (Casser la glace élégamment) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center space-y-10">
        {/* Carte de Compatibilité */}
        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 max-w-xl w-full text-center">
          <div className="w-12 h-12 bg-[hsl(var(--gold)/0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-[hsl(var(--gold))]" />
          </div>
          <h3 className="font-heading text-2xl text-foreground mb-3">Vous avez un profil compatible</h3>
          <p className="text-slate-500 text-lg leading-relaxed font-light">
            D'après notre Conciergerie, vous et Catherine partagez une belle affinité pour les{" "}
            <strong>voyages en Europe</strong> et les <strong>soirées calmes</strong>.
          </p>
        </div>

        {/* Le Compte à rebours élégant (La règle des 6 jours) */}
        <div className="flex items-start sm:items-center gap-4 bg-[hsl(var(--gold)/0.05)] border border-[hsl(var(--gold)/0.2)] p-5 rounded-sm max-w-xl w-full">
          <Clock className="w-6 h-6 text-[hsl(var(--gold))] shrink-0 mt-1 sm:mt-0" />
          <p className="text-slate-600 text-base leading-relaxed font-light">
            <strong className="text-foreground font-medium">Le temps est précieux.</strong> Sans premier échange de
            votre part d'ici 6 jours, cette mise en relation sera discrètement archivée pour laisser place à de
            nouvelles rencontres.
          </p>
        </div>

        {/* Les Suggestions (Étincelles) */}
        <div className="w-full max-w-xl space-y-5 pt-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]" />
            <span className="text-sm font-medium tracking-[0.15em] uppercase text-slate-400">
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
                className="text-left p-5 bg-white border border-slate-200 rounded-sm hover:border-[hsl(var(--gold))] hover:shadow-sm transition-all text-slate-600 text-lg font-light leading-snug group"
              >
                <span className="text-[hsl(var(--gold))] font-serif text-2xl mr-2 leading-none">"</span>
                {suggestion}
                <span className="text-[hsl(var(--gold))] font-serif text-2xl ml-2 leading-none">"</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOOTER : ZONE DE SAISIE (Hyper Accessible) */}
      <footer className="bg-white border-t border-border p-4 md:p-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {/* Guide d'utilisation doux */}
          <p className="text-slate-400 text-sm font-light italic flex items-center gap-2 ml-2 mb-1">
            <Info className="w-4 h-4 opacity-70" />
            Rédigez votre message au clavier, ou utilisez le bouton "Dicter" pour parler naturellement.
          </p>

          <div className="flex items-end gap-3 w-full">
            {/* Bouton Dicter (Seniors friendly) */}
            <button className="flex items-center justify-center gap-2 bg-[#1b2333] hover:bg-[#2a364a] text-white px-5 sm:px-8 py-4 rounded-sm transition-colors shrink-0 h-[64px]">
              <Mic className="w-5 h-5" />
              <span className="font-medium text-lg hidden sm:inline tracking-wide">Dicter</span>
            </button>

            {/* Champ de texte dynamique */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 min-h-[64px] max-h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-sm resize-none text-lg text-foreground font-light leading-relaxed focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))]/50 transition-all placeholder:text-slate-400"
            />

            {/* Bouton Envoyer (Change d'état si rempli) */}
            <button
              className={`flex items-center justify-center gap-2 px-5 sm:px-8 py-4 rounded-sm transition-all duration-300 shrink-0 h-[64px] ${
                message.trim().length > 0
                  ? "bg-[hsl(var(--gold))] text-[#1b2333] hover:brightness-110 shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-bold text-lg hidden sm:inline tracking-wide">Envoyer</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
