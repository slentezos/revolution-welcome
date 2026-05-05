import * as React from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showDictation?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

// Parseur de ponctuation et de mise en forme pour le français
const formatSpeech = (text: string) => {
  if (!text) return "";
  return (
    text
      // Ordre strictement respecté : les expressions longues d'abord
      .replace(/\bpoints?\s+d['’]interrogation\b/gi, "?")
      .replace(/\bpoints?\s+d['’]exclamation\b/gi, "!")
      .replace(/\bpoints?\s+de\s+suspension\b/gi, "...")
      .replace(/\bnouveau\s+paragraphe\b/gi, "\n\n")
      .replace(/\b(à|a)\s+la\s+ligne\b/gi, "\n")
      .replace(/\bretour\s+(à|a)\s+la\s+ligne\b/gi, "\n")
      .replace(/\bvirgule\b/gi, ",")
      .replace(/\bpoint-virgule\b/gi, ";")
      .replace(/\bdeux\s+points\b/gi, ":")
      .replace(/\bpoint\b/gi, ".")
      .replace(/\s+([,;:?.!])/g, "$1") // Supprime l'espace inutile avant la ponctuation
      .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`)
  ); // Majuscule auto
};

const capitalizeFirst = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, value, showDictation = false, onConfirm, onClose, ...props }, ref) => {
    const [isListening, setIsListening] = React.useState(false);
    const [interimText, setInterimText] = React.useState("");
    const recognitionRef = React.useRef<any>(null);
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Règle le bug du "Double Typing" : on sépare la valeur visuelle de la valeur réelle en mémoire
    const valueRef = React.useRef(value);
    React.useEffect(() => {
      valueRef.current = value;
    }, [value]);

    const { toast } = useToast();

    // Fusion de la référence transmise par le parent et de notre référence interne
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement>).current = node;
        }
      },
      [ref],
    );

    // Auto-expand fluide qui scrolle toujours en bas
    const adjustTextareaHeight = React.useCallback(() => {
      const ta = internalRef.current;
      if (ta) {
        ta.style.height = "auto";
        const scrollHeight = ta.scrollHeight;
        if (scrollHeight > 300) {
          ta.style.height = "300px";
        } else {
          ta.style.height = `${scrollHeight}px`;
        }
        ta.scrollTop = ta.scrollHeight; // Garantit qu'on voit toujours la dernière ligne
      }
    }, []);

    React.useEffect(() => {
      adjustTextareaHeight();
    }, [value, interimText, adjustTextareaHeight]);

    const listeningRef = React.useRef(false);
    React.useEffect(() => {
      listeningRef.current = isListening;
    }, [isListening]);

    React.useEffect(() => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "fr-FR";

      recognition.onresult = (event: any) => {
        if (!listeningRef.current) return;

        let finalSegment = "";
        let interimSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript || "";
          if (!transcript) continue;
          if (result.isFinal) finalSegment += transcript + " ";
          else interimSegment += transcript;
        }

        if (finalSegment && internalRef.current) {
          // On se base strictement sur la référence parente pour éviter les doublons
          let currentVal = String(valueRef.current || "");
          let formattedFinal = formatSpeech(finalSegment).trim();

          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            formattedFinal = capitalizeFirst(formattedFinal);
          }

          const needsSpace =
            currentVal.length > 0 &&
            !currentVal.endsWith(" ") &&
            !currentVal.endsWith("\n") &&
            !formattedFinal.startsWith(",") &&
            !formattedFinal.startsWith(".");
          const space = needsSpace ? " " : "";

          const newVal = currentVal + space + formattedFinal;
          valueRef.current = newVal; // Mise à jour instantanée de la mémoire interne

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value",
          )?.set;
          nativeInputValueSetter?.call(internalRef.current, newVal);
          const ev = new Event("input", { bubbles: true });
          internalRef.current.dispatchEvent(ev);
        }

        setInterimText(formatSpeech(interimSegment));
        setTimeout(adjustTextareaHeight, 0);
      };

      recognition.onerror = () => {
        listeningRef.current = false;
        setIsListening(false);
        setInterimText("");
      };
      recognition.onend = () => {
        listeningRef.current = false;
        setIsListening(false);
      };
      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.stop();
        } catch {}
        try {
          recognition.abort?.();
        } catch {}
      };
    }, [adjustTextareaHeight]);

    const toggleListening = () => {
      if (listeningRef.current) {
        listeningRef.current = false;
        setIsListening(false);
        try {
          recognitionRef.current?.stop();
        } catch {}
        try {
          recognitionRef.current?.abort?.();
        } catch {}

        if (interimText && internalRef.current) {
          let currentVal = String(valueRef.current || "");
          let finalInterim = interimText.trim();

          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            finalInterim = capitalizeFirst(finalInterim);
          }

          const space = currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "";
          const newVal = currentVal + space + finalInterim + " ";
          valueRef.current = newVal;

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value",
          )?.set;
          nativeInputValueSetter?.call(internalRef.current, newVal);
          const ev = new Event("input", { bubbles: true });
          internalRef.current.dispatchEvent(ev);
        }
        setInterimText("");
      } else {
        if (!recognitionRef.current) {
          toast({
            title: "Non supporté",
            description: "La dictée vocale n'est pas supportée sur ce navigateur.",
            variant: "destructive",
          });
          return;
        }

        setInterimText("");

        if (internalRef.current) {
          const currentVal = String(valueRef.current || "");
          if (currentVal !== "" && !currentVal.endsWith(" ") && !currentVal.endsWith("\n")) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value",
            )?.set;
            nativeInputValueSetter?.call(internalRef.current, currentVal + " ");
            const ev = new Event("input", { bubbles: true });
            internalRef.current.dispatchEvent(ev);
          }
        }

        try {
          recognitionRef.current.start();
          listeningRef.current = true;
          setIsListening(true);
        } catch {
          listeningRef.current = false;
          setIsListening(false);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length > 0) {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;
        const capitalizedValue = capitalizeFirst(currentValue);

        if (currentValue !== capitalizedValue) {
          textarea.value = capitalizedValue;
          textarea.setSelectionRange(start, end);
        }
      }

      // Si l'utilisateur commence à taper manuellement, on coupe l'écoute proprement pour ne pas doubler le texte
      if (interimText) {
        setInterimText("");
        if (listeningRef.current) {
          try {
            recognitionRef.current?.abort();
          } catch {}
          setIsListening(false);
          listeningRef.current = false;
        }
      }

      if (onChange) {
        onChange(e);
      }

      adjustTextareaHeight();
    };

    if (!showDictation) {
      return (
        <textarea
          onChange={handleChange}
          value={value}
          autoCapitalize="sentences"
          className={cn(
            "flex w-full rounded-2xl border border-input bg-background/50 px-5 py-4 text-xl backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))] disabled:cursor-not-allowed disabled:opacity-50 min-h-[140px] resize-y overflow-y-auto",
            className,
          )}
          ref={setRefs}
          {...props}
        />
      );
    }

    const safeValue = value === null || value === undefined ? "" : String(value);
    const displayValue = isListening || interimText ? safeValue + interimText : safeValue;

    return (
      <div className="w-full flex flex-col transition-all duration-500">
        {/* Zone de Texte Principale avec Auto-Expand */}
        <div className="relative flex-1">
          <textarea
            onChange={handleChange}
            value={displayValue}
            autoCapitalize="sentences"
            className={cn(
              "w-full bg-[hsl(var(--cream))]/60 border-2 rounded-2xl text-xl leading-relaxed text-[#1B2333] placeholder:text-gray-400 resize-none min-h-[160px] max-h-[300px] overflow-y-auto focus:outline-none focus:ring-0 px-6 py-5 transition-all shadow-sm",
              isListening
                ? "border-[hsl(var(--gold))] shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
                : "border-amber-100/80 focus:border-[hsl(var(--gold))]",
              className,
            )}
            ref={setRefs}
            {...props}
          />
        </div>

        {/* FEEDBACK VISUEL LARGE ET LISIBLE (NE SUPERPOSE JAMAIS LE TEXTE) */}
        {isListening && (
          <div className="mt-4 flex items-center justify-center gap-4 bg-[hsl(var(--gold))]/10 border-2 border-[hsl(var(--gold))]/30 px-6 py-5 rounded-2xl transition-all animate-in slide-in-from-top-2">
            <div className="flex items-end gap-1.5 h-6">
              <span
                className="w-1.5 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:0ms]"
                style={{ height: "60%" }}
              />
              <span
                className="w-1.5 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:150ms]"
                style={{ height: "100%" }}
              />
              <span
                className="w-1.5 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:300ms]"
                style={{ height: "40%" }}
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-[hsl(var(--gold))] animate-pulse tracking-wide">
              En écoute... Parlez distinctement
            </span>
          </div>
        )}

        {/* Astuce dictée claire et lisible */}
        <p className="mt-4 px-2 text-base text-muted-foreground leading-relaxed">
          💡 Astuce dictée : dites <span className="font-semibold text-foreground">« virgule »</span>,{" "}
          <span className="font-semibold text-foreground">« point »</span>,{" "}
          <span className="font-semibold text-foreground">« à la ligne »</span> ou{" "}
          <span className="font-semibold text-foreground">« point d'interrogation »</span>.
        </p>

        {/* Panneau de Contrôle Inférieur (Boutons Modulables) */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "min-h-[60px] flex-1 flex items-center justify-center gap-3 rounded-2xl text-lg lg:text-xl font-semibold transition-all duration-300 shadow-sm",
              isListening
                ? "bg-[hsl(var(--gold))] text-white shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.6)] hover:brightness-105"
                : "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--cream))]/50",
            )}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />}
            {isListening ? "Arrêter la dictée" : "Dicter à voix haute"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[60px] sm:w-auto px-6 rounded-2xl text-lg lg:text-xl font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Fermer
            </button>
          )}

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={!safeValue.trim() && !isListening}
              className="min-h-[60px] sm:min-w-[180px] rounded-2xl text-lg lg:text-xl font-semibold flex items-center justify-center gap-2 bg-[#1B2333] text-white hover:bg-[#1B2333]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_8px_24px_-8px_rgba(27,35,51,0.5)]"
            >
              <Check className="h-5 w-5" />
              Confirmer
            </button>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export { Textarea };
