import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";
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
                      Le site Kalimera ainsi que l’ensemble de ses contenus (notamment les textes, images, graphismes,
                      logo, structure, questionnaires, analyses, concepts et éléments visuels, questionnaire de
                      personnalité, algorithmes de matching…) sont protégés par le droit de la propriété intellectuelle.
                      Le site Kalimera ainsi que l’ensemble de ses contenus sont la propriété exclusive de l’éditeur.
                    </p>
                    <p className="text-xl mt-4">
                      Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale
                      ou partielle, de tout ou partie du site ou de son contenu, quel que soit le moyen ou le procédé
                      utilisé, est interdite sans autorisation préalable écrite.
                    </p>
                    <p className="text-xl mt-4">
                      Toute utilisation non autorisée du site ou de son contenu pourra faire l’objet de poursuites.
                    </p>
                  </>
                ),
              },
              {
                title: "5. Responsabilité",
                content: (
                  <>
                    <p className="text-xl">
                      Kalimera met en œuvre tous les moyens raisonnables pour assurer l’exactitude et la mise à jour des
                      informations diffusées sur le site.
                    </p>
                    <p className="text-xl mt-4">Toutefois, l’éditeur ne saurait être tenu responsable :</p>
                    <ul className="list-disc list-inside text-xl mt-2 space-y-1 ml-4">
                      <li>des inexactitudes ou omissions présentes sur le site ;</li>
                      <li>des interruptions de fonctionnement indépendantes de sa volonté ;</li>
                      <li>du contenu des sites tiers accessibles par lien hypertexte.</li>
                    </ul>
                    <p className="text-xl mt-4">
                      Les utilisateurs demeurent seuls responsables des contenus qu’ils publient et des échanges qu’ils
                      entretiennent avec les autres utilisateurs.
                    </p>
                  </>
                ),
              },
              {
                title: "6. Données personnelles",
                content: (
                  <>
                    <p className="text-xl">
                      Les données personnelles collectées sur le site sont traitées dans les conditions prévues par le
                      Règlement Général sur la Protection des Données (RGPD).
                    </p>
                    <p className="text-xl mt-4">
                      L’utilisateur dispose notamment de droits d’accès, de rectification, d’effacement et d’opposition
                      dans les conditions prévues par la réglementation applicable.
                    </p>
                    <p className="text-xl mt-4">
                      Pour toute demande relative aux données personnelles :{" "}
                      <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                        contact@monkalimera.fr
                      </a>
                    </p>
                  </>
                ),
              },
              {
                title: "7. Conditions d’utilisation",
                content: (
                  <p className="text-xl">
                    L’utilisation du site implique l’acceptation pleine et entière des Conditions Générales
                    d’Utilisation (CGU) accessibles sur le site.
                  </p>
                ),
              },
              {
                title: "8. Contact",
                content: (
                  <p className="text-xl">
                    Pour toute question relative au site ou à son contenu, vous pouvez contacter :{" "}
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
