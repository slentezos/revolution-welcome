import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPlayers, mockClubs } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getFlag } from "@/lib/flags";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Shield, Award, Video,
  CheckCircle2, Calendar, Ruler, Hand, Globe, Users, TrendingUp,
  Play, Heart, Eye, ExternalLink, Zap, Target, MessageSquare, Activity,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const portfolioImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop", type: "image" as const, likes: 234 },
  { id: 2, url: "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=400&h=400&fit=crop", type: "video" as const, likes: 891 },
  { id: 3, url: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&h=400&fit=crop", type: "image" as const, likes: 156 },
  { id: 4, url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop", type: "video" as const, likes: 1203 },
  { id: 5, url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", type: "image" as const, likes: 432 },
  { id: 6, url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcbc3?w=400&h=400&fit=crop", type: "image" as const, likes: 89 },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const player = mockPlayers.find((p) => p.id === id);
  const [shortlisted, setShortlisted] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

  const handballFeed = [
    { id: 1, text: "⚽ 8 goals & 3 assists in last match vs THW Kiel!", date: "2 hours ago", goals: 8, blocks: 1 },
    { id: 2, text: "🧱 5 blocks this week — defensive beast mode ON", date: "1 day ago", goals: 3, blocks: 5 },
    { id: 3, text: "🔥 Named Player of the Week in league round 14", date: "3 days ago", goals: 6, blocks: 2 },
    { id: 4, text: "💪 12 goals across 2 games — top scorer this week", date: "5 days ago", goals: 12, blocks: 0 },
    { id: 5, text: "🏆 Led team to 3rd consecutive win, 7 goals scored", date: "1 week ago", goals: 7, blocks: 3 },
  ];
  const latestPost = handballFeed[0];

  if (!player) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-bold text-foreground mb-2">Player not found</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const contractExpiry =
    player.contractStatus === "Free Agent" ? "Free Agent"
    : player.contractStatus === "Expiring" ? "June 2026" : "June 2028";

  const currentClub =
    player.contractStatus === "Free Agent"
      ? null
      : mockClubs.find((c) => c.country === player.country) || mockClubs[0];

  const rating = (70 + player.profileCompletion * 0.2 + player.experience * 0.5).toFixed(1);

  const handleShortlist = () => {
    setShortlisted(!shortlisted);
    toast({
      title: shortlisted ? "Removed from shortlist" : "Added to shortlist",
      description: `${player.name} ${shortlisted ? "removed from" : "added to"} your shortlist.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* ===== TWO-COLUMN MASTER ===== */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-6">

          {/* ===== LEFT: Player Card ===== */}
          <motion.div {...fadeUp} transition={{ duration: 0.35 }} className="lg:sticky lg:top-4 lg:self-start space-y-4">
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              {/* Big Image */}
              <div className="relative aspect-[3/4] w-full bg-secondary">
                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-card via-card/90 to-transparent" />

                {/* Rating pill */}
                <div className="absolute top-4 right-4 backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl px-4 py-2 text-center shadow-lg">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Rating</span>
                  <p className="text-2xl font-black text-primary leading-none">{rating}</p>
                </div>

                {/* Identity overlay */}
                <div className="absolute bottom-0 inset-x-0 px-5 pb-5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-foreground tracking-tight">{player.name}</h1>
                    {player.verified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-primary">{player.position}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {player.city} {getFlag(player.country)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info strip */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {player.nationalTeam && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold gap-1">
                      <Award className="h-3 w-3" /> National Team
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] font-bold">{player.level}</Badge>
                  <Badge variant="outline" className={cn("text-[10px] font-bold", player.contractStatus !== "Under Contract" && "border-primary/30 text-primary")}>
                    {contractExpiry}
                  </Badge>
                </div>

                {/* Club row */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{currentClub?.name || "Free Agent"}</p>
                    <p className="text-xs text-muted-foreground">{getFlag(currentClub?.country || player.country)} {currentClub?.country || player.country}</p>
                  </div>
                </div>

                {/* ONE set of actions — that's it */}
                <div className="space-y-2">
                  <Button className="w-full gap-2 rounded-xl h-11 text-sm font-bold" onClick={() => navigate("/dashboard/messages", { state: { newMessageTo: player.name } })}>
                    <MessageSquare className="h-4 w-4" /> Send Message
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={shortlisted ? "default" : "outline"}
                      className="gap-1.5 rounded-xl h-10 text-sm"
                      onClick={handleShortlist}
                    >
                      <Star className={cn("h-4 w-4", shortlisted && "fill-current")} />
                      {shortlisted ? "Saved" : "Shortlist"}
                    </Button>
                    <Button variant="outline" className="gap-1.5 rounded-xl h-10 text-sm">
                      <Heart className="h-4 w-4" /> Interest
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Represented by</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Independent</p>
                  <p className="text-xs text-muted-foreground">{getFlag(player.country)} {player.country}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== RIGHT: Content ===== */}
          <div className="space-y-5">

            {/* Stats row */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }} className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
              <StatCard icon={Calendar} label="Age" value={`${player.age}`} />
              <StatCard icon={Ruler} label="Height" value={`${player.height}cm`} />
              <StatCard icon={Hand} label="Hand" value={player.handedness} />
              <StatCard icon={Award} label="Level" value={player.level} />
              <StatCard icon={TrendingUp} label="Exp." value={`${player.experience}yr`} />
              <StatCard icon={Target} label="Contract" value={contractExpiry} highlight={player.contractStatus !== "Under Contract"} />
            </motion.div>

            {/* Details — clean three-column */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }} className="grid md:grid-cols-3 gap-4">
              {/* My Handball - Facebook-style post */}
              <InfoCard icon={Activity} title="My iHANDBALL">
                <div className="space-y-3">
                  <p className="text-sm text-foreground leading-snug line-clamp-2">{latestPost.text}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-bold text-primary">{latestPost.goals} goals</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="font-bold text-primary">{latestPost.blocks} blocks</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{latestPost.date}</span>
                  </div>
                  <Sheet open={feedOpen} onOpenChange={setFeedOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-primary text-xs p-0 h-auto hover:bg-transparent">
                        See more →
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" /> {player.name}'s iHANDBALL Feed
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        {handballFeed.map((post) => (
                          <div key={post.id} className="bg-secondary/50 rounded-xl p-4 space-y-2">
                            <p className="text-sm text-foreground">{post.text}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="font-bold text-primary">{post.goals} goals</span>
                              <span className="text-muted-foreground/40">·</span>
                              <span className="font-bold text-primary">{post.blocks} blocks</span>
                              <span className="text-muted-foreground/40">·</span>
                              <span>{post.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </InfoCard>

              {/* Profile Details + Languages */}
              <InfoCard icon={Users} title="Details">
                <div className="space-y-2.5 text-sm">
                  <DetailRow label="Nationality" value={`${getFlag(player.nationality)} ${player.nationality}`} />
                  <DetailRow label="Division" value={player.division} />
                  <DetailRow label="Team Level" value={player.nationalTeam ? "National team" : "Club level"} />
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground text-xs">Languages</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {player.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs font-medium gap-1 px-2.5 py-1 rounded-full">
                          <span>{getFlag(lang)}</span> {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Profile Strength */}
              <InfoCard icon={Zap} title="Profile">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold text-foreground">{player.profileCompletion}%</span>
                    </div>
                    <Progress value={player.profileCompletion} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Videos</span>
                    <span className="font-bold text-foreground">{player.hasVideo ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Verified</span>
                    <span className="font-bold text-foreground">{player.verified ? "✓ Verified" : "Pending"}</span>
                  </div>
                </div>
              </InfoCard>
            </motion.div>

            {/* Portfolio */}
            <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground">Portfolio & Highlights</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {portfolioImages.filter(p => p.type === 'video').length} Videos</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {portfolioImages.length} Posts</span>
                      </p>
                    </div>
                  </div>
                  {player.hasVideo && (
                    <Button variant="ghost" size="sm" className="text-primary gap-1.5 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" /> View All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                  {portfolioImages.map((item) => (
                    <div key={item.id} className="group relative aspect-square overflow-hidden cursor-pointer bg-secondary">
                      <img src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-white text-sm font-bold">
                          <Heart className="h-4 w-4 fill-white" /> {item.likes}
                        </span>
                      </div>
                      {item.type === "video" && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                          <Play className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ── Reusable sub-components ── */

function StatCard({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3.5 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn("text-lg font-black leading-none", highlight ? "text-primary" : "text-foreground")}>{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
