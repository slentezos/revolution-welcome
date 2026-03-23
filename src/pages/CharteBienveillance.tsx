import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CharteBienveillance() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <span data-reveal className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg">
            Nos engagements
          </span>
          <h1 data-reveal data-reveal-delay="150" className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6">
            Charte de bienveillance
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
            {[
              { title: "Respect mutuel", text: "Chaque membre de Kalimera s'engage à traiter les autres avec courtoisie, respect et bienveillance. Les échanges doivent rester polis et constructifs, même en cas de désaccord ou de refus. Toute forme d'insulte, de moquerie ou de comportement dégradant est strictement interdite." },
              { title: "Authenticité et honnêteté", text: "Nous demandons à nos membres de rester sincères dans leur démarche. Les informations communiquées sur votre profil doivent être exactes et à jour. L'utilisation de photos trompeuses ou de fausses identités entraîne l'exclusion immédiate de la plateforme." },
              { title: "Consentement et limites", text: "Chaque membre a le droit de refuser une proposition de contact sans avoir à se justifier. Le « non » doit être accepté avec élégance. Le harcèlement, les messages insistants après un refus et toute pression exercée sur un autre membre sont formellement proscrits." },
              { title: "Confidentialité", text: "Les informations personnelles partagées lors de vos échanges sont strictement confidentielles. Il est interdit de diffuser, publier ou partager les photos, messages ou données personnelles d'un autre membre sans son accord écrit préalable." },
              { title: "Bienveillance dans les échanges", text: "Prenez le temps de répondre aux messages que vous recevez, même pour décliner poliment une invitation. Le silence prolongé peut être source d'inquiétude pour l'autre personne. Un simple mot de courtoisie fait toute la différence." },
              { title: "Signalement", text: "Si vous êtes témoin ou victime d'un comportement inapproprié, nous vous encourageons à le signaler immédiatement à notre équipe. Chaque signalement est traité avec sérieux et confidentialité. Ensemble, nous préservons un espace de rencontre sûr et agréable pour tous." },
            ].map((section, i) => (
              <div key={i} data-reveal data-reveal-delay={String(300 + i * 120)}>
                <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">{section.title}</h2>
                <p className="text-xl">{section.text}</p>
              </div>
            ))}

            <div data-reveal data-reveal-delay="1000" className="bg-secondary p-8 md:p-10 text-center">
              <p className="text-foreground font-medium text-xl mb-2">
                En rejoignant Kalimera, vous adhérez à cette charte.
              </p>
              <p className="text-xl">
                Tout manquement pourra entraîner la suspension ou la suppression définitive de votre compte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>);
}
