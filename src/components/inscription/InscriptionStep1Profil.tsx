import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";
import { PINPOINT_MAPPING } from "@/data/locationData";

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

  // LOGIQUE DE FILTRAGE RADICALE (Anti-Marseille)
  const isPinpoint = location?.postalCode ? !!PINPOINT_MAPPING[location.postalCode] : false;
  const displayLocation = isPinpoint
    ? PINPOINT_MAPPING[location?.postalCode || ""]
    : `Bassin de ${location?.regionName}`;

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Verrouillage du scroll navigateur
    if (!location) navigate("/");
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [location, navigate]);

  if (!location) return null;

  const handleStep1 = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const { data: existingLead } = await supabase
        .from("waitlist_leads")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existingLead) {
        toast({ title: "Déjà inscrit(e) !", description: "Vous êtes déjà sur notre liste VIP." });
        setLoading(false);
        return;
      }
      setStep(1);
    } catch (err) {
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist_leads").insert({
        email,
        phone: phone || null,
        phone_preference: [prefersSms && "sms", prefersCall && "call"].filter(Boolean).join(",") || null,
        postal_code: location.postalCode,
        city_name: displayLocation,
        region_name: location.regionName,
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      toast({ title: "Erreur", description: "Veuillez réessayer.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <div className="flex-1 flex flex-col justify-center px-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B2333] mb-4">Accès VIP confirmé !</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Nous vous contacterons pour l'ouverture {isPinpoint ? `à ${displayLocation}` : `dans le ${displayLocation}`}
            .
          </p>
          <Button onClick={() => navigate("/")} className="h-12 bg-[#1B2333] text-white rounded-xl px-10 font-bold">
            Retour à l'accueil
          </Button>
        </div>
        <div className="hidden lg:block flex-1 relative bg-[#1B2333]">
          <img src={heroCouple} alt="Couple" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* COLONNE GAUCHE - OPTIMISÉE POUR VISIBILITÉ BOUTON */}
      <div className="flex-1 flex flex-col h-full bg-white">
        <div className="flex-1 flex flex-col max-w-lg w-full mx-auto px-6 py-6 md:py-10">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link to="/" className="font-heading text-2xl font-bold text-[#1B2333] mb-6 block">
                Kalimera
              </Link>

              <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="h-4 w-4 text-[hsl(var(--gold))]" />
                <span className="text-lg font-bold text-[#1B2333] truncate">{displayLocation}</span>
              </div>

              <div className="mb-6">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((step + 1) / 2) * 100}%` }}
                  />
                </div>
              </div>

              {step === 0 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h1 className="text-3xl font-bold text-[#1B2333] leading-tight">
                    Kalimera arrive bientôt en {location.regionName}.
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Réservez votre privilège : <strong className="text-[#1B2333]">3 mois offerts</strong> à l'ouverture{" "}
                    {isPinpoint ? `à ${displayLocation}` : `dans le ${displayLocation}`}.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Email professionnel ou personnel *
                    </label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 text-lg rounded-xl border-slate-200 focus:border-[hsl(var(--gold))]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h1 className="text-3xl font-bold text-[#1B2333]">Priorité d'accès</h1>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Téléphone (Optionnel)
                      </label>
                      <div className="flex gap-2">
                        <div className="h-14 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm">
                          🇫🇷 +33
                        </div>
                        <Input
                          type="tel"
                          placeholder="6 12 34 56 78"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="h-14 text-lg rounded-xl flex-1"
                        />
                      </div>
                    </div>
                    {phone.length >= 6 && (
                      <div className="space-y-2 pt-2">
                        <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                          <span className="font-medium">💬 SMS de lancement</span>
                          <Switch checked={prefersSms} onCheckedChange={setPrefersSms} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* LE BOUTON EST ICI - POSITIONNÉ POUR ÊTRE TOUJOURS VISIBLE */}
            <div className="mt-8 pt-4">
              {step === 0 ? (
                <Button
                  onClick={handleStep1}
                  disabled={!email.includes("@") || loading}
                  className="w-full h-14 bg-[#1B2333] text-white rounded-xl font-bold text-xl hover:bg-[#1B2333]/90 shadow-xl"
                >
                  {loading ? "Vérification..." : "Continuer"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="h-14 px-6 rounded-xl border-slate-200 text-slate-600"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 h-14 bg-[hsl(var(--gold))] text-primary rounded-xl font-bold text-lg shadow-xl"
                  >
                    {loading ? "Envoi..." : "Valider mon accès VIP"}
                  </Button>
                </div>
              )}
              <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Informations cryptées & confidentielles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DROITE - IMAGE FIXE (CAC40 BRANDING) */}
      <div className="hidden lg:block flex-1 relative bg-[#1B2333] overflow-hidden">
        <img src={heroCouple} alt="Marketing" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">L'excellence de la rencontre senior.</h2>
          <div className="pt-8 border-t border-white/10">
            <p className="text-white/60 mb-4">Déjà membre ?</p>
            <Link
              to="/connexion"
              className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold hover:bg-white/20 transition-all"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
