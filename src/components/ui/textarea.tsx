import * as React from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showDictation?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, value, showDictation = false, ...props }, ref) => {
    const [isListening, setIsListening] = React.useState(false);
    const [interimText, setInterimText] = React.useState("");
    const recognitionRef = React.useRef<any>(null);
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    const { toast } = useToast();

    // Fusion des références (Celle du composant parent + la nôtre)
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
            // Sécurité anti-undefined
            const currentVal = internalRef.current.value || "";
            const space = currentVal.endsWith(" ") || currentVal === "" ? "" : " ";
            const newVal = currentVal + space + finalSegment;

            // Déclenchement naturel de l'événement onChange pour React
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value",
            )?.set;
            nativeInputValueSetter?.call(internalRef.current, newVal);
            const ev = new Event("input", { bubbles: true });
            internalRef.current.dispatchEvent(ev);
          }
          setInterimText(interimSegment);
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
          const currentVal = internalRef.current.value || "";
          const newVal = currentVal + interimText + " ";
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
          if (internalRef.current) {
            const currentVal = internalRef.current.value || "";
            if (currentVal !== "" && !currentVal.endsWith(" ")) {
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
        const capitalizedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);

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

    // Si on ne veut pas de dictée, on retourne le champ standard sans surcharger le DOM
    if (!showDictation) {
      return (
        <textarea
          onChange={handleChange}
          value={value}
          autoCapitalize="sentences"
          className={cn(
            "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-xl resize-y",
            className,
          )}
          ref={setRefs}
          {...props}
        />
      );
    }

    // Protection anti-undefined pendant la frappe / dictée
    const safeValue = value === null || value === undefined ? "" : String(value);
    const displayValue = isListening || interimText ? safeValue + interimText : value;

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
                "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-xl resize-y",
                className,
              )}
              ref={setRefs}
              {...props}
            />
          </div>
        </div>

        {/* ÉGALISEUR DORÉ */}
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
