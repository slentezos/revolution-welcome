import { useState, useRef } from "react";
import {
  Gift,
  Share2,
  MessageCircle,
  Heart,
  Shield,
  Clock,
  Star,
  Copy,
  CheckCircle2,
  Ticket,
  Mail,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import parrainageHero from "@/assets/parrainage-hero.jpg";
import parrainageFormBg from "@/assets/parrainage-form-bg.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ─── Section 1 — Hero ─── */
function HeroSection() {
  const revealRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  return (
    <section ref={revealRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={parrainageHero} alt="Couple senior s'offrant un cadeau" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/95" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-24">
        <div
          data-reveal
          className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-[hsl(var(--gold)/0.4)] mb-8"
        >
          <Gift className="w-9 h-9 text-[hsl(var(--gold))]" />
        </div>
        <div data-reveal data-reveal-delay="150" className="divider-gold mx-auto mb-8" />
        <h1
          data-reveal
          data-reveal-delay="300"
          className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight text-balance"
        >
          Offrez 3 mois de rencontres
          <br />
          <span className="text-[hsl(var(--gold-light))]">à un proche</span>
        </h1>
        <p
          data-reveal
          data-reveal-delay="450"
          className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium text-white"
        >
          Le plus beau cadeau ? Une nouvelle chance de bonheur. Invitez une personne de confiance à rejoindre le Cercle
          Kalimera.
        </p>
        <div data-reveal data-reveal-delay="600">
          <a
            href="#invitation"
            className="inline-flex items-center justify-center bg-[#D4AF37] text-[#1B2333] px-12 py-5 text-xl font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:bg-[#D4AF37]/90 hover:-translate-y-1"
          >
            Générer mon invitation
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 2 — How it Works ─── */
const steps = [
  {
    icon: Ticket,
    title: "Obtenez votre sésame",
    description: "Générez instantanément un lien d'invitation unique, crypté et sécurisé.",
  },
  {
    icon: Share2,
    title: "Transmettez l'accès",
    description: "Partagez ce lien par WhatsApp, SMS ou e-mail à la personne de votre choix.",
  },
  {
    icon: Heart,
    title: "Il/elle découvre Kalimera",
    description: "Votre proche active son invitation et profite de ses 3 mois offerts en toute discrétion.",
  },
];

function HowItWorksSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-[#FCF9FF]">
      <div className="container-main">
        <div className="text-center mb-16">
          <p data-reveal className="text-[#D4AF37] font-medium tracking-widest uppercase mb-4 text-xl">
            L'art de recevoir
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#1B2333] mb-4"
          >
            Comment inviter un proche ?
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step, i) => (
            <div key={i} data-reveal data-reveal-delay={String(100 + i * 150)} className="text-center group">
              <p className="font-heading text-[#D4AF37]/20 mb-4 font-medium text-7xl">0{i + 1}</p>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gray-200 bg-white mb-6 transition-all duration-500 group-hover:border-[#D4AF37] group-hover:shadow-lg">
                <step.icon className="w-8 h-8 text-[#1B2333]" />
              </div>
              <h3 className="font-heading text-xl mb-3 md:text-2xl text-[#1B2333] font-medium">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3 — Value Proposition ─── */
const values = [
  {
    icon: Shield,
    title: "Cercle privé et sécurisé",
    description: "Chaque membre est validé manuellement. L'anonymat et la sécurité sont nos priorités absolues.",
  },
  {
    icon: Star,
    title: "Affinités réelles",
    description: "Un algorithme d'excellence conçu spécifiquement pour les attentes des plus de 60 ans.",
  },
  {
    icon: Clock,
    title: "3 mois, sans contrainte",
    description: "Votre proche profite d'une carte blanche totale pendant 3 mois. Aucun renouvellement caché.",
  },
];

function ValuePropositionSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-white">
      <div className="container-main">
        <div className="text-center mb-16">
          <p data-reveal className="text-[#D4AF37] font-medium tracking-widest uppercase mb-4 text-xl">
            Pourquoi Kalimera
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#1B2333] mb-4"
          >
            Un cadeau inestimable
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              data-reveal
              data-reveal-delay={String(100 + i * 150)}
              className="p-10 rounded-3xl bg-[#FCF9FF] border border-gray-100 text-center transition-transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1B2333] mb-6 shadow-md">
                <v.icon className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-heading text-xl text-[#1B2333] mb-4 md:text-2xl">{v.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4 — FAQ ─── */
const faqs = [
  {
    q: "L'offre est-elle réellement sans engagement ?",
    a: "Absolument. Votre proche accède à l'intégralité du Cercle Prestige pendant 3 mois. Aucune carte bancaire ne lui sera demandée à l'inscription.",
  },
  {
    q: "Puis-je envoyer le lien à plusieurs personnes ?",
    a: "Chaque lien d'invitation généré est unique et ne peut être utilisé qu'une seule fois. Vous disposez de 3 invitations privées au total pour garantir l'exclusivité du Cercle.",
  },
  {
    q: "Comment envoyer l'invitation si je suis sur mon ordinateur ?",
    a: "Notre système s'adapte automatiquement. Si vous êtes sur un ordinateur, vous pourrez copier le message prêt à l'emploi ou ouvrir directement WhatsApp Web ou votre boîte e-mail.",
  },
];

function FAQSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-[#FCF9FF]">
      <div className="container-main max-w-3xl">
        <div className="text-center mb-16">
          <p data-reveal className="text-[#D4AF37] font-medium tracking-widest uppercase mb-4 text-xl">
            Transparence
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#1B2333] mb-4"
          >
            Vos questions, nos réponses
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div data-reveal data-reveal-delay="350">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm"
              >
                <AccordionTrigger className="font-heading text-lg md:text-xl text-[#1B2333] hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-lg pb-6">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5 — Invitation Générateur (SÉCURISÉ & UX 2026) ─── */
function InvitationSection() {
  const { toast } = useToast();
  const revealRef = useScrollReveal<HTMLElement>();

  const [step, setStep] = useState<"initial" | "generating" | "ready">("initial");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Message pré-rédigé ultra-premium
  const getShareMessage = (code: string) => {
    return `Bonjour, j'ai découvert Kalimera, un cercle privé pour faire de belles rencontres. J'ai obtenu un accès confidentiel pour t'offrir tes 3 premiers mois. Voici le lien direct : https://kalimera.fr/cercle/${code}`;
  };

  const handleGenerate = () => {
    setStep("generating");
    // Simulation d'un appel API sécurisé pour générer un lien unique
    setTimeout(() => {
      const mockUniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setInviteCode(mockUniqueCode);
      setStep("ready");
    }, 1500);
  };

  const handleNativeShare = async () => {
    const text = getShareMessage(inviteCode);

    // UX 2026 : Si le mobile/navigateur supporte le partage natif (iOS/Android)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Votre invitation Kalimera",
          text: text,
        });
        toast({ title: "Excellente nouvelle", description: "Votre invitation a été transmise." });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      // Dégradation Gracieuse : Copie dans le presse-papier pour les PC
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Message copié", description: "Le message et le lien sont copiés. Vous pouvez les coller." });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppWeb = () => {
    const text = encodeURIComponent(getShareMessage(inviteCode));
    window.open(`https://web.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleEmailDesktop = () => {
    const subject = encodeURIComponent("Une invitation privée pour Kalimera");
    const body = encodeURIComponent(getShareMessage(inviteCode));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <section ref={revealRef} id="invitation" className="relative overflow-hidden min-h-[80vh] flex items-center py-24">
      <div className="absolute inset-0">
        <img src={parrainageFormBg} alt="Ambiance élégante" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2333]/95 via-[#1B2333]/90 to-[#1B2333]/95" />
      </div>

      <div className="relative z-10 w-full text-xl text-white">
        <div className="container-main max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-8 backdrop-blur-md shadow-lg">
              <Ticket className="w-5 h-5 text-[#D4AF37] mr-2" />
              <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest">
                Vos privilèges : 3 invitations
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-white mb-4 leading-tight">Générer une invitation</h2>
            <div className="divider-gold mx-auto mt-6 mb-2" />
          </div>

          {/* La Carte Digitale */}
          <div className="bg-[#1B2333] border border-[#D4AF37]/30 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[400px] flex flex-col justify-center">
            {/* Ornements visuels */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

            {step === "initial" && (
              <div className="text-center animate-in fade-in duration-500">
                <Gift className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
                <p className="text-xl text-white/80 leading-relaxed mb-10">
                  Créez un accès unique et sécurisé. Vous pourrez ensuite l'envoyer directement via l'application de
                  votre choix (WhatsApp, SMS, E-mail).
                </p>
                <Button
                  onClick={handleGenerate}
                  className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333] py-7 text-xl rounded-xl font-bold shadow-xl transition-all h-auto"
                >
                  Générer le lien d'accès
                </Button>
              </div>
            )}

            {step === "generating" && (
              <div className="text-center animate-in fade-in duration-500 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-6" />
                <p className="text-xl text-[#D4AF37] font-medium tracking-wide">Création de la clé sécurisée...</p>
              </div>
            )}

            {step === "ready" && (
              <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                  <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">
                    Code d'invitation généré
                  </p>
                  <p className="font-mono text-3xl text-[#D4AF37] tracking-[0.2em]">{inviteCode}</p>
                </div>

                {/* Bouton Principal (Smart : Share API ou Copy) */}
                <Button
                  onClick={handleNativeShare}
                  className={`w-full py-7 text-xl rounded-xl font-bold shadow-xl transition-all h-auto mb-6 flex items-center justify-center gap-3 ${copied ? "bg-green-500 text-white hover:bg-green-600" : "bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333]"}`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" /> Invitation copiée
                    </>
                  ) : (
                    <>
                      <Share2 className="w-6 h-6" /> Transmettre l'invitation
                    </>
                  )}
                </Button>

                {/* Boutons Fallback pour PC */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-white/10">
                  <Button
                    onClick={handleWhatsAppWeb}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 h-auto text-lg rounded-xl"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Web
                  </Button>
                  <Button
                    onClick={handleEmailDesktop}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 h-auto text-lg rounded-xl"
                  >
                    <Mail className="w-5 h-5 mr-2" /> Par E-mail
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
export default function Parrainage() {
  return (
    <Layout>
      <HeroSection />
      <HowItWorksSection />
      <ValuePropositionSection />
      <FAQSection />
      <InvitationSection />
    </Layout>
  );
}
