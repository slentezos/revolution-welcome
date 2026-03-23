import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { transferOpportunities, categoryLabels, OpportunityCategory } from "@/data/opportunitiesData";
import { TransferOpportunityRow } from "@/components/dashboard/TransferOpportunityRow";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Target, Globe, Tent, Eye, TrendingUp, Zap, CheckCircle, Flame, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categoryTabs: {value: OpportunityCategory | "all";label: string;icon: React.ReactNode;emoji: string;}[] = [
{ value: "all", label: "All", icon: null, emoji: "📋" },
{ value: "recruiting_position", label: "Your Position", icon: <Target className="h-3.5 w-3.5" />, emoji: "🎯" },
{ value: "preferred_country", label: "Preferred Countries", icon: <Globe className="h-3.5 w-3.5" />, emoji: "🌍" },
{ value: "trial_camp", label: "Trials & Camps", icon: <Tent className="h-3.5 w-3.5" />, emoji: "⛺" },
{ value: "direct_interest", label: "Direct Interest", icon: <Eye className="h-3.5 w-3.5" />, emoji: "👁" }];


const quickFilters = [
{ key: "urgent", label: "Urgent", icon: <Zap className="h-3 w-3" /> },
{ key: "verified", label: "Verified", icon: <CheckCircle className="h-3 w-3" /> },
{ key: "housing", label: "Housing", icon: null }] as
const;

type QuickFilterKey = typeof quickFilters[number]["key"];

function StatCard({ icon: Icon, label, value, accent }: {icon: React.ComponentType<any>;label: string;value: number;accent?: boolean;}) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all",
      accent ?
      "border-primary/20 bg-primary/[0.04]" :
      "border-border bg-card"
    )}>
      <div className={cn(
        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
        accent ? "bg-primary/10" : "bg-secondary"
      )}>
        <Icon className={cn("h-4 w-4", accent ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>);

}

export default function Opportunities() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "all">("all");
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilterKey>>(new Set());

  const toggleQuick = (key: QuickFilterKey) => {
    setActiveQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);else
      next.add(key);
      return next;
    });
  };

  const clearAll = () => {
    setSearch("");
    setCategory("all");
    setActiveQuickFilters(new Set());
  };

  const filtered = useMemo(() => {
    return transferOpportunities.filter((opp) => {
      if (search) {
        const q = search.toLowerCase();
        const s = `${opp.clubName} ${opp.title} ${opp.subtitle} ${opp.location} ${opp.position || ""}`.toLowerCase();
        if (!s.includes(q)) return false;
      }
      if (category !== "all" && opp.category !== category) return false;
      if (activeQuickFilters.has("urgent") && !opp.urgent) return false;
      if (activeQuickFilters.has("verified") && !opp.verified) return false;
      if (activeQuickFilters.has("housing") && !opp.housing) return false;
      return true;
    });
  }, [search, category, activeQuickFilters]);

  const hasActiveFilters = search || category !== "all" || activeQuickFilters.size > 0;
  const showGrouped = category === "all" && !search && activeQuickFilters.size === 0;
  const categories: OpportunityCategory[] = ["recruiting_position", "preferred_country", "trial_camp", "direct_interest"];

  // Stats
  const totalCount = transferOpportunities.length;
  const newToday = transferOpportunities.filter((o) => Date.now() - o.datePosted.getTime() < 24 * 3600000).length;
  const urgentCount = transferOpportunities.filter((o) => o.urgent).length;
  const verifiedCount = transferOpportunities.filter((o) => o.verified).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          
          <h2 className="text-2xl font-bold text-foreground tracking-tight"> Suggested Market</h2>
          <p className="text-muted-foreground text-sm mt-1">Opportunities matched to your profile and preferences</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <StatCard icon={TrendingUp} label="Total Openings" value={totalCount} />
          <StatCard icon={Flame} label="New Today" value={newToday} accent />
          <StatCard icon={Zap} label="Urgent" value={urgentCount} />
          <StatCard icon={CheckCircle} label="Verified Clubs" value={verifiedCount} />
        </motion.div>

        {/* Search + category tabs + quick filters — all inline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs, positions, locations..."
              className="pl-11 h-12 text-sm bg-card border-border rounded-2xl focus-visible:border-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
            
            {search &&
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            }
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {categoryTabs.map((tab) =>
            <button
              key={tab.value}
              onClick={() => setCategory(tab.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 border",
                category === tab.value ?
                "bg-primary text-primary-foreground border-primary shadow-sm" :
                "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}>
              
                <span className="text-sm">{tab.emoji}</span>
                {tab.label}
              </button>
            )}
          </div>

          {/* Quick filter pills + count */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {quickFilters.map((f) =>
              <button
                key={f.key}
                onClick={() => toggleQuick(f.key)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200",
                  activeQuickFilters.has(f.key) ?
                  f.key === "urgent" ?
                  "bg-destructive/10 text-destructive border-destructive/30" :
                  "bg-primary/10 text-primary border-primary/20" :
                  "bg-secondary text-muted-foreground border-transparent hover:border-border"
                )}>
                
                  {f.icon}
                  {f.label}
                </button>
              )}
              {hasActiveFilters &&
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                
                  <X className="h-3 w-3" /> Clear all
                </button>
              }
            </div>
            <p className="text-[12px] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}>
          
          {showGrouped ?
          <div className="space-y-8">
              {categories.map((cat) => {
              const items = filtered.filter((o) => o.category === cat);
              if (items.length === 0) return null;
              const meta = categoryLabels[cat];
              return (
                <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        {cat === "recruiting_position" && <Target className="h-3.5 w-3.5 text-primary" />}
                        {cat === "preferred_country" && <Globe className="h-3.5 w-3.5 text-primary" />}
                        {cat === "trial_camp" && <Tent className="h-3.5 w-3.5 text-primary" />}
                        {cat === "direct_interest" && <Eye className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{meta.label}</h3>
                        <p className="text-[11px] text-muted-foreground">{meta.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto text-[10px] font-semibold">
                        {items.length}
                      </Badge>
                    </div>
                    <div className="space-y-2.5">
                      {items.map((opp, i) =>
                    <TransferOpportunityRow key={opp.id} opportunity={opp} index={i} />
                    )}
                    </div>
                  </div>);

            })}
            </div> :

          <div className="space-y-2.5">
              {filtered.length > 0 ?
            filtered.map((opp, i) =>
            <TransferOpportunityRow key={opp.id} opportunity={opp} index={i} />
            ) :

            <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No opportunities match</p>
                  <p className="text-[12px] text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  <button onClick={clearAll} className="text-[12px] text-primary font-medium mt-3 hover:underline">
                    Clear all filters
                  </button>
                </div>
            }
            </div>
          }
        </motion.div>
      </div>
    </DashboardLayout>);

}