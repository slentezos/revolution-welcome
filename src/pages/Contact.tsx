import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Mail, MapPin, Send, Clock, ArrowRight } from "lucide-react";
import contactHero from "@/assets/contact-hero.jpg";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerContact from "@/assets/gift-banner-contact.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const heroRef = useScrollReveal<HTMLElement>({ threshold: 0.08 });
  const formRef = useScrollReveal<HTMLElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Layout>
      {/* Hero - Minimal & Modern */}
      {/* Correction : On retire les 'py-24 md:py-32' ici pour que la section touche le haut de l'écran */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[50vh] md:min-h-[60vh]">
          {/* Left content */}
          {/* Correction : On ajoute le padding (pt-32 pb-16) ici, à l'intérieur du bloc coloré */}
          <div className="flex flex-col justify-center bg-gradient-to-b from-secondary to-background px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-16 md:pb-24">
            <div className="max-w-xl">
              <span
                data-reveal
                className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-2xl"
              >
                Contact
              </span>
              <h1
                data-reveal
                data-reveal-delay="150"
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight"
              >
                Notre équipe <span className="text-primary block">à votre écoute</span>
              </h1>
              <p
                data-reveal
                data-reveal-delay="300"
                className="text-lg text-muted-foreground leading-relaxed md:text-2xl"
              >
                Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans votre
                recherche.
              </p>
            </div>
          </div>

          {/* Right image with overlay */}
          <div className="relative hidden lg:block">
            {/* L'image prendra maintenant toute la hauteur, y compris l'espace sous le Header */}
            <img
              src={contactHero}
              alt="Notre équipe à votre écoute"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary/30 to-primary/50" />
          </div>
        </div>
      </section>

      {/* Contact Section - Modern Grid */}
      <section ref={formRef} className="section-padding bg-background">
        <div className="container-main mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div data-reveal className="lg:col-span-3">
              <div className="bg-secondary/30 rounded-3xl p-8 md:p-10">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2 md:text-4xl">
                  Envoyez-nous un message
                </h2>
                <p className="text-muted-foreground mb-8 text-xl">Nous vous répondrons dans les plus brefs délais.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-medium text-foreground text-xl">Prénom</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Votre prénom"
                        className="h-12 rounded-xl bg-background border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium text-foreground text-xl">Nom</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Votre nom"
                        className="h-12 rounded-xl bg-background border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-foreground text-xl">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="h-12 rounded-xl bg-background border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-foreground text-xl">Sujet</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Le sujet de votre message"
                      className="h-12 rounded-xl bg-background border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-foreground text-xl">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                      className="min-h-[140px] rounded-xl bg-background border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full sm:w-auto group">
                    Envoyer le message
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info - Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: (
                    <a
                      href="mailto:contact@monkalimera.fr"
                      className="text-muted-foreground hover:text-primary transition-colors text-xl"
                    >
                      contact@monkalimera.fr
                    </a>
                  ),
                },
                {
                  icon: MapPin,
                  title: "Adresse",
                  content: (
                    <p className="text-muted-foreground text-xl">
                      123 Avenue des Champs-Élysées
                      <br />
                      75008 Paris, France
                    </p>
                  ),
                },
                {
                  icon: Clock,
                  title: "Temps de réponse",
                  content: <p className="text-muted-foreground text-xl">Sous 24 heures ouvrées</p>,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  data-reveal
                  data-reveal-delay={String(150 + i * 150)}
                  className="group p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-xl">{item.title}</h3>
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* FAQ Highlight */}
              <div data-reveal data-reveal-delay="600" className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <h3 className="font-heading font-semibold mb-2 text-2xl">Questions fréquentes</h3>
                <p className="opacity-80 mb-4 text-xl">
                  Trouvez des réponses rapides à vos questions les plus courantes.
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white/10 hover:bg-white/20 text-primary-foreground border-0"
                  asChild
                >
                  <Link to="/faq">
                    Consulter la FAQ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GiftBannerSection image={giftBannerContact} />
    </Layout>
  );
}
