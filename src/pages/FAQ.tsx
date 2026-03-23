import { useState } from "react";
import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Heart, Users, Lock, MessageSquare, Coffee, Euro, Star, Phone } from "lucide-react";

const faqSections = [
{
  title: "Sécurité & Confidentialité",
  id: "securite",
  icon: ShieldCheck,
  questions: [
  {
    q: "Comment m'assurez-vous que les profils présentés sont authentiques ?",
    a: "Votre sérénité est notre priorité. C'est pourquoi chaque nouvelle inscription est examinée manuellement par notre équipe basée en France. Nous procédons à des vérifications rigoureuses pour nous assurer que chaque membre est une véritable personne, partageant la même démarche sincère que vous."
  },
  {
    q: "Mes photos et informations personnelles sont-elles protégées ?",
    a: "Absolument. Vos données sont strictement confidentielles et sécurisées selon les normes européennes (RGPD). Elles ne seront jamais revendues à des tiers. De plus, le détail de votre profil complet n'est jamais partagé avec les autres adhérents. Enfin vous pouvez décider de résilier votre abonnement et de retirer vos informations à tout moment."
  },
  {
    q: "Que faire si le comportement d'un membre me semble inapproprié ?",
    a: "Nous prônons la courtoisie et le respect. Si un échange vous met mal à l'aise, vous pouvez bloquer la personne ou le signaler à notre équipe en toute discrétion. Nous interviendrons rapidement pour préserver la bienveillance au sein de notre communauté."
  }]

},
{
  title: "L'expérience Kalimera",
  id: "experience",
  icon: Heart,
  questions: [
  {
    q: "Je ne suis pas très à l'aise avec l'informatique. Le site est-il facile à utiliser ?",
    a: "Oui, nous avons conçu Kalimera pour qu'il soit simple, clair et intuitif, sans publicités ni menus compliqués. Si vous rencontrez la moindre difficulté, nous sommes joignables par téléphone pour vous guider pas à pas."
  },
  {
    q: "Comment fonctionne le processus de sélection ?",
    a: "Après votre inscription, vous complétez un questionnaire de personnalité approfondi. Notre équipe analyse vos réponses et vos attentes pour vous proposer des profils véritablement compatibles avec votre style de vie."
  },
  {
    q: "Comment se déroule une mise en contact ?",
    a: "Nous vous proposons uniquement des profils avec lesquels vous partagez un fort taux d'affinité réciproque (au minimum 75%). Si un profil vous plaît, vous validez la proposition de matching. Si l'intérêt est partagé (accord mutuel), vous pourrez alors communiquer librement sur notre plateforme en toute sécurité."
  }]

},
{
  title: "Engagement & Accompagnement",
  id: "engagement",
  icon: Users,
  questions: [
  {
    q: "Est-il facile de se désinscrire ?",
    a: "Notre démarche est transparente : vous pouvez suspendre ou supprimer votre compte très facilement depuis vos paramètres, en quelques clics et sans avoir à vous justifier."
  },
  {
    q: "Puis-je parler à une vraie personne en cas de besoin ?",
    a: "Bien sûr ! Une équipe humaine est à votre écoute. Vous pouvez nous joindre facilement par e-mail ou demander à être rappelé(e) par téléphone par l'un de nos conseillers en France du lundi au vendredi."
  },
  {
    q: "Puis-je mettre mon compte en pause ?",
    a: "Oui, vous pouvez mettre votre compte en veille pendant 30 jours pour profiter d'une pause en toute sérénité : dès l'activation, votre profil devient invisible pour les autres membres, tout en garantissant que vos messages et données sont précieusement sauvegardés pour votre retour. Vous conservez l'accès à votre messagerie jusqu'à la fin de votre période en cours, après quoi votre facturation est suspendue pour le mois suivant. Vous recevrez deux rappels par e-mail avant la réactivation automatique."
  }]

},
{
  title: "Discrétion & Vie Privée",
  id: "discretion",
  icon: Lock,
  questions: [
  {
    q: "Mes proches peuvent-ils tomber sur mon profil sur internet ?",
    a: "Non, votre discrétion est totale. Contrairement aux réseaux sociaux, votre profil Kalimera n'est pas public et n'apparaîtra jamais sur des moteurs de recherche comme Google. Seuls les membres inscrits, vérifiés, et avec qui vous avez une forte affinité pourront voir votre profil."
  },
  {
    q: "Je suis veuf / veuve, est-ce vraiment approprié ?",
    a: "Beaucoup de nos membres ont traversé des épreuves de vie similaires et comprennent ce que vous ressentez. Notre plateforme est conçue pour avancer à votre rythme, sans aucune pression. Refaire sa vie est une démarche légitime."
  },
  {
    q: "Mes échanges sont-ils confidentiels ?",
    a: "Tous les messages échangés sur Kalimera sont strictement privés et chiffrés. Ni notre équipe ni aucun tiers ne peut lire vos conversations."
  }]

},
{
  title: "Gérer les interactions",
  id: "interactions",
  icon: MessageSquare,
  questions: [
  {
    q: "Que se passe-t-il si je ne me sens pas prêt(e) à une rencontre ?",
    a: "Vous avez le contrôle de votre rythme. Rien ne vous oblige à précipiter une rencontre. Nous préconisons une approche prudente : prenez le temps d'échanger via notre messagerie sécurisée pour tisser un lien de confiance avant de décider, ensemble, du bon moment."
  },
  {
    q: "Comment décliner une proposition sans blesser ?",
    a: "Si un profil ne vous attire pas, un simple clic permet de refuser poliment. La personne n'est pas notifiée de manière brutale. Par souci de courtoisie, il est important de répondre aux propositions, quelle que soit la réponse."
  },
  {
    q: "Suis-je obligé(e) de mettre des photos et une vidéo récente ?",
    a: "C’est important pour garantir l'authenticité. Un tutoriel est à votre disposition pour vous aider. Rappelez-vous que nos adhérents recherchent avant tout une belle personnalité et une vraie connexion, pas une couverture de magazine."
  }]

},
{
  title: "Attentes & Style de vie",
  id: "style",
  icon: Coffee,
  questions: [
  {
    q: "Faut-il obligatoirement chercher le mariage ou la vie commune ?",
    a: "Pas du tout. Beaucoup de nos membres recherchent avant tout une belle complicité, quelqu'un avec qui partager des émotions, des loisirs et des conversations. Chacun est libre de définir son mode de relation."
  },
  {
    q: "Je n’ai pas envie d’une relation éloignée",
    a: "Vous avez raison. Les relations lointaines sont souvent plus compliquées. C’est pour cela que nous avons décidé de limiter notre plateforme à l’Île-de-France pour faciliter les rencontres réelles."
  },
  {
    q: "Kalimera s'adresse-t-il à une tranche d'âge spécifique ?",
    a: "Kalimera est le lieu de rencontre privilégié des plus de 60 ans qui cultivent l'art de vivre et l'exigence de la sincérité. Notre communauté est pensée pour accompagner les seniors dans une nouvelle étape de leur vie amoureuse."
  }]

},
{
  title: "Transparence Financière",
  id: "finance",
  icon: Euro,
  questions: [
  {
    q: "Vais-je être engagé(e) sans m'en rendre compte ?",
    a: "Chez Kalimera, la transparence est une valeur fondamentale. Nos offres sont claires dès le premier jour, sans frais cachés, sans renouvellements abusifs et sans engagements impossibles à annuler."
  },
  {
    q: "Puis-je obtenir un remboursement ?",
    a: "Conformément à nos conditions générales, un remboursement est possible dans les 14 jours suivant la souscription si vous n'avez pas encore utilisé le service. Au-delà, contactez votre conseiller pour étudier votre situation."
  },
  {
    q: "Y a-t-il des frais supplémentaires ?",
    a: "Non, votre abonnement actuel inclut l'accès illimité à toutes nos fonctionnalités. Les services optionnels futurs (photographie, aide à la rédaction) seront toujours présentés avec clarté et ne seront jamais imposés."
  }]

},
{
  title: "Le passage à la réalité",
  id: "realite",
  icon: Star,
  questions: [
  {
    q: "Avez-vous des conseils pour organiser notre première rencontre ?",
    a: "Nous recommandons toujours de prévoir la première rencontre dans un lieu public et chaleureux en journée (salon de thé), de prévenir un proche de votre sortie, et de vous y rendre par vos propres moyens."
  },
  {
    q: "Kalimera propose-t-il des événements en personne ?",
    a: "Actuellement, nous nous concentrons sur les mises en relation numériques de qualité. Cependant, des événements exclusifs (dîners privés, sorties culturelles) sont à l'étude. Vous serez les premiers informés."
  }]

}];


