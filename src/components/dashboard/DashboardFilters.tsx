import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface FilterCategory {
  id: string;
  label: string;
  count: number;
}

const squadCategories: FilterCategory[] = [
  { id: "all", label: "All Players", count: 15 },
  { id: "first-team", label: "First Team", count: 7 },
  { id: "u23", label: "U23", count: 4 },
  { id: "u21", label: "U21", count: 3 },
  { id: "free-agent", label: "Free Agents", count: 7 },
];

const positions = [
  "Goalkeeper", "Left Back", "Center Back", "Right Back", "Left Wing", "Right Wing", "Pivot",
];

export function DashboardFilters() {
  const [selectedSquad, setSelectedSquad] = useState("all");
  const [ageRange, setAgeRange] = useState([18, 44]);
  const [contractRange, setContractRange] = useState([0, 36]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const togglePosition = (pos: string) => {
    setSelectedPositions(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  return (
    <div className="w-[190px] shrink-0 space-y-5 pr-2">
      {/* Squad */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-2">Squad</h3>
        <div className="space-y-0.5">
          {squadCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedSquad(cat.id)}
              className={`flex items-center gap-2 w-full text-left px-1 py-1 rounded text-[13px] transition-colors ${
                selectedSquad === cat.id
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                selectedSquad === cat.id ? "bg-primary" : "bg-transparent border border-border"
              }`} />
              <span className="flex-1">{cat.label}</span>
              <span className="text-xs text-muted-foreground">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Age */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Age</h3>
          <button
            onClick={() => setAgeRange([18, 44])}
            className="text-[11px] text-primary hover:underline"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-foreground mb-2.5">{ageRange[0]}–{ageRange[1]}</p>
        <Slider
          min={16}
          max={45}
          step={1}
          value={ageRange}
          onValueChange={setAgeRange}
        />
      </div>

      <Separator />

      {/* Contract expiry */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Contract expiry</h3>
          <button
            onClick={() => setContractRange([0, 36])}
            className="text-[11px] text-primary hover:underline"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-foreground mb-2.5">{contractRange[0]}–{contractRange[1]}mo</p>
        <Slider
          min={0}
          max={48}
          step={1}
          value={contractRange}
          onValueChange={setContractRange}
        />
      </div>

      <Separator />

      {/* Position */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Position</h3>
          {selectedPositions.length > 0 && (
            <button
              onClick={() => setSelectedPositions([])}
              className="text-[11px] text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {positions.map(pos => (
            <label key={pos} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={selectedPositions.includes(pos)}
                onCheckedChange={() => togglePosition(pos)}
                className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-[13px] text-foreground group-hover:text-primary transition-colors">
                {pos}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
