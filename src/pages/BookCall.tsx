import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const BookCall = () => {
  const benefits = [
    "Discover talent from 50+ countries",
    "Real-time market intelligence",
    "Direct access to decision makers",
    "Streamlined transfer negotiations"
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left - Form Section */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto w-full"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">i</span>
              </div>
              <span className="text-xl font-bold text-foreground">iHandball</span>
            </Link>

            <form className="space-y-5">
              <Input 
                placeholder="First name" 
                className="bg-background border-border text-base h-12" 
                required
              />
              <Input 
                placeholder="Last name" 
                className="bg-background border-border text-base h-12" 
                required
              />
              <Input 
                type="email"
                placeholder="Email" 
                className="bg-background border-border text-base h-12" 
                required
              />
              
              <div className="flex gap-2">
                <select className="w-32 h-12 px-2 rounded-md border border-border bg-background text-foreground text-base">
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
                <Input 
                  type="tel"
                  placeholder="Mobile number" 
                  className="bg-background border-border flex-1 text-base h-12" 
                  required
                />
              </div>
              
              <select className="w-full h-12 px-3 rounded-md border border-border bg-background text-foreground text-base" required>
                <option value="" disabled selected>Which best describes you?</option>
                <option value="player">Player</option>
                <option value="club_staff">Club Staff</option>
                <option value="agent">Agent</option>
                <option value="journalist">Journalist</option>
                <option value="other">Other</option>
              </select>
              
              <select className="w-full h-12 px-3 rounded-md border border-border bg-background text-foreground text-base" required>
                <option value="" disabled selected>Are you a current iHandball customer?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              
              <select className="w-full h-12 px-3 rounded-md border border-border bg-background text-foreground text-base" required>
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
              
              <p className="text-muted-foreground text-sm">
                By registering, you confirm that you have read and agree to the processing of your personal data by iHandball as described in the{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
              
              <Button variant="hero" size="lg" className="w-full">
                Submit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Right - Branding Section */}
        <div className="hidden lg:flex bg-primary relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6">
                Breaking down barriers
                <br />
                in the transfer market
              </h1>
              
              <h2 className="text-xl font-semibold text-primary-foreground mb-4">
                Trusted all over the world
              </h2>
              
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-lg">
                We empower handball clubs, agents and players to be successful in the transfer market by giving them real-time market intelligence and direct access to a global network of decision makers.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    <span className="text-primary-foreground/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-12 mt-12">
                <div>
                  <div className="text-3xl font-bold text-primary-foreground">500+</div>
                  <div className="text-primary-foreground/70">Clubs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-foreground">10k+</div>
                  <div className="text-primary-foreground/70">Players</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-foreground">50+</div>
                  <div className="text-primary-foreground/70">Countries</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookCall;
