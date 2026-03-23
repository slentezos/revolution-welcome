import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X, Clock, ShieldCheck, MessageCircle, CalendarClock } from "lucide-react";

type ActionType = "accept" | "refuse" | "later";

interface MatchActionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ActionType;
  matchName: string;
  onConfirm: () => void;
}

const actionConfig: Record<
  ActionType,
  {
    title: string;
    icon: typeof Heart;
    iconColor: string;
    rules: { icon: typeof Heart; text: string }[];
    confirmLabel: string;
    confirmClass: string;
  }
> = {
  accept: {
    title: "Accepter ce match",
    icon: Heart,
    iconColor: "text-[hsl(var(--gold))]",
    rules: [
      {
        icon: MessageCircle,
        text: "Vous serez informé par email dès que l'autre personne aura accepté cette proposition de rencontre.",
      },
      {
        icon: ShieldCheck,
        text: "A partir de ce moment là, vous aurez la possibilité d'échanger directement entre vous.",
      },
      { icon: CalendarClock, text: "Restez respectueux et bienveillant dans vos échanges." },
    ],
    confirmLabel: "Oui, accepter",
    confirmClass: "w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90",
  },
  refuse: {
    title: "Refuser cette opportunité de rencontre",
    icon: X,
    iconColor: "text-red-600",
    rules: [
      { icon: ShieldCheck, text: "Cette personne ne sera plus en mesure de vous contacter." },
      { icon: X, text: "Vous ne la verrez plus dans vos suggestions de rencontre." },
      { icon: Heart, text: "D'autres possibilités de rencontres vous seront proposées prochainement." },
    ],
    confirmLabel: "Oui, refuser",
    confirmClass: "w-full h-12 rounded-xl text-white font-medium bg-red-600 hover:bg-red-700",
  },
  later: {
    title: "Décider plus tard",
    icon: Clock,
    iconColor: "text-[hsl(var(--gold))]",
    rules: [
      { icon: CalendarClock, text: "Ce profil restera accessible pendant 6 jours." },
      { icon: Heart, text: "Prenez le temps de bien consulter son profil." },
      {
        icon: ShieldCheck,
        text: "Passé ce délai, la proposition de rencontre expirera automatiquement et vous serez pénalisé pour manque de courtoisie.",
      },
    ],
    confirmLabel: "D'accord, plus tard",
    confirmClass: "w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90",
  },
};

export default function MatchActionConfirmDialog({
  open,
  onOpenChange,
  action,
  matchName,
  onConfirm,
}: MatchActionConfirmDialogProps) {
  const config = actionConfig[action];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="px-6 sm:px-8 pt-8 pb-6 space-y-6">
          {/* Centered icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>

          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1B2333]">{config.title}</h2>
            <p className="text-foreground text-base mt-1">
              Concernant <span className="font-semibold text-[#1B2333]">{matchName}</span>
            </p>
          </div>

          {/* Rules as list items */}
          <div className="space-y-3">
            {config.rules.map((rule, idx) => {
              const RuleIcon = rule.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
                  <RuleIcon className="h-5 w-5 text-[#1B2333] mt-0.5 shrink-0" />
                  <p className="text-foreground text-[15px] leading-relaxed">{rule.text}</p>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
              className={config.confirmClass}
            >
              {config.confirmLabel}
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] hover:bg-gray-50 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
