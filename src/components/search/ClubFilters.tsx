import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function ClubFilters() {
  const { filters, updateFilter } = useDashboard();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Division</Label>
          <Select value={filters.division || "all"} onValueChange={(v) => updateFilter("division", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Bundesliga">Bundesliga</SelectItem>
              <SelectItem value="Starligue">Starligue</SelectItem>
              <SelectItem value="Liga Asobal">Liga Asobal</SelectItem>
              <SelectItem value="Håndboldligaen">Håndboldligaen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Recruiting</Label>
          <Select value={filters.recruiting || "all"} onValueChange={(v) => updateFilter("recruiting", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Players">Players</SelectItem>
              <SelectItem value="Coaches">Coaches</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Club Type</Label>
          <Select value={filters.clubType || "all"} onValueChange={(v) => updateFilter("clubType", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Semi-Pro">Semi-Pro</SelectItem>
              <SelectItem value="Amateur">Amateur</SelectItem>
              <SelectItem value="Academy">Academy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Country</Label>
          <Select value={filters.country || "all"} onValueChange={(v) => updateFilter("country", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Denmark">Denmark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${open ? "rotate-180" : ""}`} />
            {open ? "Less Filters" : "More Filters"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Roster Size (min)</Label>
              <Select value={filters.rosterSizeMin || "all"} onValueChange={(v) => updateFilter("rosterSizeMin" as any, v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                  <SelectItem value="15">15+</SelectItem>
                  <SelectItem value="20">20+</SelectItem>
                  <SelectItem value="25">25+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Facilities</Label>
              <Select value={filters.facilities || "all"} onValueChange={(v) => updateFilter("facilities" as any, v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="housing" />
              <Label htmlFor="housing" className="text-xs">Provides Housing</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="international" />
              <Label htmlFor="international" className="text-xs">International Competition</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
