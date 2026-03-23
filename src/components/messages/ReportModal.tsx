import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, UserX, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onUnmatchInstead: () => void;
}

export default function ReportModal({ open, onOpenChange, name, onUnmatchInstead }: ReportModalProps) {
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [reportText, setReportText] = useState("");
  const [sending, setSending] = useState(false);

  const handleClose = () => {
    setStep("intro");
    setReportText("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!reportText.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(`Votre signalement concernant ${name} a bien été envoyé. Merci pour votre vigilance.`);
    handleClose();
  };

  const handleUnmatchInstead = () => {
    handleClose();
    onUnmatchInstead();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {if (!o) handleClose();}}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {step === "intro" ?
        <div className="px-6 sm:px-8 py-8 space-y-6">
            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Flag className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading font-bold text-[#1B2333] text-4xl">
              Signaler {name}
            </h2>
            <p className="text-center text-foreground mb-6 text-xl">
              Dites-nous si quelqu'un a enfreint nos règles de bienveillance.
              Cette personne ne saura pas que vous l'avez signalée, ni pourquoi.
            </p>

            <div className="space-y-3">
              {[
            "Dites-nous ce qu'il s'est passé",
            "Nous examinerons votre signalement",
            "Nous vous tiendrons informé(e)"].
            map((text, i) =>
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-[#1B2333] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-foreground font-medium text-xl">{text}</p>
                </div>
            )}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <UserX className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#1B2333] font-medium text-xl">
                  Pas d'infraction aux règles ?
                </p>
                <button
                onClick={handleUnmatchInstead}
                className="text-[hsl(var(--gold))] font-medium hover:underline underline-offset-4 text-xl">
                  Retirer le match à la place
                </button>
              </div>
            </div>

            <Button
            onClick={() => setStep("form")}
            className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90">
              Commencer le signalement
            </Button>

            <button
            onClick={handleUnmatchInstead}
            className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] font-medium text-xl bg-white border-destructive border">
              Retirer le match à la place
            </button>
          </div> :

        <div className="px-6 sm:px-8 py-8 space-y-5">
            <button
            onClick={() => setStep("intro")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1B2333] transition-colors text-xl">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Flag className="h-6 w-6" />
            </div>

            <h2 className="text-center font-heading font-bold text-[#1B2333] text-3xl">
              Que s'est-il passé ?
            </h2>
            <p className="text-center text-foreground mb-6 text-xl">
              Décrivez la situation en détail. Votre signalement restera confidentiel.
            </p>

            <Textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Décrivez ce qui vous a gêné ou inquiété..."
            className="min-h-[160px] rounded-xl text-base border-gray-200 bg-gray-50/80 resize-none"
            maxLength={1000} />
          
            <p className="text-gray-500 text-right text-sm">{reportText.length}/1000</p>

            <Button
            onClick={handleSubmit}
            disabled={!reportText.trim() || sending}
            className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90">
              {sending ? "Envoi en cours..." : "Envoyer le signalement"}
            </Button>
          </div>
        }
      </DialogContent>
    </Dialog>);
}