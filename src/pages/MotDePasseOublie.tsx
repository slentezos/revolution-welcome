import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception"
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">
              Toi & Moi
            </Link>

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Vérifiez votre email
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
              Cliquez sur le lien pour créer un nouveau mot de passe.
            </p>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    Conseil
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vérifiez également votre dossier spam si vous ne trouvez pas l'email.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary font-medium hover:underline text-sm">
                
                Renvoyer l'email
              </button>
              
              <Link
                to="/connexion"
                className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>
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
          <Link to="/" className="font-heading text-3xl font-semibold text-primary mb-8 block">Kalimera

          </Link>

          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-muted-foreground mb-8">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Adresse email
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                className="h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
              
            </div>

            <Button
              type="submit"
              className="btn-primary w-full h-12 text-base"
              disabled={loading}>
              
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>

          <Link
            to="/connexion"
            className="mt-8 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
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
              Pas de panique
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-md mx-auto">
              Nous vous aiderons à retrouver l'accès à votre compte en quelques minutes.
            </p>
          </div>
        </div>
      </div>
    </div>);

}