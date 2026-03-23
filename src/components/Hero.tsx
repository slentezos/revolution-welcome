import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-handball.jpg";
const Hero = () => {
  return <section className="pt-32 pb-20 bg-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">iHandball  <br />
              <span className="text-gradient">Connecting Players, Clubs, 
and Trainers Worldwide</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              We empower handball clubs, agents and players to make informed decisions faster than ever with real-time market data, exclusive insights and direct access to a global network of 30+ million players.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Schedule an Intro Chat
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[{
              value: "500+",
              label: "Clubs"
            }, {
              value: "2,500+",
              label: "Players"
            }, {
              value: "10,000",
              label: "iHandball Connections a day"
            }].map((stat, index) => <div key={index}>
                  
                  
                </div>)}
            </div>
          </motion.div>

          {/* Right - Video/Image */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img src={heroImage} alt="Handball player in action" className="w-full aspect-video object-cover" />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 glow-primary">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
              {/* Video Label */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-foreground/80 text-background text-sm font-medium">
                HandballXfer
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;