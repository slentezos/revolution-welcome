import { useState, useEffect } from "react";
import {
  Gift,
  UserPlus,
  Mail,
  Heart,
  Shield,
  Clock,
  Star,
  CheckCircle2,
  Ticket,
  Share2,
  Copy,
  MessageCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    title: "Obtenez votre lien unique",
    description: "En tant que membre, nous vous confions des invitations privilégiées à partager.",
  },
  {
    icon: Share2,
    title: "Transmettez l'invitation",
    description: "Envoyez le message pré-rédigé par WhatsApp, e-mail ou SMS en un seul clic.",
  },
  {
    icon: Heart,
    title: "Il/elle découvre Kalimera",
    description: "Votre proche active son accès de 3 mois offerts et commence de belles rencontres.",
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
              <h3 className="font-heading text-2xl mb-3 md:text-2xl text-[#0e172a] font-medium">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto text-2xl">{step.description}</p>
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
    q: "Qui peut être invité ?",
    a: "Toute personne de 60 ans et plus, à la recherche de l'amour ou de l'amitié. Un parent, un ami, un voisin… offrez du bonheur !",
  },
  {
    q: "Comment mon proche recevra-t-il son invitation ?",
    a: "Vous lui transmettez directement le message via l'application de votre choix (WhatsApp, SMS, E-mail). C'est vous qui faites le premier pas.",
  },
  {
    q: "Puis-je inviter plusieurs personnes ?",
    a: "Vous disposez de 3 invitations. Choisissez avec soin. Kalimera grandit grâce à la qualité de ses membres. Nous vous suggérons d'inviter en priorité les personnes de votre entourage qui apprécieront cette nouvelle élégance.",
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

/* ─── Section 5 — Bottom Form (SÉCURISÉ & UX 2026 - PARTAGE PUBLIC) ─── */
function FormSection() {
  const revealRef = useScrollReveal<HTMLElement>();

  // Gestion du Soft-Lock (LocalStorage) pour les visiteurs publics
  const [invitesLeft, setInvitesLeft] = useState<number>(3);
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setShareSupported(true);
    }
    const savedInvites = localStorage.getItem("kalimera_public_invites");
    if (savedInvites !== null) {
      setInvitesLeft(parseInt(savedInvites, 10));
    }
  }, []);

  const decrementInvites = () => {
    if (invitesLeft > 0) {
      const newCount = invitesLeft - 1;
      setInvitesLeft(newCount);
      localStorage.setItem("kalimera_public_invites", newCount.toString());
    }
  };

  const inviteLink = "https://kalimera.fr/cercle/invitation-privee";
  const inviteText =
    "Bonjour, je te partage ce nouveau site de rencontres, Kalimera. C'est très sérieux et élégant. J'ai une invitation qui t'offre les 3 premiers mois si tu veux regarder. Voici mon lien :";
  const fullMessage = `${inviteText}\n\n${inviteLink}`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Votre invitation privée Kalimera",
        text: inviteText,
        url: inviteLink,
      });
      decrementInvites();
    } catch (err: any) {
      // SÉCURITÉ UX : Si l'utilisateur a juste fermé le menu (Annulation), on ne fait rien
      if (err.name === "AbortError" || (err.message && err.message.includes("abort"))) {
        console.log("Partage annulé par l'utilisateur.");
        return;
      }
      // Si c'est un vrai blocage technique, on active le Plan B (Copie)
      console.log("Partage natif non supporté/bloqué, bascule sur la copie.");
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      decrementInvites();
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Échec de la copie", err);
    }
  };

  return (
    <section id="formulaire" ref={revealRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={parrainageFormBg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/90" />
      </div>

      <div className="relative z-10 container-main max-w-4xl">
        <div className="card-luxury bg-background/5 border-white/10 backdrop-blur-md p-8 md:p-16 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--gold)/0.1)] border border-[hsl(var(--gold)/0.3)] mb-8">
            <Ticket className="w-8 h-8 text-[hsl(var(--gold))]" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl mb-6">Transmettez vos privilèges</h2>
          <p className="opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed text-2xl">
            Partagez votre bonheur en offrant 3 mois d'abonnement à vos proches. C'est offert par Kalimera.
          </p>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-10 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <MessageCircle className="w-12 h-12" />
            </div>
            <p className="italic leading-relaxed relative z-10 text-xl">« {inviteText} »</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Button
              onClick={handleNativeShare}
              disabled={invitesLeft <= 0}
              className="h-16 rounded-xl bg-white text-primary hover:bg-white/90 font-medium text-xl"
            >
              <Share2 className="w-5 h-5 mr-3" />
              {shareSupported ? "Partager" : "Copier le lien"}
            </Button>

            <a
              href={invitesLeft > 0 ? `https://wa.me/?text=${encodeURIComponent(fullMessage)}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (invitesLeft <= 0) e.preventDefault();
                else decrementInvites();
              }}
              className={`flex items-center justify-center h-16 rounded-xl border border-white/20 hover:bg-white/5 transition-all font-medium ${invitesLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""} text-xl`}
            >
              <MessageCircle className="w-5 h-5 mr-3 text-[#25D366]" />
              WhatsApp
            </a>

            <button
              onClick={handleCopy}
              disabled={invitesLeft <= 0}
              className={`flex items-center justify-center h-16 rounded-xl border border-white/20 hover:bg-white/5 transition-all font-medium ${invitesLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""} text-xl`}
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 mr-3 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 mr-3 text-[hsl(var(--gold))]" />
              )}
              {copied ? "Copié !" : "Copier le message"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--gold))] animate-pulse" />
            <span className="opacity-60 uppercase tracking-widest text-xl">
              {invitesLeft} invitation{invitesLeft > 1 ? "s" : ""} restante{invitesLeft > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

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
