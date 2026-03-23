import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";
export default function Connexion() {
  const [email, setEmail] = useState(() => localStorage.getItem("kalimera_remembered_email") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("kalimera_remembered_email"));
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // Check onboarding status
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_step")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (profile?.onboarding_step === "completed") {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Save or clear remembered email
        if (rememberMe) {
          localStorage.setItem("kalimera_remembered_email", email);
        } else {
          localStorage.removeItem("kalimera_remembered_email");
        }

        // Check onboarding status
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_step")
          .eq("user_id", data.session.user.id)
          .maybeSingle();

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Kalimera",
        });

        if (profile?.onboarding_step === "completed") {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description:
          error.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect"
            : error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left - Form */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto">
            <Link to="/" className="font-heading font-semibold text-primary mb-8 block text-4xl">
              Kalimera
            </Link>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">Connexion</h1>
            <p className="text-muted-foreground mb-8 text-xl">
              Accédez à votre espace membre pour retrouver vos affinités.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium text-foreground mb-2 text-lg">Adresse email</label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-foreground mb-2 text-lg">Mot de passe</label>
                <PasswordInput
                  placeholder="••••••••"
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center">
                    {/* La vraie case à cocher, cachée mais fonctionnelle */}
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />

                    {/* Le fond du Switch (Gris quand inactif, Or quand actif) */}
                    <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-[hsl(var(--gold))] transition-colors duration-300 shadow-inner border border-slate-300 peer-checked:border-[hsl(var(--gold))]"></div>
                    {/* Le bouton rond (Thumb) qui se déplace */}
                    <div className="absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
                  </div>
                  <span className="text-muted-foreground text-lg select-none group-hover:text-foreground transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
                <Link to="/mot-de-passe-oublie" className="text-primary hover:underline text-lg">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="btn-primary w-full h-12 text-base" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-8 text-center text-muted-foreground text-lg">
              Vous n'avez pas de compte ?{" "}
              <button onClick={() => setModalOpen(true)} className="text-primary font-medium hover:underline">
                Rejoindre le Cercle
              </button>
            </p>
          </div>
        </div>

        {/* Right - Image with overlay */}
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />

          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="text-center text-primary-foreground relative z-10">
              <h2 className="font-heading text-4xl font-semibold mb-6">Retrouvez l'amour à tout âge</h2>
              <p className="text-primary-foreground/90 max-w-md mx-auto text-xl">
                Des rencontres authentiques basées sur 75% d'affinités réciproques.
              </p>
            </div>
          </div>
        </div>
      </div>
      <LocationCheckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
