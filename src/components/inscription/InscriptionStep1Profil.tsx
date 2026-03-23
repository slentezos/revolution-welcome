import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">Parlez-nous de vous</h1>
        <p className="text-muted-foreground text-xl">Quelques informations pour mieux vous connaître</p>
      </div>

      <div>
        <label className="block font-medium text-foreground mb-3 text-lg">Prénom *</label>
        <Input
          placeholder="Votre prénom"
          className="h-14 text-lg rounded-xl"
          value={formData.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          autoComplete="given-name"
          autoFocus
        />

        {errors.firstName && <p className="text-destructive text-sm mt-2">{errors.firstName}</p>}
      </div>

      <div>
        <label className="block font-medium text-foreground mb-3 text-lg">Date de naissance *</label>
        <div className="grid grid-cols-3 gap-3">
          <Select value={formData.birthDay} onValueChange={(v) => update("birthDay", v)}>
            <SelectTrigger className="h-14 text-base rounded-xl">
              <SelectValue placeholder="Jour" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formData.birthMonth} onValueChange={(v) => update("birthMonth", v)}>
            <SelectTrigger className="h-14 text-base rounded-xl">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formData.birthYear} onValueChange={(v) => update("birthYear", v)}>
            <SelectTrigger className="h-14 text-base rounded-xl">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.birthDate && <p className="text-destructive text-sm mt-2">{errors.birthDate}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-foreground mb-3 text-lg">Je suis *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "homme", label: "Un homme" },
              { value: "femme", label: "Une femme" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("gender", opt.value)}
                className={`h-14 rounded-xl text-base font-medium border-2 transition-all duration-300 ${
                  formData.gender === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-destructive text-sm mt-2">{errors.gender}</p>}
        </div>

        <div>
          <label className="block font-medium text-foreground mb-3 text-lg">Je recherche *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "Un compagnon", label: "Un compagnon" },
              { value: "Une compagne", label: "Une compagne" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("lookingFor", opt.value)}
                className={`h-14 rounded-xl text-base font-medium border-2 transition-all duration-300 ${
                  formData.lookingFor === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.lookingFor && <p className="text-destructive text-sm mt-2">{errors.lookingFor}</p>}
        </div>
      </div>

      <Button type="button" onClick={onNext} className="btn-primary w-full h-14 text-lg rounded-xl mt-4">
        Continuer
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
