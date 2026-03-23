import { motion } from "framer-motion";
const clubs = [{
  name: "THW Kiel",
  country: "Germany"
}, {
  name: "FC Barcelona",
  country: "Spain"
}, {
  name: "PSG Handball",
  country: "France"
}, {
  name: "SC Magdeburg",
  country: "Germany"
}, {
  name: "Veszprém HC",
  country: "Hungary"
}, {
  name: "Aalborg",
  country: "Denmark"
}, {
  name: "Montpellier",
  country: "France"
}, {
  name: "Flensburg",
  country: "Germany"
}];
const PartnerClubs = () => {
  return <section id="clubs" className="py-20 bg-secondary/20 min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 max-w-6xl w-full">
        <motion.div className="text-center mb-16" initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-gradient">clubs in all leagues</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the network of top handball clubs already using our platform
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          {clubs.map((club, index) => <motion.div key={index} className="glass rounded-xl p-8 text-center hover:border-primary/30 transition-all duration-300 group" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          delay: index * 0.05
        }}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-bold text-primary">{club.name.charAt(0)}</span>
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-1">{club.name}</h3>
              <p className="text-muted-foreground">{club.country}</p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default PartnerClubs;