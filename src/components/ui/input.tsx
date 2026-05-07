import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Pas de formatage pour les emails, les mots de passe ou les champs tel/number
      if (
        type !== "email" &&
        type !== "password" &&
        type !== "tel" &&
        type !== "number" &&
        e.target.value?.length > 0
      ) {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const rawValue = input.value;

        // LOGIQUE DE CAPITALISATION ÉLITE
        // Sépare par espaces et tirets tout en gardant les séparateurs dans le tableau
        const parts = rawValue.split(/(\s+|-)/);
        let wordCount = 0;

        const formattedParts = parts.map((part) => {
          // Si c'est un séparateur (espace ou tiret), on le garde tel quel
          if (/^(\s+|-)$/.test(part)) return part;
          if (!part) return part;

          wordCount++;

          if (wordCount === 1) {
            // Mot 1 : Capitalisé (Ex: "Belle")
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          } else if (wordCount === 2) {
            // Mot 2 : TOUT en minuscules (Ex: "du", "xavier")
            return part.toLowerCase();
          } else {
            // Mot 3 et plus : Capitalisé (Ex: "Seigneur")
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          }
        });

        const formattedValue = formattedParts.join("");

        if (rawValue !== formattedValue) {
          // CRUCIAL POUR LA SAUVEGARDE :
          // On force la valeur formatée dans l'input et dans l'événement avant de l'envoyer au parent
          input.value = formattedValue;
          e.target.value = formattedValue;

          // Empêche le curseur de sauter à la fin pendant la saisie
          window.requestAnimationFrame(() => {
            if (start !== null && end !== null) {
              input.setSelectionRange(start, end);
            }
          });
        }
      }

      // On propage l'événement (qui porte maintenant la valeur propre) au parent
      if (onChange) onChange(e);
    };

    return (
      <input
        type={type}
        onChange={handleChange}
        className={cn(
          // Design Prestige : h-14, rounded-xl, texte Noir Profond (slate-950)
          "flex h-14 w-full rounded-xl border border-input bg-background px-5 py-2 text-xl text-slate-950 ring-offset-background file:border-0 file:bg-transparent file:text-xl file:font-medium file:text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-xl transition-all shadow-sm",
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
      <div className="relative group w-full">
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
