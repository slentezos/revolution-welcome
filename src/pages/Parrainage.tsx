import { useState, useRef } from "react";
import { Gift, UserPlus, Mail, Heart, Shield, Clock, Star, Eye, Send, CheckCircle2, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
          Le plus beau cadeau ? Une nouvelle chance de bonheur. Invitez quelqu'un de votre entourage à découvrir
          Kalimera.
        </p>
        <div data-reveal data-reveal-delay="600">
          <a
            href="#formulaire"
            className="inline-block bg-primary-foreground text-primary px-12 py-5 text-lg font-medium tracking-wide transition-all duration-500 hover:shadow-elevated hover:translate-y-[-2px]"
          >
            Offrir maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 2 — How it Works ─── */
const steps = [
  {
    icon: UserPlus,
    title: "Remplissez le formulaire",
    description: "Indiquez vos coordonnées et celles de la personne que vous souhaitez inviter.",
  },
  {
    icon: Mail,
    title: "Nous envoyons l'invitation",
    description: "Votre proche reçoit un e-mail personnalisé avec son accès offert de 3 mois.",
  },
  {
    icon: Heart,
    title: "Il/elle découvre Kalimera",
    description: "Votre proche crée son profil et commence à recevoir des propositions de rencontres.",
  },
];

function HowItWorksSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-secondary">
      <div className="container-main">
        <div className="text-center mb-16">
          <p data-reveal className="text-[hsl(var(--gold))] font-medium tracking-widest uppercase mb-4 text-xl">
            Simple & rapide
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
          >
            Comment ça marche ?
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step, i) => (
            <div key={i} data-reveal data-reveal-delay={String(100 + i * 150)} className="text-center group">
              <p className="font-heading text-[hsl(var(--gold)/0.2)] mb-4 font-medium text-7xl">0{i + 1}</p>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-border bg-background mb-6 transition-all duration-500 group-hover:border-[hsl(var(--gold))] group-hover:shadow-[var(--shadow-card)]">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl mb-3 md:text-2xl text-[#0e172a] font-medium">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto text-xl">{step.description}</p>
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
    title: "Profils vérifiés manuellement",
    description: "Chaque membre est validé par notre équipe pour garantir des échanges authentiques et respectueux.",
  },
  {
    icon: Star,
    title: "Compatibilité à 75%",
    description: "Notre algorithme propriétaire assure un taux d'affinité réciproque exceptionnel entre les membres.",
  },
  {
    icon: Clock,
    title: "3 mois offerts, sans engagement",
    description: "Votre proche profite de l'accès complet pendant 3 mois, sans aucune obligation, ni frais cachés.",
  },
];

function ValuePropositionSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-background">
      <div className="container-main">
        <div className="text-center mb-16">
          <p data-reveal className="text-[hsl(var(--gold))] font-medium tracking-widest uppercase mb-4 text-xl">
            Pourquoi Kalimera
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
          >
            Un cadeau qui a du sens
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} data-reveal data-reveal-delay={String(100 + i * 150)} className="card-luxury text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-6">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3 md:text-3xl">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-xl">{v.description}</p>
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
    q: "L'offre est-elle vraiment gratuite ?",
    a: "Oui, votre proche bénéficie de 3 mois d'accès complet à Kalimera, sans frais ni engagement. À l'issue de la période, il pourra choisir de poursuivre ou non.",
  },
  {
    q: "Qui peut être parrainé ?",
    a: "Toute personne de 60 ans et plus, et à la recherche de l'amour ou de l'amitié. Un parent, un ami, un voisin… offrez du bonheur !",
  },
  {
    q: "Comment mon proche recevra-t-il son invitation ?",
    a: "Un e-mail personnalisé lui sera envoyé avec un lien d'inscription et un message de votre part si vous le souhaitez.",
  },
  {
    q: "Mon proche saura-t-il que c'est moi qui l'ai invité ?",
    a: "Oui, votre prénom sera mentionné dans l'e-mail d'invitation. Si vous préférez rester anonyme, précisez-le dans le message.",
  },
  {
    q: "Puis-je inviter plusieurs personnes ?",
    a: "Choisissez avec soin. Kalimera grandit grâce à la qualité de ses membres. Nous vous suggérons d'inviter en priorité les 3 personnes de votre entourage qui apprécieront le plus cette nouvelle élégance.",
  },
];

