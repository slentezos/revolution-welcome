import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, ArrowRight, ArrowLeft, CheckCircle, MapPin, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getStoredLocation } from "@/data/frenchPostalCodes";
import heroCouple from "@/assets/hero-couple.jpg";
import { PINPOINT_MAPPING } from "@/data/locationData";

export default function ListeAttente() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Gestion des erreurs en ligne (Inline) au lieu des popups
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = getStoredLocation();

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
    setFormError(null);

    try {
      const { data: existingLead, error } = await supabase
        .from("waitlist_leads")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;

      if (existingLead) {
        setFormError("Cette adresse email est déjà enregistrée sur notre liste prioritaire.");
        setLoading(false);
        return;
      }
      setStep(1);
    } catch (err) {
      // En cas d'erreur technique, on passe quand même à l'étape 2 pour ne pas bloquer l'utilisateur
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormError(null);
    try {
      // Vérification du doublon téléphone
      if (phone.length >= 6) {
        const { data: phoneLead } = await supabase.from("waitlist_leads").select("id").eq("phone", phone).maybeSingle();

        if (phoneLead) {
          setFormError("Ce numéro de téléphone est déjà associé à un accès VIP.");
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase.from("waitlist_leads").insert({
        email,
        phone: phone || null,
        phone_preference: isOptedIn ? "sms,call" : null,
        postal_code: location.postalCode,
        city_name: displayLocation,
        region_name: location.regionName,
      });

      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      setFormError("Une erreur technique est survenue. Veuillez vérifier votre saisie ou réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333] mb-4">
              Votre accès VIP est confirmé
            </h1>
            <p className="text-slate-500 mb-4 text-xl leading-relaxed">
              Nous reviendrons vers vous dès que Kalimera sera disponible
              {isPinpoint ? ` à ${displayLocation}` : ` dans le ${displayLocation}`}.
            </p>
            <p className="text-slate-600 mb-8 text-xl">
              Votre privilège est réservé : <strong className="text-[#C5A059]">3 mois offerts</strong> seront activés
              lors de votre première connexion.
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="h-14 text-lg font-bold rounded-xl px-8 border-2 border-slate-200 text-[#1B2333] hover:border-[#C5A059]"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#1B2333]">
          <img
            src={heroCouple}
            alt="Couple Prestige"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
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
            className="font-heading text-2xl md:text-3xl font-bold text-[#1B2333] mb-8 block text-left"
          >
            Kalimera
          </button>

          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <MapPin className="h-5 w-5 text-[#C5A059]" />
            <span className="font-bold text-[#1B2333] text-2xl">{displayLocation}</span>
          </div>

          <div className="mb-10">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A059] rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / 2) * 100}%` }}
              />
            </div>
            <p className="text-slate-400 font-bold mt-2 text-lg uppercase tracking-widest">Étape {step + 1} sur 2</p>
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
                    votre privilège :<strong className="text-[#1B2333]"> 3 mois offerts </strong> dès notre arrivée.
                  </p>
                </div>

                <div className="max-w-md">
                  <label className="block font-bold text-[#1B2333] mb-3 text-xl">
                    <Mail className="inline h-5 w-5 mr-2 -mt-0.5 text-[#C5A059]" />
                    Votre adresse email *
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className={`h-16 rounded-xl border-2 text-xl text-[#1B2333] ${formError ? "border-rose-500 bg-rose-50" : "border-slate-200 focus:border-[#C5A059]"}`}
                    autoFocus
                  />
                  {formError && (
                    <div className="mt-3 flex items-center gap-2 text-rose-600 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-lg font-bold">{formError}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleStep1}
                  disabled={!email.includes("@") || loading}
                  className="h-16 rounded-xl bg-[#1B2333] text-white px-10 hover:bg-[#C5A059] hover:text-white transition-all text-xl font-bold shadow-md"
                >
                  {loading ? "Vérification..." : "Continuer"}
                  {!loading && <ArrowRight className="ml-2 h-6 w-6" />}
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1B2333] mb-3 leading-tight">
                  Souhaitez-vous être prévenu(e) en priorité ?
                </h1>

                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block font-bold text-[#1B2333] mb-3 text-xl">
                      <Phone className="inline h-5 w-5 mr-2 -mt-0.5 text-[#C5A059]" />
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
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          if (formError) setFormError(null);
                        }}
                        className={`h-16 rounded-xl flex-1 text-xl border-2 font-medium text-[#1B2333] ${formError ? "border-rose-500 bg-rose-50" : "border-slate-200 focus:border-[#C5A059]"}`}
                        autoFocus
                      />
                    </div>
                    {formError && (
                      <div className="mt-3 flex items-center gap-2 text-rose-600 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-lg font-bold">{formError}</p>
                      </div>
                    )}

                    <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-start shadow-sm">
                      <ShieldCheck className="h-6 w-6 text-[#C5A059] shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-lg leading-relaxed">
                        <strong className="font-bold text-[#1B2333]">Engagement de confidentialité :</strong> Votre
                        numéro ne sera jamais cédé à des tiers. Il sert exclusivement à vous prévenir de l'ouverture du
                        club.
                      </p>
                    </div>
                  </div>

                  {phone.length >= 6 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsOptedIn(!isOptedIn)}
                        className={`w-full flex items-center gap-4 p-6 rounded-xl border-2 text-left transition-all ${
                          isOptedIn
                            ? "border-[#C5A059] bg-[#C5A059]/5"
                            : "border-slate-200 hover:border-[#C5A059]/40 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors ${
                            isOptedIn ? "bg-[#C5A059] border-[#C5A059]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isOptedIn && <Check className="h-5 w-5 text-white" />}
                        </div>
                        <span className="text-xl font-bold text-[#1B2333]">
                          Je souhaite être prévenu(e) en priorité lors du lancement
                        </span>
                      </button>
                      <p className="mt-3 text-slate-400 text-base italic ml-1 font-medium">
                        (Par SMS ou court appel de courtoisie)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 max-w-md pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setFormError(null);
                    }}
                    className="h-16 text-xl rounded-xl flex-1 border-2 border-slate-200 text-slate-500 hover:text-[#1B2333] hover:border-slate-300 font-bold"
                  >
                    <ArrowLeft className="mr-2 h-6 w-6" /> Retour
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || (phone.length >= 6 && !isOptedIn)}
                    className="h-16 text-xl rounded-xl flex-[2] bg-[#1B2333] text-white hover:bg-[#C5A059] hover:text-white font-bold shadow-md disabled:opacity-50 transition-all duration-300"
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
        <img
          src={heroCouple}
          alt="Couple Kalimera"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-primary-foreground relative z-10">
            <h2 className="font-heading text-5xl font-bold mb-6 leading-tight text-white">
              Rejoignez le Cercle Kalimera
            </h2>
            <p className="text-white/90 max-w-md mx-auto text-2xl leading-relaxed font-bold">
              Des rencontres authentiques pour les seniors exigeants.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-white/90 text-xl font-bold backdrop-blur-md bg-[#1B2333]/40 px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            Déjà membre ?{" "}
            <Link to="/connexion" className="text-[#C5A059] font-bold hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
