import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { allPositions, allCountries, allLevels, OpportunityCategory } from "@/data/opportunitiesData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface OpportunityFilterState {
  search: string;
  category: OpportunityCategory | "all";
  position: string;
  country: string;
  level: string;
  division: string;
  type: "all" | "recruitment" | "trial" | "camp" | "interest";
  urgentOnly: boolean;
}

export const defaultOpportunityFilters: OpportunityFilterState = {
  search: "",
  category: "all",
  position: "",
  country: "",
  level: "",
  division: "",
  type: "all",
  urgentOnly: false
};

const categoryOptions: {value: OpportunityCategory | "all";label: string;emoji: string;}[] = [
{ value: "all", label: "All", emoji: "📋" },
{ value: "recruiting_position", label: "Your Position", emoji: "🎯" },
{ value: "preferred_country", label: "Preferred Countries", emoji: "🌍" },
{ value: "trial_camp", label: "Trials & Camps", emoji: "⛺" },
{ value: "direct_interest", label: "Direct Interest", emoji: "👁" }];


const typeOptions = [
{ value: "all", label: "All Types" },
{ value: "recruitment", label: "Recruitment" },
{ value: "trial", label: "Trial" },
{ value: "camp", label: "Camp" },
{ value: "interest", label: "Interest" }];


interface Props {
  filters: OpportunityFilterState;
  onChange: (filters: OpportunityFilterState) => void;
  resultCount: number;
}

export function OpportunityFilters({ filters, onChange, resultCount }: Props) {
  const [expanded, setExpanded] = useState(false);

  const update = (patch: Partial<OpportunityFilterState>) =>
  onChange({ ...filters, ...patch });

  const activeCount = [
  filters.position,
  filters.country,
  filters.level,
  filters.type !== "all",
  filters.urgentOnly].
  filter(Boolean).length;

  const clearAll = () => onChange(defaultOpportunityFilters);

  return (
    <div className="space-y-3">
      {/* Search + toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs, positions, locations..."
            className="pl-9 h-10 text-sm bg-card border-border focus-visible:border-primary/50"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })} />

        </div>
        <Button
          variant={expanded ? "default" : "outline"}
          size="sm"
          className="gap-1.5 shrink-0 h-10"
          onClick={() => setExpanded(!expanded)}>

          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 &&
          <Badge className="h-5 min-w-[20px] p-0 flex items-center justify-center text-[10px] rounded-full bg-primary-foreground text-primary">
              {activeCount}
            </Badge>
          }
        </Button>
      </div>

      {/* Quick category tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/60 border border-border">
        {categoryOptions.map((cat) =>
        <button
          key={cat.value}
          onClick={() => update({ category: cat.value })}
          className={cn("flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 text-base",

          filters.category === cat.value ?
          "bg-card text-foreground shadow-sm border border-border" :
          "text-muted-foreground hover:text-foreground"
          )}>

            <span className="hidden sm:inline">{cat.emoji}</span>
            {cat.label}
          </button>
        )}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {expanded &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden">

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-3 rounded-xl border border-border bg-card">
              <Select value={filters.position || "all"} onValueChange={(v) => update({ position: v === "all" ? "" : v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Position" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {allPositions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filters.country || "all"} onValueChange={(v) => update({ country: v === "all" ? "" : v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {allCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filters.level || "all"} onValueChange={(v) => update({ level: v === "all" ? "" : v })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {allLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(v) => update({ type: v as OpportunityFilterState["type"] })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <button
                onClick={() => update({ urgentOnly: !filters.urgentOnly })}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200",
                  filters.urgentOnly ?
                  "bg-destructive/10 text-destructive border-destructive/30" :
                  "bg-secondary text-muted-foreground border-border hover:border-destructive/30"
                )}>

                  🔥 Urgent
                </button>
                {activeCount > 0 &&
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground" onClick={clearAll}>
                    <X className="h-3 w-3" />Clear
                  </Button>
              }
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "opportunity" : "opportunities"}
        </p>
        {activeCount > 0 &&
        <button onClick={clearAll} className="text-xs text-primary hover:underline font-medium">
            Clear all filters
          </button>
        }
      </div>
    </div>);

}