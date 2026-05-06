import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  firstName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: string;
  lookingFor: string;
}

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  errors: Record<string, string>;
}

const months = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

export default function InscriptionStep1Profil({ formData, setFormData, onNext, errors }: Props) {
  const years = useMemo(() => {
    const arr = [];
    for (let y = 1940; y <= 1966; y++) arr.push(y);
    return arr.reverse();
  }, []);

  const days = useMemo(() => {
    const month = parseInt(formData.birthMonth) || 1;
    const year = parseInt(formData.birthYear) || 1960;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0"));
  }, [formData.birthMonth, formData.birthYear]);

  const update = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Style commun pour les bordures au survol et focus
  const interactiveClasses =
    "hover:border-[hsl(var(--gold))] focus:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 transition-colors duration-300";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#1B2333] mb-3">Parlez-nous de vous</h1>
        <p className="text-muted-foreground text-xl">Informations requises pour la certification de votre profil.</p>
      </div>

      {/* PRÉNOM */}
      <div>
        <label className="block font-medium text-[#1B2333] mb-3 text-xl">Prénom *</label>
        <Input
          placeholder="Votre prénom"
          className={cn("h-14 text-xl rounded-xl border-[#E5E0D8]", interactiveClasses)}
          value={formData.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          autoComplete="given-name"
          autoFocus
        />
        {errors.firstName && <p className="text-destructive text-lg mt-2 font-medium">{errors.firstName}</p>}
      </div>

      {/* DATE DE NAISSANCE */}
      <div>
        <label className="block font-medium text-[#1B2333] mb-3 text-xl">Date de naissance *</label>
        <div className="grid grid-cols-3 gap-3">
          <Select value={formData.birthDay} onValueChange={(v) => update("birthDay", v)}>
            <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
              <SelectValue placeholder="Jour" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {days.map((d) => (
                <SelectItem key={d} value={d} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.birthMonth} onValueChange={(v) => update("birthMonth", v)}>
            <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.birthYear} onValueChange={(v) => update("birthYear", v)}>
            <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.birthDate && <p className="text-destructive text-lg mt-2 font-medium">{errors.birthDate}</p>}
      </div>

      {/* GENRE & RECHERCHE */}
      <div className="flex flex-col gap-8">
        <div>
          <label className="block font-medium text-[#1B2333] mb-3 text-xl">Je suis *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "homme", label: "Un homme" },
              { value: "femme", label: "Une femme" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("gender", opt.value)}
                className={cn(
                  "h-14 px-3 rounded-xl text-lg md:text-xl font-medium whitespace-nowrap transition-all duration-300 border-[#1B2333] bg-[#1B2333] text-white border",
                  formData.gender === opt.value
                    ? "border-[#1B2333] bg-[#1B2333] text-white"
                    : "border-[#1B2333] bg-[#1B2333] text-white border",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-destructive text-lg mt-2 font-medium">{errors.gender}</p>}
        </div>

        <div>
          <label className="block font-medium text-[#1B2333] mb-3 text-xl">Je recherche *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "Un compagnon", label: "Un compagnon" },
              { value: "Une compagne", label: "Une compagne" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("lookingFor", opt.value)}
                className={cn(
                  "h-14 px-3 rounded-xl text-lg md:text-xl font-medium whitespace-nowrap transition-all duration-300 border-[#1B2333] bg-[#1B2333] text-white border",
                  formData.lookingFor === opt.value
                    ? "border-[#1B2333] bg-[#1B2333] text-white"
                    : "border-[#1B2333] bg-[#1B2333] text-white border",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.lookingFor && <p className="text-destructive text-lg mt-2 font-medium">{errors.lookingFor}</p>}
        </div>
      </div>

      <Button
        type="button"
        onClick={onNext}
        className="w-full h-14 bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-xl rounded-xl mt-4 shadow-lg transition-all active:scale-[0.98]"
      >
        Continuer
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
