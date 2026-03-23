import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
const Contact = () => {
  return <section id="contact" className="py-24 bg-primary min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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
              Start connecting.   
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join 500+ clubs, players, and trainers who are already using HandballXfer 
              to connect, discover, and grow in the handball world.
            </p>
            
          </motion.div>

          {/* Right Form */}
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
    </section>;
};
export default Contact;