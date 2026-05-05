import * as React from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showDictation?: boolean;
  recipientName?: string;
  recipientAvatar?: string;
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
    .replace(/([?.!])\s*([a-zà-ÿ])/gi, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`); // Majuscule auto
};

const capitalizeFirst = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      onChange,
      value,
      showDictation = false,
      recipientName = "Sophie",
      recipientAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop", // UX 2026: Placeholder Premium
      ...props
    },
    ref,
  ) => {
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
          setInterimText("");
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
            "flex w-full rounded-2xl border border-input bg-background/50 px-5 py-4 text-xl backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))] disabled:cursor-not-allowed disabled:opacity-50 min-h-[140px] resize-y",
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
      <div className="w-full max-w-3xl mx-auto flex flex-col bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-500">
        {/* En-tête Contextuel (UX 2026 : Intégration de l'Avatar) */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-2">
          <div className="relative">
            <img
              src={recipientAvatar}
              alt={`Avatar de ${recipientName}`}
              className="w-14 h-14 rounded-full object-cover border-2 border-transparent ring-2 ring-[hsl(var(--gold))/0.2]"
            />
            {isListening && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nouveau Message</p>
            <p className="text-xl font-bold text-[#1B2333]">Écrire à {recipientName}</p>
          </div>
        </div>

        {/* Zone de Texte Principale */}
        <div className="relative px-6 py-2 flex-1">
          <textarea
            onChange={handleChange}
            value={displayValue}
            autoCapitalize="sentences"
            placeholder={`Bonjour ${recipientName}...`}
            className={cn(
              "w-full bg-transparent text-xl leading-relaxed text-[#1B2333] placeholder:text-gray-300 resize-none min-h-[160px] focus:outline-none focus:ring-0",
              className,
            )}
            ref={setRefs}
            {...props}
          />

          {/* Overlay de Dictée (Feedback Visuel 2026) */}
          {isListening && (
            <div className="absolute inset-0 pointer-events-none rounded-xl border border-[hsl(var(--gold))/0.3] bg-[hsl(var(--gold))/0.02] transition-opacity duration-300"></div>
          )}
        </div>

        {/* Panneau de Contrôle Inférieur */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between bg-gray-50/50 mt-auto rounded-b-[32px]">
          {/* Indicateur d'état & Égaliseur */}
          <div className="flex items-center min-w-[150px] h-10">
            {isListening ? (
              <div className="flex items-center gap-3 bg-[hsl(var(--gold))/0.1] px-4 py-2 rounded-full">
                <div className="flex items-end gap-1 h-4">
                  <span
                    className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:0ms]"
                    style={{ height: "60%" }}
                  />
                  <span
                    className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:150ms]"
                    style={{ height: "100%" }}
                  />
                  <span
                    className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:300ms]"
                    style={{ height: "40%" }}
                  />
                  <span
                    className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce [animation-delay:450ms]"
                    style={{ height: "80%" }}
                  />
                </div>
                <span className="text-sm font-semibold text-[hsl(var(--gold))] animate-pulse">Écoute en cours...</span>
              </div>
            ) : safeValue.length > 0 ? (
              <span className="text-sm font-medium text-gray-400">Brouillon sauvegardé</span>
            ) : null}
          </div>

          {/* Actions : Dictée & Envoi */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "flex items-center justify-center gap-2 h-12 px-6 rounded-full transition-all duration-300 text-lg font-semibold shadow-sm",
                isListening
                  ? "bg-white text-red-500 border border-red-100 hover:bg-red-50"
                  : "bg-white text-[#1B2333] border border-gray-200 hover:bg-gray-50",
              )}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-[hsl(var(--gold))]" />}
              {isListening ? "Arrêter" : "Dicter"}
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#1B2333] text-white hover:bg-[#1B2333]/90 transition-all text-lg font-semibold shadow-md"
            >
              Envoyer <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export { Textarea };
