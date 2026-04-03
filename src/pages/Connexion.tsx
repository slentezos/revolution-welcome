import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Phone, RefreshCcw, Edit2 } from "lucide-react";
import LocationCheckModal from "@/components/location/LocationCheckModal";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroCouple from "@/assets/hero-couple.jpg";

type LoginMethod = "email" | "phone";

export default function Connexion() {
  const [method, setMethod] = useState<LoginMethod>("email");

  // Email state
  const [email, setEmail] = useState(() => localStorage.getItem("kalimera_remembered_email") || "");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(() => !!localStorage.getItem("kalimera_remembered_email"));

  // Phone state
  const [phone, setPhone] = useState(() => localStorage.getItem("kalimera_remembered_phone") || "");
  const [rememberPhone, setRememberPhone] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
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

  const formatPhoneDigits = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const handleRedirectAfterLogin = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_step")
      .eq("user_id", userId)
      .maybeSingle();

    toast({ title: "Connexion réussie", description: "Bienvenue sur Kalimera" });

    if (profile?.onboarding_step === "completed") {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        if (rememberEmail) {
          localStorage.setItem("kalimera_remembered_email", email);
        } else {
          localStorage.removeItem("kalimera_remembered_email");
        }
        await handleRedirectAfterLogin(data.session.user.id);
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

  const handleSendOtp = async () => {
    if (phone.length < 9) return;
    setSendingOtp(true);

    try {
      const fullPhone = `+33${phone.replace(/^0/, "")}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
      if (error) throw error;

      if (rememberPhone) {
        localStorage.setItem("kalimera_remembered_phone", phone);
      } else {
        localStorage.removeItem("kalimera_remembered_phone");
      }

      setOtpSent(true);
      toast({ title: "Code envoyé", description: `Un code a été envoyé au ${fullPhone}` });
    } catch (error: any) {
      console.error("OTP error:", error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le code SMS",
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);

    try {
      const fullPhone = `+33${phone.replace(/^0/, "")}`;
      const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
      if (error) throw error;

      if (data.session) {
        await handleRedirectAfterLogin(data.session.user.id);
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast({
        title: "Code incorrect",
        description: "Le code saisi est invalide ou expiré. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // COMPOSANT TOGGLE AFFINÉ POUR PRENDRE MOINS DE PLACE
  const RememberMeToggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-12 h-7 bg-muted rounded-full peer-checked:bg-[hsl(var(--gold))] transition-colors duration-300 shadow-inner border border-border peer-checked:border-[hsl(var(--gold))]" />
        <div className="absolute left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-5" />
      </div>
      <span className="text-muted-foreground select-none group-hover:text-foreground transition-colors text-lg md:text-xl whitespace-nowrap">
        {label}
      </span>
    </label>
  );

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto">
            <Link to="/" className="font-heading font-semibold text-primary mb-8 block text-4xl">
              Kalimera
            </Link>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">Connexion</h1>
            <p className="text-muted-foreground mb-8 text-xl">
              Accédez à votre espace membre pour retrouver vos affinités.
            </p>

            {/* Method Tabs */}
            <div className="flex rounded-2xl bg-muted p-1.5 mb-8 gap-1">
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all duration-300 text-xl ${
                  method === "email"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-5 w-5" />
                Par email
              </button>
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all duration-300 text-xl ${
                  method === "phone"
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-5 w-5" />
                Par téléphone
              </button>
            </div>

            {/* Email Form */}
            {method === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <label className="block font-medium text-foreground mb-2 text-xl">Adresse email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="h-14 text-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-2 text-xl">Mot de passe</label>
                  <PasswordInput
                    placeholder="••••••••"
                    className="h-14 text-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* LA CORRECTION POUR L'ALIGNEMENT "SE SOUVENIR DE MOI" / "MOT DE PASSE OUBLIÉ" EST ICI */}
                <div className="flex flex-row items-center justify-between gap-4 py-2">
                  <RememberMeToggle checked={rememberEmail} onChange={setRememberEmail} label="Se souvenir de moi" />
                  <Link
                    to="/mot-de-passe-oublie"
                    className="text-[#1B2333] hover:underline text-lg md:text-xl font-medium whitespace-nowrap"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button type="submit" className="btn-primary w-full h-14 text-xl mt-2" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}

            {/* Phone Form */}
            {method === "phone" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block font-medium text-foreground mb-2 text-xl">
                        <Phone className="inline h-5 w-5 mr-1.5 -mt-0.5 text-primary" />
                        Numéro de téléphone
                      </label>
                      <div className="flex gap-3">
                        <div className="h-14 px-4 flex items-center bg-muted rounded-xl text-lg font-medium text-foreground shrink-0 border border-border">
                          🇫🇷 +33
                        </div>
                        <Input
                          placeholder="6 12 34 56 78"
                          className="h-14 text-xl rounded-xl flex-1"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneDigits(e.target.value))}
                          inputMode="tel"
                          autoComplete="tel-national"
                        />
                      </div>
                    </div>

                    <div className="py-2">
                      <RememberMeToggle
                        checked={rememberPhone}
                        onChange={setRememberPhone}
                        label="Se souvenir de mon numéro"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      className="btn-primary w-full h-14 text-xl"
                      disabled={phone.length < 9 || sendingOtp}
                    >
                      {sendingOtp ? "Envoi en cours..." : "Recevoir un code par SMS"}
                      {!sendingOtp && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-muted-foreground text-xl">
                        Un code à 6 chiffres a été envoyé au{" "}
                        <span className="font-semibold text-foreground">+33 {phone}</span>
                      </p>
                    </div>

                    <div className="flex justify-center py-4">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="btn-primary w-full h-14 text-xl mt-4"
                      disabled={otp.length !== 6 || loading}
                    >
                      {loading ? "Vérification..." : "Vérifier le code"}
                      {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>

                    {/* LA CORRECTION POUR L'ALIGNEMENT "RENVOYER LE CODE" / "MODIFIER LE NUMÉRO" EST ICI */}
                    <div className="flex flex-row items-center justify-center gap-6 md:gap-8 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setOtp("");
                          handleSendOtp();
                        }}
                        className="flex items-center gap-2 text-[#1B2333] font-medium hover:opacity-70 transition-opacity text-lg whitespace-nowrap"
                        disabled={sendingOtp}
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Renvoyer le code
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="flex items-center gap-2 text-[#1B2333] font-medium hover:opacity-70 transition-opacity text-lg whitespace-nowrap"
                      >
                        <Edit2 className="h-4 w-4" />
                        Modifier le numéro
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <p className="mt-10 text-center text-muted-foreground text-2xl">
              Vous n'avez pas de compte ?{" "}
              <button onClick={() => setModalOpen(true)} className="text-[#1B2333] font-bold hover:underline text-xl">
                Rejoindre le Cercle
              </button>
            </p>
          </div>
        </div>

        {/* Right - Image with overlay */}
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src={heroCouple} alt="Couple heureux" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1B2333]/70" />
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="text-center text-white relative z-10">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">Retrouvez l'amour à tout âge</h2>
              <p className="text-white/90 max-w-md mx-auto text-2xl">
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
