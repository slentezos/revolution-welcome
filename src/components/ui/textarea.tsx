import * as React from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showDictation?: boolean;
}

// Parseur de ponctuation et de mise en forme pour le français
const formatSpeech = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\bvirgule\b/gi, ",")
    .replace(/\bpoint\b/gi, ".")
    .replace(/\bpoint d'interrogation\b/gi, "?")
    .replace(/\bpoint d'exclamation\b/gi, "!")
    .replace(/\bpoints de suspension\b/gi, "...")
    .replace(/\bà la ligne\b/gi, "\n")
    .replace(/\s+([,?.!])/g, "$1") // Supprime l'espace avant la ponctuation
    .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`); // Majuscule auto après ponctuation
};

const capitalizeFirst = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, value, showDictation = false, ...props }, ref) => {
    const [isListening, setIsListening] = React.useState(false);
    const [interimText, setInterimText] = React.useState("");
    const recognitionRef = React.useRef<any>(null);
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
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

    React.useEffect(() => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "fr-FR";

        recognition.onresult = (event: any) => {
          let finalSegment = "";
          let interimSegment = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i].transcript;
            if (event.results[i].isFinal) finalSegment += transcript + " ";
            else interimSegment += transcript;
          }

          if (finalSegment && internalRef.current) {
            let currentVal = internalRef.current.value || "";
            let formattedFinal = formatSpeech(finalSegment).trim();

            // Auto-majuscule si le champ est vide ou si on suit une ponctuation de fin de phrase
            if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
              formattedFinal = capitalizeFirst(formattedFinal);
            }

            // Gestion intelligente de l'espace de liaison
            const needsSpace =
              currentVal.length > 0 &&
              !currentVal.endsWith(" ") &&
              !currentVal.endsWith("\n") &&
              !formattedFinal.startsWith(",") &&
              !formattedFinal.startsWith(".");
            const space = needsSpace ? " " : "";

            const newVal = currentVal + space + formattedFinal;

            // Injection native pour déclencher le onChange de React
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value",
            )?.set;
            nativeInputValueSetter?.call(internalRef.current, newVal);
            const ev = new Event("input", { bubbles: true });
            internalRef.current.dispatchEvent(ev);
          }

          setInterimText(formatSpeech(interimSegment));
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }

      return () => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      };
    }, [isListening]);

    const toggleListening = () => {
      if (isListening) {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);

        if (interimText && internalRef.current) {
          let currentVal = internalRef.current.value || "";
          let finalInterim = interimText.trim();

          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            finalInterim = capitalizeFirst(finalInterim);
          }

          const space = currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "";
          const newVal = currentVal + space + finalInterim + " ";

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
        if (recognitionRef.current) {
          setInterimText(""); // Sécurité : On vide toujours le buffer avant de démarrer
          if (internalRef.current) {
            const currentVal = internalRef.current.value || "";
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
          recognitionRef.current.start();
          setIsListening(true);
        } else {
          toast({
            title: "Non supporté",
            description: "La dictée vocale n'est pas supportée sur ce navigateur.",
            variant: "destructive",
          });
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

      // Si l'utilisateur efface ou tape du texte manuellement, on tue le buffer vocal
      // pour éviter l'effet "Texte Fantôme"
      if (interimText) {
        setInterimText("");
      }

      if (onChange) {
        onChange(e);
      }
    };

    if (!showDictation) {
      return (
        <textarea
          onChange={handleChange}
          value={value}
          autoCapitalize="sentences"
          className={cn(
            "flex w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-xl resize-y min-h-[120px] max-h-[300px] overflow-y-auto",
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
      <div className="flex flex-col w-full">
        <div className="flex items-end gap-3 w-full">
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "min-h-[48px] px-4 w-auto min-w-[120px] flex items-center justify-center gap-2 rounded-xl transition-all duration-300 text-xl font-semibold shrink-0",
              isListening
                ? "bg-[hsl(var(--gold))] text-white animate-pulse [animation-duration:3s] shadow-[0_0_16px_hsl(var(--gold)/0.4)]"
                : "bg-[#1B2333] text-white hover:bg-[#1B2333]/90",
            )}
            aria-label={isListening ? "Arrêter de dicter" : "Dictée vocale"}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            {isListening ? "Arrêter de dicter" : "Dicter"}
          </button>

          <div className="flex-1 w-full">
            <textarea
              onChange={handleChange}
              value={displayValue}
              autoCapitalize="sentences"
              className={cn(
                "flex w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))] focus-visible:border-[hsl(var(--gold))] disabled:cursor-not-allowed disabled:opacity-50 text-xl resize-y min-h-[120px] max-h-[300px] overflow-y-auto",
                className,
              )}
              ref={setRefs}
              {...props}
            />
          </div>
        </div>

        {/* FEEDBACK ÉGALISEUR SOUS LE CHAMP DE TEXTE */}
        <div className="mt-2 min-h-[1.5rem]">
          {isListening ? (
            <div className="flex items-center gap-3">
              <p className="font-bold text-3xl text-[#e2a036]" style={{ color: "hsl(var(--gold))" }}>
                Je vous écoute...
              </p>
              <div className="flex items-end gap-1 h-5">
                <span
                  className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                  style={{ height: "60%", animationDelay: "0ms" }}
                />
                <span
                  className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                  style={{ height: "100%", animationDelay: "150ms" }}
                />
                <span
                  className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce"
                  style={{ height: "40%", animationDelay: "300ms" }}
                />
              </div>
            </div>
          ) : safeValue.length > 0 ? (
            <p className="italic text-right text-lg" style={{ color: "hsl(var(--gold))" }}>
              ✍️ Votre brouillon est sauvegardé
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export { Textarea };
