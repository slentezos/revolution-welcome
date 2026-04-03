import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Phone, RefreshCw, Edit3 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface Props {
  formData: { phone: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export default function InscriptionStep3Telephone({ formData, setFormData, onNext, onBack, errors }: Props) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState("");

  const formatPhone = (phone: string) => {
    // Display formatted: 06 12 34 56 78
    const digits = phone.replace(/\D/g, "").slice(0, 10);
    return digits;
  };

  const handleSendCode = async () => {
    if (formData.phone.length < 9) return;
    setSending(true);
    setCodeError("");

    // TODO: Integrate with SMS service (Twilio edge function)
    // For now, simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setCodeSent(true);
    setSending(false);
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    setCodeError("");

    // TODO: Verify OTP with backend
    // For now, simulate verification
    await new Promise((r) => setTimeout(r, 1000));

    // Accept any 6-digit code for now
    if (code.length === 6) {
      onNext();
    } else {
      setCodeError("Le code saisi est incorrect. Veuillez réessayer.");
    }
    setVerifying(false);
  };

  const handleResend = async () => {
    setSending(true);
    setCodeError("");
    setCode("");
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
  };

  const handleEditPhone = () => {
    setCodeSent(false);
    setCode("");
    setCodeError("");
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-3">
          {codeSent ? "Entrez le code reçu" : "Vérification du téléphone"}
        </h1>
        <p className="text-muted-foreground text-xl">
          {codeSent
            ? `Un code à 6 chiffres a été envoyé au +33 ${formData.phone}`
            : "Pour votre sécurité, nous vérifions votre numéro de téléphone"}
        </p>
      </div>

      {!codeSent ? (
        <div className="max-w-sm mx-auto space-y-6">
          <div>
            <label className="block font-medium text-foreground mb-3 text-xl">
              <Phone className="inline h-5 w-5 mr-1 -mt-0.5 text-primary" />
              Numéro de téléphone *
            </label>
            <div className="flex gap-3">
              <div className="h-14 px-4 flex items-center bg-muted rounded-xl text-base font-medium text-foreground shrink-0">
                🇫🇷 +33
              </div>
              <Input
                placeholder="6 12 34 56 78"
                className="h-14 text-xl rounded-xl flex-1"
                value={formData.phone}
                onChange={(e) => {
                  const val = formatPhone(e.target.value);
                  setFormData((prev: any) => ({ ...prev, phone: val }));
                }}
                inputMode="tel"
                autoComplete="tel-national"
                autoFocus
              />
            </div>
            {errors.phone && <p className="text-destructive text-xl mt-2">{errors.phone}</p>}
          </div>

          <div className="flex gap-4 text-xl">
            <Button type="button" variant="outline" onClick={onBack} className="h-14 text-base rounded-xl flex-1">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour
            </Button>
            <Button
              type="button"
              onClick={handleSendCode}
              className="btn-primary h-14 text-base rounded-xl flex-[2]"
              disabled={formData.phone.length < 9 || sending}
            >
              {sending ? "Envoi en cours..." : "Envoyer le code"}
              {!sending && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-sm mx-auto space-y-8">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-lg" />
                <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-lg" />
                <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-lg" />
                <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-lg" />
                <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-lg" />
                <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {codeError && <p className="text-destructive text-sm text-center">{codeError}</p>}

          <Button
            type="button"
            onClick={handleVerifyCode}
            className="btn-primary w-full h-14 text-base rounded-xl"
            disabled={code.length !== 6 || verifying}
          >
            {verifying ? "Vérification..." : "Vérifier le code"}
            {!verifying && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>

          <div className="flex justify-center gap-6 text-sm">
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline flex items-center gap-1 text-xl"
              disabled={sending}
            >
              <RefreshCw className="h-4 w-4" />
              Renvoyer le code
            </button>
            <button
              type="button"
              onClick={handleEditPhone}
              className="text-primary font-medium hover:underline flex items-center gap-1 text-xl"
            >
              <Edit3 className="h-4 w-4" />
              Modifier le numéro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
