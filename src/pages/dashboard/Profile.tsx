import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  User, Mail, MapPin, Phone, Globe, Calendar, Ruler, Shield,
  Award, Video, Languages, Briefcase, Edit2, Save, X, CheckCircle2,
  AlertCircle, Camera, Flag, Heart, Star, FileText
} from "lucide-react";
import hubProfile from "@/assets/hub-profile.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

const mockPlayerProfile = {
  firstName: "Alex",
  lastName: "Müller",
  email: "",
  phone: "+49 170 1234567",
  dateOfBirth: "1998-05-14",
  nationality: "Germany",
  country: "Germany",
  city: "Hamburg",
  bio: "Dedicated goalkeeper with 8+ years of professional experience in the Bundesliga. Strong reflexes, excellent communication skills, and a passion for developing young talent.",
  position: "Goalkeeper",
  secondaryPosition: "—",
  handedness: "Right",
  height: 192,
  weight: 88,
  shirtNumber: 1,
  currentClub: "HSV Hamburg",
  contractUntil: "2026-06",
  availability: "Open to Offers",
  level: "Professional",
  division: "Bundesliga",
  experience: 8,
  nationalTeam: true,
  languages: ["German", "English", "French"],
  preferredCountries: ["Germany", "Denmark", "France", "Spain"],
  willingToRelocate: true,
  videoUrl: "https://youtube.com/watch?v=example",
  website: "",
  socialMedia: { instagram: "@alexmuller_hb", twitter: "" },
  achievements: [
    "Bundesliga Best Goalkeeper 2024",
    "National Team – 32 Caps",
    "EHF Champions League Quarter-Finals 2023",
    "Youth World Championship Bronze 2017",
  ],
  careerHistory: [
    { club: "HSV Hamburg", period: "2021 – Present", role: "Starting Goalkeeper", division: "Bundesliga" },
    { club: "TSV Hannover-Burgdorf", period: "2018 – 2021", role: "Goalkeeper", division: "Bundesliga" },
    { club: "SC Magdeburg U21", period: "2016 – 2018", role: "Youth Goalkeeper", division: "Youth League" },
  ],
};

function PlayerProfileContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(mockPlayerProfile);
  const [dbProfile, setDbProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setDbProfile(data);
      });
  }, [user]);

  const displayName = dbProfile?.display_name || profile.firstName + " " + profile.lastName;
  const avatarUrl = dbProfile?.avatar_url || "";
  const completionPercentage = 75;

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Hero Banner ── */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <Card className="border-border overflow-hidden">
          <div className="relative">
            {/* Gradient banner */}
            <div className="h-32 md:h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary" />
            {/* Content overlay */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <Avatar className="h-28 w-28 border-4 border-card shadow-xl">
                    <AvatarImage src={avatarUrl || hubProfile} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {editing && (
                    <button className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-7 w-7 text-background" />
                    </button>
                  )}
                  <span className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-foreground">{displayName}</h1>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">{profile.level}</Badge>
                    {profile.nationalTeam && (
                      <Badge variant="outline" className="text-xs">🏅 National Team</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {profile.position} · #{profile.shirtNumber} · {profile.currentClub}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {profile.city}, {profile.country} · 🇩🇪 {profile.nationality}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {editing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4 mr-1.5" /> Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-1.5" /> Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Bento Stats ── */}
      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <BentoStat icon={Shield} label="Position" value={profile.position} />
          <BentoStat icon={Ruler} label="Height" value={`${profile.height} cm`} />
          <BentoStat icon={Star} label="Hand" value={profile.handedness} />
          <BentoStat icon={Briefcase} label="Experience" value={`${profile.experience} yrs`} />
          <BentoStat icon={Award} label="Shirt" value={`#${profile.shirtNumber}`} />
          <BentoStat icon={Calendar} label="Age" value={`${new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}`} />
        </div>
      </motion.div>

      {/* ── Profile Completion ── */}
      <motion.div initial="hidden" animate="visible" custom={1.5} variants={fadeUp}>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-[72px] w-[72px] rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                {completionPercentage >= 80 ? (
                  <CheckCircle2 className="h-9 w-9 text-primary" />
                ) : (
                  <AlertCircle className="h-9 w-9 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">Profile Completion</span>
                  <span className={cn("text-lg font-extrabold", completionPercentage >= 80 ? "text-primary" : "text-amber-600")}>{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2.5" />
                {completionPercentage < 100 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Add photo</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Upload video</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Complete career</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Main Grid: 3 columns ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Col 1: Personal + Availability */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="space-y-5">
          <SectionCard icon={User} title="Personal Info">
            {editing ? (
              <div className="space-y-3">
                <div><Label className="text-xs">First Name</Label><Input defaultValue={profile.firstName} className="mt-1" /></div>
                <div><Label className="text-xs">Last Name</Label><Input defaultValue={profile.lastName} className="mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input defaultValue={profile.phone} className="mt-1" /></div>
                <div><Label className="text-xs">Date of Birth</Label><Input type="date" defaultValue={profile.dateOfBirth} className="mt-1" /></div>
                <div><Label className="text-xs">City</Label><Input defaultValue={profile.city} className="mt-1" /></div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <InfoRow icon={Mail} label="Email" value={user?.email || "—"} />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} />
                <InfoRow icon={Calendar} label="Born" value={new Date(profile.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                <InfoRow icon={Languages} label="Languages" value={profile.languages.join(", ")} />
              </div>
            )}
          </SectionCard>

          <SectionCard icon={Briefcase} title="Availability">
            {editing ? (
              <div className="space-y-3">
                <Select defaultValue={profile.availability}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actively Looking">Actively Looking</SelectItem>
                    <SelectItem value="Open to Offers">Open to Offers</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Willing to Relocate</Label>
                  <Switch defaultChecked={profile.willingToRelocate} />
                </div>
              </div>
            ) : (
              <>
                <Badge className={cn("text-xs mb-3",
                  profile.availability === "Actively Looking" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                  profile.availability === "Open to Offers" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                )}>
                  {profile.availability}
                </Badge>
                <InfoRow icon={FileText} label="Contract Until" value={profile.contractUntil} />
                <InfoRow icon={Shield} label="Division" value={profile.division} />
                <InfoRow icon={MapPin} label="Relocate" value={profile.willingToRelocate ? "Yes" : "No"} />
              </>
            )}
          </SectionCard>

          <SectionCard icon={Heart} title="Preferred Countries">
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredCountries.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </SectionCard>
        </motion.div>

        {/* Col 2: Bio + Handball Details */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-5">
          <SectionCard icon={FileText} title="Bio">
            {editing ? (
              <Textarea defaultValue={profile.bio} rows={5} className="text-sm" />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            )}
          </SectionCard>

          <SectionCard icon={Shield} title="Handball Details">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Position</Label>
                  <Select defaultValue={profile.position}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Goalkeeper", "Left Wing", "Right Wing", "Left Back", "Right Back", "Center Back", "Pivot"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Handedness</Label>
                  <Select defaultValue={profile.handedness}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Right">Right</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Height (cm)</Label><Input type="number" defaultValue={profile.height} className="mt-1" /></div>
                <div><Label className="text-xs">Weight (kg)</Label><Input type="number" defaultValue={profile.weight} className="mt-1" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4">
                <InfoRow icon={Shield} label="Position" value={profile.position} />
                <InfoRow icon={Star} label="Hand" value={profile.handedness} />
                <InfoRow icon={Ruler} label="Height" value={`${profile.height} cm`} />
                <InfoRow icon={Ruler} label="Weight" value={`${profile.weight} kg`} />
              </div>
            )}
          </SectionCard>

          <SectionCard icon={Video} title="Media & Links">
            {editing ? (
              <div className="space-y-3">
                <div><Label className="text-xs">Highlight Video URL</Label><Input defaultValue={profile.videoUrl} className="mt-1" placeholder="https://youtube.com/..." /></div>
                <div><Label className="text-xs">Instagram</Label><Input defaultValue={profile.socialMedia.instagram} className="mt-1" /></div>
                <div><Label className="text-xs">Website</Label><Input defaultValue={profile.website} className="mt-1" /></div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <InfoRow icon={Video} label="Highlight Video" value={
                  profile.videoUrl ? <a href={profile.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Watch Video →</a> : "Not uploaded"
                } />
                <InfoRow icon={Globe} label="Instagram" value={profile.socialMedia.instagram || "—"} />
                <InfoRow icon={Globe} label="Website" value={profile.website || "—"} />
              </div>
            )}
          </SectionCard>
        </motion.div>

        {/* Col 3: Career + Achievements */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="space-y-5">
          <SectionCard icon={Briefcase} title="Career History">
            <div className="space-y-0 divide-y divide-border">
              {profile.careerHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground">{entry.club}</h4>
                      <span className="text-[11px] text-muted-foreground shrink-0">{entry.period}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.role} · {entry.division}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Award} title="Achievements">
            <div className="space-y-2">
              {profile.achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">🏆</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{a}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Flag} title="National Team">
            <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl">🇩🇪</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Germany National Team</p>
                <p className="text-xs text-muted-foreground">32 Caps · Active</p>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Section Card with 72px icon ── */
function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border hover:border-primary/15 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[72px] w-[72px] rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-9 w-9 text-primary" />
          </div>
          <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

/* ── Bento Stat ── */
function BentoStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all text-center">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-base font-extrabold text-foreground leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Info Row ── */
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <DashboardLayout>
      <PlayerProfileContent />
    </DashboardLayout>
  );
}
