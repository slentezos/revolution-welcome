import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Globe, Award, Handshake, Clock, MapPin } from "lucide-react";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import handballActionClubs from "@/assets/handball-action-clubs.jpg";
import handballCoaching from "@/assets/handball-coaching.jpg";
import aboutHeroImage from "@/assets/about-hero.jpg";
import handballClubTeam from "@/assets/handball-club-team.jpg";
const aboutTestimonials = [{
  quote: "The iHandball team truly cares about the handball community. Their support and dedication are unmatched.",
  name: "Klaus Schmidt",
  role: "President, German Handball Federation",
  image: handballActionClubs
}, {
  quote: "Working with iHandball has been a pleasure. They understand the sport and its unique challenges.",
  name: "Anna Petersen",
  role: "Agent, Nordic Sports Management",
  image: handballCoaching
}, {
  quote: "A company built by handball people, for handball people. That's what makes them special.",
  name: "Carlos Rodriguez",
  role: "Former National Team Captain, Spain",
  image: handballClubTeam
}];
const About = () => {
  const values = [{
    icon: Users,
    title: "Player-First",
    description: "We put players at the center of everything we do, ensuring they have the tools to advance their careers."
  }, {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in connecting talent with opportunity across the handball world."
  }, {
    icon: Globe,
    title: "Global Reach",
    description: "Our platform connects players and clubs across continents, breaking down geographical barriers."
  }, {
    icon: Award,
    title: "Trust",
    description: "We build lasting relationships based on transparency, integrity, and mutual respect."
  }];
  const milestones = [{
    year: "2019",
    title: "Founded",
    description: "iHandball was born from a vision to modernize handball transfers"
  }, {
    year: "2020",
    title: "First 100 Clubs",
    description: "Reached milestone of 100 partner clubs across Europe"
  }, {
    year: "2021",
    title: "Global Expansion",
    description: "Expanded operations to include 30+ countries"
  }, {
    year: "2022",
    title: "1,000 Transfers",
    description: "Celebrated our 1,000th successful player placement"
  }, {
    year: "2023",
    title: "10,000 Players",
    description: "Platform reaches 10,000 registered active players"
  }, {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as the leading handball transfer platform worldwide"
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={aboutHeroImage} alt="Handball team unity" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-5xl font-bold text-foreground mb-6 md:text-5xl">
              About <span className="text-gradient">iHandball</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to revolutionize handball transfers, connecting talented players and trainers with clubs worldwide through innovative technology and personalized support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              
              <p className="text-muted-foreground mb-4 text-lg">
                Today, iHandball serves as the bridge between ambition and opportunity, helping hundreds of players find their dream clubs while enabling teams to discover exceptional talent they might have otherwise missed.

              </p>
              <p className="text-muted-foreground text-lg">
                Today, iHandball serves as the bridge between ambition and opportunity, helping 
                hundreds of players find their dream clubs while enabling teams to discover 
                exceptional talent they might have otherwise missed.
              </p>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              These core principles guide everything we do at iHandball.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <motion.div key={value.title} className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-lg">{value.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      

      {/* Stats Section */}
      

      {/* Global Presence Section */}
      <section className="py-20 bg-muted/30 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div className="relative" initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <img src={handballClubTeam} alt="Handball team celebrating" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Global Presence
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                iHandball operates globally, connecting handball talent with opportunities worldwide. Our platform bridges continents, cultures, and leagues to create a truly global handball community.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[{
                icon: MapPin,
                label: "Europe",
                count: "35+ countries"
              }, {
                icon: MapPin,
                label: "Asia",
                count: "8+ countries"
              }, {
                icon: MapPin,
                label: "Americas",
                count: "5+ countries"
              }, {
                icon: MapPin,
                label: "Africa & Oceania",
                count: "4+ countries"
              }].map(region => <div key={region.label} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                    <region.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{region.label}</p>
                      
                    </div>
                  </div>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Partnerships
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                We work closely with federations, leagues, and clubs to ensure the best experience for players 
                and organizations alike. Our partnerships are built on trust and shared goals.
              </p>
              <div className="space-y-4">
                {[{
                icon: Handshake,
                title: "Federation Partnerships",
                desc: "Official partner of 15+ national federations"
              }, {
                icon: Award,
                title: "League Integrations",
                desc: "Connected with top leagues across Europe"
              }, {
                icon: Clock,
                title: "24/7 Support",
                desc: "Dedicated support for all our partners"
              }].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <item.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
              </div>
            </motion.div>
            <motion.div className="relative" initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <img src={handballCoaching} alt="Handball coaching session" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel title="What People Say About Us" subtitle="Trusted by the handball community worldwide" testimonials={aboutTestimonials} />

      <Footer />
    </div>;
};
export default About;