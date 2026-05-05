import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Send, Undo2, X, Sparkles, Clock } from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";
import MatchProfileModal from "@/components/dashboard/MatchProfileModal";
import DashboardMatchCard from "@/components/dashboard/DashboardMatchCard";
import DashboardPendingCard from "@/components/dashboard/DashboardPendingCard";
import DashboardProgressCards from "@/components/dashboard/DashboardProgressCards";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EmptyMatchState from "@/components/dashboard/EmptyMatchState";

const getIsoDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Mock data for matches — Nouvelles propositions
const mockMatches = [
  { id: 1, name: "Marie", age: 67, location: "75014 - Paris", affinity: 85, matchedAt: getIsoDateDaysAgo(0), avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", verified: true, online: true, tags: ["Jazz", "Voyages", "Théâtre"], commonPoint: "Vous adorez tous les deux le Jazz et les voyages en Italie." },
  { id: 2, name: "Sophie", age: 59, location: "93000 - Boulogne-Billancourt", affinity: 81, matchedAt: getIsoDateDaysAgo(1), avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", verified: true, online: false, tags: ["Cuisine", "Randonnée"], commonPoint: "Vous partagez la passion de la randonnée en montagne et des marchés provençaux." },
  { id: 3, name: "Catherine", age: 71, location: "92430 - Marnes-la-Coquette", affinity: 80, matchedAt: getIsoDateDaysAgo(2), avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", verified: false, online: true, tags: ["Lecture", "Jardinage", "Opéra"], commonPoint: "Vous adorez tous les deux le jardinage et l'opéra italien." },
  { id: 4, name: "Anne", age: 64, location: "67000 - Strasbourg", affinity: 84, matchedAt: getIsoDateDaysAgo(3), avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", verified: true, online: false, tags: ["Musée", "Vélo", "Cuisine"], commonPoint: "Vous partagez l'amour des musées et des balades à vélo le long du Rhin." },
  { id: 5, name: "Martine", age: 68, location: "35000 - Rennes", affinity: 78, matchedAt: getIsoDateDaysAgo(4), avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face", verified: false, online: true, tags: ["Tricot", "Cinéma", "Marche"], commonPoint: "Vous appréciez tous les deux les longues promenades et le cinéma indépendant." },
];

export type MockMatch = typeof mockMatches[0];
export type SavedMatch = MockMatch & {savedAt: string;};
export type PendingMatch = MockMatch & {acceptedAt: string;};
type DashboardProfile = { first_name?: string | null; onboarding_step?: string | null };

// Mock data — En attente de sa réponse
const mockPendingMatches: PendingMatch[] = [
  { id: 10, name: "Isabelle", age: 63, location: "69006 - Lyon", affinity: 88, matchedAt: "2026-03-20", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", verified: true, online: true, tags: ["Peinture", "Yoga", "Cinéma"], commonPoint: "Vous partagez un amour pour le cinéma d'auteur et les expositions d'art contemporain.", acceptedAt: "25 mars 2026" },
  { id: 11, name: "Nathalie", age: 61, location: "44000 - Nantes", affinity: 86, matchedAt: "2026-03-19", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", verified: true, online: true, tags: ["Musique classique", "Bénévolat", "Marche"], commonPoint: "Vous partagez l'engagement associatif et l'amour de la musique classique.", acceptedAt: "24 mars 2026" },
  { id: 12, name: "Hélène", age: 58, location: "13008 - Marseille", affinity: 83, matchedAt: "2026-03-18", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", verified: false, online: true, tags: ["Voile", "Photographie"], commonPoint: "Vous adorez tous les deux la mer Méditerranée et la photographie de paysages.", acceptedAt: "23 mars 2026" },
];

// Mock data — À finaliser de ma part
const mockSavedMatches: SavedMatch[] = [
  { id: 20, name: "Françoise", age: 65, location: "33000 - Bordeaux", affinity: 79, matchedAt: "2026-03-22", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", verified: true, online: false, tags: ["Vin", "Littérature", "Danse"], commonPoint: "Vous êtes tous les deux passionnés de littérature française et de dégustation de vins.", savedAt: "26 mars 2026" },
  { id: 21, name: "Dominique", age: 69, location: "31000 - Toulouse", affinity: 77, matchedAt: "2026-03-21", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", verified: false, online: false, tags: ["Histoire", "Bridge", "Gastronomie"], commonPoint: "Vous êtes tous les deux amateurs de gastronomie du Sud-Ouest et de jeux de société.", savedAt: "25 mars 2026" },
  { id: 22, name: "Béatrice", age: 62, location: "06000 - Nice", affinity: 82, matchedAt: "2026-03-20", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", verified: true, online: true, tags: ["Aquarelle", "Méditation", "Théâtre"], commonPoint: "Vous partagez la passion de l'aquarelle et des balades sur la Promenade des Anglais.", savedAt: "24 mars 2026" },
  { id: 23, name: "Chantal", age: 66, location: "59000 - Lille", affinity: 80, matchedAt: "2026-03-19", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face", verified: true, online: false, tags: ["Bridge", "Voyages", "Musique"], commonPoint: "Vous partagez l'amour de la musique baroque et des week-ends en Belgique.", savedAt: "23 mars 2026" },
  { id: 24, name: "Sylvie", age: 70, location: "21000 - Dijon", affinity: 76, matchedAt: "2026-03-18", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face", verified: false, online: true, tags: ["Œnologie", "Patrimoine", "Cuisine"], commonPoint: "Vous appréciez tous les deux l'œnologie bourguignonne et la visite de châteaux.", savedAt: "22 mars 2026" },
];

const SAVED_MATCHES_STORAGE_KEY = "kalimera_saved_matches_v3";
const ACCEPTED_MATCHES_STORAGE_KEY = "kalimera_accepted_matches_v3";
const PENDING_MATCHES_STORAGE_KEY = "kalimera_pending_matches_v3";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MockMatch | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedForLater, setSavedForLater] = useState<SavedMatch[]>(() => {
    const raw = localStorage.getItem(SAVED_MATCHES_STORAGE_KEY);
    if (!raw) return mockSavedMatches;
    try {const parsed = JSON.parse(raw) as SavedMatch[]; return parsed.length > 0 ? parsed : mockSavedMatches;} catch {return mockSavedMatches;}
  });
  const [acceptedMatchIds, setAcceptedMatchIds] = useState<number[]>(() => {
    const raw = localStorage.getItem(ACCEPTED_MATCHES_STORAGE_KEY);
    if (!raw) return mockPendingMatches.map(m => m.id);
    try {return JSON.parse(raw);} catch {return mockPendingMatches.map(m => m.id);}
  });
  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>(() => {
    const raw = localStorage.getItem(PENDING_MATCHES_STORAGE_KEY);
    if (!raw) return mockPendingMatches;
    try {const parsed = JSON.parse(raw) as PendingMatch[]; return parsed.length > 0 ? parsed : mockPendingMatches;} catch {return mockPendingMatches;}
  });

  const [viewingPending, setViewingPending] = useState(false);
  const [undoBanner, setUndoBanner] = useState<{match: MockMatch;timer: ReturnType<typeof setTimeout>;} | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const revealRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const matchId = searchParams.get("match");
    if (matchId && !loading) {
      const found = mockMatches.find((m) => m.id === Number(matchId));
      if (found) {setSelectedMatch(found);setModalOpen(true);setSearchParams({}, { replace: true });}
    }
  }, [searchParams, loading, setSearchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {navigate("/connexion");return;}
      setUser(session.user);
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle();
      if (!profileData || profileData.onboarding_step !== "completed") {navigate("/onboarding");return;}
      setProfile(profileData);
      setLoading(false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {if (!session) navigate("/connexion");});
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {localStorage.setItem(SAVED_MATCHES_STORAGE_KEY, JSON.stringify(savedForLater));}, [savedForLater]);
  useEffect(() => {localStorage.setItem(ACCEPTED_MATCHES_STORAGE_KEY, JSON.stringify(acceptedMatchIds));}, [acceptedMatchIds]);
  useEffect(() => {localStorage.setItem(PENDING_MATCHES_STORAGE_KEY, JSON.stringify(pendingMatches));}, [pendingMatches]);

  const handleDecideLater = useCallback((match: MockMatch) => {
    const savedAt = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    setSavedForLater((prev) => {
      const idx = prev.findIndex((m) => m.id === match.id);
      if (idx === -1) return [...prev, { ...match, savedAt }];
      const updated = [...prev];updated[idx] = { ...prev[idx], ...match, savedAt };return updated;
    });

    // Show undo banner
    if (undoBanner?.timer) clearTimeout(undoBanner.timer);
    const timer = setTimeout(() => setUndoBanner(null), 10000);
    setUndoBanner({ match, timer });
  }, [undoBanner]);

  const handleUndo = useCallback(() => {
    if (!undoBanner) return;
    setSavedForLater((prev) => prev.filter((m) => m.id !== undoBanner.match.id));
    clearTimeout(undoBanner.timer);
    setUndoBanner(null);
  }, [undoBanner]);

  const dismissBanner = useCallback(() => {
    if (undoBanner?.timer) clearTimeout(undoBanner.timer);
    setUndoBanner(null);
  }, [undoBanner]);

  const sixDaysInMs = 6 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const visibleMatches = mockMatches.filter(
    (m) => !savedForLater.some((s) => s.id === m.id) && !acceptedMatchIds.includes(m.id) && !pendingMatches.some((p) => p.id === m.id)
  );

  const filteredMatches = visibleMatches.filter(
    (m) => now - new Date(m.matchedAt).getTime() <= sixDaysInMs
  ).slice(0, 5);
  const visibleSavedForLater = savedForLater.filter(
    (m) => !pendingMatches.some((p) => p.id === m.id) && !acceptedMatchIds.includes(m.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(35,20%,94%)]">
        <div className="animate-pulse text-muted-foreground text-lg">Chargement...</div>
      </div>);

  }

  return (
    <Layout>
      <div ref={revealRef} className="min-h-screen bg-[#faf8f5]">
        {/* Undo Banner */}
        {undoBanner &&
        <div className="sticky top-0 z-50 animate-fade-in">
            <div className="bg-amber-50 border-b-2 border-amber-300 px-4 md:px-8 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Undo2 className="h-5 w-5 text-amber-700" />
                  </div>
                  <p className="text-foreground font-medium text-lg">
                    Profil de <span className="font-semibold">{undoBanner.match.name}</span> déplacé dans « À revoir ».
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                  onClick={handleUndo}
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-[0_4px_0_0_hsl(var(--primary)/0.4)] hover:shadow-[0_2px_0_0_hsl(var(--primary)/0.4)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100">
                  
                    Remettre dans mes propositions
                  </button>
                  <button
                  onClick={dismissBanner}
                  className="p-2 rounded-full hover:bg-amber-200/60 transition-colors">
                  
                    <X className="h-5 w-5 text-amber-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <DashboardGreeting firstName={profile?.first_name} />
          <div data-reveal>
            <DashboardProgressCards />
          </div>
          <div data-reveal data-reveal-delay="100">
            <DashboardStatsCards
              onMessagesClick={() => navigate("/messages")}
              newProposalsCount={filteredMatches.length}
              pendingCount={pendingMatches.length}
              savedCount={visibleSavedForLater.length}
              unreadMessageCount={2} />
            
          </div>

          {/* ── Section: Nouvelles Propositions ── */}
          <div id="section-nouvelles" data-reveal data-reveal-delay="200" className="scroll-mt-4">
            {/* Section Header */}
            <div className="flex items-center gap-5 mb-8 py-[20px]">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl text-foreground tracking-tight">
                  Vos nouvelles propositions
                </h2>
                <p className="text-muted-foreground font-medium text-xl mt-1">
                  Des profils sélectionnés avec soin par nos experts
                </p>
              </div>
              <div className="ml-auto hidden md:block">
                <div className="divider-gold w-24" />
              </div>
            </div>

            {filteredMatches.length === 0 && pendingMatches.length === 0 && visibleSavedForLater.length === 0 ? (
              <EmptyMatchState />
            ) : filteredMatches.length === 0 ? null : (
              <div className="grid grid-cols-1 gap-6">
                {filteredMatches.map((match) => (
                  <DashboardMatchCard key={match.id} match={match} onView={() => { setSelectedMatch(match); setModalOpen(true); }} />
                ))}
              </div>
            )}
          </div>

          {/* ── Section: En Attente ── */}
          {pendingMatches.length > 0 && (
            <div id="section-attente" data-reveal data-reveal-delay="100" className="mt-12 scroll-mt-4">
              <div className="flex items-center gap-5 mb-8 py-[20px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Send className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-heading text-3xl lg:text-4xl text-foreground tracking-tight">
                    En attente de sa réponse
                  </h2>
                  <p className="text-muted-foreground font-medium text-xl mt-1">
                    Vous avez accepté — en attente de leur confirmation
                  </p>
                </div>
                <div className="ml-auto hidden md:block">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {pendingMatches.map((match) => (
                  <DashboardPendingCard key={match.id} match={match} onView={() => { setSelectedMatch(match); setViewingPending(true); setModalOpen(true); }} />
                ))}
              </div>
            </div>
          )}

          {/* ── Section: À Finaliser ── */}
          {visibleSavedForLater.length > 0 && (
            <div id="section-finaliser" data-reveal data-reveal-delay="100" className="mt-12 scroll-mt-4">
              <div className="flex items-center gap-5 mb-8 py-[20px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-heading text-3xl lg:text-4xl text-foreground tracking-tight">
                    Propositions à finaliser
                  </h2>
                  <p className="text-muted-foreground font-medium text-xl mt-1">
                    Des profils que vous souhaitez revoir à votre rythme
                  </p>
                </div>
                <div className="ml-auto hidden md:block">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {visibleSavedForLater.map((match) => (
                  <div key={match.id} className="relative">
                    <DashboardMatchCard match={match} onView={() => { setSelectedMatch(match); setModalOpen(true); }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <MatchProfileModal
          match={selectedMatch}
          open={modalOpen}
          onOpenChange={(v) => {setModalOpen(v);if (!v) setViewingPending(false);}}
          hideActions={viewingPending}
          onAccept={() => {
            if (selectedMatch) {
              setSavedForLater((prev) => prev.filter((m) => m.id !== selectedMatch.id));
              setAcceptedMatchIds((prev) => [...new Set([...prev, selectedMatch.id])]);
              const acceptedAt = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
              setPendingMatches((prev) => {
                if (prev.some((m) => m.id === selectedMatch.id)) return prev;
                return [...prev, { ...selectedMatch, acceptedAt }];
              });
            }
            setModalOpen(false);
          }}
          onRefuse={() => {if (selectedMatch) setSavedForLater((prev) => prev.filter((m) => m.id !== selectedMatch.id));setModalOpen(false);}}
          onDecideLater={() => {if (selectedMatch) handleDecideLater(selectedMatch);setModalOpen(false);}} />
        
      </div>
    </Layout>);

}