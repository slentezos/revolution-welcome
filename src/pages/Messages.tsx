import { useState } from "react";
import { Mic, Send, Phone, Video, Shield, Clock, Sparkles, Lock, Info, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const conversations = [
  {
    id: "catherine",
    name: "Catherine, 71",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    online: true,
    affinity: "voyages en Europe et soirées calmes",
  },
  {
    id: "monique",
    name: "Monique, 68",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=faces",
    online: false,
    affinity: "randonnée en montagne et cuisine provençale",
  },
  {
    id: "francoise",
    name: "Françoise, 73",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    online: true,
    affinity: "littérature classique et jardinage",
  },
  {
    id: "marie",
    name: "Marie-Claire, 66",
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=faces",
    online: false,
    affinity: "danse de salon et concerts classiques",
  },
  {
    id: "josiane",
    name: "Josiane, 70",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    online: false,
    affinity: "photographie et promenades en bord de mer",
  },
  {
    id: "colette",
    name: "Colette, 75",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
    online: true,
    affinity: "opéra et art contemporain",
  },
  {
    id: "helene",
    name: "Hélène, 69",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    online: false,
    affinity: "yoga et méditation en pleine nature",
  },
];

export default function MessagesPage() {
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("catherine");

  const selected = conversations.find((c) => c.id === selectedId)!;

  const handleLockedFeature = () => {
    toast(
      "🔒 Pour votre sécurité, les appels se débloquent automatiquement après quelques messages échangés (au moins 5 messages chacun).",
      {
        position: "bottom-left",
        duration: 7000,
        className: "bg-[#1b2333] text-white border border-[hsl(var(--gold))] text-base p-4 shadow-xl transition-all",
      },
    );
  };

  const handleSparkleClick = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="flex h-full min-h-[600px] bg-background font-sans relative">
      {/* SIDEBAR — Conversations list */}
      <aside className="w-[320px] shrink-0 bg-white border-r border-border/50 flex flex-col hidden md:flex">
        <div className="p-5 border-b border-border/50">
          <h2 className="font-heading text-lg text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[hsl(var(--gold))]" />
            Mes conversations
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-light">{conversations.length} mises en relation</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-border/30 hover:bg-accent/30 ${
                selectedId === conv.id ? "bg-accent/50 border-l-2 border-l-[hsl(var(--gold))]" : ""
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.photo}
                  alt={conv.name}
                  className="w-11 h-11 rounded-full object-cover border border-border shadow-sm"
                />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground truncate">{conv.name}</p>
                <p className="text-xs text-muted-foreground font-light truncate mt-0.5">
                  Aucun message échangé
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--gold))]" title="Nouveau" />
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile conversation selector */}
        <div className="md:hidden bg-white border-b border-border/50 p-3 overflow-x-auto">
          <div className="flex gap-3">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`shrink-0 flex flex-col items-center gap-1 ${
                  selectedId === conv.id ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.photo}
                    alt={conv.name}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${
                      selectedId === conv.id ? "border-[hsl(var(--gold))]" : "border-transparent"
                    }`}
                  />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="text-[10px] text-foreground font-medium max-w-[60px] truncate">
                  {conv.name.split(",")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="bg-white border-b border-border/50 p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selected.photo}
                alt={selected.name}
                className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
              />
              {selected.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-xl text-foreground m-0 leading-none">{selected.name}</h2>
              <span className={`text-xs font-medium mt-1 inline-block ${selected.online ? "text-green-600" : "text-muted-foreground"}`}>
                {selected.online ? "En ligne" : "Hors ligne"}
              </span>
            </div>
          </div>

          <div className="items-center gap-3 hidden sm:flex">
            <button
              onClick={handleLockedFeature}
              className="flex items-center gap-2 px-4 py-2 bg-accent border border-border rounded-sm text-muted-foreground hover:bg-accent/80 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium text-sm">Appeler</span>
              <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
            </button>
            <button
              onClick={handleLockedFeature}
              className="flex items-center gap-2 px-4 py-2 bg-accent border border-border rounded-sm text-muted-foreground hover:bg-accent/80 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span className="font-medium text-sm">Vidéo</span>
              <Lock className="w-3 h-3 text-[hsl(var(--gold))] ml-1" />
            </button>
          </div>
        </header>

        {/* CENTRAL ZONE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center space-y-8">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-border max-w-xl w-full text-center">
            <div className="w-10 h-10 bg-[hsl(var(--gold)/0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-[hsl(var(--gold))]" />
            </div>
            <h3 className="font-heading text-xl text-foreground mb-2">Vous avez un profil compatible</h3>
            <p className="text-muted-foreground text-base leading-relaxed font-light">
              D'après notre Conciergerie, vous et {selected.name.split(",")[0]} partagez une belle affinité pour les{" "}
              <strong>{selected.affinity}</strong>.
            </p>
          </div>

          <div className="flex items-start sm:items-center gap-4 bg-[hsl(var(--gold)/0.05)] border border-[hsl(var(--gold)/0.2)] p-4 rounded-sm max-w-xl w-full">
            <Clock className="w-5 h-5 text-[hsl(var(--gold))] shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
              <strong className="text-foreground font-medium">Le temps est précieux.</strong> Sans premier échange de
              votre part d'ici 6 jours, cette mise en relation sera discrètement archivée.
            </p>
          </div>

          <div className="w-full max-w-xl space-y-4 pt-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                L'étincelle de la Conciergerie
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                `Bonjour ${selected.name.split(",")[0]} ! J'ai vu que vous aimiez voyager, quelle a été votre dernière belle découverte ?`,
                "Ravi de faire votre connaissance. Vous êtes plutôt thé ou café pour vos lectures du dimanche ?",
                "Bonjour ! Votre profil a retenu mon attention. Comment se passe votre semaine ?",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSparkleClick(suggestion)}
                  className="text-left p-4 bg-white border border-border rounded-sm hover:border-[hsl(var(--gold))] hover:shadow-sm transition-all text-muted-foreground text-base font-light leading-snug"
                >
                  <span className="text-[hsl(var(--gold))] font-serif text-xl mr-2 leading-none">"</span>
                  {suggestion}
                  <span className="text-[hsl(var(--gold))] font-serif text-xl ml-2 leading-none">"</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER INPUT */}
        <footer className="bg-white border-t border-border p-4 md:p-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <p className="text-muted-foreground text-xs sm:text-sm font-light italic flex items-center gap-2 ml-1 mb-1">
              <Info className="w-3.5 h-3.5 opacity-70" />
              Rédigez votre message ou utilisez "Dicter" pour parler naturellement.
            </p>
            <div className="flex items-end gap-3 w-full">
              <button className="flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background px-4 sm:px-6 py-3 rounded-sm transition-colors shrink-0 h-[56px]">
                <Mic className="w-5 h-5" />
                <span className="font-medium text-base hidden sm:inline tracking-wide">Dicter</span>
              </button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 min-h-[56px] max-h-[120px] p-3 sm:p-4 bg-accent border border-border rounded-sm resize-none text-base text-foreground font-light leading-relaxed focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))]/50 transition-all placeholder:text-muted-foreground"
              />
              <button
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-sm transition-all duration-300 shrink-0 h-[56px] ${
                  message.trim().length > 0
                    ? "bg-[hsl(var(--gold))] text-foreground hover:brightness-110 shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
                <span className="font-bold text-base hidden sm:inline tracking-wide">Envoyer</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
