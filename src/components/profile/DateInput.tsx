import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateInputProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const parts = value ? value.split("-") : ["", "", ""];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = parts[2] || "";

  const update = (d: string, m: string, y: string) => {
    const dd = d.replace(/\D/g, "").slice(0, 2);
    const mm = m.replace(/\D/g, "").slice(0, 2);
    const yy = y.replace(/\D/g, "").slice(0, 4);
    onChange(yy || mm || dd ? `${yy}-${mm}-${dd}` : "");
  };

  return (
  <div className="space-y-3">
  <Label className="text-xl font-medium text-[#1B2333]">Date de naissance</Label>
  
  <div className="grid grid-cols-3 gap-4">
    {/* --- JOUR --- */}
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground ml-1">Jour</Label>
      <Select value={day} onValueChange={(v) => update(v, month, year)}>
        <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
          <SelectValue placeholder="JJ" />
        </SelectTrigger>
        <SelectContent className="max-h-[250px]">
          {Array.from({ length: 31 }, (_, i) => {
            const d = String(i + 1).padStart(2, "0");
            return <SelectItem key={d} value={d}>{d}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>

    {/* --- MOIS --- */}
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground ml-1">Mois</Label>
      <Select value={month} onValueChange={(v) => update(day, v, year)}>
        <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="max-h-[250px]">
          {Array.from({ length: 12 }, (_, i) => {
            const m = String(i + 1).padStart(2, "0");
            return <SelectItem key={m} value={m}>{m}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>

    {/* --- ANNÉE --- */}
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground ml-1">Année</Label>
      <Select value={year} onValueChange={(v) => update(day, month, v)}>
        <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
          <SelectValue placeholder="AAAA" />
        </SelectTrigger>
        <SelectContent className="max-h-[250px]">
          {/* Génère les années de 1966 vers 1940 (ordre décroissant pour plus de rapidité) */}
          {Array.from({ length: 1966 - 1940 + 1 }, (_, i) => {
            const y = String(1966 - i);
            return <SelectItem key={y} value={y}>{y}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>
</div>
      </div>
    </div>
  );
}