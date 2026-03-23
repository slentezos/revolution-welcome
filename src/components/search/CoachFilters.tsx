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

export function CoachFilters() {
  const { filters, updateFilter } = useDashboard();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Specialization</Label>
          <Select value={filters.specialization || "all"} onValueChange={(v) => updateFilter("specialization", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Defense Systems">Defense Systems</SelectItem>
              <SelectItem value="Goalkeeping">Goalkeeping</SelectItem>
              <SelectItem value="Youth Development">Youth Development</SelectItem>
              <SelectItem value="Attack Systems">Attack Systems</SelectItem>
              <SelectItem value="Physical Training">Physical Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Experience</Label>
          <Select value={filters.experience || "all"} onValueChange={(v) => updateFilter("experience", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="0-5">0–5 years</SelectItem>
              <SelectItem value="5-10">5–10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">License Level</Label>
          <Select value={filters.licenseLevel || "all"} onValueChange={(v) => updateFilter("licenseLevel", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="EHF Master Coach">EHF Master Coach</SelectItem>
              <SelectItem value="EHF Pro License">EHF Pro License</SelectItem>
              <SelectItem value="National License">National License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Preferred Role</Label>
          <Select value={filters.preferredRole || "all"} onValueChange={(v) => updateFilter("preferredRole", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Head Coach">Head Coach</SelectItem>
              <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
              <SelectItem value="Goalkeeper Coach">Goalkeeper Coach</SelectItem>
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
        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="relocate" />
              <Label htmlFor="relocate" className="text-xs">Willing to Relocate</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="youth-focus" />
              <Label htmlFor="youth-focus" className="text-xs">Youth Focus</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
