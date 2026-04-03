import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MatchActionConfirmDialog from "./MatchActionConfirmDialog";
import {
  Play,
  MapPin,
  Ruler,
  Feather,
  GraduationCap,
  Languages,
  Utensils,
  Globe,
  Moon,
  Sparkles,
  Heart,
  X,
  Clock,
  Check,
  User,
  Brain,
  HelpCircle,
  ChevronLeft,
  ChevronRight } from
"lucide-react";
import personalityHero from "@/assets/personality-hero.jpg";

const originToCountryCode: Record<string, string> = {
  Européenne: "fr",
  Française: "fr",
  Italienne: "it",
  Espagnole: "es",
  Portugaise: "pt",
  Allemande: "de",
  Britannique: "gb",
  Américaine: "us",
  Marocaine: "ma",
  Algérienne: "dz",
  Tunisienne: "tn",
  Russe: "ru",
  Turque: "tr",
  Libanaise: "lb",
  Brésilienne: "br"
};

interface MatchProfile {
  id: number;
  name: string;
  age: number;
  location: string;
  affinity: number;
  avatar: string;
  photos?: string[];
  height?: string;
  smoking?: string;
  education?: string;
  languages?: string;
  diet?: string;
  origin?: string;
  nationality?: string;
  religion?: string;
  availability?: string;
  lookingFor?: string;
  matchedAt?: string;
  quizPreferences?: {
    drinks?: string[];
    food?: string[];
    books?: string[];
    movies?: string[];
    music?: string[];
    destinations?: string[];
    artists?: string[];
    animals?: string[];
    objects?: string[];
    hobbies?: string[];
  };
}

interface MatchProfileModalProps {
  match: MatchProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  onRefuse?: () => void;
  onDecideLater?: () => void;
  hideActions?: boolean;
}

type TabId = "profile" | "quiz" | "personality";

const tabs: {id: TabId;label: string;icon: typeof User;}[] = [
{ id: "profile", label: "Profil", icon: User },
{ id: "quiz", label: "Quiz", icon: HelpCircle },
{ id: "personality", label: "Personnalité", icon: Brain }];


// Mock personality data for the match
const matchPersonality = {
  title: "Le Séducteur élégant et charismatique",
  dimensions: [
  { label: "Extraverti", value: 64 },
  { label: "Concret", value: 55 },
  { label: "Empathique", value: 62 },
  { label: "Structuré", value: 58 }],


  temperament:
  "Vous avez une aisance naturelle dans la relation. Vous savez capter l'attention, créer du lien, installer une dynamique. Sans en faire trop, vous avez ce sens du contact qui facilite les échanges. Vous êtes attentif(ve) à l'image que vous renvoyez et à la qualité de vos interactions. Vous aimez que les relations soient fluides, agréables, équilibrées. Vous avez besoin d'interaction. Le lien, les échanges, les regards comptent pour vous. Dans votre parcours, vous avez souvent développé cette capacité à vous adapter aux autres, à comprendre rapidement ce qui fonctionne dans la relation. Dans la relation, vous êtes présent(e), engageant(e), expressif(ve). Vous savez créer une proximité.",
  strengths: [
  "Aisance relationnelle",
  "Charisme naturel",
  "Capacité d'adaptation",
  "Qualité de communication",
  "Présence",
  "Sens du lien"],


  weaknesses: ["Tendance à rester en surface", "Besoin de validation", "Difficulté à se livrer en profondeur"]
};

