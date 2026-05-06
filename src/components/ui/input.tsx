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
          "flex h-14 w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-2 text-xl shadow-none transition-colors hover:border-[hsl(var(--gold))] focus-visible:outline-none focus-visible:border-[hsl(var(--gold))] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground",
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
  value: { day: string; month: string; year: string } | string;
  onChange: (field: "day" | "month" | "year", val: string) => void;
  error?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const DateInput = ({
  value,
  onChange,
  error,
  className,
  label = "Date de naissance *",
  disabled = false,
}: DateInputProps) => {
  // Helper to handle string format ("YYYY-MM-DD") or object format
  const parsedValue =
    typeof value === "string"
      ? {
          year: value.split("-")[0] || "",
          month: value.split("-")[1] || "",
          day: value.split("-")[2] || "",
        }
      : value;

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
  // Limitation pour 60+ (ex: 2026 - 60 = 1966 max, remontant jusqu'à 1940)
  const years = Array.from({ length: 30 }, (_, i) => String(1966 - i));

  return (
    <div className={cn("w-full text-left", className)}>
      <label className="block font-medium text-[#1B2333] mb-3 text-xl">{label}</label>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* JOUR */}
        <Select disabled={disabled} value={parsedValue.day} onValueChange={(v) => onChange("day", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors disabled:opacity-100 disabled:bg-slate-50">
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
        <Select disabled={disabled} value={parsedValue.month} onValueChange={(v) => onChange("month", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors disabled:opacity-100 disabled:bg-slate-50">
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
        <Select disabled={disabled} value={parsedValue.year} onValueChange={(v) => onChange("year", v)}>
          <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors disabled:opacity-100 disabled:bg-slate-50">
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

// ─── 4. COMPOSANT TÉLÉPHONE (Avec indicatif pays comme à l'inscription) ───
interface PhoneInputProps {
  phone: string;
  setPhone: (val: string) => void;
  className?: string;
  disabled?: boolean;
}

const PhoneInput = ({ phone, setPhone, className, disabled = false }: PhoneInputProps) => {
  // Extraire l'indicatif (ex: +33) et le numéro si le format est déjà sauvegardé
  const [countryCode, setCountryCode] = useState("+33");
  const [rawNumber, setRawNumber] = useState("");

  // Au montage, séparer le numéro s'il existe déjà dans la base
  React.useEffect(() => {
    if (phone) {
      if (phone.startsWith("+33")) {
        setCountryCode("+33");
        setRawNumber(phone.slice(3));
      } else if (phone.startsWith("+32")) {
        setCountryCode("+32");
        setRawNumber(phone.slice(3));
      } else if (phone.startsWith("+41")) {
        setCountryCode("+41");
        setRawNumber(phone.slice(3));
      } else if (phone.startsWith("+352")) {
        setCountryCode("+352");
        setRawNumber(phone.slice(4));
      } else if (phone.startsWith("+377")) {
        setCountryCode("+377");
        setRawNumber(phone.slice(4));
      } else if (phone.startsWith("+1")) {
        setCountryCode("+1");
        setRawNumber(phone.slice(2));
      } else {
        setRawNumber(phone);
      } // Fallback
    }
  }, [phone]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Accepte uniquement les chiffres
    setRawNumber(val);
    setPhone(`${countryCode}${val}`);
  };

  const handleCodeChange = (code: string) => {
    setCountryCode(code);
    if (rawNumber) {
      setPhone(`${code}${rawNumber}`);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-2 w-full">
        {/* SÉLECTEUR INDICATIF PAYS */}
        <Select disabled={disabled} value={countryCode} onValueChange={handleCodeChange}>
          <SelectTrigger className="w-[120px] h-14 text-xl rounded-xl border-[#E5E0D8] bg-white shadow-none hover:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 focus:border-[hsl(var(--gold))] transition-colors disabled:opacity-100 disabled:bg-slate-50">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+33" className="text-lg">
              🇫🇷 +33
            </SelectItem>
            <SelectItem value="+32" className="text-lg">
              🇧🇪 +32
            </SelectItem>
            <SelectItem value="+41" className="text-lg">
              🇨🇭 +41
            </SelectItem>
            <SelectItem value="+352" className="text-lg">
              🇱🇺 +352
            </SelectItem>
            <SelectItem value="+377" className="text-lg">
              🇲🇨 +377
            </SelectItem>
            <SelectItem value="+1" className="text-lg">
              🇨🇦 +1
            </SelectItem>
          </SelectContent>
        </Select>

        {/* CHAMP NUMÉRO */}
        <Input
          type="tel"
          disabled={disabled}
          placeholder="6 12 34 56 78"
          value={rawNumber}
          onChange={handleNumberChange}
          className="flex-1 disabled:opacity-100 disabled:bg-slate-50"
        />
      </div>
    </div>
  );
};
PhoneInput.displayName = "PhoneInput";

export { Input, PasswordInput, DateInput, PhoneInput };
