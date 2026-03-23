import { useDashboard } from "@/contexts/DashboardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

export function QuickFilters() {
  const { role, filters, updateFilter, resetFilters } = useDashboard();

  const hasActiveFilters = filters.country || filters.level || filters.availability || filters.division;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
      
      <Select value={filters.country || "all"} onValueChange={(v) => updateFilter("country", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[130px] h-8 text-xs border-border bg-card">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          <SelectItem value="Germany">Germany</SelectItem>
          <SelectItem value="France">France</SelectItem>
          <SelectItem value="Spain">Spain</SelectItem>
          <SelectItem value="Denmark">Denmark</SelectItem>
          <SelectItem value="Sweden">Sweden</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.level || "all"} onValueChange={(v) => updateFilter("level", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[120px] h-8 text-xs border-border bg-card">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="Professional">Professional</SelectItem>
          <SelectItem value="Semi-Pro">Semi-Pro</SelectItem>
          <SelectItem value="Amateur">Amateur</SelectItem>
          <SelectItem value="Youth">Youth</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.availability || "all"} onValueChange={(v) => updateFilter("availability", v === "all" ? "" : v)}>
        <SelectTrigger className="w-[140px] h-8 text-xs border-border bg-card">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Actively Looking">Actively Looking</SelectItem>
          <SelectItem value="Open to Offers">Open to Offers</SelectItem>
          <SelectItem value="Not Available">Not Available</SelectItem>
        </SelectContent>
      </Select>

      {role === "player" && (
        <Select value={filters.position || "all"} onValueChange={(v) => updateFilter("position", v === "all" ? "" : v)}>
          <SelectTrigger className="w-[130px] h-8 text-xs border-border bg-card">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
            <SelectItem value="Left Wing">Left Wing</SelectItem>
            <SelectItem value="Right Wing">Right Wing</SelectItem>
            <SelectItem value="Left Back">Left Back</SelectItem>
            <SelectItem value="Center Back">Center Back</SelectItem>
            <SelectItem value="Right Back">Right Back</SelectItem>
            <SelectItem value="Pivot">Pivot</SelectItem>
          </SelectContent>
        </Select>
      )}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive" onClick={resetFilters}>
          <X className="h-3 w-3 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
