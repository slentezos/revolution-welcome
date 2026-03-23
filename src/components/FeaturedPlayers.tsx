import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin } from "lucide-react";
import player1 from "@/assets/player-1.jpg";
import player2 from "@/assets/player-2.jpg";
import player3 from "@/assets/player-3.jpg";
import player4 from "@/assets/player-4.jpg";

interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  club: string;
  value: string;
  image: string;
  stats: {
    goals: number;
    assists: number;
  };
  trending?: boolean;
}

const players: Player[] = [
  {
    id: 1,
    name: "Mikkel Hansen",
    position: "Left Back",
    age: 35,
    nationality: "Denmark",
    club: "Aalborg Håndbold",
    value: "€1.2M",
    image: player1,
    stats: { goals: 156, assists: 89 },
    trending: true,
  },
  {
    id: 2,
    name: "Niklas Landin",
    position: "Goalkeeper",
    age: 35,
    nationality: "Denmark",
    club: "THW Kiel",
    value: "€900K",
    image: player2,
    stats: { goals: 2, assists: 45 },
  },
  {
    id: 3,
    name: "Sander Sagosen",
    position: "Center Back",
    age: 28,
    nationality: "Norway",
    club: "SC Magdeburg",
    value: "€1.5M",
    image: player3,
    stats: { goals: 203, assists: 112 },
    trending: true,
  },
  {
    id: 4,
    name: "Mathias Gidsel",
    position: "Right Back",
    age: 24,
    nationality: "Denmark",
    club: "Füchse Berlin",
    value: "€1.8M",
    image: player4,
    stats: { goals: 178, assists: 95 },
    trending: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedPlayers = () => {
  return (
    <section id="players" className="py-20 bg-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/30">
            Featured Talent
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Players <span className="text-gradient">Available Now</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover elite handball talent from leagues worldwide. Updated daily with verified profiles.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {players.map((player) => (
            <motion.div
              key={player.id}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Player Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                
                {player.trending && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium">Trending</span>
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{player.name}</h3>
                    <p className="text-muted-foreground">{player.position}</p>
                  </div>
                  <span className="text-xl font-bold text-gradient">{player.value}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{player.club}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{player.stats.goals}</div>
                    <div className="text-xs text-muted-foreground">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{player.stats.assists}</div>
                    <div className="text-xs text-muted-foreground">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{player.age}</div>
                    <div className="text-xs text-muted-foreground">Age</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{player.nationality.slice(0, 3).toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">Nat.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPlayers;
