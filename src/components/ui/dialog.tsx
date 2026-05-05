import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Video, Calendar, Sparkles } from "lucide-react";

interface PhotoExpertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function PhotoExpertDialog({ open, onOpenChange, onConfirm }: PhotoExpertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* En-tête avec bannière subtile */}
        <div className="h-3 w-full bg-[hsl(var(--gold))]" />

        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-[hsl(var(--gold))]" />
            <span className="text-[hsl(var(--gold))] font-semibold tracking-wider uppercase text-sm">
              Nouveau Service Kalimera
            </span>
          </div>
          <DialogTitle>Votre voix, votre regard, votre présence… tout commence par là.</DialogTitle>
        </DialogHeader>

        <div className="px-8 space-y-6">
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Quelques secondes suffisent pour créer un premier lien : une intonation, un sourire, une façon d’être.
            Inutile de jouer un rôle — soyez simplement vous-même. Offrez une image sincère, naturelle et vivante, qui
            laisse entrevoir votre personnalité.
          </p>

          <div className="bg-[#1B2333]/5 rounded-2xl p-6 border border-[#1B2333]/10">
            <h4 className="font-heading text-[#1B2333] text-xl font-bold mb-4">
              Un expert vous guide en direct pour réaliser vos photos et votre vidéo :
            </h4>
            <ul className="space-y-3">
              {[
                "Conseils clairs et mise en confiance",
                "Réglages techniques optimisés",
                "Contrôle immédiat du résultat final",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))] shrink-0" />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-gray-600 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <Video className="h-6 w-6 text-[#1B2333]" />
              </div>
              <span className="text-lg font-medium">Via Google Meet</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-[#1B2333]" />
              </div>
              <span className="text-lg font-medium">1 heure d'accompagnement</span>
            </div>
          </div>

          <p className="text-lg text-gray-500 italic">* Aucun accès à votre ordinateur n'est requis de notre part.</p>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-[#1B2333]">35 €</span>
            <span className="text-sm text-gray-500 font-medium">Offre de lancement (puis 70€ au 01/10/2026)</span>
          </div>
          <Button
            onClick={onConfirm}
            className="min-h-[56px] w-full sm:w-auto px-8 rounded-xl bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-xl font-semibold shadow-md transition-all"
          >
            Réserver ma séance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
