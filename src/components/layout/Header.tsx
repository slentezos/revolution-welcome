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

const publicNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/notre-démarche", label: "Notre Démarche" },
  { href: "/a-propos", label: "Notre histoire" },
  { href: "/editorial", label: "L'éditorial" },
  { href: "/conseils", label: "Conseils" },
  { href: "/privileges", label: "Privilèges" },
  { href: "/contact", label: "Contact" },
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

  // ─── LOGIQUE D'ONBOARDING (Masquage forcé du menu) ───
  // Ajoutez ici TOUTES les URL possibles où l'utilisateur est en train de faire son onboarding
  const ONBOARDING_ROUTES = [
    "/", // Ajouté au cas où vous testez sur la page d'accueil
    "/dashboard", // Ajouté au cas où l'appli redirige ici par défaut
    "/onboarding",
    "/tutoriel",
    "/quiz",
    "/photos",
    "/video",
    "/creation-profil",
    "/personnalite",
  ];

  // Si l'URL actuelle fait partie de la liste CI-DESSUS, on masque tout le menu
  const isOnboarding = ONBOARDING_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/"),
  );

  // EN-TÊTE MINIMALISTE (Juste le Logo et le bouton Retour)
  if (isOnboarding) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm py-4 border-b border-amber-200/20">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between">
          <span className="font-serif text-2xl md:text-3xl tracking-tight text-slate-900">Kalimera</span>
          <button
            onClick={() => navigate(-1)}
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

  // ─── MODE NORMAL : Navigation publique (visiteurs non connectés) ───
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
            {/* 1. Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <span className="font-serif text-2xl md:text-3xl tracking-tight text-slate-900 transition-colors duration-300">
                Kalimera
              </span>
            </Link>

            {/* 2. Desktop Navigation (Seulement pour les visiteurs publics) */}
            <div className="hidden lg:flex items-center gap-10">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative py-2 text-[13px] uppercase tracking-wider font-medium transition-all duration-300 group ${
                    location.pathname === link.href ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center mx-0 gap-px px-0">{link.label}</div>
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
              {publicNavLinks.map((link, index) => (
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-center"
                >
                  Rejoindre le Cercle
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
