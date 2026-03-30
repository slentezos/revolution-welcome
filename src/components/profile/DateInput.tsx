import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value: string; // Format: "YYYY-MM-DD"
  onChange: (value: string) => void;
  className?: string;
}

export default function DateInput({ value, onChange, className }: DateInputProps) {
  // Découpage de la date "YYYY-MM-DD"
  const parts = value ? value.split("-") : ["", "", ""];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = parts[2] || "";

  // Mise à jour de la date formatée
  const update = (d: string, m: string, y: string) => {
    const newDate = `${y || "0000"}-${m || "00"}-${d || "00"}`;
    onChange(newDate);
  };

  // Données pour les listes
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  // MOIS EN FRANÇAIS
  const months = [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  // Plage 60+ : 1940 à 1966
  const years = Array.from({ length: 1966 - 1940 + 1 }, (_, i) => String(1966 - i));

  return (
    <div className={cn("space-y-4 w-full text-left", className)}>
      <Label className="text-xl font-medium text-[#1B2333] block mb-3">Date de naissance</Label>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* --- JOUR --- */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground ml-1">Jour</Label>
          <Select value={day} onValueChange={(v) => update(v, month, year)}>
            <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
              <SelectValue placeholder="JJ" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-xl border-[#E5E0D8]">
              {days.map((d) => (
                <SelectItem key={d} value={d} className="text-lg py-3">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- MOIS (NOMS EN FRANÇAIS) --- */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground ml-1">Mois</Label>
          <Select value={month} onValueChange={(v) => update(day, v, year)}>
            <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-xl border-[#E5E0D8]">
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value} className="text-lg py-3">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- ANNÉE --- */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground ml-1">Année</Label>
          <Select value={year} onValueChange={(v) => update(day, month, v)}>
            <SelectTrigger className="h-14 text-lg rounded-xl border-[#E5E0D8] bg-white shadow-none focus:ring-0 focus:border-[hsl(var(--gold))] transition-colors">
              <SelectValue placeholder="AAAA" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-xl border-[#E5E0D8]">
              {years.map((y) => (
                <SelectItem key={y} value={y} className="text-lg py-3">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
