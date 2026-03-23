import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PolitiqueConfidentialite() {
  const revealRef = useScrollReveal<HTMLElement>();

  // S'assure que la page commence toujours en haut lors du chargement ou changement d'onglet
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <Layout>
      <LegalSubMenu />
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg"
          >
            Protection des données
          </span>
          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6"
          >
            Politique de confidentialité (RGPD)
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 leading-relaxed text-muted-foreground">
            {[
              {
                title: "1. Responsable du traitement",
                content: (
                  <p className="text-xl">
                    Le responsable du traitement des données est : <strong>Luc SOLENTE</strong>
                    <br />
                    <strong>Dénomination commerciale :</strong> Kalimera
                    <br />
                    <strong>Statut :</strong> Micro entreprise
                    <br />
                    <strong>Adresse professionnelle :</strong> [Votre adresse à compléter]
                    <br />
                    <strong>Email :</strong>{" "}
                    <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                      contact@monkalimera.fr
                    </a>
                  </p>
                ),
              },
              {
                title: "2. Données collectées",
                content: (
                  <>
                    <p className="text-xl mb-6">
                      Dans le cadre de l’utilisation du site Kalimera, les données suivantes peuvent être collectées :
                    </p>

                    <h3 className="text-xl font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                      Données d’identification
                    </h3>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>prénom</li>
                      <li>date de naissance</li>
                      <li>numéro de téléphone</li>
                      <li>adresse email</li>
                      <li>code postal</li>
                      <li>nationalité</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                      Données de profil
                    </h3>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>niveau d’étude</li>
                      <li>langues parlées</li>
                      <li>situation personnelle</li>
                      <li>sport et mode de vie</li>
                      <li>centres d’intérêt et loisirs</li>
                      <li>préférences personnelles</li>
                      <li>attentes relationnelles</li>
                      <li>origine culturelle</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                      Données relatives aux valeurs et sensibilités
                    </h3>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>valeurs personnelles</li>
                      <li>convictions et spiritualité</li>
                      <li>centres d’intérêt sociétaux</li>
                      <li>sensibilités et engagements</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                      Données issues des questionnaires
                    </h3>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>données et analyses</li>
                      <li>quiz des préférences</li>
                      <li>résultats d’affinité</li>
                    </ul>

                    <h3 className="text-xl font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                      Analyse de personnalité
                    </h3>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4">
                      <li>questionnaire de compatibilité</li>
                      <li>test et analyse de personnalité</li>
                      <li>résultats d’affinités communes</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "3. Finalités du traitement",
                content: (
                  <>
                    <p className="text-xl mb-4">Les données sont collectées pour les finalités suivantes :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>création et gestion du compte utilisateur</li>
                      <li>mise en relation entre membres</li>
                      <li>réalisation d’analyses de personnalité</li>
                      <li>communication avec les utilisateurs</li>
                      <li>sécurité et prévention des fraudes</li>
                      <li>gestion des abonnements</li>
                      <li>amélioration de l’expérience utilisateur</li>
                    </ul>
                    <p className="text-xl">
                      Les données collectées ne sont pas cédées à des tiers à des fins commerciales sans base légale
                      appropriée ou sans information adéquate.
                    </p>
                  </>
                ),
              },
              {
                title: "4. Base légale",
                content: (
                  <>
                    <p className="text-xl mb-4">Le traitement des données repose sur :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4">
                      <li>le consentement de l’utilisateur</li>
                      <li>l’exécution du service</li>
                      <li>l’intérêt légitime</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "5. Partage des données et résultats d’affinité",
                content: (
                  <div className="space-y-4 text-xl">
                    <p>
                      Les données personnelles collectées par Kalimera sont destinées, dans la limite de leurs
                      attributions respectives :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                      <li>
                        aux personnes habilitées de Kalimera, chargées de la gestion de la plateforme, de la relation
                        utilisateur, de la modération, de la sécurité, de la prévention des fraudes et du support ;
                      </li>
                      <li>
                        aux prestataires techniques intervenant pour le compte de Kalimera et agissant en qualité de
                        sous-traitants, notamment pour l’hébergement, la maintenance, l’envoi de messages, la gestion
                        technique du site et la sécurité des systèmes ;
                      </li>
                      <li>
                        le cas échéant, aux autorités administratives ou judiciaires légalement habilitées, lorsque la
                        loi l’exige ou lorsque cela est nécessaire à la défense des droits et intérêts de Kalimera.
                      </li>
                    </ul>
                    <p>
                      Les données personnelles peuvent être transmises, dans la limite de leurs attributions
                      respectives, à des sous-traitants intervenant pour le compte de Kalimera, notamment pour
                      l’hébergement, la maintenance technique, l’envoi de courriers électroniques, la sécurité, la
                      gestion des paiements, la mesure d’audience et, le cas échéant, l’hébergement ou la diffusion de
                      contenus audiovisuels. Ces prestataires agissent sur instruction de Kalimera et dans le cadre de
                      contrats conformes à la réglementation applicable.
                    </p>
                    <p>
                      Kalimera peut également proposer des mises en relation fondées notamment sur un traitement
                      automatisé des informations renseignées par l’utilisateur, de ses préférences, de ses réponses aux
                      questionnaires et des éléments de compatibilité déclarés sur la plateforme. Ce traitement peut
                      conduire à l’affichage d’un indice d’affinité fourni à titre indicatif. Cet indice constitue un
                      outil d’aide à la mise en relation ; il ne constitue ni une garantie de compatibilité affective,
                      relationnelle ou personnelle, ni une promesse de succès d’une rencontre.
                    </p>
                    <p>
                      Dans le cadre du fonctionnement du service, certaines informations de profil peuvent être rendues
                      visibles à d’autres utilisateurs, dans la stricte mesure nécessaire à la mise en relation et selon
                      les paramètres proposés sur la plateforme. Peuvent notamment être visibles, le prénom, l’âge, la
                      zone de résidence, certaines informations de présentation, les contenus de profil, les
                      photos/vidéo, ainsi que certains éléments relatifs aux préférences et aux affinités. Les
                      informations affichées aux autres utilisateurs sont limitées à celles utiles à la mise en
                      relation.
                    </p>
                    <p>
                      Les résultats d’affinité et suggestions de profils reposent sur un mécanisme de profilage au sens
                      du RGPD. Ils ont pour finalité d’améliorer la pertinence des propositions présentées à
                      l’utilisateur. Ils ne produisent pas, par eux-mêmes, d’effet juridique à l’égard de l’utilisateur.
                    </p>
                    <p>
                      Certaines données proposées dans les formulaires de Kalimera peuvent relever de catégories
                      particulières de données au sens du RGPD, notamment lorsqu’elles révèlent des convictions
                      religieuses ou philosophiques, des informations relatives à l’orientation sexuelle, ou certaines
                      informations susceptibles de révéler une origine raciale ou ethnique. Lorsqu’elles sont
                      collectées, ces données sont facultatives et ne sont traitées que sur la base du consentement
                      explicite de l’utilisateur. Elles ne sont rendues visibles aux autres utilisateurs que dans les
                      conditions prévues par la plateforme et, le cas échéant, selon les choix exprimés par
                      l’utilisateur.
                    </p>
                    <p>
                      L’utilisateur peut retirer à tout moment son consentement au traitement des données fondé sur
                      celui-ci, sans que cela puisse affecter la licéité du traitement effectué antérieurement. Les
                      réponses aux questionnaires sont comparées automatiquement avec celles des autres membres afin
                      d’identifier des profils présentant des affinités importantes. Lorsqu’une forte compatibilité est
                      détectée, une proposition de mise en relation peut être adressée aux deux utilisateurs, qui
                      restent entièrement libres de l’accepter ou de la refuser.
                    </p>
                    <p>
                      Le retrait de certains consentements ou l’absence de renseignement de certaines données
                      facultatives peut toutefois limiter l’accès à certaines fonctionnalités de mise en relation ou
                      réduire la pertinence des résultats d’affinité proposés.
                    </p>
                    <p>
                      Les données personnelles ne sont ni vendues, ni cédées à des tiers à des fins de prospection ou
                      d’exploitation commerciale sans base légale appropriée.
                    </p>
                    <p>
                      Dans l’hypothèse d’une fusion, cession, transmission universelle de patrimoine, acquisition ou
                      opération de restructuration portant sur Kalimera, les données personnelles des utilisateurs
                      pourront être transmises au repreneur ou à l’entité concernée, sous réserve du respect de la
                      réglementation applicable et d’une information préalable des utilisateurs lorsque celle-ci est
                      requise.
                    </p>
                  </div>
                ),
              },
              {
                title: "6. Durée de conservation",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Les données personnelles sont conservées par Kalimera pendant une durée n’excédant pas celle
                      nécessaire aux finalités pour lesquelles elles sont collectées et traitées.
                      <br />À ce titre :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-2 ml-4 mb-6">
                      <li>
                        les données relatives au compte utilisateur et au profil sont conservées pendant toute la durée
                        d’utilisation active du compte ;
                      </li>
                      <li>
                        en cas d’inactivité prolongée du compte, les données peuvent être conservées pendant une durée
                        maximale de trois (3) ans à compter du dernier contact ou de la dernière activité de
                        l’utilisateur, sauf obligation légale ou intérêt légitime particulier justifiant une
                        conservation plus longue ;
                      </li>
                      <li>
                        en cas de demande de suppression du compte ou d’exercice du droit à l’effacement, les données
                        sont supprimées dans les meilleurs délais, sous réserve des obligations légales de conservation
                        ou des nécessités liées à la constatation, l’exercice ou la défense des droits de Kalimera ;
                      </li>
                      <li>
                        certaines données peuvent être conservées pour une durée plus longue lorsqu’une obligation
                        légale l’impose, notamment à des fins comptables, fiscales, probatoires, de gestion des
                        réclamations, de prévention de la fraude ou de sécurité de la plateforme ;
                      </li>
                      <li>
                        lorsqu’une conservation supplémentaire n’est plus nécessaire en base active, les données peuvent
                        être archivées de manière intermédiaire pour la durée strictement nécessaire au respect des
                        obligations légales ou à la protection des intérêts légitimes de Kalimera.
                      </li>
                    </ul>
                    <p className="text-xl">
                      À l’issue des durées applicables, les données sont supprimées ou anonymisées de manière
                      irréversible, sous réserve de leur conservation temporaire lorsque celle-ci est requise par la loi
                      ou strictement nécessaire à la gestion d’un contentieux en cours.
                    </p>
                  </>
                ),
              },
              {
                title: "7. Sécurité",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Kalimera met en œuvre des mesures techniques et organisationnelles pour protéger les données :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4">
                      <li>connexion sécurisée (HTTPS)</li>
                      <li>accès limités aux données</li>
                      <li>hébergement sécurisé</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "8. Les droits de l’utilisateur",
                content: (
                  <>
                    <p className="text-xl mb-4">Conformément au RGPD, l’utilisateur dispose des droits suivants :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>droit d’accès</li>
                      <li>droit de rectification</li>
                      <li>droit à l’effacement</li>
                      <li>droit d’opposition</li>
                      <li>droit à la limitation</li>
                      <li>droit à la portabilité</li>
                      <li>droit d’introduire une réclamation auprès de la CNIL</li>
                    </ul>
                    <p className="text-xl mb-4">
                      L’utilisateur peut demander des informations générales sur le fonctionnement du rapprochement des
                      profils et le caractère indicatif du niveau d’affinité proposé.
                    </p>
                    <p className="text-xl">
                      Pour exercer vos droits :{" "}
                      <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                        contact@monkalimera.fr
                      </a>
                    </p>
                  </>
                ),
              },
              {
                title: "9. Suppression du compte",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      L’utilisateur peut supprimer son compte à tout moment sous réserve des obligations légales de
                      conservation. La suppression du compte entraîne la suppression des données, sous réserve des
                      obligations légales de conservation et des nécessités liées à la défense des droits de Kalimera.
                    </p>
                    <p className="text-xl mb-2">Cette suppression entraîne :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4">
                      <li>la suppression des données personnelles</li>
                      <li>la suppression du profil</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "10. Cookies",
                content: (
                  <p className="text-xl">
                    Le site Kalimera peut utiliser des cookies et autres traceurs nécessaires à son fonctionnement, à la
                    sécurité, à la mesure d’audience et à l’amélioration de l’expérience utilisateur.
                    <br />
                    Lorsque le consentement de l’utilisateur est requis, les cookies concernés ne sont déposés qu’après
                    son accord.
                    <br />
                    Pour en savoir plus, l’utilisateur est invité à consulter la Politique relative aux cookies
                    accessible sur le site.
                  </p>
                ),
              },
              {
                title: "11. Transfert hors UE",
                content: (
                  <p className="text-xl">
                    Les données sont hébergées au sein de l’Union européenne.
                    <br />
                    En cas de transfert hors UE, Kalimera s’assure que des garanties appropriées sont mises en place.
                  </p>
                ),
              },
              {
                title: "12. Modification de la politique",
                content: (
                  <p className="text-xl">
                    Kalimera peut modifier la présente politique à tout moment.
                    <br />
                    Les utilisateurs seront informés en cas de modification importante.
                  </p>
                ),
              },
            ].map((section, i) => (
              <div key={i} data-reveal data-reveal-delay={String(300 + i * 50)}>
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
