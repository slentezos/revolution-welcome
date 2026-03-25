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

  // États pour l'auto-expand et la dictée
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const originalTextRef = useRef<string>("");

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
    if (isListening) toggleDictation(); // Coupe le micro si on ferme
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!reason || !reportText.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(`Votre signalement concernant ${name} a bien été envoyé.`);
    handleClose();
  };

  const handleUnmatchInstead = () => {
    handleClose();
    onUnmatchInstead();
  };

  // Logique de dictée vocale "No BS"
  const toggleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Votre navigateur ne supporte pas la dictée vocale.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Sauvegarde du texte déjà écrit avant de commencer à parler
    originalTextRef.current = reportText;

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      // On combine proprement l'ancien texte avec ce qui est dicté
      setReportText((originalTextRef.current + " " + transcript).trim());
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
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
                if (isListening) toggleDictation();
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

            <div className="space-y-5 pt-2">
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

              <div className="space-y-2">
                <Label className="text-lg font-medium text-[#1B2333]">Détails supplémentaires</Label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Écrivez ou dictez votre message ici..."
                    className="w-full min-h-[140px] rounded-xl text-base border border-gray-200 bg-gray-50/80 resize-none outline-none focus:ring-2 focus:ring-[#1B2333] p-4 pb-14 overflow-hidden transition-all"
                    maxLength={1000}
                  />

                  {/* Bouton de dictée flottant en bas à droite */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={toggleDictation}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm border ${
                        isListening
                          ? "bg-red-50 border-red-200 text-red-500 animate-pulse"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                      }`}
                      title={isListening ? "Arrêter la dictée" : "Dicter vocalement"}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-right text-sm mt-1">{reportText.length}/1000</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!reason || !reportText.trim() || sending}
                className="w-full h-14 rounded-xl text-white text-lg font-medium bg-[#1B2333] hover:bg-[#1B2333]/90 transition-all"
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
