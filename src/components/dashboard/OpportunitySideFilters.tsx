import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { allPositions, allCountries, allLevels, allDivisions } from "@/data/opportunitiesData";

interface Props {
  selectedPositions: string[];
  onTogglePosition: (p: string) => void;
  selectedCountries: string[];
  onToggleCountry: (c: string) => void;
  selectedLevels: string[];
  onToggleLevel: (l: string) => void;
  selectedDivisions: string[];
  onToggleDivision: (d: string) => void;
  selectedTypes: string[];
  onToggleType: (t: string) => void;
  urgentOnly: boolean;
  onToggleUrgent: () => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  housingOnly: boolean;
  onToggleHousing: () => void;
}

const types = [
  { value: "recruitment", label: "Recruitment" },
  { value: "trial", label: "Trial" },
  { value: "camp", label: "Camp" },
  { value: "interest", label: "Interest" },
];

function CheckboxGroup({ title, items, selected, onToggle }: {
  title: string; items: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {selected.length > 0 && (
          <button onClick={() => selected.forEach(s => onToggle(s))} className="text-[11px] text-primary hover:underline">Clear</button>
        )}
      </div>
      <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
        {items.map(item => (
          <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={selected.includes(item.value)}
              onCheckedChange={() => onToggle(item.value)}
              className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[13px] text-foreground group-hover:text-primary transition-colors">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BooleanFilter({ label, checked, onToggle, id }: {
  label: string; checked: boolean; onToggle: () => void; id: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onToggle}
        className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span className="text-[13px] text-foreground group-hover:text-primary transition-colors">{label}</span>
    </label>
  );
}

export function OpportunitySideFilters(props: Props) {
  const positionItems = allPositions.map(p => ({ value: p, label: p }));
  const countryItems = allCountries.map(c => ({ value: c, label: c }));
  const levelItems = allLevels.map(l => ({ value: l, label: l }));
  const divisionItems = allDivisions.map(d => ({ value: d, label: d }));

  return (
    <div className="w-[200px] shrink-0 space-y-5 pr-2 hidden lg:block">
      <CheckboxGroup title="Type" items={types} selected={props.selectedTypes} onToggle={props.onToggleType} />
      <Separator />

      <CheckboxGroup title="Position" items={positionItems} selected={props.selectedPositions} onToggle={props.onTogglePosition} />
      <Separator />

      <CheckboxGroup title="Country" items={countryItems} selected={props.selectedCountries} onToggle={props.onToggleCountry} />
      <Separator />

      <CheckboxGroup title="Level" items={levelItems} selected={props.selectedLevels} onToggle={props.onToggleLevel} />
      <Separator />

      <CheckboxGroup title="Division" items={divisionItems} selected={props.selectedDivisions} onToggle={props.onToggleDivision} />
      <Separator />

      <div>
        <h3 className="text-sm font-bold text-foreground mb-2">More</h3>
        <div className="space-y-1.5">
          <BooleanFilter label="🔥 Urgent only" checked={props.urgentOnly} onToggle={props.onToggleUrgent} id="urgent" />
          <BooleanFilter label="✓ Verified clubs" checked={props.verifiedOnly} onToggle={props.onToggleVerified} id="verified" />
          <BooleanFilter label="🏠 Provides housing" checked={props.housingOnly} onToggle={props.onToggleHousing} id="housing" />
        </div>
      </div>
    </div>
  );
}
