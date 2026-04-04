import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, MapPin, Mail, X } from "lucide-react";

const VALID_POSTAL_PREFIXES = ["75", "77", "78", "92", "93", "94", "95"];

const isValidPostalCode = (code: string) => {
  if (code.length !== 5 || !/^\d{5}$/.test(code)) return false;
  return VALID_POSTAL_PREFIXES.includes(code.substring(0, 2));
};

interface Props {
  formData: { postalCode: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export default function InscriptionStep2Localisation({ formData, setFormData, onNext, onBack, errors }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [preReleaseEmail, setPreReleaseEmail] = useState("");
  const [preReleaseSent, setPreReleaseSent] = useState(false);

  const handleNext = () => {
    if (formData.postalCode.length !== 5) return;

    if (!isValidPostalCode(formData.postalCode)) {
      setShowModal(true);
      return;
    }
    onNext();
  };

  const handlePreRelease = () => {
    if (!preReleaseEmail.includes("@")) return;
    // TODO: Save email to database
    setPreReleaseSent(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">Où habitez-vous ?</h1>
        <p className="text-muted-foreground text-lg">
          Nous avons besoin de votre code postal pour vous proposer des profils proches de chez vous
        </p>
      </div>

      <div className="max-w-sm mx-auto">
        <label className="block text-base font-medium text-foreground mb-3">
          <MapPin className="inline h-5 w-5 mr-1 -mt-0.5 text-primary" />
          Code postal *
        </label>
        <Input
          placeholder="Ex : 75001"
          className="h-14 text-lg rounded-xl text-center tracking-widest"
          value={formData.postalCode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 5);
            setFormData((prev: any) => ({ ...prev, postalCode: val }));
          }}
          maxLength={5}
          inputMode="numeric"
          autoFocus
        />

        {errors.postalCode && <p className="text-destructive text-lg mt-2 text-center">{errors.postalCode}</p>}

        <p className="text-lg text-muted-foreground mt-3 text-center">
          Actuellement disponible en Île-de-France.   Cliquez sur "Continuer" pour laisser votre e-mail et être
          informé(e) de notre arrivée, ou vous inscrire si vous êtes en Île-de-France.
        </p>
      </div>

      <div className="flex gap-4 max-w-sm mx-auto">
        <Button type="button" variant="outline" onClick={onBack} className="h-14 text-base rounded-xl flex-1">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="btn-primary h-14 text-base rounded-xl flex-[2]"
          disabled={formData.postalCode.length !== 5}
        >
          Continuer
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Modal for ineligible postal code */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-2xl shadow-[var(--shadow-luxury)] max-w-md w-full p-8 relative animate-scale-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!preReleaseSent ? (
              <>
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground text-center mb-3">
                  Nous arrivons bientôt !
                </h2>
                <p className="text-muted-foreground text-center text-base mb-6 leading-relaxed">
                  Nous ne sommes pas encore présents dans votre secteur, mais laissez votre email pour être informé(e)
                  dès notre arrivée.
                </p>

                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="h-14 text-base rounded-xl"
                    value={preReleaseEmail}
                    onChange={(e) => setPreReleaseEmail(e.target.value)}
                    autoFocus
                  />

                  <Button
                    type="button"
                    onClick={handlePreRelease}
                    className="btn-primary w-full h-14 text-base rounded-xl"
                    disabled={!preReleaseEmail.includes("@")}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Être informé(e)
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">Merci !</h2>
                <p className="text-muted-foreground text-base mb-6">
                  Nous vous préviendrons dès que Kalimera sera disponible près de chez vous.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="h-14 text-base rounded-xl px-8"
                >
                  Fermer
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
