import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Cookies() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg"
          >
            Vie privée
          </span>
          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6"
          >
            Politique relative aux cookies
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 leading-relaxed text-muted-foreground">
            {[
              {
                title: "1. Qu'est-ce qu'un cookie ?",
                content: (
                  <p className="text-xl">
                    Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
                    lors de la visite d'un site web. Il permet au site de mémoriser certaines informations relatives à
                    votre navigation afin de faciliter vos visites ultérieures et de rendre le service plus ergonomique.
                  </p>
                ),
              },
              {
                title: "2. Les cookies utilisés sur Kalimera",
                content: (
                  <>
                    <p className="text-xl">
                      Kalimera utilise exclusivement des <strong>cookies strictement nécessaires</strong> au
                      fonctionnement technique de la plateforme. Ces cookies sont indispensables pour vous permettre de
                      naviguer sur le site et d'utiliser ses fonctionnalités essentielles.
                    </p>
                    <p className="text-xl mt-4">Ils assurent notamment :</p>
                    <ul className="list-disc list-inside text-xl mt-2 space-y-1 ml-4">
                      <li>le maintien de votre session de connexion ;</li>
                      <li>la mémorisation de vos préférences d'affichage (confort visuel) ;</li>
                      <li>le bon fonctionnement des formulaires et de la navigation sécurisée.</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "3. Cookies publicitaires et de traçage",
                content: (
                  <p className="text-xl">
                    Kalimera <strong>n'utilise aucun cookie publicitaire, analytique ou de traçage</strong>. Votre
                    activité sur la plateforme n'est ni suivie ni partagée avec des réseaux publicitaires ou des
                    services tiers à des fins commerciales.
                  </p>
                ),
              },
              {
                title: "4. Cookies tiers",
                content: (
                  <p className="text-xl">
                    La plateforme n'intègre aucun cookie provenant de services tiers (réseaux sociaux, régies
                    publicitaires, outils d'analyse comportementale). Seuls les cookies émis directement par Kalimera
                    sont déposés sur votre terminal.
                  </p>
                ),
              },
              {
                title: "5. Durée de conservation",
                content: (
                  <p className="text-xl">
                    Les cookies strictement nécessaires sont conservés uniquement pendant la durée de votre session de
                    navigation, ou pour une durée maximale de 13 mois conformément aux recommandations de la CNIL. Ils
                    sont automatiquement supprimés à l'expiration de cette période.
                  </p>
                ),
              },
              {
                title: "6. Gestion des cookies",
                content: (
                  <>
                    <p className="text-xl">
                      Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies. Veuillez
                      noter que la désactivation des cookies strictement nécessaires peut altérer votre expérience de
                      navigation et limiter l'accès à certaines fonctionnalités du site.
                    </p>
                    <p className="text-xl mt-4">
                      Voici les liens vers les pages de gestion des cookies des principaux navigateurs :
                    </p>
                    <ul className="list-disc list-inside text-xl mt-2 space-y-1 ml-4">
                      <li>
                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Google Chrome
                        </a>
                      </li>
                      <li>
                        <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Mozilla Firefox
                        </a>
                      </li>
                      <li>
                        <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Safari
                        </a>
                      </li>
                      <li>
                        <a href="https://support.microsoft.com/fr-fr/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Microsoft Edge
                        </a>
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                title: "7. Base légale",
                content: (
                  <p className="text-xl">
                    Conformément à l'article 82 de la loi Informatique et Libertés et aux lignes directrices de la CNIL,
                    les cookies strictement nécessaires au fonctionnement du site sont exemptés du recueil de
                    consentement préalable. Kalimera n'utilisant que cette catégorie de cookies, aucune bannière de
                    consentement n'est requise.
                  </p>
                ),
              },
              {
                title: "8. Mise à jour de cette politique",
                content: (
                  <p className="text-xl">
                    La présente politique relative aux cookies peut être mise à jour à tout moment. Toute modification
                    sera publiée sur cette page avec la date de dernière mise à jour. Nous vous invitons à la consulter
                    régulièrement.
                  </p>
                ),
              },
              {
                title: "9. Contact",
                content: (
                  <p className="text-xl">
                    Pour toute question concernant notre politique relative aux cookies, vous pouvez nous contacter à
                    l'adresse :{" "}
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
