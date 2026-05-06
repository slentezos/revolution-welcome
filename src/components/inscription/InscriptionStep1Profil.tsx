import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

// 1. DÉFINITION DES PROPS (Le "Contrat")
interface InscriptionStepProps {
  formData: any; // Vous pouvez préciser le type exact si souhaité
  setFormData: Dispatch<SetStateAction<any>>;
  onNext: () => void;
  errors: Record<string, string>;
}

// 2. APPLICATION DU TYPAGE
export default function InscriptionStep1Profil({ formData, setFormData, onNext, errors }: InscriptionStepProps) {
  // Validation locale avec la règle des 3 caractères minimum
  const handleContinue = () => {
    if (formData.firstName.trim().length >= 3) {
      onNext();
    } else {
      // L'erreur sera gérée par le parent ou ici
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <label className="text-xl font-bold text-[#1B2333]">Votre Prénom</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className={cn(
            "flex h-14 w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-2 text-xl outline-none",
            errors.firstName && "border-red-500",
          )}
          placeholder="Ex: Jean-Pierre"
        />
        {errors.firstName && <p className="text-red-500 text-sm font-bold">{errors.firstName}</p>}
      </div>

      {/* ... reste du formulaire ... */}

      <button
        onClick={handleContinue}
        className="w-full h-14 bg-[#1B2333] text-white rounded-xl font-bold text-xl hover:opacity-90 transition-all"
      >
        Continuer
      </button>
    </div>
  );
}
