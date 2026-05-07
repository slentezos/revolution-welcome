import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, ArrowRight, ArrowLeft, CheckCircle, MapPin, Check, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";
import { PINPOINT_MAPPING } from "@/data/locationData";

export default function ListeAttente() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefersSms, setPrefersSms] = useState(true); // Coché par défaut pour encourager l'opt-in
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
            <p className="text-muted-foreground mb-4 text-xl leading-relaxed">
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
            className="font-heading text-2xl md:text-3xl font-semibold text-[#1B2333] mb-8 block text-left"
          >
            Kalimera
          </button>

          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <MapPin className="h-4 w-4 text-[hsl(var(--gold))]" />
            <span className="font-bold text-[#1B2333] text-2xl">{displayLocation}</span>
          </div>

          <div className="mb-10">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--gold))] rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / 2) * 100}%` }}
              />
            </div>
            <p className="text-slate-400 font-medium mt-2 text-lg">Étape {step + 1} sur 2</p>
          </div>

          <div className="flex-1">
            {step === 0 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333] mb-4 leading-tight">
                    Kalimera arrive bientôt en {location.regionName}.
                  </h1>
                  <p className="text-slate-500 text-xl leading-relaxed">
                    Rejoignez les membres {isPinpoint ? `de ${displayLocation}` : `du ${displayLocation}`} et réservez
                    votre privilège :<strong className="text-[#1B2333]"> 3 mois vous seront offerts </strong> dès notre
                    arrivée.
                  </p>
                </div>

                <div className="max-w-sm">
                  <label className="block font-medium text-[#1B2333] mb-3 text-xl">
                    <Mail className="inline h-5 w-5 mr-2 -mt-0.5 text-[hsl(var(--gold))]" />
                    Votre adresse email *
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 rounded-xl border-2 border-slate-200 focus:border-[hsl(var(--gold))] text-xl text-[#1B2333]"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleStep1}
                  disabled={!email.includes("@") || loading}
                  className="h-16 rounded-xl bg-[#1B2333] text-white px-10 hover:bg-[#1B2333]/90 text-xl font-bold transition-all shadow-md"
                >
                  {loading ? "Vérification..." : "Continuer"}
                  {!loading && <ArrowRight className="ml-2 h-6 w-6" />}
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333] mb-3">
                  Souhaitez-vous être prévenu(e) en priorité ?
                </h1>

                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block font-medium text-[#1B2333] mb-3 text-xl">
                      <Phone className="inline h-5 w-5 mr-2 -mt-0.5 text-[hsl(var(--gold))]" />
                      Téléphone (optionnel)
                    </label>
                    <div className="flex gap-3">
                      <div className="h-16 px-5 flex items-center bg-slate-50 border-2 border-slate-200 rounded-xl font-bold shrink-0 text-xl text-[#1B2333]">
                        🇫🇷 +33
                      </div>
                      <Input
                        type="tel"
                        placeholder="6 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="h-16 rounded-xl flex-1 text-xl border-2 border-slate-200 focus:border-[hsl(var(--gold))] font-medium text-[#1B2333]"
                        autoFocus
                      />
                    </div>

                    {/* ENCART DE CONFIDENTIALITÉ PREMIUM */}
                    <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-start shadow-sm">
                      <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold-dark))] shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-lg leading-relaxed">
                        <strong className="font-bold text-[#1B2333]">Engagement de confidentialité :</strong> Votre
                        numéro ne sera jamais utilisé pour du démarchage ni cédé à des tiers. Il sert exclusivement à
                        vous prévenir de l'ouverture du club.
                      </p>
                    </div>
                  </div>

                  {phone.length >= 6 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 pt-2">
                      <p className="font-bold text-[#1B2333] text-xl mb-3">Vos préférences de contact :</p>

                      {/* TICK BOX 1 : SMS */}
                      <button
                        type="button"
                        onClick={() => setPrefersSms(!prefersSms)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                          prefersSms
                            ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                            : "border-slate-200 hover:border-[hsl(var(--gold))]/40 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors ${
                            prefersSms ? "bg-[hsl(var(--gold))] border-[hsl(var(--gold))]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {prefersSms && <Check className="h-5 w-5 text-white" />}
                        </div>
                        <span className="text-xl font-medium text-[#1B2333]">
                          J'accepte de recevoir un SMS d'invitation
                        </span>
                      </button>

                      {/* TICK BOX 2 : APPEL */}
                      <button
                        type="button"
                        onClick={() => setPrefersCall(!prefersCall)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                          prefersCall
                            ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                            : "border-slate-200 hover:border-[hsl(var(--gold))]/40 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors ${
                            prefersCall
                              ? "bg-[hsl(var(--gold))] border-[hsl(var(--gold))]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {prefersCall && <Check className="h-5 w-5 text-white" />}
                        </div>
                        <span className="text-xl font-medium text-[#1B2333]">
                          J'accepte un court appel lors du lancement
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 max-w-md pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="h-16 text-xl rounded-xl flex-1 border-2 border-slate-200 text-slate-500 hover:text-[#1B2333] hover:border-slate-300 font-bold"
                  >
                    <ArrowLeft className="mr-2 h-6 w-6" /> Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || (phone.length >= 6 && !prefersSms && !prefersCall)}
                    className="h-16 text-xl rounded-xl flex-[2] bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white font-bold shadow-md disabled:opacity-50 transition-all"
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
            <h2 className="font-heading text-5xl font-bold mb-6 leading-tight text-white">
              Rejoignez le Cercle Kalimera
            </h2>
            <p className="text-white/90 max-w-md mx-auto text-2xl leading-relaxed font-medium">
              Des rencontres authentiques et vérifiées pour les seniors exigeants.
            </p>
          </div>
        </div>

        {/* LIEN CONNEXION EN BAS À DROITE DE L'IMAGE */}
        <div className="absolute bottom-10 right-10 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-white/90 text-xl font-medium backdrop-blur-md bg-[#1B2333]/40 px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            Déjà membre ?{" "}
            <Link to="/connexion" className="text-[hsl(var(--gold-light))] font-bold hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
