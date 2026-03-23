import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";

export default function ListeAttente() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefersSms, setPrefersSms] = useState(true);
  const [prefersCall, setPrefersCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const location = getStoredLocation();

  useEffect(() => {
    if (!location) {
      navigate("/");
    }
  }, []);

  if (!location) return null;

  const handleStep1 = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      // Check if email exists in waitlist
      const { data: existingLead } = await supabase
        .from("waitlist_leads")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingLead) {
        toast({
          title: "Déjà inscrit(e) !",
          description: "Vous êtes déjà inscrit(e) sur notre liste VIP ! Nous vous contacterons très bientôt.",
        });
        setLoading(false);
        return;
      }

      // Check if email exists in profiles (registered user)
      const { data: existingUser } = await supabase.from("profiles").select("id").eq("user_id", email).maybeSingle();

      // Also try signUp check - if user already registered, supabase will catch it
      setStep(1);
    } catch (err) {
      console.error("Check error:", err);
      setStep(1); // proceed anyway on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Check phone duplication if provided
      if (phone.length >= 6) {
        const { data: phoneLead } = await supabase.from("waitlist_leads").select("id").eq("phone", phone).maybeSingle();

        if (phoneLead) {
          toast({
            title: "Déjà inscrit(e) !",
            description: "Vous êtes déjà inscrit(e) sur notre liste VIP ! Nous vous contacterons très bientôt.",
          });
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase.from("waitlist_leads").insert({
        email,
        phone: phone || null,
        phone_preference: [prefersSms && "sms", prefersCall && "call"].filter(Boolean).join(",") || null,
        postal_code: location.postalCode,
        city_name: location.cityName,
        region_name: location.regionName,
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      console.error("Waitlist error:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Votre accès VIP est confirmé !
            </h1>
            <p className="text-muted-foreground mb-4 text-xl">
              Nous vous préviendrons dès que Kalimera sera disponible à {location.cityName}.
            </p>
            <p className="text-muted-foreground mb-8 text-xl">
              Votre privilège est d'ores et déjà réservé,{" "}
              <strong className="text-[hsl(var(--gold))]">3 mois offerts </strong> seront activés automatiquement lors
              de votre première connexion, une fois le club lancé.
            </p>
            <Button onClick={() => navigate("/")} variant="outline" className="h-14 text-base rounded-xl px-8">
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col px-6 md:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto flex flex-col flex-1">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-8 block text-left"
          >
            Kalimera
          </button>

          {/* Location badge */}
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <MapPin className="h-4 w-4 text-[hsl(var(--gold))]" />
            <span className="text-xl">
              {location.cityName}, {location.regionName}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--gold))] rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / 2) * 100}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-2 text-xl">Étape {step + 1} sur 2</p>
          </div>

          <div className="flex-1">
            {step === 0 ? (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
                    Kalimera arrive bientôt en {location.regionName}.
                  </h1>
                  <p className="text-muted-foreground text-xl">
                    Rejoignez les membres de {location.cityName} et réservez votre privilège : 3 mois vous seront
                    offerts dès notre arrivée.
                  </p>
                </div>

                <div className="max-w-sm">
                  <label className="block font-medium text-foreground mb-3 text-xl">
                    <Mail className="inline h-5 w-5 mr-1 -mt-0.5 text-[hsl(var(--gold))]" />
                    Votre adresse email *
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg rounded-xl"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleStep1}
                  disabled={!email.includes("@") || loading}
                  className="h-14 text-base rounded-xl bg-primary text-primary-foreground px-10"
                >
                  {loading ? "Vérification..." : "Continuer"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
                    Souhaitez-vous être prévenu(e) en priorité dès notre arrivée ?
                  </h1>
                </div>

                <div className="max-w-sm space-y-6">
                  <div>
                    <label className="block font-medium text-foreground mb-3 text-xl">
                      <Phone className="inline h-5 w-5 mr-1 -mt-0.5 text-[hsl(var(--gold))]" />
                      Numéro de téléphone (optionnel)
                    </label>
                    <div className="flex gap-3">
                      <div className="h-14 px-4 flex items-center bg-muted rounded-xl text-base font-medium text-foreground shrink-0">
                        🇫🇷 +33
                      </div>
                      <Input
                        type="tel"
                        placeholder="6 12 34 56 78"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(val);
                        }}
                        className="h-14 text-lg rounded-xl flex-1"
                        inputMode="tel"
                        autoFocus
                      />
                    </div>
                  </div>

                  {phone.length >= 6 && (
                    <div className="animate-fade-in">
                      <p className="font-medium text-foreground mb-4 text-xl">
                        Comment préférez-vous être informé(e) ?
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border hover:border-gold/40 transition-colors cursor-pointer">
                          <span className="text-xl">💬 Par SMS</span>
                          <Switch
                            checked={prefersSms}
                            onCheckedChange={setPrefersSms}
                            className="data-[state=checked]:bg-[#C5A059]"
                          />
                        </label>
                        <label className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border hover:border-gold/40 transition-colors cursor-pointer">
                          <span className="text-xl">📞 Appel de courtoisie de l'équipe</span>
                          <Switch
                            checked={prefersCall}
                            onCheckedChange={setPrefersCall}
                            className="data-[state=checked]:bg-[#C5A059]"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust text */}
                <p className="text-muted-foreground flex items-center gap-1.5 text-lg">
                  <Lock className="h-3.5 w-3.5" />
                  Vos informations sont strictement confidentielles et ne seront jamais partagées.
                </p>

                <div className="flex gap-4 max-w-sm">
                  <Button variant="outline" onClick={() => setStep(0)} className="h-14 text-base rounded-xl flex-1">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-14 text-base rounded-xl flex-[2] bg-[hsl(var(--gold))] text-primary hover:opacity-90"
                  >
                    {loading ? "Envoi..." : "Valider mon accès VIP"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading text-4xl font-semibold mb-6">Rejoignez le Cercle Kalimera</h2>
            <p className="text-primary-foreground/90 max-w-md mx-auto text-2xl">
              Des rencontres authentiques et vérifiées pour les seniors exigeants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
