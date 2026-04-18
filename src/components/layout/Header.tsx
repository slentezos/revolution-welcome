import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  CreditCard,
  Settings,
  ChevronDown,
  MessageCircle,
  Gift,
  ChevronLeft,
} from "lucide-react";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VisualComfortToggle from "./VisualComfortToggle";
import LanguageToggle from "./LanguageToggle";

const publicNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/notre-démarche", label: "Notre Démarche" },
  { href: "/a-propos", label: "Notre histoire" },
  { href: "/editorial", label: "L'éditorial" },
  { href: "/conseils", label: "Conseils" },
  { href: "/privileges", label: "Privilèges" },
  { href: "/contact", label: "Contact" },
];

// Unread count derived from mock conversations data
const UNREAD_MESSAGES = [
  { id: 1, unread: 2 },
  { id: 2, unread: 0 },
  { id: 3, unread: 0 },
];
const unreadCount = UNREAD_MESSAGES.reduce((sum, c) => sum + c.unread, 0);

const authNavLinks = [
  { href: "/dashboard", label: "Mon espace personnel" },
  { href: "/messages", label: "Mes messages", badge: unreadCount },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const [modalOpen, setModalOpen] = useState(false);
  const navLinks = user ? authNavLinks : publicNavLinks;

  const currentPath = location.pathname.toLowerCase();

  // ─── 1. ROUTES SANS HEADER (Le menu à onglets fait le job) ───
  const NO_HEADER_ROUTES = ["/tutoriel", "/quiz", "/photos", "/video", "/creation-profil", "/personnalite", "/onboarding"];
  const hideHeader = NO_HEADER_ROUTES.some((route) => currentPath.startsWith(route));

  // Si on est sur une de ces pages, on supprime totalement le Header
  if (hideHeader) {
    return null;
  }

  // ─── 2. ROUTES AVEC HEADER MINIMALISTE (ex: Paiement, Service Conciergerie) ───
  const MINIMAL_HEADER_ROUTES = ["/reservation"];
  const isMinimalHeader = MINIMAL_HEADER_ROUTES.some((route) => currentPath.startsWith(route));

  if (isMinimalHeader) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm py-4 border-b border-amber-200/20">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between">
          <span className="font-serif text-2xl md:text-3xl tracking-tight text-slate-900">Kalimera</span>
          <button
            onClick={() => {
              if (currentPath.startsWith("/reservation")) {
                navigate("/onboarding?step=welcome&showPricing=true");
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-2 bg-white border border-amber-200/50 hover:border-amber-500/50 text-slate-700 px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm group"
          >
            <ChevronLeft className="h-4 w-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] sm:text-[13px] uppercase tracking-widest font-semibold hidden sm:block">
              Modifier mon accompagnement
            </span>
            <span className="text-[12px] uppercase tracking-widest font-semibold sm:hidden">Retour</span>
          </button>
        </div>
      </header>
    );
  }

  // ─── 3. MODE NORMAL : Navigation complète (avec gestion connexion) ───
  return (
    <>
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm py-3 border-b border-amber-200/20"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* 1. Logo — Style Héritage */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group shrink-0">
              <span className="font-serif text-2xl md:text-3xl tracking-tight text-slate-900 transition-colors duration-300">
                Kalimera
              </span>
            </Link>

            {/* 2. Desktop Navigation — Style Exclusif */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative py-2 text-[13px] uppercase tracking-wider font-medium transition-all duration-300 group ${
                    location.pathname === link.href ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center mx-0 gap-px px-0">
                    {link.label}
                    {"badge" in link && (link as any).badge > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-900 text-[10px] text-white font-bold ml-1">
                        {(link as any).badge}
                      </span>
                    )}
                  </div>

                  {/* Trait de lumière doré */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-amber-600 transition-all duration-500 ease-out ${
                      location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* 3. CTA / Profile Buttons */}
            <div className="flex items-center gap-3">
              <LanguageToggle />
              {user && (
                <div className="hidden lg:block">
                  <VisualComfortToggle />
                </div>
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden lg:flex items-center gap-3 bg-white border border-amber-200/40 hover:border-amber-500/50 text-slate-800 px-5 py-2.5 rounded-full transition-all duration-500 shadow-sm group">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <User className="h-4 w-4 text-amber-500" />
                      </div>
                      <span className="text-[13px] uppercase tracking-widest font-semibold">Mon profil</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 mt-3 bg-white border-amber-100 shadow-2xl rounded-xl p-2"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/profil")}
                      className="py-3 px-4 text-[14px] text-slate-700 cursor-pointer rounded-lg hover:bg-amber-50 transition-colors gap-3"
                    >
                      <Settings className="h-4 w-4 text-amber-600" /> Gérer mes informations
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/profil?tab=abonnement")}
                      className="py-3 px-4 text-[14px] text-slate-700 cursor-pointer rounded-lg hover:bg-amber-50 transition-colors gap-3"
                    >
                      <CreditCard className="h-4 w-4 text-amber-600" /> Mon abonnement Privilège
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/contact")}
                      className="py-3 px-4 text-[14px] text-slate-700 cursor-pointer rounded-lg hover:bg-amber-50 transition-colors gap-3"
                    >
                      <MessageCircle className="h-4 w-4 text-amber-600" /> Nous contacter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/profil?gift=true")}
                      className="py-3 px-4 text-[14px] text-slate-700 cursor-pointer rounded-lg hover:bg-amber-50 transition-colors gap-3"
                    >
                      <Gift className="h-4 w-4 text-amber-600" /> Offrir un abonnement
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-amber-100/40" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="py-3 px-4 text-[14px] text-red-600 cursor-pointer rounded-lg hover:bg-red-50 transition-colors gap-3"
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center gap-8">
                  <Link
                    to="/connexion"
                    className="text-[13px] uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-colors font-medium"
                  >
                    Espace Membres
                  </Link>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-full text-[13px] uppercase tracking-wider font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                  >
                    Rejoindre le Cercle
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-3 rounded-full bg-slate-100 text-slate-900 hover:bg-amber-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-[70px] bg-[#FAF9F6] z-50 animate-fade-in p-8 flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-2xl font-serif py-4 border-b border-amber-100 animate-fade-up ${
                    location.pathname === link.href ? "text-amber-800" : "text-slate-600"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
                {user ? (
                  <button onClick={handleLogout} className="w-full py-4 bg-slate-900 text-white rounded-full font-bold">
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen(true);
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-center"
                  >
                    Rejoindre le Cercle
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
