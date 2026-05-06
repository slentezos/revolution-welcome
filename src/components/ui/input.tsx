import * as React from "react";
import { useState, useMemo } from "react";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── 1. COMPOSANT INPUT PREMIUM (Texte, Email, etc.) ───
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Capitalisation automatique pour tout sauf email et password
      if (type !== "email" && type !== "password" && e.target.value?.length > 0) {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;
        const capitalized = val.charAt(0).toUpperCase() + val.slice(1);

        if (val !== capitalized) {
          input.value = capitalized;
          input.setSelectionRange(start, end);
        }
      }
      if (onChange) onChange(e);
    };

    return (
      <input
        type={type}
        onChange={handleChange}
        autoCapitalize="sentences"
        className={cn(
          "flex h-16 w-full rounded-xl border border-white/10 bg-[#1B2333] px-5 py-2 text-xl text-white shadow-2xl transition-all placeholder:text-white/20 hover:border-[hsl(var(--gold))/50] focus-visible:outline-none focus-visible:border-[hsl(var(--gold))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--gold))/20] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// ─── 2. COMPOSANT MOT DE PASSE (Sécurisé) ───
const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative group w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-16 w-full rounded-xl border border-white/10 bg-[#1B2333] px-5 py-2 text-xl text-white shadow-2xl transition-all placeholder:text-white/20 hover:border-[hsl(var(--gold))/50] focus-visible:outline-none focus-visible:border-[hsl(var(--gold))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--gold))/20] pr-14",
            className,
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[hsl(var(--gold))] transition-colors p-2"
          title={showPassword ? "Masquer" : "Afficher"}
        >
          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

// ─── 3. COMPOSANT DATE DE NAISSANCE (Contrainte 60+ ans) ───
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

  // LOGIQUE MÉTIER : 60 ANS ET PLUS (Basé sur 2026)
  const years = useMemo(() => {
    const currentYear = 2026;
    const maxYear = currentYear - 60; // 1966
    return Array.from({ length: 50 }, (_, i) => String(maxYear - i));
  }, []);

  const selectTriggerClass =
    "h-16 text-xl rounded-xl border-white/10 bg-[#1B2333] text-white shadow-2xl hover:border-[hsl(var(--gold))/50] focus:ring-1 focus:ring-[hsl(var(--gold))/20] focus:border-[hsl(var(--gold))] transition-all";

  return (
    <div className={cn("w-full text-left", className)}>
      <label className="block font-semibold text-white/90 mb-4 text-xl flex items-center gap-2">
        <Calendar className="h-5 w-5 text-[hsl(var(--gold))]" />
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <Select value={value.day} onValueChange={(v) => onChange("day", v)}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Jour" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B2333] border-white/10 text-white max-h-[300px]">
            {days.map((d) => (
              <SelectItem key={d} value={d} className="text-lg focus:bg-[hsl(var(--gold))] focus:text-primary">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.month} onValueChange={(v) => onChange("month", v)}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B2333] border-white/10 text-white max-h-[300px]">
            {months.map((m) => (
              <SelectItem
                key={m.value}
                value={m.value}
                className="text-lg focus:bg-[hsl(var(--gold))] focus:text-primary"
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.year} onValueChange={(v) => onChange("year", v)}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B2333] border-white/10 text-white max-h-[300px]">
            {years.map((y) => (
              <SelectItem key={y} value={y} className="text-lg focus:bg-[hsl(var(--gold))] focus:text-primary">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-400 text-lg mt-3 font-medium animate-pulse">⚠️ {error}</p>}
    </div>
  );
};
DateInput.displayName = "DateInput";

export { Input, PasswordInput, DateInput };
