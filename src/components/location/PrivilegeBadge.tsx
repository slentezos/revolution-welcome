import { Gift } from "lucide-react";

interface PrivilegeBadgeProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function PrivilegeBadge({ className = "", variant = "light" }: PrivilegeBadgeProps) {
  const isDark = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${
    isDark ?
    "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" :
    "border-[hsl(var(--gold)/0.3)] bg-accent text-foreground"} ${
    className}`}>
      <Gift className={`h-4 w-4 ${isDark ? "text-primary-foreground/70" : "text-[hsl(var(--gold))]"}`} />
      <span className="font-medium tracking-wide text-2xl">3 mois offerts</span>
    </div>);

}