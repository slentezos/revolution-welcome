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
      <Label className="text-lg font-medium text-foreground">Date de naissance</Label>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Jour</Label>
          <Input
            placeholder="JJ"
            value={day}
            onChange={(e) => update(e.target.value, month, year)}
            maxLength={2}
            inputMode="numeric"
            className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none text-center"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Mois</Label>
          <Input
            placeholder="MM"
            value={month}
            onChange={(e) => update(day, e.target.value, year)}
            maxLength={2}
            inputMode="numeric"
            className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none text-center"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Année</Label>
          <Input
            placeholder="AAAA"
            value={year}
            onChange={(e) => update(day, month, e.target.value)}
            maxLength={4}
            inputMode="numeric"
            className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none text-center"
          />
        </div>
      </div>
    </div>
  );
}
