import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Shared
const countries = [
  "Germany", "France", "Spain", "Denmark", "Sweden", "Norway", "Croatia", "Hungary", "Portugal",
];
const levels = ["Professional", "Semi-Pro", "Amateur", "Youth"];
const leagueTiers = ["1st League", "2nd League", "3rd League", "4th League", "5th League"];
const availabilities = ["Actively Looking", "Open to Offers", "Not Available"];

const genderOptions = ["Male", "Female"];
const positions = [
  "Goalkeeper", "Left Back", "Center Back", "Right Back", "Left Wing", "Right Wing", "Pivot",
];
const contractStatuses = ["Free Agent", "Expiring", "Under Contract"];
const handednessOptions = ["Left", "Right", "Both"];
const nationalities = [
  "German", "French", "Spanish", "Danish", "Swedish", "Norwegian", "Croatian", "Hungarian", "Portuguese", "Serbian", "Slovenian", "Polish", "Romanian", "Icelandic",
];
const languageOptions = ["English", "French", "German", "Spanish", "Danish", "Swedish", "Norwegian", "Croatian", "Hungarian", "Portuguese", "Arabic"];

// Coach-specific
const specializations = ["Defense Systems", "Goalkeeping", "Youth Development", "Attack Systems", "Physical Training"];
const licenseLevels = ["EHF Master Coach", "EHF Pro License", "National License"];
const preferredRoles = ["Head Coach", "Assistant Coach", "Goalkeeper Coach"];
const coachFocus = ["Youth", "Senior", "Both"];

// Club-specific
const divisions = ["Bundesliga", "Starligue", "Liga Asobal", "Håndboldligaen"];
const recruitingOptions = ["Players", "Coaches", "Both", "None"];
const clubTypes = ["Professional", "Semi-Pro", "Amateur", "Academy"];
const facilities = ["Basic", "Standard", "Premium", "Elite"];

interface SearchFiltersProps {
  role: string;
  selectedGender: string[];
  onToggleGender: (g: string) => void;
  selectedPositions: string[];
  onTogglePosition: (pos: string) => void;
  selectedCountries: string[];
  onToggleCountry: (c: string) => void;
  selectedLevels: string[];
  onToggleLevel: (l: string) => void;
  selectedLeagueTiers: string[];
  onToggleLeagueTier: (t: string) => void;
  selectedStatuses: string[];
  onToggleStatus: (s: string) => void;
  selectedAvailability: string[];
  onToggleAvailability: (a: string) => void;
  ageRange: number[];
  onAgeChange: (v: number[]) => void;
  contractRange: number[];
  onContractChange: (v: number[]) => void;
  // Coach-specific
  selectedSpecializations: string[];
  onToggleSpecialization: (s: string) => void;
  selectedLicenseLevels: string[];
  onToggleLicenseLevel: (l: string) => void;
  selectedPreferredRoles: string[];
  onTogglePreferredRole: (r: string) => void;
  selectedHandedness: string[];
  onToggleHandedness: (h: string) => void;
  heightRange: number[];
  onHeightChange: (v: number[]) => void;
  experienceRange: number[];
  onExperienceChange: (v: number[]) => void;
  selectedNationalities: string[];
  onToggleNationality: (n: string) => void;
  selectedLanguages: string[];
  onToggleLanguage: (l: string) => void;
  selectedCoachFocus: string[];
  onToggleCoachFocus: (f: string) => void;
  willingToRelocate: boolean;
  onToggleRelocate: () => void;
  // Club-specific
  selectedDivisions: string[];
  onToggleDivision: (d: string) => void;
  selectedRecruiting: string[];
  onToggleRecruiting: (r: string) => void;
  selectedClubTypes: string[];
  onToggleClubType: (t: string) => void;
  selectedFacilities: string[];
  onToggleFacility: (f: string) => void;
  providesHousing: boolean;
  onToggleHousing: () => void;
  internationalComp: boolean;
  onToggleInternational: () => void;
  // Player extras
  nationalTeam: boolean;
  onToggleNationalTeam: () => void;
  hasVideo: boolean;
  onToggleHasVideo: () => void;
  verified: boolean;
  onToggleVerified: () => void;
}

