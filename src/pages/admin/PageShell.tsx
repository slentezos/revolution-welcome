import type { ReactNode } from "react";

export function PageShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy mb-6">{title}</h1>
      <div className="border-2 border-dashed border-gray-300 h-[60vh] rounded-xl flex items-center justify-center text-muted-foreground bg-white/50">
        {children ?? "Content area"}
      </div>
    </div>
  );
}
