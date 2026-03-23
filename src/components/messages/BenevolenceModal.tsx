import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface BenevolenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BenevolenceModal({ open, onOpenChange }: BenevolenceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[24px] p-0 overflow-hidden duration-500">
        <div className="bg-[hsl(var(--navy))] px-6 py-5 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[hsl(var(--gold-light))]" />
          <h2 className="font-heading text-xl font-semibold text-white">Charte de bienveillance</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          <p className="text-foreground text-base leading-relaxed">
            Il semblerait que votre message contienne des termes ne correspondant pas tout à fait à notre charte de bienveillance. Souhaitez-vous le reformuler pour garantir une communication sereine ?
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/50">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-xl bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy))]/90 text-white font-medium">
            Je vais le reformuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