function CheckboxGroup({ title, items, selected, onToggle }: {
  title: string; items: string[]; selected: string[]; onToggle: (v: string) => void;
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
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
              className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[13px] text-foreground group-hover:text-primary transition-colors">{item}</span>
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

export function SearchFilters(props: SearchFiltersProps) {
  const { role } = props;
  const showPlayer = role === "all" || role === "player";
  const showCoach = role === "all" || role === "coach";
  const showClub = role === "all" || role === "club";

  return (
    <div className="w-[200px] shrink-0 space-y-5 pr-2">
      {/* ── Shared: Gender ── */}
      {(showPlayer || showCoach) && (
        <>
          <CheckboxGroup title="Gender" items={genderOptions} selected={props.selectedGender} onToggle={props.onToggleGender} />
          <Separator />
        </>
      )}

      {/* ── Shared: Country ── */}
      <CheckboxGroup title="Country" items={countries} selected={props.selectedCountries} onToggle={props.onToggleCountry} />
      <Separator />

      {/* ── Shared: Level ── */}
      <CheckboxGroup title="Level" items={levels} selected={props.selectedLevels} onToggle={props.onToggleLevel} />
      <Separator />

      {/* ── Shared: League Tier ── */}
      <CheckboxGroup title="League" items={leagueTiers} selected={props.selectedLeagueTiers} onToggle={props.onToggleLeagueTier} />
      <Separator />

      {/* ── Shared: Availability ── */}
      {(showPlayer || showCoach) && (
        <>
          <CheckboxGroup title="Availability" items={availabilities} selected={props.selectedAvailability} onToggle={props.onToggleAvailability} />
          <Separator />
        </>
      )}

      {/* ══════ PLAYER-SPECIFIC ══════ */}
      {showPlayer && (
        <>
          <CheckboxGroup title="Position" items={positions} selected={props.selectedPositions} onToggle={props.onTogglePosition} />
          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Age</h3>
              <button onClick={() => props.onAgeChange([16, 45])} className="text-[11px] text-primary hover:underline">Clear</button>
            </div>
            <p className="text-sm text-foreground mb-2.5">{props.ageRange[0]}–{props.ageRange[1]}</p>
            <Slider min={16} max={45} step={1} value={props.ageRange} onValueChange={props.onAgeChange} />
          </div>
          <Separator />

          <CheckboxGroup title="Contract" items={contractStatuses} selected={props.selectedStatuses} onToggle={props.onToggleStatus} />
          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Contract expiry</h3>
              <button onClick={() => props.onContractChange([0, 48])} className="text-[11px] text-primary hover:underline">Clear</button>
            </div>
            <p className="text-sm text-foreground mb-2.5">{props.contractRange[0]}–{props.contractRange[1]}mo</p>
            <Slider min={0} max={48} step={1} value={props.contractRange} onValueChange={props.onContractChange} />
          </div>
          <Separator />

          <CheckboxGroup title="Handedness" items={handednessOptions} selected={props.selectedHandedness} onToggle={props.onToggleHandedness} />
          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Height (cm)</h3>
              <button onClick={() => props.onHeightChange([150, 220])} className="text-[11px] text-primary hover:underline">Clear</button>
            </div>
            <p className="text-sm text-foreground mb-2.5">{props.heightRange[0]}–{props.heightRange[1]}</p>
            <Slider min={150} max={220} step={1} value={props.heightRange} onValueChange={props.onHeightChange} />
          </div>
          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Experience (yrs)</h3>
              <button onClick={() => props.onExperienceChange([0, 25])} className="text-[11px] text-primary hover:underline">Clear</button>
            </div>
            <p className="text-sm text-foreground mb-2.5">{props.experienceRange[0]}–{props.experienceRange[1]}</p>
            <Slider min={0} max={25} step={1} value={props.experienceRange} onValueChange={props.onExperienceChange} />
          </div>
          <Separator />

          <CheckboxGroup title="Nationality" items={nationalities} selected={props.selectedNationalities} onToggle={props.onToggleNationality} />
          <Separator />

          <CheckboxGroup title="Languages" items={languageOptions} selected={props.selectedLanguages} onToggle={props.onToggleLanguage} />
          <Separator />

          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">More</h3>
            <div className="space-y-1.5">
              <BooleanFilter label="National Team Experience" checked={props.nationalTeam} onToggle={props.onToggleNationalTeam} id="national-team" />
              <BooleanFilter label="Has Video" checked={props.hasVideo} onToggle={props.onToggleHasVideo} id="has-video" />
              <BooleanFilter label="Verified" checked={props.verified} onToggle={props.onToggleVerified} id="verified" />
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* ══════ COACH-SPECIFIC ══════ */}
      {showCoach && (
        <>
          <CheckboxGroup title="Specialization" items={specializations} selected={props.selectedSpecializations} onToggle={props.onToggleSpecialization} />
          <Separator />

          <CheckboxGroup title="License Level" items={licenseLevels} selected={props.selectedLicenseLevels} onToggle={props.onToggleLicenseLevel} />
          <Separator />

          <CheckboxGroup title="Preferred Role" items={preferredRoles} selected={props.selectedPreferredRoles} onToggle={props.onTogglePreferredRole} />
          <Separator />

          <CheckboxGroup title="Focus" items={coachFocus} selected={props.selectedCoachFocus} onToggle={props.onToggleCoachFocus} />
          <Separator />

          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">More</h3>
            <div className="space-y-1.5">
              <BooleanFilter label="Willing to Relocate" checked={props.willingToRelocate} onToggle={props.onToggleRelocate} id="relocate" />
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* ══════ CLUB-SPECIFIC ══════ */}
      {showClub && (
        <>
          <CheckboxGroup title="Division" items={divisions} selected={props.selectedDivisions} onToggle={props.onToggleDivision} />
          <Separator />

          <CheckboxGroup title="Recruiting" items={recruitingOptions} selected={props.selectedRecruiting} onToggle={props.onToggleRecruiting} />
          <Separator />

          <CheckboxGroup title="Club Type" items={clubTypes} selected={props.selectedClubTypes} onToggle={props.onToggleClubType} />
          <Separator />

          <CheckboxGroup title="Facilities" items={facilities} selected={props.selectedFacilities} onToggle={props.onToggleFacility} />
          <Separator />

          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">More</h3>
            <div className="space-y-1.5">
              <BooleanFilter label="Provides Housing" checked={props.providesHousing} onToggle={props.onToggleHousing} id="housing" />
              <BooleanFilter label="International Comp." checked={props.internationalComp} onToggle={props.onToggleInternational} id="international" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
