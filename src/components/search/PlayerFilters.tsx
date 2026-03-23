import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function PlayerFilters() {
  const { filters, updateFilter } = useDashboard();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Position</Label>
          <Select value={filters.position || "all"} onValueChange={(v) => updateFilter("position", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
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
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Age Range: {filters.ageRange[0]} – {filters.ageRange[1]}</Label>
          <Slider
            min={16} max={45} step={1}
            value={filters.ageRange}
            onValueChange={(v) => updateFilter("ageRange", v as [number, number])}
            className="mt-2"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Contract Status</Label>
          <Select value={filters.contractStatus || "all"} onValueChange={(v) => updateFilter("contractStatus", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Free Agent">Free Agent</SelectItem>
              <SelectItem value="Under Contract">Under Contract</SelectItem>
              <SelectItem value="Expiring">Expiring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Handedness</Label>
          <Select value={filters.handedness || "all"} onValueChange={(v) => updateFilter("handedness", v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Left">Left</SelectItem>
              <SelectItem value="Right">Right</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
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
              <Checkbox id="national-team" />
              <Label htmlFor="national-team" className="text-xs">National Team</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="has-video" />
              <Label htmlFor="has-video" className="text-xs">Has Video</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="text-xs">Verified Profile</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
