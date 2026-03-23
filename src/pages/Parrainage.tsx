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

      <div className="relative z-10 w-full text-xl text-[#d1d1d1]">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 mb-8 backdrop-blur-sm">
              <Ticket className="w-5 h-5 text-[#D4AF37] mr-2" />
              <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest">
                Il vous reste 3 invitations ce mois-ci
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl text-white mb-4 leading-tight">
              {step === "form" ? "Créez votre carte d'invitation" : "Aperçu de votre cadeau"}
            </h2>
            <div className="divider-gold mx-auto mt-6 mb-2" />
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl transition-all duration-500">
            {/* ETAPE 1 : LE FORMULAIRE */}
            {step === "form" && (
              <form onSubmit={handlePreview} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* HONEYPOT (Invisible pour les humains, appât pour les bots) */}
                <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_url_trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_url_trap}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-white/80 text-lg">Votre prénom</Label>
                    <Input
                      required
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      placeholder="Ex: Jean"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14 text-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white/80 text-lg flex items-center justify-between">
                      Votre e-mail{" "}
                      {isEmailValid(formData.senderEmail) && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    </Label>
                    <Input
                      required
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14 text-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-3">
                    <Label className="text-[#D4AF37] text-lg font-bold">Prénom de l'invité(e)</Label>
                    <Input
                      required
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      placeholder="Ex: Marie"
                      className="bg-black/20 border-black/20 text-white placeholder:text-white/30 h-14 text-lg focus-visible:ring-[#D4AF37] rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[#D4AF37] text-lg font-bold flex items-center justify-between">
                      Son e-mail{" "}
                      {isEmailValid(formData.receiverEmail) && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    </Label>
                    <Input
                      required
                      type="email"
                      name="receiverEmail"
                      value={formData.receiverEmail}
                      onChange={handleInputChange}
                      placeholder="son@email.com"
                      className="bg-black/20 border-black/20 text-white placeholder:text-white/30 h-14 text-lg focus-visible:ring-[#D4AF37] rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white/80 text-lg flex items-center justify-between">
                    Message personnel{" "}
                    <span className="text-sm font-normal text-white/40">
                      (Les liens web sont désactivés par sécurité)
                    </span>
                  </Label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Un petit mot affectueux pour accompagner votre cadeau..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#D4AF37] resize-none rounded-xl text-lg p-4"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333] py-7 text-xl rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Eye className="w-6 h-6" /> Prévisualiser la carte
                </Button>

                <p className="text-center text-white/40 text-sm italic mt-4">
                  En continuant, vous acceptez notre{" "}
                  <Link to="/charte-bienveillance" className="underline hover:text-white/70">
                    charte de bienveillance
                  </Link>
                  .
                </p>
              </form>
            )}

            {/* ETAPE 2 : LA PRÉVISUALISATION (LA FRICTION POSITIVE) */}
            {step === "preview" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-[#FDFBF7] rounded-[24px] p-8 md:p-12 text-[#1B2333] shadow-2xl relative overflow-hidden mb-8 border border-[#D4AF37]/30">
                  {/* Ornements visuels pour faire "Carte cadeau" */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]" />
                  <Gift className="w-16 h-16 text-[#D4AF37]/20 absolute top-8 right-8" />

                  <p className="font-heading text-2xl mb-6">
                    Chèr(e) <span className="font-bold text-[#D4AF37]">{formData.receiverName}</span>,
                  </p>
                  <p className="text-xl leading-relaxed mb-8">
                    <strong>{formData.senderName}</strong> a pensé à vous et souhaite vous offrir{" "}
                    <strong>3 mois d'accès privilégié</strong> à Kalimera, la plateforme de rencontres dédiée à
                    l'élégance et à l'authenticité.
                  </p>

                  {formData.message && (
                    <div className="bg-white p-6 rounded-xl border border-gray-100 italic text-lg text-gray-600 shadow-sm">
                      "{formData.message}"
                    </div>
                  )}

                  <div className="mt-10 text-center">
                    <div className="inline-block border-2 border-[#1B2333] text-[#1B2333] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm opacity-50">
                      Bouton d'accès sécurisé
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={() => setStep("form")}
                    variant="outline"
                    className="flex-1 py-7 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent h-auto"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="flex-[2] bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1B2333] py-7 text-xl rounded-xl font-bold shadow-xl transition-all h-auto flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      "Envoi sécurisé en cours..."
                    ) : (
                      <>
                        <Send className="w-6 h-6" /> Confirmer et Envoyer
                      </>
                    )}
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
      <FormSection />
    </Layout>
  );
}
