import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Player } from "@/types/dashboard";

type TransferStatus = "make_available" | "to_buy" | "to_loan" | "to_buy_loan" | "none";

const statusConfig: Record<TransferStatus, { label: string; filled: boolean }> = {
  make_available: { label: "MAKE AVAILABLE", filled: true },
  to_buy: { label: "TO BUY", filled: false },
  to_loan: { label: "TO LOAN", filled: false },
  to_buy_loan: { label: "TO BUY & LOAN", filled: false },
  none: { label: "—", filled: false },
};

function getTransferStatus(player: Player): TransferStatus {
  if (player.contractStatus === "Free Agent") return "make_available";
  if (player.contractStatus === "Expiring") return "to_loan";
  return "to_buy";
}

// Deterministic contract months based on player id
function getContractMonths(player: Player): number | null {
  if (player.contractStatus === "Free Agent") return null;
  const hash = player.id.charCodeAt(1) * 7 + player.id.charCodeAt(0) * 3;
  return (hash % 30) + 1;
}

function getSquad(player: Player): string {
  if (player.age <= 21) return "U21";
  if (player.age <= 23) return "U23";
  return "First Team";
}

interface SquadTableProps {
  players: Player[];
}

export function SquadTable({ players }: SquadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Player
            </th>
            <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Squad
            </th>
            <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Position
            </th>
            <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Age
            </th>
            <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Contract Expiry
            </th>
            <th className="text-right py-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Transfer Status
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const status = getTransferStatus(player);
            const config = statusConfig[status];
            const months = getContractMonths(player);
            const squad = getSquad(player);
            const isExpiringSoon = months !== null && months <= 6;

            return (
              <tr
                key={player.id}
                className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                {/* Player */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
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

                {/* Squad */}
                <td className="py-2.5 px-3 text-[13px] text-foreground">
                  {squad}
                </td>

                {/* Position */}
                <td className="py-2.5 px-3 text-[13px] text-foreground">
                  {player.position.length > 12
                    ? player.position.split(" ").map(w => w[0]).join("")
                    : player.position.replace("Left ", "L ").replace("Right ", "R ").replace("Center ", "C ")}
                </td>

                {/* Age */}
                <td className="py-2.5 px-3 text-center text-[13px] text-foreground">
                  {player.age}
                </td>

                {/* Contract Expiry */}
                <td className="py-2.5 px-3 text-[13px]">
                  {months === null ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <span className={isExpiringSoon ? "text-destructive font-semibold" : "text-foreground"}>
                      {months} months
                    </span>
                  )}
                </td>

                {/* Transfer Status */}
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <button
                      className={`inline-flex items-center rounded px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                        config.filled
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {config.label}
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