function FAQSection() {
  const revealRef = useScrollReveal<HTMLElement>();
  return (
    <section ref={revealRef} className="section-luxury bg-secondary">
      <div className="container-main max-w-3xl">
        <div className="text-center mb-16">
          <p data-reveal className="text-[hsl(var(--gold))] font-medium tracking-widest uppercase mb-4 text-xl">
            Questions fréquentes
          </p>
          <h2
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4"
          >
            Vos questions, nos réponses
          </h2>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mt-6" />
        </div>
        <div data-reveal data-reveal-delay="350">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-background border border-border rounded-sm px-6 shadow-[var(--shadow-soft)]"
              >
                <AccordionTrigger className="font-heading text-lg md:text-xl text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5 — Bottom Form (SÉCURISÉ & UX 2026) ─── */
function FormSection() {
  const { toast } = useToast();
  const revealRef = useScrollReveal<HTMLElement>();

  const [step, setStep] = useState<"form" | "preview">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    receiverName: "",
    receiverEmail: "",
    message: "",
    website_url_trap: "", // HONEYPOT (Champ invisible pour piéger les bots)
  });

  // Regex simple pour valider l'email en temps réel
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // SÉCURITÉ : Interdire la saisie de liens (http://, https://, www.) dans le message
    if (name === "message") {
      const sanitizedValue = value.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi, "");
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("preview");
  };

  const handleFinalSubmit = () => {
    setLoading(true);

    // SÉCURITÉ INVISIBLE : Si le bot a rempli le champ caché, on bloque silencieusement.
    if (formData.website_url_trap.length > 0) {
      setTimeout(() => {
        setLoading(false);
        setStep("form");
        setFormData({
          senderName: "",
          senderEmail: "",
          receiverName: "",
          receiverEmail: "",
          message: "",
          website_url_trap: "",
        });
      }, 1000);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Magnifique !",
        description: `L'invitation a bien été envoyée à ${formData.receiverName}.`,
      });
      setStep("form");
      setFormData({
        senderName: "",
        senderEmail: "",
        receiverName: "",
        receiverEmail: "",
        message: "",
        website_url_trap: "",
      });
    }, 1500);
  };

  return (
    <section ref={revealRef} id="formulaire" className="relative overflow-hidden min-h-[80vh] flex items-center py-24">
      <div className="absolute inset-0">
        <img src={parrainageFormBg} alt="Couple senior écrivant ensemble" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2333]/95 via-[#1B2333]/90 to-[#1B2333]/95" />
      </div>

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
            <h2 className="font-heading text-3xl md:text-5xl text-white mb-4 leading-tight">
              Générer une invitation
            </h2>
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
                  Créez un accès unique et sécurisé. Vous pourrez ensuite l'envoyer directement via l'application de votre choix (WhatsApp, SMS, E-mail).
                </p>
                <Button onClick={handleGenerate} className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333] py-7 text-xl rounded-xl font-bold shadow-xl transition-all h-auto">
                  Générer le lien d'accès
                </Button>
              </div>
            )}

            {step === "generating" && (
              <div className="text-center animate-in fade-in duration-500 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-6" />
                <p className="text-xl text-[#D4AF37] font-medium tracking-wide">
                  Création de la clé sécurisée...
                </p>
              </div>
            )}

            {step === "ready" && (
              <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                  <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">Code d'invitation généré</p>
                  <p className="font-mono text-3xl text-[#D4AF37] tracking-[0.2em]">{inviteCode}</p>
                </div>

                {/* Bouton Principal (Smart : Share API ou Copy) */}
                <Button onClick={handleNativeShare} className={`w-full py-7 text-xl rounded-xl font-bold shadow-xl transition-all h-auto mb-6 flex items-center justify-center gap-3 ${copied ? "bg-green-500 text-white hover:bg-green-600" : "bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333]"}`}>
                  {copied ? <><CheckCircle2 className="w-6 h-6" /> Invitation copiée</> : <><Share2 className="w-6 h-6" /> Transmettre l'invitation</>}
                </Button>

                {/* Boutons Fallback pour PC */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-white/10">
                  <Button onClick={handleWhatsAppWeb} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 h-auto text-lg rounded-xl">
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Web
                  </Button>
                  <Button onClick={handleEmailDesktop} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 h-auto text-lg rounded-xl">
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