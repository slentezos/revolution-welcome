import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
          // Design plat et épuré : bordure beige, fond blanc, texte large, pas d'ombre, pas de halo bleu au clic (ring-0)
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

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative group w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            // Mêmes styles appliqués ici pour le mot de passe, avec le pr-12 pour laisser la place à l'icône de l'œil
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
          {showPassword ? <EyeOff className="h-5 w-5 md:h-6 md:w-6" /> : <Eye className="h-5 w-5 md:h-6 md:w-6" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
