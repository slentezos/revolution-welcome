import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Mic, MicOff, Crown, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { toast as sonner } from "sonner";
import profileGiftImg from "@/assets/profile-gift.jpg";

/* ─── Parseur de ponctuation et mise en forme (identique à ContactMemberContent) ─── */
const formatSpeech = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\bpoints? d['']interrogation\b/gi, "?")
    .replace(/\bpoints? d['']exclamation\b/gi, "!")
    .replace(/\bpoints de suspension\b/gi, "...")
    .replace(/\bnouveau paragraphe\b/gi, "\n\n")
    .replace(/\b(à|a) la ligne\b/gi, "\n")
    .replace(/\bretour (à|a) la ligne\b/gi, "\n")
    .replace(/\bvirgule\b/gi, ",")
    .replace(/\bpoint-virgule\b/gi, ";")
    .replace(/\bdeux points\b/gi, ":")
    .replace(/\bpoint\b/gi, ".")
    .replace(/\s+([,;:?.!])/g, "$1")
    .replace(/([?.!])\s*([a-zà-ÿ])/gi, (_m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
};
const capitalizeFirst = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

/* ─── Formules alignées sur la page Privileges et Abonnement ─── */
const plans = [
  {
    id: "trimestrielle",
    label: "Cercle Privé — Trimestrielle",
    duration: "3 mois d'accès",
    price: "120€",
    note: "Soit 40€/mois — économisez 30€",
    recommended: true,
  },
  {
    id: "mensuelle",
    label: "Cercle Privé — Mensuelle",
    duration: "1 mois d'accès",
    price: "50€",
    note: "Sans engagement",
    recommended: false,
  },
] as const;

export default function ProfileGiftTab() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[number]["id"]>("trimestrielle");
  const [addVip, setAddVip] = useState(false);

  /* ─── Message + dictée ─── */
  const [message, setMessage] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, interimText, adjustTextareaHeight]);

  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
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
      if (finalSegment) {
        setMessage((prev) => {
          const currentVal = prev || "";
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
          return currentVal + (needsSpace ? " " : "") + formattedFinal;
        });
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
      try { recognition.stop(); } catch { /* noop */ }
      try { recognition.abort?.(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = useCallback(() => {
    if (listeningRef.current) {
      listeningRef.current = false;
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch { /* noop */ }
      try { recognitionRef.current?.abort?.(); } catch { /* noop */ }

      if (interimText) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let finalInterim = interimText.trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            finalInterim = capitalizeFirst(finalInterim);
          }
          const space = currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "";
          return currentVal + space + finalInterim + " ";
        });
      }
      setInterimText("");
    } else {
      if (!recognitionRef.current) {
        sonner.error("La dictée vocale n'est pas supportée par votre navigateur.");
        return;
      }
      setInterimText("");
      setMessage((prev) => {
        const currentVal = prev || "";
        if (currentVal !== "" && !currentVal.endsWith(" ") && !currentVal.endsWith("\n")) {
          return currentVal + " ";
        }
        return currentVal;
      });
      try {
        recognitionRef.current.start();
        listeningRef.current = true;
        setIsListening(true);
      } catch {
        listeningRef.current = false;
        setIsListening(false);
      }
    }
  }, [interimText]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const capitalizedValue = val.length === 1 ? capitalizeFirst(val) : val;
    setMessage(capitalizedValue);
    if (interimText) setInterimText("");
    adjustTextareaHeight();
  };

  const displayValue = isListening || interimText ? message + interimText : message;

  const handleSubmit = () => {
    if (listeningRef.current) toggleListening();
    toast({ title: "Cadeau envoyé !", description: "Le destinataire recevra un email personnalisé." });
  };

  return (
    <div>
      {/* Hero split – reversed */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24 order-2 lg:order-1">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Faites plaisir
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Offrir un abonnement
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Offrez à un proche l'opportunité de faire de belles rencontres. Nous lui enverrons un email personnalisé avec votre message.
          </p>
        </div>
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh] order-1 lg:order-2">
          <img decoding="async" src={profileGiftImg} alt="Offrir un abonnement" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Gift form */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Recipient info */}
            <div className="space-y-8">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground">Informations du destinataire</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Nom du destinataire</Label>
                  <Input
                    placeholder="Ex : Marie Dupont"
                    className="h-14 border-2 border-muted bg-background focus:border-primary rounded-none text-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Email du destinataire</Label>
                  <Input
                    type="email"
                    placeholder="marie@exemple.fr"
                    className="h-14 border-2 border-muted bg-background focus:border-primary rounded-none text-xl"
                  />
                </div>

                {/* Personal message with dictation */}
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">
                    Votre message personnel (optionnel)
                  </Label>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={displayValue}
                      onChange={handleTextareaChange}
                      placeholder="Un petit mot pour accompagner le cadeau…"
                      className={`flex w-full rounded-2xl border-2 bg-[hsl(var(--cream))]/60 px-6 py-5 ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus:ring-0 text-xl md:text-2xl leading-relaxed resize-none overflow-hidden transition-all duration-300 min-h-[160px] ${
                        isListening
                          ? "border-[hsl(var(--gold))] shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
                          : "border-amber-100/80 focus:border-[hsl(var(--gold))]"
                      }`}
                    />
                    {isListening && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-[hsl(var(--gold))]/15 px-3 py-1.5 rounded-full">
                        <div className="flex items-end gap-0.5 h-4">
                          <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[60%]" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[100%]" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[40%]" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="font-semibold text-[hsl(var(--gold))] text-base">En écoute</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-1 text-muted-foreground leading-relaxed text-lg">
                    💡 Astuce dictée : dites <span className="font-semibold text-foreground">« virgule »</span>,{" "}
                    <span className="font-semibold text-foreground">« point »</span>,{" "}
                    <span className="font-semibold text-foreground">« à la ligne »</span> ou{" "}
                    <span className="font-semibold text-foreground">« point d'interrogation »</span>.
                  </p>

                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`mt-2 min-h-[60px] w-full flex items-center justify-center gap-3 rounded-2xl text-lg lg:text-xl font-semibold transition-all duration-300 ${
                      isListening
                        ? "bg-[hsl(var(--gold))] text-white shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.6)] hover:brightness-105"
                        : "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--cream))]/50"
                    }`}
                  >
                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />}
                    {isListening ? "Arrêter la dictée" : "Dicter à voix haute"}
                  </button>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="space-y-8">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground">Choisissez une formule</h3>
              <div className="space-y-4">
                {plans.map((plan) => {
                  const active = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full text-left p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 min-h-[80px] ${
                        active
                          ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-md"
                          : "border-secondary bg-white hover:border-[hsl(var(--gold))]/40"
                      }`}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-3 right-6 bg-[hsl(var(--gold))] text-primary px-3 py-1 font-bold tracking-[0.15em] uppercase rounded-full text-base">
                          Recommandé
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                            {plan.label}
                          </p>
                          <p className="text-muted-foreground text-lg mt-1">{plan.duration}</p>
                          <p className="text-muted-foreground text-base mt-1">{plan.note}</p>
                          {active && (
                            <div className="flex items-center gap-2 text-[hsl(var(--gold))] font-medium text-lg mt-3">
                              <Check className="h-5 w-5" /> Sélectionnée
                            </div>
                          )}
                        </div>
                        <span className="font-heading text-2xl md:text-3xl font-semibold text-foreground shrink-0">
                          {plan.price}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* VIP add-on */}
                <button
                  type="button"
                  onClick={() => setAddVip((v) => !v)}
                  className={`relative w-full text-left p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 ${
                    addVip
                      ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5 shadow-md"
                      : "border-secondary bg-white hover:border-[hsl(var(--gold))]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Crown className="h-6 w-6 text-[hsl(var(--gold))]" />
                        <p className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                          Ajouter le Carré VIP
                        </p>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        Mode Invisible, accusés de lecture, alertes Conciergerie.
                      </p>
                      {addVip && (
                        <div className="flex items-center gap-2 text-[hsl(var(--gold))] font-medium text-lg mt-3">
                          <Check className="h-5 w-5" /> Inclus dans le cadeau
                        </div>
                      )}
                    </div>
                    <span className="font-heading text-2xl md:text-3xl font-semibold text-foreground shrink-0">
                      +12€<span className="text-muted-foreground text-lg font-normal"> /mois</span>
                    </span>
                  </div>
                </button>
              </div>

              <Button
                onClick={handleSubmit}
                className="btn-primary py-5 px-10 text-lg h-auto min-h-[60px] w-full"
              >
                <Gift className="h-5 w-5 mr-3" />
                Offrir cet abonnement
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
