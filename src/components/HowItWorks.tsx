import { motion } from "framer-motion";
import { Search, MessageSquare, FileCheck, Handshake } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Talent",
    description: "Browse our extensive database of handball players with detailed profiles, stats, and verified availability.",
  },
  {
    icon: MessageSquare,
    title: "Connect Directly",
    description: "Initiate private conversations with clubs and agents. No middlemen, just direct communication.",
  },
  {
    icon: FileCheck,
    title: "Your Terms",
    description: "Use our secure platform to negotiate and finalize transfer terms with complete transparency.",
  },
  {
    icon: Handshake,
    title: "Finalize",
    description: "Finalize deals with digital contracts and secure payment processing. Hassle-free transfers.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/30 min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">It Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From discovery to completion, our platform streamlines every step of the transfer process.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
