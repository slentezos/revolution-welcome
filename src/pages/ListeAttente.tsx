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

  // LOGIQUE DE SÉCURITÉ CAC40
  const isPinpoint = location && !!PINPOINT_MAPPING[location.postalCode];
  const displayLocation = isPinpoint
    ? PINPOINT_MAPPING[location?.postalCode || ""]
    : `Bassin de ${location?.regionName}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
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
        toast({
          title: "Déjà inscrit(e) !",
          description: "Vous êtes déjà sur notre liste VIP ! Nous vous contacterons très bientôt.",
        });
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
      if (phone.length >= 6) {
        const { data: phoneLead } = await supabase.from("waitlist_leads").select("id").eq("phone", phone).maybeSingle();
        if (phoneLead) {
          toast({
            title: "Déjà inscrit(e) !",
            description: "Ce numéro est déjà enregistré sur notre liste VIP.",
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
        city_name: displayLocation,
        region_name: location.regionName,
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Votre accès VIP est confirmé !
            </h1>
            <p className="text-muted-foreground mb-4 text-2xl leading-relaxed">
              Nous vous préviendrons dès que Kalimera sera disponible
              {isPinpoint ? ` à ${displayLocation}` : ` dans le ${displayLocation}`}.
            </p>
            <p className="text-muted-foreground mb-8 text-xl">
              Votre privilège est réservé : <strong className="text-[hsl(var(--gold))]">3 mois offerts</strong> seront
              activés automatiquement lors de votre première connexion.
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-14 text-base rounded-xl px-8 border-[hsl(var(--gold))] text-primary"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
          <img src={heroCouple} alt="Couple" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <div className="flex-1 flex flex-col px-6 md:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto flex flex-col min-h-full">
          <button
            onClick={() => navigate("/")}
            className="font-heading text-2xl md:text-3xl font-semibold text-primary mb-8 block text-left"
          >
            Kalimera
          </button>

          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <MapPin className="h-4 w-4 text-[hsl(var(--gold))]" />
            <span className="text-xl font-bold text-[#1B2333]">{displayLocation}</span>
          </div>

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
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3 leading-tight">
                    Kalimera arrive bientôt en {location.regionName}.
                  </h1>
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    Rejoignez les membres {isPinpoint ? `de ${displayLocation}` : `du ${displayLocation}`} et réservez
                    votre privilège :<strong className="text-[#1B2333]"> 3 mois vous seront offerts </strong> dès notre
                    arrivée.
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
                    className="h-14 text-lg rounded-xl border-slate-200 focus:border-[hsl(var(--gold))]"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleStep1}
                  disabled={!email.includes("@") || loading}
                  className="h-14 text-base rounded-xl bg-[#1B2333] text-white px-10 hover:bg-[#1B2333]/90"
                >
                  {loading ? "Vérification..." : "Continuer"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
                  Souhaitez-vous être prévenu(e) en priorité ?
                </h1>

                <div className="max-w-sm space-y-6">
                  <div>
                    <label className="block font-medium text-foreground mb-3 text-xl">
                      <Phone className="inline h-5 w-5 mr-1 -mt-0.5 text-[hsl(var(--gold))]" />
                      Téléphone (optionnel)
                    </label>
                    <div className="flex gap-3">
                      <div className="h-14 px-4 flex items-center bg-muted rounded-xl text-base font-medium shrink-0">
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
                    <div className="animate-fade-in space-y-4">
                      <p className="font-medium text-foreground text-xl">Préférence de contact :</p>
                      <label className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-[hsl(var(--gold))]/40 cursor-pointer transition-all">
                        <span className="text-xl">💬 Par SMS</span>
                        <Switch
                          checked={prefersSms}
                          onCheckedChange={setPrefersSms}
                          className="data-[state=checked]:bg-[#C5A059]"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-[hsl(var(--gold))]/40 cursor-pointer transition-all">
                        <span className="text-xl">📞 Appel de courtoisie</span>
                        <Switch
                          checked={prefersCall}
                          onCheckedChange={setPrefersCall}
                          className="data-[state=checked]:bg-[#C5A059]"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 max-w-sm">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="h-14 text-base rounded-xl flex-1 border-slate-200"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-14 text-base rounded-xl flex-[2] bg-[hsl(var(--gold))] text-primary font-bold"
                  >
                    {loading ? "Envoi..." : "Valider mon accès VIP"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
        <img src={heroCouple} alt="Couple" className="absolute inset-0 w-full h-full object-cover opacity-60" />

        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading text-5xl font-semibold mb-6 leading-tight text-white">
              Rejoignez le Cercle Kalimera
            </h2>
            <p className="text-white/90 max-w-md mx-auto text-2xl leading-relaxed">
              Des rencontres authentiques et vérifiées pour les seniors exigeants.
            </p>
          </div>
        </div>

        {/* LIEN CONNEXION EN BAS À DROITE DE L'IMAGE */}
        <div className="absolute bottom-10 right-10 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-white/80 text-xl backdrop-blur-md bg-black/20 px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            Déjà membre ?{" "}
            <Link to="/connexion" className="text-[hsl(var(--gold))] font-bold hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
