import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquare } from "lucide-react";
import { Player, Coach, Club } from "@/types/dashboard";

// ---- Player Table ----

export function PlayerResultsTable({ players }: { players: Player[] }) {
  const navigate = useNavigate();
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Player</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Position</th>
          <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Age</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Country</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Level</th>
          <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Height</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Contract</th>
          <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => (
          <tr key={player.id} onClick={() => navigate(`/dashboard/player/${player.id}`)} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer group">
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                    {player.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground text-[13px] group-hover:text-primary transition-colors">
                  {player.name}
                </span>
              </div>
            </td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{player.position}</td>
            <td className="py-2.5 px-3 text-center text-[13px] text-foreground">{player.age}</td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{player.country}</td>
            <td className="py-2.5 px-3">
              <Badge variant="secondary" className="text-[10px] font-medium">{player.level}</Badge>
            </td>
            <td className="py-2.5 px-3 text-center text-[13px] text-foreground">{player.height} cm</td>
            <td className="py-2.5 px-3">
              <span className={`text-[13px] ${player.contractStatus === "Free Agent" ? "text-primary font-semibold" : player.contractStatus === "Expiring" ? "text-destructive font-semibold" : "text-foreground"}`}>
                {player.contractStatus}
              </span>
            </td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <AvailabilityBadge availability={player.availability} />
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- Coach Table ----

export function CoachResultsTable({ coaches }: { coaches: Coach[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Coach</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Specialization</th>
          <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Experience</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">License</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Country</th>
          <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Status</th>
        </tr>
      </thead>
      <tbody>
        {coaches.map(coach => (
          <tr key={coach.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer group">
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={coach.avatar} />
                  <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                    {coach.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground text-[13px] group-hover:text-primary transition-colors">
                  {coach.name}
                </span>
              </div>
            </td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{coach.specialization}</td>
            <td className="py-2.5 px-3 text-center text-[13px] text-foreground">{coach.experience}yr</td>
            <td className="py-2.5 px-3">
              <Badge variant="secondary" className="text-[10px] font-medium">{coach.licenseLevel}</Badge>
            </td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{coach.country}</td>
            <td className="py-2.5 px-3 text-right">
              <AvailabilityBadge availability={coach.availability} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- Club Table ----

export function ClubResultsTable({ clubs }: { clubs: Club[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Club</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Division</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Country</th>
          <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Roster</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Recruiting</th>
          <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Open Positions</th>
        </tr>
      </thead>
      <tbody>
        {clubs.map(club => (
          <tr key={club.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer group">
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={club.logo} />
                  <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                    {club.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground text-[13px] group-hover:text-primary transition-colors">
                  {club.name}
                </span>
              </div>
            </td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{club.division}</td>
            <td className="py-2.5 px-3 text-[13px] text-foreground">{club.country}</td>
            <td className="py-2.5 px-3 text-center text-[13px] text-foreground">{club.rosterSize}</td>
            <td className="py-2.5 px-3">
              <Badge
                variant="secondary"
                className={`text-[10px] font-medium ${
                  club.recruiting === "Both" ? "bg-primary/10 text-primary" :
                  club.recruiting === "None" ? "bg-muted text-muted-foreground" : ""
                }`}
              >
                {club.recruiting}
              </Badge>
            </td>
            <td className="py-2.5 px-3 text-[13px] text-muted-foreground">
              {club.openPositions.length > 0 ? club.openPositions.join(", ") : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- Shared availability badge ----

function AvailabilityBadge({ availability }: { availability: string }) {
  const filled = availability === "Actively Looking";
  return (
    <div className="flex items-center gap-0.5">
      <span className={`inline-flex items-center rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        filled
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground border border-border"
      }`}>
        {availability === "Actively Looking" ? "AVAILABLE" : availability === "Open to Offers" ? "OPEN" : "UNAVAILABLE"}
      </span>
      <button className="p-0.5 text-muted-foreground hover:text-foreground">
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
