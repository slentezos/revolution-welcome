import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CriteriaEditWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function CriteriaEditWarningModal({
  open,
  onOpenChange,
  onConfirm,
}: CriteriaEditWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-8 sm:p-10">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--gold))]" />
            </div>
            <DialogTitle className="font-heading text-2xl text-foreground">
              Ajustement de vos critères
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
            Modifier ce que vous recherchez va réinitialiser vos propositions de
            rencontres en cours. Notre algorithme aura besoin de 24h pour vous
            chercher de nouveaux profils correspondants.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1 px-8 py-3 text-lg min-h-[48px]"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="sm:order-2 px-8 py-3 text-lg min-h-[48px] bg-primary hover:bg-primary/90"
          >
            J'ai compris, modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
