import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type !== "email" && type !== "password" && e.target.value?.length > 0) {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const rawValue = input.value;

        // RÈGLE ÉLITE :
        // 1. On passe tout en minuscules (No other capital letters allowed)
        // 2. On met en majuscule la première lettre de chaque mot (Espace ou Tiret)
        // Résultat : "LOUIS" -> "Louis", "louis xavier" -> "Louis Xavier"
        const formattedValue = rawValue.toLowerCase().replace(/(?:^|[\s-])\p{L}/gu, (match) => match.toUpperCase());

        if (rawValue !== formattedValue) {
          input.value = formattedValue;
          // Protection du curseur pour éviter qu'il saute à la fin
          window.requestAnimationFrame(() => {
            if (start !== null && end !== null) {
              input.setSelectionRange(start, end);
            }
          });
        }
      }

      // On propage l'événement original
      if (onChange) onChange(e);
    };

    return (
      <input
        type={type}
        onChange={handleChange}
        className={cn(
          // text-slate-950 : Contraste maximal pour les 60+
          // placeholder:text-slate-500 : Aide à la lecture renforcée
          "flex h-14 w-full rounded-xl border border-input bg-background px-4 py-2 text-xl text-slate-950 ring-offset-background file:border-0 file:bg-transparent file:text-xl file:font-medium file:text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-xl transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="relative group">
        <Input type={show ? "text" : "password"} className={cn("pr-14", className)} ref={ref} {...props} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors p-2"
          tabIndex={-1}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {show ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
