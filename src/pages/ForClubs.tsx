import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, BarChart3, Shield, Clock, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import handballClubTeam from "@/assets/handball-club-team.jpg";
import handballCoaching from "@/assets/handball-coaching.jpg";
const clubTestimonials = [{
  quote: "We've reduced our scouting costs by 40% while improving the quality of our signings. iHandball is invaluable.",
  name: "Henrik Larsson",
  role: "General Manager, Aalborg Håndbold",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face"
}, {
  quote: "The player database is incredibly comprehensive. We found three key signings for our women's team last season.",
  name: "Isabelle Martin",
  role: "Head of Recruitment, Metz Handball",
  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
}, {
  quote: "Direct communication with players speeds up negotiations significantly. A must-have tool for any serious club.",
  name: "Viktor Kovács",
  role: "Sporting Director, Veszprém HC",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
}];
const ForClubs = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    league: ""
  });
  const features = [{
    icon: Search,
    title: "Advanced Player Search",
    description: "Filter players by position, age, nationality, experience level, and performance metrics."
  }, {
    icon: Users,
    title: "Verified Player Profiles",
    description: "Access comprehensive profiles with verified stats, videos, and career history."
  }, {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Compare players with detailed analytics and scouting reports."
  }, {
    icon: Shield,
    title: "Secure Communications",
    description: "Direct and confidential messaging with players and their representatives."
  }, {
    icon: Clock,
    title: "Time-Saving Tools",
    description: "Shortlist candidates, set alerts, and streamline your recruitment workflow."
  }, {
    icon: Globe,
    title: "Global Talent Pool",
    description: "Access players from 50+ countries across all competition levels."
  }];
  const benefits = ["Access to 10,000+ verified player profiles", "Advanced filtering and search capabilities", "Direct communication with players", "Performance analytics and comparisons", "Priority support from our team", "Custom scouting reports on request"];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Club registration:", formData);
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={handballClubTeam} alt="Handball club team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <motion.div className="max-w-4xl" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              For Clubs
            </span>
            <h1 className="text-5xl font-bold text-foreground mb-6 md:text-5xl">
              Find Your Next
              <br />
              <span className="text-gradient">Player or training staff</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">iHandball helps your club  to discover, evaluate, and recruit top handball talent from around the world.</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" className="">
                Register
                <ArrowRight className="w-5 h-5" />
              </Button>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30 min-h-[80vh] flex items-center">
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
              Our platform provides clubs with powerful tools to streamline recruitment. <span className="text-gradient">Scout Talent</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our platform provides clubs with powerful tools to streamline recruitment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300" initial={{
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
                <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                Why Clubs Choose iHandball
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join the growing network of professional clubs who trust iHandball 
                for their player recruitment needs.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => <motion.li key={benefit} className="flex items-center gap-3" initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.4,
                delay: index * 0.1
              }}>
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </motion.li>)}
              </ul>
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
              <img alt="Handball coaching session" className="rounded-2xl shadow-xl w-full" src="/lovable-uploads/09e0a524-9d5b-4f28-88e8-22b50c53ac18.jpg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-24 bg-primary min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Register Your Club
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Get started with iHandball and transform your recruitment process.
                Join 500+ clubs already finding their next star players.
              </p>
              
            </motion.div>

            <motion.div className="bg-card rounded-2xl p-8 shadow-2xl" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input required value={formData.clubName} onChange={e => setFormData({
                  ...formData,
                  clubName: e.target.value
                })} placeholder="Club Name *" className="bg-background border-border text-lg h-12" />
                  <Input required value={formData.contactName} onChange={e => setFormData({
                  ...formData,
                  contactName: e.target.value
                })} placeholder="Contact Person *" className="bg-background border-border text-lg h-12" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input type="email" required value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} placeholder="Email *" className="bg-background border-border text-lg h-12" />
                  <Input type="tel" value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} placeholder="Phone Number" className="bg-background border-border text-lg h-12" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input required value={formData.country} onChange={e => setFormData({
                  ...formData,
                  country: e.target.value
                })} placeholder="Country *" className="bg-background border-border text-lg h-12" />
                  <Input value={formData.league} onChange={e => setFormData({
                  ...formData,
                  league: e.target.value
                })} placeholder="League / Division" className="bg-background border-border text-lg h-12" />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full text-lg">
                  Submit Registration
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-muted-foreground text-center text-lg">
                  By registering, you agree to our terms of service and privacy policy.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel title="Trusted by Leading Clubs" subtitle="See what sporting directors and managers say about iHandball" testimonials={clubTestimonials} />

      <Footer />
    </div>;
};
export default ForClubs;