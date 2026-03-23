import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ChatTooltipOverlayProps {
  contactName: string;
  show: boolean;
  onDismiss: () => void;
}

export default function ChatTooltipOverlay({ contactName, show, onDismiss }: ChatTooltipOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onDismiss}
    >
      {/* Dim overlay — no blur */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Tooltip pointing to message input area */}
      <div
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[61] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40 px-6 py-5 max-w-md relative">
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-[#1B2333]" />
          </button>
          <p className="text-[#1B2333] text-lg font-medium leading-relaxed pr-6">
            👋 C'est ici que vous pouvez écrire à <span className="font-bold text-[hsl(var(--gold))]">{contactName}</span>.
          </p>
          <p className="text-gray-500 text-base mt-2">
            Tapez votre message puis appuyez sur « Envoyer ».
          </p>
          <button
            onClick={onDismiss}
            className="mt-4 w-full h-12 rounded-xl bg-[#1B2333] text-white font-medium hover:bg-[#1B2333]/90 transition-colors"
          >
            J'ai compris !
          </button>
        </div>
        {/* Arrow pointing down */}
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white mx-auto" />
      </div>
    </div>
  );
}
