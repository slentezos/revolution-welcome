import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, ArrowRight } from "lucide-react";

interface RecommendationProps {
  name: string;
  subtitle: string;
  location: string;
  tags: string[];
  avatar: string;
}

export function RecommendationCard({ name, subtitle, location, tags, avatar }: RecommendationProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer">
      <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex flex-wrap gap-1 justify-end">
          {tags.filter(Boolean).slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
              {tag}
            </Badge>
          ))}
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
