import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import profileContactImg from "@/assets/profile-contact.jpg";

export default function ProfileContactTab() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons dans les plus brefs délais." });
  };

  return (
    <div>
      {/* Hero split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh]">
          <img src={profileContactImg} alt="Nous contacter" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            À votre écoute
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Nous Contacter
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner.
          </p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-8">
                Envoyez-nous un message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-medium text-foreground text-xl">Prénom</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Votre prénom"
                      className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                    
                  </div>
                  <div className="space-y-3">
                    <Label className="font-medium text-foreground text-xl">Nom</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Votre nom"
                      className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                    
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                  
                </div>
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Sujet</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Le sujet de votre message"
                    className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                  
                </div>
                <div className="space-y-3">
                  <Label className="font-medium text-foreground text-xl">Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez votre demande..."
                    className="min-h-[160px] text-lg border-2 border-muted bg-background focus:border-primary rounded-none resize-none" />
                  
                </div>
                <Button type="submit" className="btn-primary py-5 px-10 text-lg h-auto min-h-[56px]">
                  Envoyer le message
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {[
              { icon: Mail, title: "Email", content: "contact@monkalimera.fr" },
              { icon: MapPin, title: "Adresse", content: "123 Avenue des Champs-Élysées\n75008 Paris, France" },
              { icon: Clock, title: "Temps de réponse", content: "Sous 24 heures ouvrées" }].
              map((item, i) =>
              <div
                key={i}
                className="group bg-secondary p-8 hover:shadow-[var(--shadow-card)] transition-all duration-300">
                
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 text-2xl">{item.title}</h4>
                      <p className="text-muted-foreground whitespace-pre-line text-xl">{item.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>);

}