import { Link } from "react-router-dom";
import { ArrowRight, Mic, MicOff, Heart, ShieldCheck, Gift, Users, Send } from "lucide-react";
import contactMemberHero from "@/assets/contact-member-hero.jpg";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerContact from "@/assets/gift-banner-contact.jpg";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

/* ─── Parseur de ponctuation et mise en forme (copié de Messages.tsx / Écrire à Sophie) ─── */
const formatSpeech = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\bpoints? d['']interrogation\b/gi, "?")
    .replace(/\bpoints? d['']exclamation\b/gi, "!")
    .replace(/\bpoints de suspension\b/gi, "...")
    .replace(/\bnouveau paragraphe\b/gi, "\n\n")
    .replace(/\b(à|a) la ligne\b/gi, "\n")
    .replace(/\bretour (à|a) la ligne\b/gi, "\n")
    .replace(/\bvirgule\b/gi, ",")
    .replace(/\bpoint-virgule\b/gi, ";")
    .replace(/\bdeux points\b/gi, ":")
    .replace(/\bpoint\b/gi, ".")
    .replace(/\s+([,;:?.!])/g, "$1")
    .replace(/([?.!])\s*([a-zà-ÿ])/gi, (_m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
};

const capitalizeFirst = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

/* ─── FAQ Content ─── */
const faqSections = [
  {
    id: "esprit",
    icon: Heart,
    title: "L'Esprit Kalimera",
    questions: [
      {
        q: "Pourquoi s'adresser aux 60 ans et plus ?",
        a: "Parce que la maturité mérite un espace dédié. Kalimera a été pensé exclusivement pour les personnes qui ont vécu, qui savent ce qu'elles veulent, et qui recherchent une relation sincère et durable, sans superficialité.",
      },
      {
        q: "Comment garantissez-vous la qualité des profils ?",
        a: "Chaque inscription est vérifiée manuellement par notre équipe basée en France. Nous examinons l'authenticité des informations, la cohérence du profil et la sincérité de la démarche avant toute validation.",
      },
      {
        q: "Quelles sont vos valeurs fondamentales ?",
        a: "Bienveillance, authenticité et respect absolu de chaque membre. Nous croyons que chaque rencontre mérite d'être traitée avec soin, et que la qualité prime toujours sur la quantité.",
      },
    ],
  },
  {
    id: "admission",
    icon: Users,
    title: "Votre Admission",
    questions: [
      {
        q: "Comment fonctionne la vérification d'identité ?",
        a: "Nous vérifions chaque profil manuellement : cohérence des informations, authenticité de la photo et sincérité de la démarche. Ce processus garantit un environnement de confiance pour tous nos membres.",
      },
      {
        q: "Puis-je inviter un proche à rejoindre Kalimera ?",
        a: "Absolument. Chaque membre dispose d'invitations privilège à partager avec ses proches. C'est notre façon de grandir : par la recommandation et la confiance.",
      },
      {
        q: "Comment protégez-vous mes données personnelles ?",
        a: "Vos données sont hébergées en Europe, chiffrées et jamais partagées avec des tiers. Vous gardez le contrôle total sur vos informations et pouvez les supprimer à tout moment.",
      },
    ],
  },
  {
    id: "privileges",
    icon: Gift,
    title: "Vos Privilèges",
    questions: [
      {
        q: "En quoi consistent les 3 mois offerts ?",
        a: "À votre inscription, vous bénéficiez de 3 mois d'accès complet et gratuit à l'ensemble des services Kalimera. Aucun engagement, aucune carte bancaire requise.",
      },
      {
        q: "Quels sont les détails de l'abonnement ?",
        a: "Après la période d'essai, l'abonnement est proposé à un tarif accessible avec facturation mensuelle. Vous pouvez résilier à tout moment, sans frais ni justification.",
      },
      {
        q: "Quels services exclusifs sont inclus ?",
        a: "Propositions de rencontres personnalisées, conciergerie dédiée, événements privés et accompagnement par notre équipe. Chaque membre bénéficie d'une attention sur-mesure.",
      },
    ],
  },
  {
    id: "securite",
    icon: ShieldCheck,
    title: "Sécurité & Bienveillance",
    questions: [
      {
        q: "Comment signaler un comportement inapproprié ?",
        a: "Vous pouvez signaler tout comportement inadéquat directement depuis la messagerie ou via ce formulaire. Notre équipe intervient sous 24h pour préserver la sérénité de chaque membre.",
      },
      {
        q: "Quelles mesures de protection sont en place ?",
        a: "Modération proactive, vérification des profils, chiffrement des échanges et politique de tolérance zéro envers tout manquement au respect. Votre tranquillité est notre engagement.",
      },
      {
        q: "Puis-je bloquer un membre ?",
        a: "Oui, à tout moment et en toute discrétion. Le membre bloqué ne sera pas informé et ne pourra plus vous contacter ni voir votre profil.",
      },
    ],
  },
];

const contactMotifs = [
  { value: "profil", label: "Mon profil & mes informations" },
  { value: "match", label: "Mes propositions de rencontres" },
  { value: "abonnement", label: "Mon abonnement & facturation" },
  { value: "technique", label: "Problème technique" },
  { value: "signalement", label: "Sécurité & signalement" },
  { value: "autre", label: "Autre demande" },
];

export default function ContactMemberContent() {
  const [motif, setMotif] = useState("");
  const [message, setMessage] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const faqRef = useScrollReveal<HTMLElement>();
  const formRef = useScrollReveal<HTMLElement>();

  const isFormLocked = !motif;

  /* ─── Auto-expand textarea ─── */
  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, interimText, adjustTextareaHeight]);

  useEffect(() => {
    listeningRef.current = isListening;
  }, [isListening]);

  /* ─── Speech Recognition (init unique) ─── */
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: any) => {
      if (!listeningRef.current) return;

      let finalSegment = "";
      let interimSegment = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript || "";
        if (!transcript) continue;
        if (result.isFinal) finalSegment += transcript + " ";
        else interimSegment += transcript;
      }

      if (finalSegment) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let formattedFinal = formatSpeech(finalSegment).trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            formattedFinal = capitalizeFirst(formattedFinal);
          }
          const needsSpace =
            currentVal.length > 0 &&
            !currentVal.endsWith(" ") &&
            !currentVal.endsWith("\n") &&
            !formattedFinal.startsWith(",") &&
            !formattedFinal.startsWith(".");
          return currentVal + (needsSpace ? " " : "") + formattedFinal;
        });
      }

      setInterimText(formatSpeech(interimSegment));
      setTimeout(adjustTextareaHeight, 0);
    };

    recognition.onerror = () => {
      listeningRef.current = false;
      setIsListening(false);
      setInterimText("");
    };
    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch { /* noop */ }
      try { recognition.abort?.(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = useCallback(() => {
    if (listeningRef.current) {
      listeningRef.current = false;
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch { /* noop */ }
      try { recognitionRef.current?.abort?.(); } catch { /* noop */ }

      if (interimText) {
        setMessage((prev) => {
          const currentVal = prev || "";
          let finalInterim = interimText.trim();
          if (currentVal.trim() === "" || /[.!?]\s*$/.test(currentVal)) {
            finalInterim = capitalizeFirst(finalInterim);
          }
          const space = currentVal.length > 0 && !currentVal.endsWith(" ") ? " " : "";
          return currentVal + space + finalInterim + " ";
        });
      }
      setInterimText("");
    } else {
      if (!recognitionRef.current) {
        toast.error("La dictée vocale n'est pas supportée par votre navigateur.");
        return;
      }
      setInterimText("");
      setMessage((prev) => {
        const currentVal = prev || "";
        if (currentVal !== "" && !currentVal.endsWith(" ") && !currentVal.endsWith("\n")) {
          return currentVal + " ";
        }
        return currentVal;
      });
      try {
        recognitionRef.current.start();
        listeningRef.current = true;
        setIsListening(true);
      } catch {
        listeningRef.current = false;
        setIsListening(false);
      }
    }
  }, [interimText]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const capitalizedValue = val.length === 1 ? capitalizeFirst(val) : val;
    setMessage(capitalizedValue);
    if (interimText) setInterimText("");
    adjustTextareaHeight();
  };

  const displayValue = isListening || interimText ? message + interimText : message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motif || !message.trim()) return;
    if (listeningRef.current) toggleListening();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center section-padding">
        <div data-reveal className="text-center max-w-lg mx-auto animate-in fade-in duration-1000">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">Message transmis</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Notre équipe vous répondra personnellement sous 24 heures ouvrées.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/dashboard">
              Retour au tableau de bord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative pt-0 pb-16 md:pb-24 overflow-hidden z-10 mt-0">
        <div className="grid lg:grid-cols-2 min-h-[50vh]">
          <div className="flex items-center bg-gradient-to-b from-secondary to-background px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pt-40 lg:pb-24">
            <div className="max-w-xl">
              <span
                data-reveal
                className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-2xl"
              >
                Conciergerie
              </span>
              <h1
                data-reveal
                data-reveal-delay="150"
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight"
              >
                Votre Conciergerie
                <span className="text-primary block">Privée</span>
              </h1>
              <p
                data-reveal
                data-reveal-delay="300"
                className="text-lg text-muted-foreground leading-relaxed md:text-2xl"
              >
                Un espace dédié pour échanger avec notre équipe, à votre rythme et en toute confidentialité.
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block pt-[81px]">
            <img
              src={contactMemberHero}
              alt="Votre conciergerie privée Kalimera"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary/30 to-primary/50" />
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordions ─── */}
      <section ref={faqRef} className="section-padding bg-background py-20">
        <div className="container-main mx-auto px-4 md:px-8">
          <div data-reveal className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">Questions fréquentes</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Retrouvez ici les réponses aux interrogations les plus courantes de nos membres.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {faqSections.map((section) => (
              <div
                key={section.id}
                data-reveal
                className="rounded-3xl border border-border bg-secondary/20 p-8 md:p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">{section.title}</h3>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, idx) => (
                    <AccordionItem key={idx} value={`${section.id}-${idx}`} className="border-border/40 py-2">
                      <AccordionTrigger className="text-left text-xl md:text-2xl font-semibold text-foreground hover:no-underline hover:text-primary py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xl md:text-2xl leading-relaxed pt-2 pb-6">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section ref={formRef} className="section-padding bg-secondary/30 py-32">
        <div className="container-main mx-auto px-4 md:px-8 max-w-3xl">
          <div data-reveal className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Écrivez à votre conseiller
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Choisissez un motif, puis rédigez ou dictez votre message.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            data-reveal
            className="bg-background rounded-3xl border border-border p-10 md:p-14 shadow-xl space-y-10"
          >
            {/* Motif selector */}
            <div className="space-y-4">
              <label className="font-semibold text-foreground text-2xl">Motif de votre demande</label>
              <Select value={motif} onValueChange={setMotif}>
                <SelectTrigger className="h-14 rounded-xl bg-background border-border/60 text-xl md:text-2xl">
                  <SelectValue placeholder="Sélectionnez un motif..." />
                </SelectTrigger>
                <SelectContent>
                  {contactMotifs.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xl md:text-2xl py-3">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message area */}
            <div className="space-y-4">
              <label className="font-semibold text-foreground text-2xl block">Votre message</label>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={displayValue}
                  onChange={handleTextareaChange}
                  disabled={isFormLocked}
                  placeholder={
                    isFormLocked
                      ? "Veuillez d'abord sélectionner un motif..."
                      : "Décrivez votre demande en quelques mots..."
                  }
                  className={`flex w-full rounded-2xl border-2 bg-[hsl(var(--cream))]/60 px-6 py-5 ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus:ring-0 text-xl md:text-2xl leading-relaxed resize-none overflow-hidden transition-all duration-300 min-h-[200px] ${
                    isFormLocked
                      ? "opacity-40 cursor-not-allowed border-amber-100/80"
                      : isListening
                        ? "border-[hsl(var(--gold))] shadow-[0_0_0_4px_hsl(var(--gold)/0.12)]"
                        : "border-amber-100/80 focus:border-[hsl(var(--gold))]"
                  }`}
                />
                {isListening && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-[hsl(var(--gold))]/15 px-3 py-1.5 rounded-full">
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[60%]" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[100%]" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 bg-[hsl(var(--gold))] rounded-full animate-bounce h-[40%]" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm font-semibold text-[hsl(var(--gold))]">En écoute</span>
                  </div>
                )}
              </div>

              {/* Astuce dictée */}
              <p className="mt-1 text-base text-muted-foreground leading-relaxed">
                💡 Astuce dictée : dites <span className="font-semibold text-foreground">« virgule »</span>,{" "}
                <span className="font-semibold text-foreground">« point »</span>,{" "}
                <span className="font-semibold text-foreground">« à la ligne »</span> ou{" "}
                <span className="font-semibold text-foreground">« point d'interrogation »</span>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={toggleListening}
                disabled={isFormLocked}
                className={`min-h-[60px] flex-1 flex items-center justify-center gap-3 rounded-2xl text-lg lg:text-xl font-semibold transition-all duration-300 ${
                  isFormLocked
                    ? "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] opacity-40 cursor-not-allowed"
                    : isListening
                      ? "bg-[hsl(var(--gold))] text-white shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.6)] hover:brightness-105"
                      : "bg-white border-2 border-[#1B2333]/15 text-[#1B2333] hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--cream))]/50"
                }`}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-[hsl(var(--gold))]" />}
                {isListening ? "Arrêter la dictée" : "Dicter à voix haute"}
              </button>

              <Button
                type="submit"
                disabled={isFormLocked || !message.trim()}
                className="btn-primary min-h-[60px] sm:min-w-[220px] px-8 text-xl rounded-2xl group shadow-luxury"
              >
                Envoyer
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <GiftBannerSection image={giftBannerContact} />
    </>
  );
}
