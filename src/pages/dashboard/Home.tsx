import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye, ArrowRight, Sparkles, Search, MessageSquare, Briefcase,
  CheckCircle2, TrendingUp, Shield, FileText, Video, ChevronRight,
  Target, Clock, Calendar, CircleUserRound
} from "lucide-react";
import { mockProfileViews, mockPlayerOpportunities, mockMessages } from "@/data/mockData";
import hubProfile from "@/assets/hub-profile.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

const profileCompletion = 72;

const gettingSignedSteps = [
  { icon: FileText, label: "Complete your profile", done: true, description: "Bio, stats & experience" },
  { icon: Video, label: "Upload highlight video", done: true, description: "Showcase your best moments" },
  { icon: Shield, label: "Get verified", done: false, description: "Earn the trust badge" },
  { icon: Search, label: "Set availability status", done: true, description: "Let clubs know you're open" },
  { icon: Target, label: "Apply to 3 opportunities", done: false, description: "0/3 applications sent" },
  { icon: MessageSquare, label: "Respond to all messages", done: false, description: "2 unread messages" },
];

const completedSteps = gettingSignedSteps.filter(s => s.done).length;
const stepProgress = Math.round((completedSteps / gettingSignedSteps.length) * 100);

export default function Home() {
  const unreadMessages = mockMessages.filter(m => !m.read);
  const urgentOpps = mockPlayerOpportunities.filter(o => o.urgent);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ─── TWO-COLUMN HERO ─── */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">

          {/* Left: Identity card — sticky on desktop */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <Card className="border-border overflow-hidden">
              <div className="relative">
                <img
                  src={hubProfile}
                  alt="Player"
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Gradient overlay with name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-white tracking-tight">Your Career Hub</h1>
                    <span className="text-xl">🤾</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1">Everything you need — one page, zero noise.</p>
                  {urgentOpps.length > 0 && (
                    <Badge className="mt-3 text-xs font-bold bg-destructive/90 text-white border-0 gap-1.5 px-3 py-1 rounded-lg animate-pulse">
                      <Clock className="h-3.5 w-3.5" /> {urgentOpps.length} urgent
                    </Badge>
                  )}
                </div>
                {/* Verified badge */}
                <span className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </span>
              </div>

              {/* Quick stats inside card */}
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat icon={Eye} value={mockProfileViews.length} label="Views" />
                  <MiniStat icon={Briefcase} value={mockPlayerOpportunities.length} label="Opportunities" />
                  <MiniStat icon={MessageSquare} value={unreadMessages.length} label="Unread" />
                  <MiniStat icon={TrendingUp} value={`${profileCompletion}%`} label="Profile" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Content columns */}
          <div className="space-y-6">

            {/* Navigation Hub — 3×2 grid */}
            <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
              <div className="grid grid-cols-3 gap-3">
                <HubCard to="/dashboard/search" icon={Search} label="Search" sub="Find clubs & players" />
                <HubCard to="/dashboard/opportunities" icon={Briefcase} label="Opportunities" sub={`${mockPlayerOpportunities.length} open`} count={mockPlayerOpportunities.length} />
                <HubCard to="/dashboard/messages" icon={MessageSquare} label="Messages" sub="Inbox" count={unreadMessages.length} />
                <HubCard to="/dashboard/events" icon={Calendar} label="Events" sub="Camps & trials" />
                <HubCard to="/dashboard/profile" icon={CircleUserRound} label="My Profile" sub={`${profileCompletion}% complete`} />
                <HubCard to="/dashboard/opportunities" icon={TrendingUp} label="Market" sub="Transfer feed" />
              </div>
            </motion.div>

            {/* Two-column content: Recruiting + Viewed */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* Who's Recruiting You */}
              <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
                <SectionCard icon={Target} title="Who's Recruiting You" subtitle={`${mockPlayerOpportunities.length} clubs interested`}>
                  <div className="space-y-2">
                    {mockPlayerOpportunities.slice(0, 3).map((opp) => (
                      <NavLink key={opp.id} to="/dashboard/opportunities" className="group/row flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-primary/[0.03] transition-all">
                        <Avatar className="h-11 w-11 shrink-0 border-2 border-border">
                          <AvatarImage src={opp.avatar} />
                          <AvatarFallback className="text-xs font-bold bg-secondary">{opp.title[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground truncate">{opp.title}</p>
                            {opp.urgent && (
                              <span className="shrink-0 text-[9px] font-bold uppercase text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-md animate-pulse">Urgent</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{opp.subtitle}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/row:text-primary transition-colors shrink-0" />
                      </NavLink>
                    ))}
                    <NavLink to="/dashboard/opportunities" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline pt-1">
                      View all <ArrowRight className="h-4 w-4" />
                    </NavLink>
                  </div>
                </SectionCard>
              </motion.div>

              {/* Who Viewed You */}
              <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
                <SectionCard icon={Eye} title="Who Viewed You" subtitle={`${mockProfileViews.length} visitors this week`}>
                  <div className="space-y-2">
                    {mockProfileViews.slice(0, 4).map((view) => (
                      <div key={view.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-primary/[0.03] transition-all cursor-pointer">
                        <Avatar className="h-11 w-11 shrink-0 border-2 border-border">
                          <AvatarImage src={view.avatar} />
                          <AvatarFallback className="text-[11px] font-bold bg-secondary">{view.viewerName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{view.viewerName}</p>
                          <p className="text-xs text-muted-foreground truncate">{view.viewerOrg}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-border capitalize">{view.viewerRole}</Badge>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{view.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {mockProfileViews.length > 4 && (
                      <p className="text-center text-xs text-muted-foreground pt-1">+{mockProfileViews.length - 4} more</p>
                    )}
                  </div>
                </SectionCard>
              </motion.div>
            </div>

            {/* How to Get Signed — full width */}
            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}>
              <SectionCard icon={Sparkles} title="How to Get Signed" subtitle={`${completedSteps}/${gettingSignedSteps.length} steps done`}>
                <div className="flex items-center gap-3 mb-4">
                  <Progress value={stepProgress} className="h-2.5 flex-1" />
                  <span className="text-sm font-extrabold text-primary">{stepProgress}%</span>
                </div>
                <div className="grid md:grid-cols-2 gap-1.5">
                  {gettingSignedSteps.map((step) => (
                    <div key={step.label}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${step.done ? "opacity-45" : "hover:bg-secondary/50 cursor-pointer"}`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${step.done ? "bg-primary/10" : "bg-secondary"}`}>
                        {step.done ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <step.icon className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{step.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─── */

function MiniStat({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-extrabold text-foreground leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function HubCard({ to, icon: Icon, label, sub, count }: {
  to: string; icon: React.ElementType; label: string; sub: string; count?: number;
}) {
  return (
    <NavLink to={to} className="group">
      <div className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
        {count !== undefined && count > 0 && (
          <span className="absolute top-2.5 right-2.5 min-w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1.5">
            {count}
          </span>
        )}
        <div className="h-[72px] w-[72px] rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
          <Icon className="h-9 w-9 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </div>
    </NavLink>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <Card className="border-border h-full overflow-hidden hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3 p-5 pb-3">
        <div className="h-[72px] w-[72px] rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-9 w-9 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <CardContent className="px-5 pb-5 pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
