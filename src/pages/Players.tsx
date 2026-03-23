import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Globe, TrendingUp, Users, Shield, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import playersHeroImage from "@/assets/players-hero.jpg";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
const playerTestimonials = [{
  quote: "After 3 months on iHandball, I received offers from 5 different clubs across Europe. I'm now playing in the Bundesliga!",
  name: "Luka Petrović",
  role: "Left Back, SC Magdeburg",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
}, {
  quote: "The platform helped me showcase my skills to clubs I never would have reached on my own. Game changer for my career.",
  name: "Emma Lindqvist",
  role: "Goalkeeper, Sweden",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
}, {
  quote: "Being a free agent was scary until I found iHandball. Within weeks, I had multiple trials lined up.",
  name: "Ahmed Hassan",
  role: "Right Wing, Egypt",
  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
}];
const Players = () => {
  const features = [{
    icon: Globe,
    title: "Global Exposure",
    description: "Get discovered by clubs and agents from 50+ countries worldwide."
  }, {
    icon: TrendingUp,
    title: "Career Analytics",
    description: "Track your performance stats and see how you compare to other players."
  }, {
    icon: Users,
    title: "Direct Connections",
    description: "Connect directly with clubs, coaches, and agents looking for talent."
  }, {
    icon: Shield,
    title: "Verified Profiles",
    description: "Build a credible profile with verified achievements and references."
  }, {
    icon: Trophy,
    title: "Transfer Opportunities",
    description: "Access exclusive transfer listings and contract opportunities."
  }, {
    icon: Star,
    title: "Showcase Your Skills",
    description: "Upload highlight videos and performance data to stand out."
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={playersHeroImage} alt="Handball player in action" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">Advance your  
          </span>
            <h1 className="text-5xl font-bold text-foreground mb-4 md:text-5xl">Advance your
next move<br />
              <span className="text-gradient">Career</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Connect with clubs in all regions, Share performance, Receive and send messages
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="my-[10px]">
                Request FREE access  
                <ArrowRight className="w-5 h-5" />
              </Button>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to <span className="text-gradient">level up</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of handball players who are taking control of their careers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Clubs Using iHandball Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">trusted by clubs in all leagues <span className="text-primary">Worldwide  </span> clubs are using iHandball to look for players like you
            </h2>
          </motion.div>
          
          <motion.div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 items-center" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            {[{
            name: "FC Barcelona",
            logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg"
          }, {
            name: "THW Kiel",
            logo: "https://www.thw-handball.de/fileadmin/templates/images/thw_logo.svg"
          }, {
            name: "PSG Handball",
            logo: "https://www.psg.fr/img/logos/psg-logo.png"
          }, {
            name: "Veszprém HC",
            logo: "https://www.handballveszprem.hu/wp-content/themes/veszprem/images/logo.png"
          }, {
            name: "SC Magdeburg",
            logo: "https://www.scm-handball.de/typo3conf/ext/theme_scm/Resources/Public/Images/scm-logo.svg"
          }, {
            name: "Aalborg Håndbold",
            logo: "https://www.aalborghaandbold.dk/wp-content/themes/aalborg/images/logo.svg"
          }, {
            name: "RK Vardar",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/RK_Vardar_logo.svg/200px-RK_Vardar_logo.svg.png"
          }, {
            name: "Montpellier HB",
            logo: "https://www.montpellierhandball.com/wp-content/themes/mhb/images/logo.png"
          }, {
            name: "SG Flensburg",
            logo: "https://www.sg-flensburg-handewitt.de/fileadmin/templates/images/logo.svg"
          }].map((club, index) => <motion.div key={club.name} className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group" initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.3,
            delay: index * 0.05
          }}>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                  <img src={club.logo} alt={club.name} className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110" onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-primary font-bold text-lg">${club.name.split(' ').map(word => word[0]).join('').slice(0, 3)}</span>`;
              }} />
                </div>
                <span className="text-muted-foreground text-center text-lg">{club.name}</span>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Request Access Form Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 max-w-6xl">
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
                Request FREE Access to iHandball
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of players who are already using iHandball to advance their careers 
                and connect with clubs worldwide.
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
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="First name" className="bg-background border-border text-lg h-12" required />
                  <Input placeholder="Last name" className="bg-background border-border text-lg h-12" required />
                </div>
                
                <div className="flex gap-2">
                  <select className="w-28 h-12 px-2 rounded-md border border-border bg-background text-foreground text-lg">
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+45">🇩🇰 +45</option>
                    <option value="+46">🇸🇪 +46</option>
                    <option value="+47">🇳🇴 +47</option>
                    <option value="+48">🇵🇱 +48</option>
                    <option value="+385">🇭🇷 +385</option>
                    <option value="+381">🇷🇸 +381</option>
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+386">🇸🇮 +386</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+43">🇦🇹 +43</option>
                  </select>
                  <Input type="tel" placeholder="Phone number" className="bg-background border-border flex-1 text-lg h-12" required />
                </div>

                <Input placeholder="Current club (or 'Free Agent')" className="bg-background border-border text-lg h-12" required />

                <Input type="date" placeholder="Date of birth" className="bg-background border-border text-lg h-12" required />
                
                <select className="w-full h-12 px-3 rounded-md border border-border bg-background text-foreground text-lg" required>
                  <option value="" disabled selected>Which best describes you?</option>
                  <option value="player">Player</option>
                  <option value="club_staff">Club Staff</option>
                  <option value="agent">Agent</option>
                  <option value="journalist">Journalist</option>
                  <option value="other">Other</option>
                </select>
                
                <div>
                  <p className="text-lg text-foreground mb-2">Are you a current iHandball customer?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-foreground text-lg cursor-pointer">
                      <input type="radio" name="ihandball_customer" value="yes" className="w-5 h-5 accent-primary" required />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-foreground text-lg cursor-pointer">
                      <input type="radio" name="ihandball_customer" value="no" className="w-5 h-5 accent-primary" />
                      No
                    </label>
                  </div>
                </div>
                
                <select className="w-full h-12 px-3 rounded-md border border-border bg-background text-foreground text-lg" required>
                  <option value="" disabled selected>How did you hear about us?</option>
                  <option value="search_engine">Search Engine (Google, Bing, etc.)</option>
                  <option value="social_media">Social Media</option>
                  <option value="friend_colleague">Friend or Colleague</option>
                  <option value="club_recommendation">Club Recommendation</option>
                  <option value="federation">Federation</option>
                  <option value="event_conference">Event or Conference</option>
                  <option value="news_article">News Article</option>
                  <option value="podcast">Podcast</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="email">Email</option>
                  <option value="ihandball">iHandball</option>
                  <option value="other">Other</option>
                </select>
                
                <Button variant="hero" size="lg" className="w-full text-lg">
                  Submit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-muted-foreground text-center text-lg">
                  By registering, you confirm that you have read and agree to the processing of your personal data by iHandball as described in the Privacy Policy.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* As Featured On Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-10" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <h3 className="text-xl font-semibold text-muted-foreground">As featured on</h3>
          </motion.div>
          
          <motion.div className="flex flex-wrap justify-center items-center gap-6 md:gap-10" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            {[{
            name: "ESPN",
            logo: "https://a.espncdn.com/combiner/i?img=/i/espn/misc/espn_logo_450x500.png"
          }, {
            name: "Handball World",
            logo: "https://www.handball-world.news/o/layout-2016/images/hw-logo.png"
          }, {
            name: "EHF",
            logo: "/logos/ehf.svg"
          }, {
            name: "Sport1",
            logo: "https://www.sport1.de/resources/images/sport1-logo.svg"
          }, {
            name: "L'Équipe",
            logo: "/logos/lequipe-alt.png"
          }].map((media, index) => <motion.div key={media.name} className="px-6 py-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group h-16 flex items-center justify-center min-w-[120px]" initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.3,
            delay: index * 0.05
          }}>
                <img src={media.logo} alt={media.name} className="h-8 max-w-[100px] object-contain transition-all duration-300 group-hover:scale-110" onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-lg font-bold text-muted-foreground">${media.name}</span>`;
            }} />
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      <TestimonialsCarousel title="Players Who Made It" subtitle="Real stories from players who advanced their careers with iHandball" testimonials={playerTestimonials} />

      <Footer />
    </div>;
};
export default Players;