export default function MatchProfileModal({
  match,
  open,
  onOpenChange,
  onAccept,
  onRefuse,
  onDecideLater,
  hideActions = false
}: MatchProfileModalProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [confirmAction, setConfirmAction] = useState<"accept" | "refuse" | "later" | null>(null);

  if (!match) return null;

  const profileData = {
    height: match.height || "180 cm",
    smoking: match.smoking || "A l'occasion",
    education: match.education || "Master 3",
    languages: match.languages || "English, Russian",
    diet: match.diet || "Sans restriction",
    origin: match.origin || "Européenne",
    religion: match.religion || "Musulmane",
    availability: match.availability || "Weekend",
    lookingFor: match.lookingFor || "Amour",
    photos: [
    match.avatar,
    ...(match.photos || [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"])],



    quizPreferences: match.quizPreferences || {
      drinks: ["Champagne", "Vin rouge", "Thé"],
      food: ["Cuisine française", "Sushi", "Italien"],
      books: ["Le Petit Prince", "Belle du Seigneur", "L'Étranger"],
      movies: ["Les Intouchables", "Amélie Poulain", "Casablanca"],
      music: ["Jazz", "Classique", "Chanson française"],
      destinations: ["Toscane", "Provence", "Japon"],
      artists: ["Aznavour", "Édith Piaf", "Monet"],
      animals: ["Chat", "Cheval", "Dauphin"],
      objects: ["Montre ancienne", "Carnet de voyage", "Appareil photo"],
      hobbies: ["Jardinage", "Randonnée", "Lecture"]
    }
  };

  const allMedia = profileData.photos;

  const profileAttributes = [
  { icon: MapPin, label: "Localisation", value: match.location.split(" - ")[0] || "Paris" },
  { icon: Ruler, label: "Taille", value: profileData.height },
  { icon: Feather, label: "Tabac", value: profileData.smoking },
  { icon: GraduationCap, label: "Études", value: profileData.education },
  { icon: Languages, label: "Langues", value: profileData.languages },
  { icon: Utensils, label: "Régime", value: profileData.diet },
  { icon: Globe, label: "Origine", value: profileData.origin },
  { icon: Moon, label: "Religion", value: profileData.religion },
  { icon: Sparkles, label: "Disponibilité", value: profileData.availability },
  { icon: Heart, label: "Recherche", value: profileData.lookingFor }];


  const quizCategories = [
  { label: "Boissons", emoji: "🍸", items: profileData.quizPreferences.drinks },
  { label: "Cuisine", emoji: "🍽️", items: profileData.quizPreferences.food },
  { label: "Livres", emoji: "📚", items: profileData.quizPreferences.books },
  { label: "Films", emoji: "🎬", items: profileData.quizPreferences.movies },
  { label: "Musique", emoji: "🎵", items: profileData.quizPreferences.music },
  { label: "Destinations", emoji: "✈️", items: profileData.quizPreferences.destinations },
  { label: "Artistes", emoji: "🎨", items: profileData.quizPreferences.artists },
  { label: "Animaux", emoji: "🐕", items: profileData.quizPreferences.animals },
  { label: "Objets fétiches", emoji: "⌚", items: profileData.quizPreferences.objects },
  { label: "Passe-temps", emoji: "🌿", items: profileData.quizPreferences.hobbies }];


  const goToPrev = () => setActiveMediaIndex((i) => i === 0 ? allMedia.length - 1 : i - 1);
  const goToNext = () => setActiveMediaIndex((i) => i === allMedia.length - 1 ? 0 : i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] xl:max-w-[1300px] h-[94vh] p-0 gap-0 overflow-hidden bg-background rounded-xl border-none shadow-[var(--shadow-luxury)]">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-5 top-5 z-50 p-2.5 rounded-full bg-background/95 hover:bg-background transition-colors shadow-md border border-border/30">
          
          <X className="h-5 w-5 text-foreground" />
        </button>

        <div className="flex flex-col h-full">
          {/* ═══ TAB BAR — Elegant gold underline style ═══ */}
          <div className="flex border-b border-border/30 bg-secondary flex-shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 text-xl font-medium transition-all duration-300 border-b-[3px] ${
                  isActive ?
                  "border-[hsl(var(--gold))] text-foreground bg-background" :
                  "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50"}`
                  }>
                  
                  <Icon className="h-5 w-5" />
                  <span className="font-heading tracking-wide text-2xl">{tab.label}</span>
                </button>);

            })}
          </div>

          {/* ═══ TAB CONTENT ═══ Scrollable wrapper for all tabs */}
          <div className="flex-1 overflow-y-auto">
            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" &&
            <div className="flex flex-col lg:flex-row min-h-full">
                {/* Left: Media viewer */}
                <div className="lg:w-[50%] flex flex-col bg-secondary/50 p-4 lg:p-5">
                  {/* Identity bar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[hsl(var(--gold))]/30 flex-shrink-0">
                      <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight lg:text-4xl">
                          {match.name}
                        </h2>
                        <img
                        src={`https://flagcdn.com/w40/${originToCountryCode[profileData.origin] || "fr"}.png`}
                        alt={profileData.origin}
                        className="w-6 h-4 rounded-sm object-cover" />
                      
                      </div>
                      <p className="text-muted-foreground text-2xl">
                        {match.age} ans · {match.location.split(" - ")[0]}
                      </p>
                    </div>
                    {/* Affinity */}
                    <div className="flex-shrink-0 px-5 py-2.5 bg-primary rounded-full flex items-center gap-2">
                      <Heart className="h-4 w-4 text-[hsl(var(--gold))]" fill="hsl(var(--gold))" />
                      <span className="text-xl font-bold text-primary-foreground">{match.affinity}%</span>
                      <span className="text-primary-foreground/70 text-base hidden sm:inline">affinité</span>
                    </div>
                  </div>

                  {/* Main media */}
                  <div className="relative flex-1 min-h-[400px] rounded-xl overflow-hidden group/media">
                    <img
                    src={allMedia[activeMediaIndex]}
                    alt={`${match.name} - photo ${activeMediaIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out absolute inset-0" />
                  

                    {activeMediaIndex === 0 &&
                  <button className="absolute inset-0 flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300">
                        <div className="w-20 h-20 rounded-full bg-background/95 flex items-center justify-center shadow-xl backdrop-blur-sm">
                          <Play className="h-9 w-9 text-primary ml-1" />
                        </div>
                      </button>
                  }

                    {/* Navigation arrows with text */}
                    <button
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/90 hover:bg-background shadow-md transition-all duration-200 opacity-80 hover:opacity-100 group-hover/media:opacity-100">
                    
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                      <span className="text-foreground font-medium text-base hidden lg:inline">Précédent</span>
                    </button>
                    <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/90 hover:bg-background shadow-md transition-all duration-200 opacity-80 hover:opacity-100 group-hover/media:opacity-100">
                    
                      <span className="text-foreground font-medium text-base hidden lg:inline">Suivant</span>
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>

                    {/* Counter pill */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/50 text-primary-foreground px-5 py-1.5 rounded-full text-base font-medium backdrop-blur-md">
                      {activeMediaIndex + 1} / {allMedia.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                    {allMedia.map((photo, idx) =>
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    idx === activeMediaIndex ?
                    "ring-2 ring-[hsl(var(--gold))] ring-offset-2 scale-105 shadow-md" :
                    "opacity-50 hover:opacity-90"}`
                    }>
                    
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        {idx === 0 &&
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                            <Play className="h-3.5 w-3.5 text-primary-foreground" />
                          </div>
                    }
                      </button>
                  )}
                  </div>
                </div>

                {/* Right: Profile attributes */}
                <div className="lg:w-[50%] flex flex-col p-5 lg:p-6 bg-[hsl(var(--cream))]">
                  <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-[hsl(var(--gold))]" />
                    Informations
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
                    {profileAttributes.map((attr, idx) =>
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-b-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <attr.icon className="h-[18px] w-[18px] text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-muted-foreground font-medium uppercase tracking-wider text-xl">
                            {attr.label}
                          </p>
                          <p className="text-foreground font-medium truncate text-xl">{attr.value}</p>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            }

            {/* ── QUIZ TAB ── */}
            {activeTab === "quiz" &&
            <div className="flex flex-col min-h-full bg-[hsl(var(--cream))] p-5 lg:p-6 pb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] bg-[hsl(var(--gold))]" />
                  <h3 className="font-heading text-2xl font-semibold text-foreground">Quiz des 3 préférences</h3>
                  <span className="text-muted-foreground text-xl">— Ce que {match.name} apprécie</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                  {quizCategories.map((cat, idx) =>
                <div
                  key={idx}
                  className="bg-background rounded-xl p-4 flex flex-col border border-border/20 hover:shadow-[var(--shadow-soft)] transition-shadow">
                  
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="font-heading font-semibold text-foreground text-2xl">{cat.label}</span>
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        {cat.items?.map((item, itemIdx) =>
                    <span
                      key={itemIdx}
                      className="px-3 py-1.5 bg-secondary rounded-lg text-foreground font-medium border border-border/15 text-lg">
                      
                            {item}
                          </span>
                    )}
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {/* ── PERSONALITY TAB ── */}
            {activeTab === "personality" &&
            <div className="min-h-full pb-10">
                {/* Hero section */}
                <div className="relative h-[320px] lg:h-[360px] flex items-center justify-center overflow-hidden">
                  <img src={personalityHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/70" />
                  <div className="relative z-10 text-center px-8">
                    <p className="text-[hsl(var(--gold))] font-heading tracking-[4px] uppercase mb-3 text-3xl">
                      Profil de personnalité
                    </p>
                    <h2 className="font-heading text-3xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-6">
                      {matchPersonality.title}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                      {matchPersonality.dimensions.map((dim, idx) =>
                    <span
                      key={idx}
                      className="px-5 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-medium text-lg">
                      
                          {dim.label} <span className="font-bold text-[hsl(var(--gold))]">{dim.value}%</span>
                        </span>
                    )}
                    </div>
                  </div>
                </div>

                {/* Temperament text */}
                <div className="bg-[hsl(var(--cream))] px-8 lg:px-16 py-10">
                  <p className="text-foreground text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto font-normal">
                    {matchPersonality.temperament}
                  </p>
                </div>

                {/* Strengths and weaknesses side by side */}
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="bg-primary/[0.04] p-8 lg:p-10">
                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-[hsl(var(--gold))]" />
                      Points forts
                    </h3>
                    <div className="space-y-3">
                      {matchPersonality.strengths.map((s, idx) =>
                    <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
                          <span className="text-foreground font-medium text-lg">{s}</span>
                        </div>
                    )}
                    </div>
                  </div>
                  <div className="bg-primary/[0.04] p-8 lg:p-10 lg:bg-transparent border-t lg:border-t-0 lg:border-l border-border/10">
                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-muted-foreground/40" />
                      Points faibles
                    </h3>
                    <div className="space-y-3">
                      {matchPersonality.weaknesses.map((w, idx) =>
                    <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                          <span className="text-muted-foreground text-lg">{w}</span>
                        </div>
                    )}
                    </div>
                  </div>
                </div>

                {/* Compatibility note */}
                <div className="bg-[hsl(var(--cream))] px-8 lg:px-16 py-10">
                  <div className="max-w-3xl mx-auto bg-background rounded-xl p-8 border border-border/20 shadow-[var(--shadow-soft)]">
                    <p className="text-[hsl(var(--gold))] font-heading text-sm tracking-[3px] uppercase mb-3">
                      Compatibilité
                    </p>
                    <p className="text-foreground text-lg leading-relaxed">
                      Vos profils de personnalité montrent une forte compatibilité, notamment sur l'empathie et la
                      stabilité émotionnelle — des bases solides pour une relation épanouissante.
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* ═══ Bottom action bar — luxury style ═══ */}
          {!hideActions &&
          <div className="border-t border-border/20 px-6 lg:px-10 py-4 flex items-center justify-between bg-primary flex-shrink-0 z-20">
            <p className="text-primary-foreground/70 font-heading text-lg tracking-wide hidden sm:block">
              Que souhaitez-vous faire ?
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                onClick={() => setConfirmAction("refuse")}
                className="px-7 py-3 h-auto rounded-full text-base font-medium bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border border-primary-foreground/20 gap-2 backdrop-blur-sm transition-colors">
                
                <X className="h-4 w-4" />
                Refuser
              </Button>
              <Button
                onClick={() => setConfirmAction("later")}
                className="px-7 py-3 h-auto rounded-full text-base font-medium bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-light))] hover:bg-[hsl(var(--gold))]/25 border border-[hsl(var(--gold))]/30 gap-2 transition-colors">
                
                <Clock className="h-4 w-4" />
                Décider plus tard
              </Button>
              <Button
                onClick={() => setConfirmAction("accept")}
                className="px-8 py-3 h-auto rounded-full text-base font-semibold bg-[hsl(var(--gold))] text-primary hover:bg-[hsl(var(--gold-light))] shadow-lg gap-2 transition-colors">
                
                <Check className="h-4 w-4" />
                Accepter
              </Button>
            </div>
          </div>
          }
        </div>

        {/* Confirmation Dialog */}
        {confirmAction &&
        <MatchActionConfirmDialog
          open={!!confirmAction}
          onOpenChange={(v) => {
            if (!v) setConfirmAction(null);
          }}
          action={confirmAction}
          matchName={match.name}
          onConfirm={() => {
            if (confirmAction === "accept") onAccept?.();else
            if (confirmAction === "refuse") onRefuse?.();else
            if (confirmAction === "later") {
              onDecideLater?.();
              onOpenChange(false);
            }
            setConfirmAction(null);
          }} />

        }
      </DialogContent>
    </Dialog>);

}