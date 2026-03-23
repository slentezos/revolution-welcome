import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function MentionsLegales() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg"
          >
            Informations légales
          </span>
          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6"
          >
            Mentions légales
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 leading-relaxed text-muted-foreground">
            {[
              {
                title: "1. Éditeur du site",
                content: (
                  <p className="text-xl">
                    Le site Kalimera est édité par :<br />
                    <strong>Luc Solente, Entrepreneur individuel (EI)</strong>
                    <br />
                    <strong>Nom commercial :</strong> Kalimera
                    <br />
                    <strong>Adresse de domiciliation :</strong> [Votre adresse complète à compléter]
                    <br />
                    [Code postal] [Ville] – France
                    <br />
                    <strong>Numéro SIRET :</strong> [Votre numéro SIRET à compléter]
                    <br />
                    <strong>TVA non applicable</strong> – article 293 B du CGI
                    <br />
                    <strong>Directeur de la publication :</strong> Luc Solente
                    <br />
                    <strong>Email :</strong> contact@monkalimera.fr
                    <br />
                    <strong>Téléphone :</strong> [Votre numéro de téléphone à compléter, optionnel]
                  </p>
                ),
              },
              {
                title: "2. Hébergement",
                content: (
                  <p className="text-xl">
                    Le site est hébergé par la société :<br />
                    <strong>[Nom de l’hébergeur final]</strong>
                    <br />
                    [Adresse de l’hébergeur]
                    <br />
                    [Code postal] [Ville] [Pays]
                    <br />
                    <strong>Téléphone :</strong> [Numéro de téléphone de l'hébergeur]
                    <br />
                    <strong>Site web :</strong>{" "}
                    https://www.captaincontrat.com/gestion/politique-de-confidentialite-rgpd/la-responsabilite-de-lhebergeur-me-lefroy
                  </p>
                ),
              },
              {
                title: "3. Activité",
                content: (
                  <p className="text-xl">
                    Kalimera est une plateforme en ligne de mise en relation à des fins de rencontres, dédiée
                    spécifiquement aux seniors résidents en Île-de-France.
                  </p>
                ),
              },
              {
                title: "4. Propriété intellectuelle",
                content: (
                  <>
                    <p className="text-xl">
                      Le site Kalimera ainsi que l’ensemble de ses contenus, notamment les textes, images, vidéos,
                      graphismes, logo, structure, questionnaires de personnalité, analyses, concepts, algorithmes de
                      matching et éléments visuels, sont protégés par le droit de la propriété intellectuelle. Le site
                      Kalimera ainsi que l’ensemble de ses contenus sont la propriété exclusive de l’éditeur.
                    </p>
                    <p className="text-xl mt-4">
                      Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale
                      ou partielle, de tout ou partie du site ou de son contenu, quel que soit le moyen ou le procédé
                      utilisé, est formellement interdite sans autorisation préalable et écrite de l'éditeur.
                    </p>
                    <p className="text-xl mt-4">
                      Toute utilisation non autorisée du site ou de son contenu sera considérée comme constitutive d’une
                      contrefaçon et pourra faire l’objet de poursuites judiciaires.
                    </p>
                  </>
                ),
              },
              {
                title: "5. Données personnelles",
                content: (
                  <>
                    <p className="text-xl">
                      Les données personnelles collectées sur le site sont traitées dans le strict respect des
                      conditions prévues par le Règlement Général sur la Protection des Données (RGPD).
                    </p>
                    <p className="text-xl mt-4">
                      Conformément à la réglementation applicable, l’utilisateur dispose de droits d’accès, de
                      rectification, d’effacement, de limitation du traitement, de portabilité et d’opposition. Pour
                      toute demande relative à l'exercice de ces droits ou pour toute question concernant le traitement
                      de vos données personnelles, vous pouvez nous écrire à :{" "}
                      <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                        contact@monkalimera.fr
                      </a>
                    </p>
                  </>
                ),
              },
              {
                title: "6. Cookies",
                content: (
                  <p className="text-xl">
                    Le site Kalimera utilise exclusivement des cookies strictement nécessaires au fonctionnement
                    technique du service. Aucun cookie publicitaire ou de traçage n'est utilisé. L'utilisateur peut
                    configurer son navigateur pour refuser les cookies, mais cette action pourrait limiter l'accès à
                    certaines fonctionnalités du site.
                  </p>
                ),
              },
              {
                title: "7. Responsabilité",
                content: (
                  <>
                    <p className="text-xl">
                      Kalimera s'efforce de fournir des informations exactes et à jour sur son site. Toutefois, la
                      société ne saurait être tenue responsable des erreurs, inexactitudes ou omissions présentes sur le
                      site, ni des résultats obtenus suite à l'utilisation de ces informations.
                    </p>
                    <p className="text-xl mt-4">De plus, l'éditeur ne pourra être tenu responsable :</p>
                    <ul className="list-disc list-inside text-xl mt-2 space-y-1 ml-4">
                      <li>des interruptions de fonctionnement ou bugs du site indépendants de sa volonté ;</li>
                      <li>du contenu des sites tiers accessibles par lien hypertexte depuis le site Kalimera.</li>
                    </ul>
                    <p className="text-xl mt-4">
                      L'utilisateur est seul responsable de l'utilisation qu'il fait du contenu du site. Les
                      utilisateurs demeurent également seuls responsables des contenus qu’ils publient sur la plateforme
                      et des échanges qu’ils entretiennent avec les autres utilisateurs.
                    </p>
                  </>
                ),
              },
              {
                title: "8. Conditions Générales d’Utilisation (CGU)",
                content: (
                  <p className="text-xl">
                    L’utilisation du site implique l’acceptation pleine et entière des Conditions Générales
                    d’Utilisation (CGU) accessibles sur le site. Nous invitons tous les utilisateurs à en prendre
                    connaissance.
                  </p>
                ),
              },
              {
                title: "9. Contact",
                content: (
                  <p className="text-xl">
                    Pour toute question relative au site, à son contenu ou aux présentes mentions légales, vous pouvez
                    nous contacter à l'adresse suivante :{" "}
                    <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                      contact@monkalimera.fr
                    </a>
                  </p>
                ),
              },
            ].map((section, i) => (
              <div key={i} data-reveal data-reveal-delay={String(300 + i * 120)}>
                <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">{section.title}</h2>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
