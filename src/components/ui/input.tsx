import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── 1. COMPOSANT INPUT CLASSIQUE (Texte, Email, etc.) ───
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type !== "email" && type !== "password" && e.target.value?.length > 0) {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentValue = input.value;
        const capitalizedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);

        if (currentValue !== capitalizedValue) {
          input.value = capitalizedValue;
          input.setSelectionRange(start, end);
        }
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <input
        type={type}
        onChange={handleChange}
        autoCapitalize="sentences"
        className={cn(
          "flex h-14 w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-2 text-lg shadow-none transition-colors hover:border-[hsl(var(--gold))] focus-visible:outline-none focus-visible:border-[hsl(var(--gold))] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// ─── 2. COMPOSANT MOT DE PASSE (Avec œil de visibilité) ───
const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative group w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-14 w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-2 text-lg shadow-none transition-colors hover:border-[hsl(var(--gold))] focus-visible:outline-none focus-visible:border-[hsl(var(--gold))] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground pr-12",
            className,
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

// ─── 3. COMPOSANT DATE DE NAISSANCE (Le design à 3 blocs) ───
interface DateInputProps {
  value: { day: string; month: string; year: string };
  onChange: (field: "day" | "month" | "year", val: string) => void;
  error?: string;
  className?: string;
  label?: string;
}

const DateInput = ({ value, onChange, error, className, label = "Date de naissance *" }: DateInputProps) => {
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  return (
    <div className={cn("w-full text-left", className)}>
      <label className="block font-medium text-[#1B2333] mb-3 text-xl">{label}</label>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* JOUR */}
        <Select value={value.day} onValueChange={(v) => onChange("day", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors">
            <SelectValue placeholder="Jour" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            {days.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* MOIS */}
        <Select value={value.month} onValueChange={(v) => onChange("month", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ANNÉE */}
        <Select value={value.year} onValueChange={(v) => onChange("year", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-destructive text-lg mt-2">{error}</p>}
    </div>
  );
};
DateInput.displayName = "DateInput";

export { Input, PasswordInput, DateInput };
