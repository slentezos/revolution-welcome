import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessCheckmarkProps {
  message: string;
  show: boolean;
  onDone: () => void;
}

export default function SuccessCheckmark({ message, show, onDone }: SuccessCheckmarkProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDone, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 animate-scale-in bg-white px-10 py-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[hsl(var(--gold))]/40">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-[pulse_0.6s_ease-in-out]" />
        <p className="text-lg font-semibold text-[#1B2333]">{message}</p>
      </div>
    </div>
  );
}
