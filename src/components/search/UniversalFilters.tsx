import { useDashboard } from "@/contexts/DashboardContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UniversalFilters() {
  const { filters, updateFilter } = useDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Role</Label>
        <Select value={filters.role} onValueChange={(v) => updateFilter("role", v)}>
          <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="player">Players</SelectItem>
            <SelectItem value="coach">Coaches</SelectItem>
            <SelectItem value="club">Clubs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Country</Label>
        <Select value={filters.country || "all"} onValueChange={(v) => updateFilter("country", v === "all" ? "" : v)}>
          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All Countries" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="Europe" className="font-semibold text-primary">🌍 Europe</SelectItem>
            <SelectItem value="Asia" className="font-semibold text-primary">🌏 Asia</SelectItem>
            <SelectItem value="Africa" className="font-semibold text-primary">🌍 Africa</SelectItem>
            <SelectItem value="Americas" className="font-semibold text-primary">🌎 Americas</SelectItem>
            <SelectItem value="Oceania" className="font-semibold text-primary">🌏 Oceania</SelectItem>
            <span className="block px-2 py-1.5 text-xs text-muted-foreground">— Countries —</span>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="Denmark">Denmark</SelectItem>
            <SelectItem value="Sweden">Sweden</SelectItem>
            <SelectItem value="Portugal">Portugal</SelectItem>
            <SelectItem value="Norway">Norway</SelectItem>
            <SelectItem value="Croatia">Croatia</SelectItem>
            <SelectItem value="Hungary">Hungary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">City</Label>
        <Input
          placeholder="Any city"
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Level</Label>
        <Select value={filters.level || "all"} onValueChange={(v) => updateFilter("level", v === "all" ? "" : v)}>
          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All Levels" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Semi-Pro">Semi-Pro</SelectItem>
            <SelectItem value="Amateur">Amateur</SelectItem>
            <SelectItem value="Youth">Youth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Availability</Label>
        <Select value={filters.availability || "all"} onValueChange={(v) => updateFilter("availability", v === "all" ? "" : v)}>
          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Actively Looking">Actively Looking</SelectItem>
            <SelectItem value="Open to Offers">Open to Offers</SelectItem>
            <SelectItem value="Not Available">Not Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Division</Label>
        <Select value={filters.division || "all"} onValueChange={(v) => updateFilter("division", v === "all" ? "" : v)}>
          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All Divisions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            <SelectItem value="Bundesliga">Bundesliga</SelectItem>
            <SelectItem value="Starligue">Starligue</SelectItem>
            <SelectItem value="Liga Asobal">Liga Asobal</SelectItem>
            <SelectItem value="Håndboldligaen">Håndboldligaen</SelectItem>
            <SelectItem value="Handbollsligan">Handbollsligan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