export default function FAQ() {
  const revealRef = useScrollReveal<HTMLElement>();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <LegalSubMenu />
      <section ref={revealRef} className="section-luxury bg-background pt-32 pb-40">
        <div className="container-main mx-auto px-6 max-w-7xl">
          <div className="mb-32 text-center">
            <span
              data-reveal
              className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-lg">
              
              Aide & Questions
            </span>
            <h1
              data-reveal
              data-reveal-delay="150"
              className="font-heading text-5xl md:text-7xl text-foreground mb-8 font-bold">
              
              Consulter la FAQ
            </h1>
            <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Sommaire latéral */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-32 space-y-3 p-8 rounded-[32px] bg-card border border-border/40 shadow-sm">
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-[hsl(var(--gold))] mb-8 px-4 font-bold">
                  Sommaire
                </p>
                {faqSections.map((section) =>
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left hover:bg-primary/5 hover:text-primary transition-all group">
                  
                    <section.icon className="w-5 h-5 text-[hsl(var(--gold))]" />
                    <span className="font-semibold text-lg">{section.title}</span>
                  </button>
                )}

                







                
              </div>
            </div>

            {/* Questions avec padding important */}
            <div className="lg:col-span-8 space-y-32">
              {faqSections.map((section, i) =>
              <div key={section.id} id={section.id} data-reveal data-reveal-delay={String(300 + i * 50)}>
                  <div className="flex items-center gap-6 mb-12">
                    <div className="p-4 rounded-2xl bg-primary/5">
                      <section.icon className="w-10 h-10 text-[hsl(var(--gold))]" />
                    </div>
                    <h2 className="font-heading text-4xl text-foreground font-bold">{section.title}</h2>
                  </div>

                  <Accordion type="single" collapsible className="space-y-8">
                    {section.questions.map((item, j) =>
                  <AccordionItem
                    key={j}
                    value={`${section.id}-${j}`}
                    className="border border-border/40 rounded-[32px] px-10 bg-card shadow-sm hover:shadow-md transition-all duration-300">
                    
                        <AccordionTrigger className="py-10 hover:no-underline group">
                          <span className="text-left text-2xl font-bold text-[#0e172a] leading-tight group-hover:text-primary transition-colors">
                            {item.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-left text-muted-foreground text-xl leading-relaxed pb-12 border-t border-border/5 pt-8">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                  )}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>);

}