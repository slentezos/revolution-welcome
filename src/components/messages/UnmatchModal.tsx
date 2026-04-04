import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeOff, VolumeX, Flag } from "lucide-react";

interface UnmatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onConfirmUnmatch: () => void;
  onReportInstead: () => void;
}

export default function UnmatchModal({ open, onOpenChange, name, onConfirmUnmatch, onReportInstead }: UnmatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="px-6 sm:px-8 pt-8 pb-6 space-y-6">
          {/* Centered icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <EyeOff className="h-6 w-6" />
          </div>

          <h2 className="text-center font-heading text-2xl font-bold text-[#1B2333]">
            Retirer {name}
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <EyeOff className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
              <p className="text-foreground text-base">Vous ne vous verrez plus</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
              <VolumeX className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
              <p className="text-foreground text-base">Cette personne ne pourra plus vous écrire</p>
            </div>
          </div>

          <button
            onClick={() => {
              onOpenChange(false);
              onReportInstead();
            }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left w-full hover:bg-gray-100/80 transition-colors">
            <Flag className="h-5 w-5 text-[#1B2333] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1B2333] text-base">Un comportement inapproprié</p>
              <p className="text-gray-500 text-lg">Signalez-le à notre équipe</p>
            </div>
          </button>

          <Button
            onClick={() => {
              onOpenChange(false);
              onConfirmUnmatch();
            }}
            className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90">
            Retirer le match
          </Button>

          <button
            onClick={() => {
              onOpenChange(false);
              onReportInstead();
            }}
            className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] hover:bg-gray-50 font-medium">
            Signaler plutôt
          </button>
        </div>
      </DialogContent>
    </Dialog>);
}
