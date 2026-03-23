import { motion } from "framer-motion";
import { Users, Building2, GraduationCap } from "lucide-react";

const audiences = [
  {
    icon: Users,
    label: "Players",
    title: "Advance Your Career",
    description: "Discover clubs, track performance, connect with opportunities worldwide.",
  },
  {
    icon: Building2,
    label: "Clubs",
    title: "Find Top Talent",
    description: "Recruit players, boost visibility, streamline operations efficiently.",
  },
  {
    icon: GraduationCap,
    label: "Trainers",
    title: "Grow Your Network",
    description: "Access resources, market your skills, stay ahead of the game.",
  },
];

const ForYou = () => {
  return (
    <section className="py-20 bg-card relative min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Built for Everyone in{" "}
            <span className="text-gradient">Handball</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One platform connecting players, clubs, and trainers worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {audiences.map((item, index) => (
            <motion.div
              key={item.label}
              className="group relative p-8 md:p-10 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              
              <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-2 block">
                {item.label}
              </span>
              
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForYou;
