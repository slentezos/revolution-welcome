import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PlayerResultsTable, CoachResultsTable, ClubResultsTable } from "@/components/search/SearchResultsTable";
import { Input } from "@/components/ui/input";
import { mockPlayers, mockCoaches, mockClubs } from "@/data/mockData";
import { Search as SearchIcon, Users, UserCheck, Building2 } from "lucide-react";

const roleTabs = [
  { id: "all", label: "All", icon: SearchIcon },
  { id: "player", label: "Players", icon: Users },
  { id: "coach", label: "Coaches", icon: UserCheck },
  { id: "club", label: "Clubs", icon: Building2 },
];

function toggle(arr: string[], item: string) {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

function SearchContent() {
  const [activeRole, setActiveRole] = useState("all");
  const [query, setQuery] = useState("");

  // Shared
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLeagueTiers, setSelectedLeagueTiers] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  // Player
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedHandedness, setSelectedHandedness] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([16, 45]);
  const [contractRange, setContractRange] = useState([0, 48]);
  const [heightRange, setHeightRange] = useState([150, 220]);
  const [experienceRange, setExperienceRange] = useState([0, 25]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [nationalTeam, setNationalTeam] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [verified, setVerified] = useState(false);

  // Coach
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedLicenseLevels, setSelectedLicenseLevels] = useState<string[]>([]);
  const [selectedPreferredRoles, setSelectedPreferredRoles] = useState<string[]>([]);
  const [selectedCoachFocus, setSelectedCoachFocus] = useState<string[]>([]);
  const [willingToRelocate, setWillingToRelocate] = useState(false);

  // Club
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedRecruiting, setSelectedRecruiting] = useState<string[]>([]);
  const [selectedClubTypes, setSelectedClubTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [providesHousing, setProvidesHousing] = useState(false);
  const [internationalComp, setInternationalComp] = useState(false);

  const filteredPlayers = useMemo(() => {
    if (activeRole !== "all" && activeRole !== "player") return [];
    return mockPlayers.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCountries.length && !selectedCountries.includes(p.country)) return false;
      if (selectedGender.length && !selectedGender.includes(p.gender)) return false;
      if (selectedPositions.length && !selectedPositions.includes(p.position)) return false;
      if (selectedLevels.length && !selectedLevels.includes(p.level)) return false;
      if (selectedLeagueTiers.length && !selectedLeagueTiers.includes(p.leagueTier)) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(p.contractStatus)) return false;
      if (selectedAvailability.length && !selectedAvailability.includes(p.availability)) return false;
      if (selectedHandedness.length && !selectedHandedness.includes(p.handedness)) return false;
      if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
      if (p.height < heightRange[0] || p.height > heightRange[1]) return false;
      if (p.experience < experienceRange[0] || p.experience > experienceRange[1]) return false;
      if (selectedNationalities.length && !selectedNationalities.includes(p.nationality)) return false;
      if (selectedLanguages.length && !p.languages.some(l => selectedLanguages.includes(l))) return false;
      if (nationalTeam && !p.nationalTeam) return false;
      if (hasVideo && !p.hasVideo) return false;
      if (verified && !p.verified) return false;
      return true;
    });
  }, [activeRole, query, selectedCountries, selectedGender, selectedPositions, selectedLevels, selectedLeagueTiers, selectedStatuses, selectedAvailability, selectedHandedness, ageRange, heightRange, experienceRange, selectedNationalities, selectedLanguages, nationalTeam, hasVideo, verified]);

  const filteredCoaches = useMemo(() => {
    if (activeRole !== "all" && activeRole !== "coach") return [];
    return mockCoaches.filter(c => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCountries.length && !selectedCountries.includes(c.country)) return false;
      if (selectedGender.length && !selectedGender.includes(c.gender)) return false;
      if (selectedLevels.length && !selectedLevels.includes(c.level)) return false;
      if (selectedLeagueTiers.length && !selectedLeagueTiers.includes(c.leagueTier)) return false;
      if (selectedAvailability.length && !selectedAvailability.includes(c.availability)) return false;
      if (selectedSpecializations.length && !selectedSpecializations.includes(c.specialization)) return false;
      if (selectedLicenseLevels.length && !selectedLicenseLevels.includes(c.licenseLevel)) return false;
      if (selectedPreferredRoles.length && !selectedPreferredRoles.includes(c.preferredRole)) return false;
      if (selectedCoachFocus.length && !selectedCoachFocus.includes(c.focus)) return false;
      if (willingToRelocate && !c.willingToRelocate) return false;
      return true;
    });
  }, [activeRole, query, selectedCountries, selectedGender, selectedLevels, selectedLeagueTiers, selectedAvailability, selectedSpecializations, selectedLicenseLevels, selectedPreferredRoles, selectedCoachFocus, willingToRelocate]);

  const filteredClubs = useMemo(() => {
    if (activeRole !== "all" && activeRole !== "club") return [];
    return mockClubs.filter(cl => {
      if (query && !cl.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCountries.length && !selectedCountries.includes(cl.country)) return false;
      if (selectedLevels.length && !selectedLevels.includes(cl.level)) return false;
      if (selectedLeagueTiers.length && !selectedLeagueTiers.includes(cl.leagueTier)) return false;
      if (selectedDivisions.length && !selectedDivisions.includes(cl.division)) return false;
      if (selectedRecruiting.length && !selectedRecruiting.includes(cl.recruiting)) return false;
      if (selectedClubTypes.length && !selectedClubTypes.includes(cl.clubType)) return false;
      if (selectedFacilities.length && !selectedFacilities.includes(cl.facilities)) return false;
      if (providesHousing && !cl.providesHousing) return false;
      if (internationalComp && !cl.internationalCompetition) return false;
      return true;
    });
  }, [activeRole, query, selectedCountries, selectedLevels, selectedLeagueTiers, selectedDivisions, selectedRecruiting, selectedClubTypes, selectedFacilities, providesHousing, internationalComp]);

  const total = filteredPlayers.length + filteredCoaches.length + filteredClubs.length;

  return (
    <DashboardLayout>
      <div className="space-y-0">
        {/* Top: Role tabs */}
        <div className="flex items-center gap-1 border-b border-border -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6 bg-card">
          {roleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveRole(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[12px] font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeRole === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for player, coach, or club..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-10 text-sm border-border"
            />
          </div>
          <p className="text-sm text-muted-foreground shrink-0">{total} results</p>
        </div>

        {/* Two-column: Filters + Results */}
        <div className="flex gap-6">
          <SearchFilters
            role={activeRole}
            // Gender
            selectedGender={selectedGender}
            onToggleGender={(g) => setSelectedGender(prev => toggle(prev, g))}
            // Shared
            selectedCountries={selectedCountries}
            onToggleCountry={(c) => setSelectedCountries(prev => toggle(prev, c))}
            selectedLevels={selectedLevels}
            onToggleLevel={(l) => setSelectedLevels(prev => toggle(prev, l))}
            selectedLeagueTiers={selectedLeagueTiers}
            onToggleLeagueTier={(t) => setSelectedLeagueTiers(prev => toggle(prev, t))}
            selectedAvailability={selectedAvailability}
            onToggleAvailability={(a) => setSelectedAvailability(prev => toggle(prev, a))}
            // Player
            selectedPositions={selectedPositions}
            onTogglePosition={(p) => setSelectedPositions(prev => toggle(prev, p))}
            selectedStatuses={selectedStatuses}
            onToggleStatus={(s) => setSelectedStatuses(prev => toggle(prev, s))}
            selectedHandedness={selectedHandedness}
            onToggleHandedness={(h) => setSelectedHandedness(prev => toggle(prev, h))}
            ageRange={ageRange}
            onAgeChange={setAgeRange}
            contractRange={contractRange}
            onContractChange={setContractRange}
            heightRange={heightRange}
            onHeightChange={setHeightRange}
            experienceRange={experienceRange}
            onExperienceChange={setExperienceRange}
            selectedNationalities={selectedNationalities}
            onToggleNationality={(n) => setSelectedNationalities(prev => toggle(prev, n))}
            selectedLanguages={selectedLanguages}
            onToggleLanguage={(l) => setSelectedLanguages(prev => toggle(prev, l))}
            nationalTeam={nationalTeam}
            onToggleNationalTeam={() => setNationalTeam(v => !v)}
            hasVideo={hasVideo}
            onToggleHasVideo={() => setHasVideo(v => !v)}
            verified={verified}
            onToggleVerified={() => setVerified(v => !v)}
            // Coach
            selectedSpecializations={selectedSpecializations}
            onToggleSpecialization={(s) => setSelectedSpecializations(prev => toggle(prev, s))}
            selectedLicenseLevels={selectedLicenseLevels}
            onToggleLicenseLevel={(l) => setSelectedLicenseLevels(prev => toggle(prev, l))}
            selectedPreferredRoles={selectedPreferredRoles}
            onTogglePreferredRole={(r) => setSelectedPreferredRoles(prev => toggle(prev, r))}
            selectedCoachFocus={selectedCoachFocus}
            onToggleCoachFocus={(f) => setSelectedCoachFocus(prev => toggle(prev, f))}
            willingToRelocate={willingToRelocate}
            onToggleRelocate={() => setWillingToRelocate(v => !v)}
            // Club
            selectedDivisions={selectedDivisions}
            onToggleDivision={(d) => setSelectedDivisions(prev => toggle(prev, d))}
            selectedRecruiting={selectedRecruiting}
            onToggleRecruiting={(r) => setSelectedRecruiting(prev => toggle(prev, r))}
            selectedClubTypes={selectedClubTypes}
            onToggleClubType={(t) => setSelectedClubTypes(prev => toggle(prev, t))}
            selectedFacilities={selectedFacilities}
            onToggleFacility={(f) => setSelectedFacilities(prev => toggle(prev, f))}
            providesHousing={providesHousing}
            onToggleHousing={() => setProvidesHousing(v => !v)}
            internationalComp={internationalComp}
            onToggleInternational={() => setInternationalComp(v => !v)}
          />

          <div className="flex-1 min-w-0 overflow-x-auto">
            {filteredPlayers.length > 0 && (
              <div className="mb-6">
                <PlayerResultsTable players={filteredPlayers} />
              </div>
            )}

            {filteredCoaches.length > 0 && (
              <div className="mb-6">
                <CoachResultsTable coaches={filteredCoaches} />
              </div>
            )}

            {filteredClubs.length > 0 && (
              <div className="mb-6">
                <ClubResultsTable clubs={filteredClubs} />
              </div>
            )}

            {total === 0 && (
              <div className="text-center py-16">
                <SearchIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results match your filters</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Search() {
  return (
    <DashboardProvider>
      <SearchContent />
    </DashboardProvider>
  );
}
