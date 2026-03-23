import { motion } from "framer-motion";
const clubs = [{
  name: "THW Kiel",
  logo: "https://www.thw-handball.de/fileadmin/templates/images/thw_logo.svg"
}, {
  name: "FC Barcelona",
  logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg"
}, {
  name: "PSG Handball",
  logo: "https://www.psg.fr/img/logos/psg-logo.png"
}, {
  name: "SC Magdeburg",
  logo: "https://www.scm-handball.de/typo3conf/ext/theme_scm/Resources/Public/Images/scm-logo.svg"
}, {
  name: "Veszprém HC",
  logo: "https://www.handballveszprem.hu/wp-content/themes/veszprem/images/logo.png"
}, {
  name: "Aalborg",
  logo: "https://www.aalborghaandbold.dk/wp-content/themes/aalborg/images/logo.svg"
}, {
  name: "Montpellier",
  logo: "https://www.montpellierhandball.com/wp-content/themes/mhb/images/logo.png"
}, {
  name: "Flensburg",
  logo: "https://www.sg-flensburg-handewitt.de/fileadmin/templates/images/logo.svg"
}, {
  name: "Pick Szeged",
  logo: "https://www.pickhandball.hu/images/logo.svg"
}, {
  name: "Kielce",
  logo: "https://www.vfrankreich.de/images/handball/lomza-vive-kielce.png"
}];
const TrustedClubs = () => {
  return <section className="py-20 bg-background border-y border-border">
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
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Trusted by decision makers from clubs worldwide</h2>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center items-center gap-6 md:gap-10" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          {clubs.map((club, index) => <motion.div key={index} className="flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 p-4 group" initial={{
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
              <img src={club.logo} alt={club.name} className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110" onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<span class="text-lg font-bold text-primary">${club.name.split(' ').map(word => word[0]).join('').slice(0, 3)}</span>`;
          }} />
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default TrustedClubs;