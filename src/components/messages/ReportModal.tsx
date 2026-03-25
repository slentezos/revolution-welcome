import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag, UserX, ArrowLeft, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onUnmatchInstead: () => void;
}

export default function ReportModal({ open, onOpenChange, name, onUnmatchInstead }: ReportModalProps) {
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [reason, setReason] = useState<string>("");
  const [reportText, setReportText] = useState("");
  const [sending, setSending] = useState(false);

  // États pour l'auto-expand et la dictée indestructible
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);

  // Les "Coffres-forts" pour empêcher l'API vocale d'effacer le texte
  const recognitionRef = useRef<any>(null);
  const manualStopRef = useRef(false);
  const reportTextRef = useRef(reportText);
  const baseTextRef = useRef("");

  // Garde la référence toujours à jour avec le texte actuel
  useEffect(() => {
    reportTextRef.current = reportText;
  }, [reportText]);

  // Ajustement automatique de la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [reportText, step]);

  const handleClose = () => {
    setStep("intro");
    setReason("");
    setReportText("");
    if (isListening) forceStopDictation();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!reason || !reportText.trim()) return;
    setSending(true);
    if (isListening) forceStopDictation();
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(`Votre signalement concernant ${name} a bien été envoyé.`);
    handleClose();
  };

  const handleUnmatchInstead = () => {
    handleClose();
    onUnmatchInstead();
  };

  // ---- LE MOTEUR DE DICTÉE VOCALE "CRÈME DE LA CRÈME" ----
  const initRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    // Quand le micro s'allume (même après une pause), on verrouille le texte existant
    recognition.onstart = () => {
      baseTextRef.current = reportTextRef.current;
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      // On combine le texte verrouillé avec les nouveaux mots
      const newText = (baseTextRef.current + " " + transcript).trim();
      setReportText(newText);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        manualStopRef.current = true;
        setIsListening(false);
      }
    };

    // Si le navigateur fait une pause, on le relance automatiquement (sauf si l'utilisateur a cliqué sur "Arrêter")
    recognition.onend = () => {
      if (!manualStopRef.current) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  };

  const toggleDictation = () => {
    if (isListening) {
      forceStopDictation();
    } else {
      manualStopRef.current = false;
      if (!recognitionRef.current) {
        recognitionRef.current = initRecognition();
      }
      if (!recognitionRef.current) {
        toast.error("Votre navigateur ne supporte pas la dictée vocale.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Erreur de démarrage audio");
      }
    }
  };

  const forceStopDictation = () => {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[90vh] bg-white">
        {step === "intro" ? (
          <div className="px-6 sm:px-8 py-8 space-y-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Flag className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading font-bold text-[#1B2333] text-4xl">Signaler {name}</h2>
            <p className="text-center text-foreground mb-6 text-xl">
              Dites-nous si quelqu'un a enfreint nos règles de bienveillance. Cette personne ne saura pas que vous
              l'avez signalée.
            </p>

            <div className="space-y-3">
              {[
                "Dites-nous ce qu'il s'est passé",
                "Nous examinerons votre signalement",
                "Nous vous tiendrons informé(e)",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left"
                >
                  <span className="shrink-0 w-9 h-9 rounded-full bg-[#1B2333] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-foreground font-medium text-xl mt-1">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <UserX className="h-6 w-6 text-[#1B2333] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#1B2333] font-medium text-xl">Pas d'infraction aux règles ?</p>
                <button
                  onClick={handleUnmatchInstead}
                  className="text-[hsl(var(--gold))] font-medium hover:underline underline-offset-4 text-xl mt-1"
                >
                  Retirer le match à la place
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                onClick={() => setStep("form")}
                className="w-full h-14 rounded-xl text-white text-lg font-medium bg-[#1B2333] hover:bg-[#1B2333]/90"
              >
                Commencer le signalement
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-6 sm:px-8 py-8 space-y-6">
            <button
              onClick={() => {
                setStep("intro");
                if (isListening) forceStopDictation();
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-[#1B2333] transition-colors text-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>

            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center text-[#1B2333]">
              <Flag className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading font-bold text-[#1B2333] text-3xl">Que s'est-il passé ?</h2>
            <p className="text-center text-foreground text-lg">
              Sélectionnez un motif et décrivez la situation en détail.
            </p>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label className="text-lg font-medium text-[#1B2333]">Motif principal</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full h-14 text-lg rounded-xl border-gray-200 bg-gray-50/80 focus:ring-[#1B2333]">
                    <SelectValue placeholder="Sélectionnez une raison..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="comportement" className="text-base py-3">
                      Comportement déplacé ou irrespectueux
                    </SelectItem>
                    <SelectItem value="fraude" className="text-base py-3">
                      Suspicion de faux profil ou fraude
                    </SelectItem>
                    <SelectItem value="contenu" className="text-base py-3">
                      Contenu inapproprié ou choquant
                    </SelectItem>
                    <SelectItem value="vie_privee" className="text-base py-3">
                      Atteinte à la vie privée
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium text-[#1B2333]">Détails supplémentaires</Label>

                {/* L'UX 2026 : Barre d'outils de dictée */}
                <div className="flex items-center gap-4 mb-1">
                  <button
                    onClick={toggleDictation}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-base ${
                      isListening
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] shadow-inner"
                        : "bg-[#E5C18D]/40 text-[#1B2333] hover:bg-[#E5C18D]/60 shadow-sm"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? "Arrêter" : "Dicter"}
                  </button>

                  {/* L'indicateur animé "Je vous écoute..." */}
                  {isListening && (
                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-lg animate-in fade-in duration-300">
                      Je vous écoute...
                      <div className="flex items-end gap-[3px] h-4 ml-1">
                        <span className="w-1.5 bg-[#D4AF37] animate-pulse rounded-full h-2"></span>
                        <span
                          className="w-1.5 bg-[#D4AF37] animate-pulse rounded-full h-4"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-1.5 bg-[#D4AF37] animate-pulse rounded-full h-3"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Écrivez ou dictez votre message ici..."
                  className={`w-full min-h-[140px] rounded-xl text-lg border bg-white resize-none outline-none p-4 overflow-hidden transition-all ${
                    isListening
                      ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/20"
                      : "border-gray-200 focus:border-[#1B2333] focus:ring-1 focus:ring-[#1B2333]"
                  }`}
                  maxLength={1000}
                />
                <p className="text-gray-500 text-right text-sm mt-1">{reportText.length}/1000</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!reason || !reportText.trim() || sending}
                className="w-full h-14 rounded-xl text-white text-lg font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all mt-4"
              >
                {sending ? "Envoi sécurisé..." : "Confirmer le signalement"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
