import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";

export default function ReinitialiserMotDePasse() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
    };

    // Listen for auth events (the reset link will trigger a SIGNED_IN event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" && session) {
        setIsValidSession(true);
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Mot de passe modifié",
        description: "Vous pouvez maintenant vous connecter"
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
              Toi & Moi
            </Link>

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Mot de passe modifié !
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Votre nouveau mot de passe a été enregistré avec succès.
            </p>

            <Button
              onClick={() => navigate("/connexion")}
              className="btn-primary w-full h-12 text-base">
              
              Se connecter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img
            src={heroCouple}
            alt="Couple heureux"
            className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-primary/70" />
        </div>
      </div>);

  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
              Kalimera
            </Link>

            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-amber-600" />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Lien invalide ou expiré
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Le lien de réinitialisation n'est plus valide. Veuillez demander un nouveau lien.
            </p>

            <Button
              onClick={() => navigate("/mot-de-passe-oublie")}
              className="btn-primary w-full h-12 text-base">
              
              Demander un nouveau lien
            </Button>
          </div>
        </div>

        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img
            src={heroCouple}
            alt="Couple heureux"
            className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-primary/70" />
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
            Toi & Moi
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-muted-foreground mb-8 text-2xl">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-foreground mb-2 text-lg">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} />
              
              <p className="text-muted-foreground mt-1 text-lg">
                Minimum 6 caractères
              </p>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-2 text-lg">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required />
              
            </div>

            <Button
              type="submit"
              className="btn-primary w-full h-12 text-base"
              disabled={loading}>
              
              {loading ? "Enregistrement..." : "Enregistrer le mot de passe"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src={heroCouple}
          alt="Couple heureux"
          className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading text-4xl font-semibold mb-6">
              Sécurisez votre compte
            </h2>
            <p className="text-primary-foreground/90 max-w-md mx-auto text-xl">
              Choisissez un mot de passe que vous n'utilisez nulle part ailleurs.
            </p>
          </div>
        </div>
      </div>
    </div>);

}