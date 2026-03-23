import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ConditionsUtilisation() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      <section ref={revealRef} className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-4xl">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg"
          >
            Cadre légal et réglementaire
          </span>
          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-4"
          >
            Conditions générales d’utilisation (CGU)
          </h1>
          <p data-reveal data-reveal-delay="200" className="text-center text-muted-foreground italic text-lg mb-8">
            (Conditions générales d’utilisation révisées le 17/03/2026)
          </p>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 leading-relaxed text-muted-foreground">
            {[
              {
                title: "Préambule",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Les présentes Conditions d’utilisation sont conclues entre la société Kalimera (« nous ») et les
                      utilisateurs.
                    </p>
                    <p className="text-xl mb-4">
                      Kalimera propose une plateforme de rencontres entre seniors à des fins de rencontre, dans un cadre
                      personnel et non commercial. Nous fournissons des produits et services gratuits et payants sur
                      ordinateur, web mobile et applications (les « Services »).
                    </p>
                    <p className="text-xl">
                      Sauf lorsqu’ils sont réservés à une certaine catégorie d’utilisateurs, certaines options
                      supplémentaires peuvent être proposées lors de l’inscription. Nos Services sont ouverts à tous les
                      seniors de 60+ ans résidents en Ile de France sous réserve qu’ils respectent les critères
                      d’éligibilité ci-dessous.
                    </p>
                  </>
                ),
              },
              {
                title: "1. Acceptation des conditions d’utilisation",
                content: (
                  <p className="text-xl">
                    En créant un compte sur les Services, vous acceptez d’être lié(e) par les présentes Conditions
                    d’utilisation (CGU), ainsi que par les Conseils de sécurité et les Règles de communauté qui en font
                    partie intégrante, et reconnaissez avoir pris connaissance de la Politique de confidentialité (RGPD)
                    et de la Politique relative aux cookies. Le recueil du consentement de l’utilisateur pour les
                    cookies et autres traceurs soumis à consentement est effectué séparément, dans les conditions
                    prévues par la Politique relative aux cookies. Si vous n’acceptez pas d’être lié(e) par les
                    Conditions d’utilisation, vous devez cesser d’utiliser nos Services.
                  </p>
                ),
              },
              {
                title: "2. Éligibilité aux services",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      L’accès aux Services est réservé aux utilisateurs remplissant l’ensemble des conditions suivantes
                      :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>être âgé(e) de 60 ans ou plus ;</li>
                      <li>être juridiquement capable de conclure un contrat ;</li>
                      <li>résider en Île-de-France ;</li>
                      <li>fournir des informations exactes, sincères et à jour, ne prêtant pas à confusion ;</li>
                      <li>
                        utiliser les Services dans un cadre strictement personnel et non commercial, en vue de favoriser
                        des rencontres authentiques ;
                      </li>
                      <li>
                        respecter les présentes Conditions d’utilisation, ainsi que l’ensemble des lois et
                        réglementations applicables.
                      </li>
                    </ul>
                    <p className="text-xl mb-4">
                      L’utilisateur s’engage à adopter un comportement conforme à l’esprit du service, fondé sur la
                      sincérité, le respect des autres membres et la recherche de relations de qualité.
                    </p>
                    <p className="text-xl mb-4">
                      L’utilisateur déclare n’avoir jamais été reconnu(e) coupable d’actes :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>de fraude,</li>
                      <li>d’escroquerie</li>
                      <li>de racisme</li>
                      <li>de violence,</li>
                      <li>de harcèlement,</li>
                      <li>d’infractions sexuelles,</li>
                      <li>contraires à la finalité du service,</li>
                      <li>incompatibles avec la sécurité des biens et des personnes</li>
                    </ul>
                    <p className="text-xl mb-4">
                      Kalimera demeure libre d’accepter, de refuser, de suspendre ou de ne pas donner suite à toute
                      demande d’adhésion ou de réadhésion, ainsi qu’à toute demande de maintien ou de réactivation d’un
                      compte, sous réserve des dispositions légales impératives, pour tout motif légitime, objectif et
                      non discriminatoire sans être tenue d’en détailler les raisons.
                    </p>
                    <p className="text-xl mb-4">
                      Toute décision prise à ce titre peut notamment être fondée sur des considérations tenant à
                      l’éligibilité du demandeur, à la cohérence, la complétude ou la sincérité des informations
                      communiquées, à la qualité du profil présenté, à la compatibilité avec l’objet, l’esprit ou le
                      positionnement du service, à la sécurité des personnes, à la prévention des fraudes, à la
                      fiabilité des échanges, à la protection de la communauté, au bon fonctionnement de la plateforme
                      ou, plus généralement, à tout motif légitime, objectif et non discriminatoire.
                    </p>
                    <p className="text-xl mb-4">
                      Sauf obligation légale particulière, Kalimera n’est tenue ni d’accepter une demande d’adhésion, ni
                      de communiquer au demandeur les motifs détaillés de sa décision. Le demandeur reconnaît que
                      l’accès au service demeure subordonné à l’appréciation de Kalimera dans le respect de la
                      réglementation applicable.
                    </p>
                    <p className="text-xl mb-4">
                      Kalimera se réserve le droit de suspendre ou résilier l’accès aux Services :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4">
                      <li>en cas de non-respect des conditions d’éligibilité ;</li>
                      <li>en cas de fourniture d’informations inexactes ou trompeuses ;</li>
                      <li>
                        en cas de comportement contraire aux présentes Conditions d’utilisation, aux règles de la
                        plateforme ou à la législation applicable ;
                      </li>
                      <li>
                        ou en cas de risque avéré pour la sécurité, la qualité des échanges ou le bon fonctionnement des
                        Services.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                title: "3. Inscription",
                content: (
                  <>
                    <p className="text-xl mb-4">L’ouverture d’un compte est gratuite.</p>
                    <p className="text-xl mb-2">L’utilisateur s’engage :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>à ne pas créer plus d’un compte.</li>
                      <li>
                        à fournir les informations requises pour compléter son profil (y compris les supports
                        audio-visuels).
                      </li>
                      <li>à fournir des informations exactes, sincères et véridiques et à les maintenir à jour.</li>
                      <li>à accepter la diffusion des informations liées à son profil au sein de la plateforme.</li>
                      <li>
                        à accepter la possibilité que ces informations soient modérées ou supprimées par Kalimera.
                      </li>
                    </ul>
                    <p className="text-xl mb-2">L’utilisateur reste responsable :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>des contenus qu’il publie lors de l’inscription et ultérieurement.</li>
                      <li>
                        des éventuelles conséquences de la diffusion de ces contenus sur la vie d’un utilisateur ou
                        d’autres personnes.
                      </li>
                      <li>du maintien de la confidentialité de ses identifiants de connexion.</li>
                      <li>de toutes les activités survenant sous ces identifiants.</li>
                    </ul>
                    <p className="text-xl mb-2">
                      L’utilisateur, qui diffuse des informations (données, texte, contenu, vidéos et images) le
                      concernant :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-6">
                      <li>garantit disposer des droits nécessaires sur les contenus transmis,</li>
                      <li>accepte leur diffusion dans le cadre normal du service,</li>
                      <li>et reste responsable des autorisations qu’il a données.</li>
                    </ul>
                    <p className="text-xl mb-4">
                      Pour plus d’informations sur les données que nous collectons et sur la façon dont nous les
                      utilisons, consulter notre Politique de confidentialité.
                    </p>
                    <p className="text-xl">
                      Si vous pensez qu’une personne a eu accès à votre compte, vous êtes invité(e) à nous contacter
                      dans les meilleurs délais.
                    </p>
                  </>
                ),
              },
              {
                title: "4. Règles de conduite",
                content: (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mt-4 mb-4">
                      4.1 Présentation des règles de conduite
                    </h3>
                    <p className="text-xl mb-4">
                      La qualité des échanges au sein de la plateforme repose sur le respect, la sincérité et la
                      bienveillance entre les utilisateurs. En utilisant les Services, l’utilisateur s’engage à adopter
                      un comportement respectueux à l’égard des autres membres et des équipes de Kalimera, et à se
                      conformer aux présentes Conditions d’utilisation, ainsi qu’aux lois et réglementations
                      applicables.
                    </p>
                    <p className="text-xl mb-4">
                      Afin de garantir un environnement sécurisé et de qualité, chaque utilisateur s’engage à ne pas :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-2 ml-4 mb-6">
                      <li>diffuser des informations fausses, trompeuses ou de nature à induire en erreur ;</li>
                      <li>usurper l’identité d’un tiers ou utiliser le compte d’un autre utilisateur ;</li>
                      <li>
                        publier ou transmettre des contenus portant atteinte aux droits d’autrui, notamment à la vie
                        privée, à l’image, ou aux droits de propriété intellectuelle ;
                      </li>
                      <li>diffuser des informations personnelles concernant un tiers sans son consentement ;</li>
                      <li>adopter un comportement injurieux, diffamatoire, menaçant, harcelant ou discriminatoire ;</li>
                      <li>solliciter de l’argent, exercer un chantage, ou se livrer à toute forme d’escroquerie ;</li>
                      <li>envoyer des messages non sollicités de manière répétée ou assimilables à du spam ;</li>
                      <li>
                        publier des contenus à caractère violent, haineux, pornographique ou contraires à la dignité
                        humaine ;
                      </li>
                      <li>utiliser les Services à des fins commerciales, promotionnelles ou politiques ;</li>
                      <li>
                        proposer ou promouvoir des services à caractère sexuel ou des relations de nature
                        transactionnelle ;
                      </li>
                      <li>contourner les dispositifs de sécurité ou perturber le fonctionnement des Services ;</li>
                      <li>
                        utiliser tout logiciels, scripts, robots, scraping ou tout autre moyen ou processus visant à
                        accéder, extraire, indexer, fouiller les données, vandaliser le site ou reproduire de quelque
                        façon que ce soit la structure de navigation ou la présentation des Services ou de ses contenus
                        ;
                      </li>
                      <li>
                        créer ou gérer plusieurs comptes ou tenter de contourner une suspension ou une interdiction
                        d’accès ;
                      </li>
                      <li>
                        effectuer des signalements abusifs, manifestement infondés ou détournés de leur finalité ;
                      </li>
                      <li>laisser sans réponse les propositions de rencontre qu’il aura reçues.</li>
                    </ul>
                    <p className="text-xl mb-4">
                      Tout utilisateur reconnaît que Kalimera peut procéder à la modération des contenus et
                      comportements signalés ou détectés dans le cadre de l’exploitation des Services. Toute violation
                      de l’une de ces règles de conduite constitue une violation grave de vos obligations contractuelles
                      en vertu des présentes Conditions d’utilisation.
                    </p>
                    <p className="text-xl mb-4">
                      Nous nous réservons le droit de suspendre ou de résilier votre compte sans préavis, sans
                      remboursement et sans indemnisation en cas de violation graves ou répétées de votre part des
                      présentes obligations.
                    </p>
                    <p className="text-xl mb-6">
                      Aux fins de mieux sécuriser nos services, les informations des utilisateurs bannis peuvent être
                      conservées et utilisées à des fins de sécurité et de prévention des fraudes. Elles peuvent être
                      partagées afin de nous permettre de prendre les mesures nécessaires contre les utilisateurs à
                      risque, telles que la résiliation de leur compte et/ou l’interdiction de créer un compte. Nous
                      nous réservons la possibilité d’informer les autorités compétentes en cas d’activité(s)
                      illicite(s) de votre part.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">
                      4.2 Détection et signalement des contenus contraires à nos règles de conduite et/ou illicites
                    </h3>
                    <p className="text-xl mb-4">
                      Afin de nous assurer du respect de nos règles de conduite par nos utilisateurs et des obligations
                      qui nous sont applicables lorsque nous hébergeons du contenu, nous avons mis en place des mesures
                      et des outils dédiés à des fins de modération.
                    </p>
                    <p className="text-xl mb-2">Nous veillons notamment à la sécurité de nos utilisateurs via :</p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>la mise en place d’outils de détection automatique</li>
                      <li>la mise à disposition d’un outil de signalement utilisateur</li>
                      <li>la possibilité de contacter directement notre service client.</li>
                    </ul>
                    <p className="text-xl mb-6">
                      Pour signaler un profil, un comportement ou un contenu privé contraire à nos règles de conduite,
                      il convient de vous rendre sur votre espace personnel.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">
                      4.3 Conséquences en cas de non-respect de nos conditions d’utilisation
                    </h3>
                    <p className="text-xl">
                      Dès que nous avons connaissance d’un contenu ou d’un comportement qui enfreindrait nos conditions
                      d’utilisation, notre équipe de modération prendra les mesures appropriées. En cas de manquement
                      grave ou répété, celles-ci pourront inclure de supprimer le contenu, résilier l’abonnement sans
                      remboursement ou compensation, bannir l’utilisateur, procéder au blocage des adresses e-mail et
                      autres identifiants associés aux personnes mal intentionnées.
                    </p>
                  </>
                ),
              },
              {
                title: "5. Services",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Sauf en période de lancement ou promotionnelle, la souscription d’un abonnement et l’usage de
                      notre plateforme est payante. La communication avec d’autres utilisateurs requiert un abonnement.
                    </p>
                    <p className="text-xl mb-4">
                      Notre structure tarifaire peut varier dans le temps selon la durée de l’abonnement, les offres
                      spéciales et les promotions. Certaines options proposées à nos utilisateurs peuvent faire l’objet
                      d’une facturation distincte.
                    </p>
                    <p className="text-xl">
                      En utilisant nos Services, vous acceptez que ces informations et ce contenu puissent faire l’objet
                      d’un traitement via des systèmes d’intelligence artificielle (par exemple pour la création de
                      contenu généré automatiquement). Nous utilisons également un algorithme pour améliorer les chances
                      de réussite des propositions de rencontres.
                    </p>
                  </>
                ),
              },
              {
                title: "6. Procédure et conditions d’achat",
                content: (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mt-4 mb-4">6.1 Généralités</h3>
                    <p className="text-xl mb-4">
                      En fonction de votre localisation et de la manière dont vous accédez aux Services (par exemple via
                      un ordinateur, un appareil mobile ou une application sur iOS ou Android), les Achats peuvent être
                      effectués directement sur nos Services (par exemple via une carte de paiement, PayPal, etc.), via
                      les opérateurs mobiles ou via les systèmes de paiement intégrés aux applications (tels que l’App
                      Store/Google Play). Lorsque vous choisissez d’effectuer un Achat, vous êtes invité(e) à le
                      confirmer auprès du prestataire de paiement concerné. Votre mode de paiement, tel qu’une carte de
                      paiement ou votre compte tiers, par exemple Apple Pay/Google Play dans l’App Store/Google Play (le
                      « Mode de paiement » de l’utilisateur), sera débité des montants affichés pour le(s) Achat(s) que
                      vous avez sélectionnés et vous nous autorisez, nous et/ou Apple/Google ou un autre compte tiers
                      (le cas échéant) à vous débiter.
                    </p>
                    <p className="text-xl mb-6">
                      L’Achat est confirmé au moment où la transaction financière est autorisée et confirmée auprès de
                      votre banque ou de votre compte tiers (tel que les opérateurs mobiles ou l’App Store/Google Store
                      d’Apple/Google).
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">6.2 Renouvellement de l’abonnement</h3>
                    <p className="text-xl mb-6">
                      Nous ne prévoyons pas de renouvellement automatique. En fin d’abonnement, l’utilisateur reçoit un
                      email l’informant de la nécessité de souscrire un nouvel abonnement sous peine de voir son compte
                      clôturé.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">6.3 Droit de rétractation</h3>
                    <p className="text-xl mb-4">
                      Conformément à l’article L.221-18 du Code de la Consommation, vous disposez d’un délai de quatorze
                      jours à compter du jour suivant un Achat pour exercer votre droit de rétractation (sans pénalité
                      et sans motif) en remplissant le formulaire de rétractation mis à votre disposition.
                    </p>
                    <p className="text-xl mb-4">
                      À compter de la souscription de votre abonnement payant, vous bénéficiez d’un délai légal de
                      rétractation de quatorze (14) jours. Pendant ce délai, les propositions de rencontre ne sont pas
                      accessibles, sauf demande expresse de votre part tendant au commencement immédiat du service
                      payant.
                    </p>
                    <p className="text-xl mb-4">
                      En cas de demande expresse de commencement immédiat du service payant avant l’expiration du délai
                      de rétractation, et si vous exercez ensuite ce droit dans le délai légal, vous resterez redevable
                      du montant correspondant aux services effectivement fournis jusqu’à la communication de votre
                      décision de vous rétracter.
                    </p>
                    <p className="text-xl">
                      Le remboursement sera effectué dans les 14 jours suivants la date à laquelle nous avons été
                      informés de votre décision de rétractation et est traité avec le même Mode de paiement que celui
                      que vous avez utilisé pour l’Achat initial.
                    </p>
                  </>
                ),
              },
              {
                title: "7. Résiliation de l’Abonnement – Suspension de profil – Fermeture de compte par l’utilisateur",
                content: (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mt-4 mb-4">7.1 Résiliation de l’Abonnement</h3>
                    <p className="text-xl mb-4">
                      En cas de résiliation anticipée de l’abonnement du fait de l’utilisateur et en l’absence de faute
                      de notre part, l’utilisateur ne pourra pas prétendre à un remboursement pour la période non
                      effectuée. Il conservera toutefois l’accès aux fonctionnalités gratuites.
                    </p>
                    <p className="text-xl mb-6">
                      Kalimera se réserve également le droit de procéder à l’annulation de l’abonnement en cours
                      conformément à l’article 4 en cas de manquement aux CGU. Dans un tel cas, l’utilisateur en sera
                      informé par email.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">7.2 Suspension de profil</h3>
                    <p className="text-xl mb-6">
                      Si vous ne souhaitez plus recevoir de messages ou exposer votre profil à d’autres utilisateurs,
                      vous pouvez à tout moment demander la suspension de votre profil via votre espace personnel. Cette
                      suspension d’une durée maximale de 30 jours est temporaire et n’interrompt en aucun cas
                      l’abonnement que vous avez souscrit. Vous pouvez réactiver votre profil à tout moment.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">7.3 Suppression du profil</h3>
                    <p className="text-xl mb-4">
                      Vous pouvez à tout moment demander la suppression de vos informations personnelles et de votre
                      compte en suivant les instructions disponibles sur votre section « Mon compte ». Dans le cas où
                      vous rencontreriez des difficultés, vous êtes invité(e) à contacter le Service Client qui est
                      habilité à le faire en votre nom.
                    </p>
                    <p className="text-xl mb-4">
                      La suppression de votre compte ne met pas fin à votre abonnement en cours ; tous les versements au
                      titre de l’abonnement restent dus et exigibles pour la partie restante de la période en cours même
                      si vous n’utilisez plus les Services correspondants.
                    </p>
                    <p className="text-xl mb-6">
                      À la fermeture de votre compte, vous recevez un e-mail de confirmation.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">
                      7.4 Défaut répété de réponse aux propositions de rencontre
                    </h3>
                    <p className="text-xl mb-4">
                      Afin de préserver la courtoisie des échanges, la qualité des mises en relation et l’intérêt réel
                      du service, l’utilisateur s’engage à répondre, dans un délai raisonnable, favorablement ou
                      défavorablement, aux propositions de rencontre qui lui sont adressées par l’intermédiaire de la
                      plateforme.
                    </p>
                    <p className="text-xl mb-4">
                      Constitue un manquement aux présentes Conditions d’utilisation le fait, pour un utilisateur, de
                      laisser sans réponse trois (3) propositions de rencontre qui lui ont été adressées, malgré trois
                      (3) relances par courrier électronique envoyées à l’adresse associée à son compte.
                    </p>
                    <p className="text-xl mb-4">
                      En pareil cas, Kalimera pourra, après avoir mis l’utilisateur en mesure de réagir ou de faire
                      valoir ses observations dans le délai indiqué dans la dernière relance, suspendre le profil, puis,
                      à défaut de régularisation, clôturer le compte et retirer le profil de la plateforme, sans
                      indemnité.
                    </p>
                    <p className="text-xl mb-4">
                      Lorsque l’utilisateur dispose d’un abonnement payant en cours, Kalimera pourra, selon les
                      circonstances, privilégier d’abord la suspension du profil ou différer la clôture définitive à
                      l’issue de l’abonnement en cours, sous réserve des dispositions légales impératives.
                    </p>
                    <p className="text-xl">
                      Cette mesure a pour finalité de garantir la qualité, la sincérité, la courtoisie des échanges et
                      le bon fonctionnement du service, Kalimera n’ayant pas vocation à maintenir durablement des
                      comptes inactifs ou dépourvus d’implication réelle dans les mises en relation proposées.
                    </p>
                  </>
                ),
              },
              {
                title: "8. Propriété intellectuelle",
                content: (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mt-4 mb-4">
                      8.1 Contenu que nous diffusons sur les Services
                    </h3>
                    <p className="text-xl mb-4">
                      Tous les noms, marques, logos, graphismes, photographies, animations, vidéos, textes, et en
                      général tout contenu affiché sur les Services, sont notre propriété exclusive, ou nous ont été
                      accordés en vertu d’une licence ou sont sous notre contrôle, et ne peuvent être reproduits,
                      utilisés ou communiqués sans notre autorisation expresse, sous peine de poursuites judiciaires.
                    </p>
                    <p className="text-xl mb-4">
                      Les droits d’utilisation qui vous sont accordés sont limités à votre usage privé et personnel dans
                      le cadre de votre utilisation des Services et tant que vous disposez d’un compte chez nous. Toute
                      autre utilisation de votre part est interdite. De même, vous n’êtes pas autorisé(e) à copier,
                      reproduire ou utiliser de toute autre manière le contenu produit par d’autres utilisateurs, à des
                      fins autres que strictement personnelles et privées.
                    </p>
                    <p className="text-xl mb-6">
                      Il vous est interdit, entre autres, de copier, reproduire, télécharger, diffuser, transmettre,
                      modifier, exploiter commercialement et/ou distribuer du contenu, des pages ou des codes
                      informatiques des Services, de quelque manière que ce soit, sous peine de poursuites judiciaires.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">
                      8.2 Contenus publiés par l’utilisateur
                    </h3>
                    <p className="text-xl mb-4">
                      L’utilisateur demeure titulaire des droits sur les contenus qu’il publie ou transmet dans le cadre
                      de l’utilisation des Services, tels que notamment ses textes, photographies, vidéos,
                      enregistrements audio, descriptions et informations de profil.
                    </p>
                    <p className="text-xl mb-4">
                      En publiant ou en transmettant de tels contenus sur les Services, l’utilisateur accorde à
                      Kalimera, pour les besoins exclusifs de l’exploitation, du fonctionnement, de la promotion et de
                      l’amélioration des Services, une autorisation non exclusive, gratuite, personnelle, non
                      transférable à des tiers hors prestataires techniques, et pour la durée d’utilisation du compte
                      concerné, permettant de :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>héberger, stocker et reproduire les contenus ;</li>
                      <li>les afficher et les mettre à disposition sur les Services ;</li>
                      <li>les adapter à des contraintes techniques, de format, de présentation ou d’affichage ;</li>
                      <li>
                        les utiliser dans le cadre de la mise en relation, de la modération, de la sécurité et de
                        l’administration des Services.
                      </li>
                    </ul>
                    <p className="text-xl">
                      Cette autorisation est strictement limitée aux besoins du service. Elle n’emporte aucun transfert
                      de propriété au profit de Kalimera.
                    </p>
                  </>
                ),
              },
              {
                title: "9. Garanties, responsabilité et indemnisation",
                content: (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mt-4 mb-4">
                      9.1 Nos obligations en ce qui concerne votre utilisation des Services
                    </h3>
                    <p className="text-xl mb-4">
                      Kalimera est un intermédiaire qui ne garantit ni la sincérité des profils, ni l’exactitude des
                      algorithmes de mises en contact, ni le succès des propositions de rencontres. Les utilisateurs
                      publient et téléchargent leurs contenus sous leur seule responsabilité. Nous ne contrôlons ni ne
                      modérons de manière exhaustive ces contenus.
                    </p>
                    <p className="text-xl mb-6">
                      Nous ne pouvons être tenus pour responsables de tous les contenus diffusés par les utilisateurs
                      susceptibles de porter atteinte à vos droits.
                    </p>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">9.2 Fonctionnement des Services</h3>
                    <p className="text-xl mb-2">
                      Nos Services vous sont fournis « en l’état ». Nous ne vous garantissons pas la possibilité de les
                      utiliser si :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>votre équipement ne fonctionne pas correctement,</li>
                      <li>votre fournisseur d’accès Internet ne fournit pas un niveau de service adéquat</li>
                      <li>votre connexion Internet n’est pas pleinement fonctionnelle.</li>
                    </ul>
                    <p className="text-xl mb-4">
                      Le fonctionnement des Services peut être interrompu temporairement pour des motifs techniques.
                    </p>
                    <p className="text-xl">
                      Dans la mesure du possible, nous nous engageons à vous informer avant toute maintenance ou mise à
                      jour planifiée qui pourrait avoir une incidence sur votre utilisation des Services.
                    </p>
                  </>
                ),
              },
              {
                title: "10. Sécurité",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      En utilisant les Services, vous acceptez de prendre des précautions raisonnables lorsque vous
                      interagissez avec d’autres utilisateurs, en particulier si vous décidez de communiquer en dehors
                      des Services ou de rencontrer d’autres utilisateurs en dehors des Services. En outre, vous
                      acceptez de consulter nos Conseils de sécurité avant de commencer à utiliser les Services et de
                      les suivre à tout moment lors de l’utilisation de nos Services et lors de toute interaction avec
                      d’autres utilisateurs.
                    </p>
                    <p className="text-xl">
                      Dans le cas où vous publiez et/ou divulguez à d’autres utilisateurs des informations
                      confidentielles ou sensibles, telles que des informations personnelles (nom, adresse postale,
                      adresse e-mail, numéro de téléphone, etc.) ou des informations financières (par exemple, des
                      informations de carte de crédit ou de compte bancaire), vous le faites à vos risques et périls.
                    </p>
                  </>
                ),
              },
              {
                title: "11. Responsabilité générale",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Kalimera agit comme intermédiaire de mise en relation et n’est tenue que d’une obligation de
                      moyens.
                    </p>
                    <p className="text-xl mb-4">
                      Kalimera ne garantit ni la disponibilité permanente des Services, ni l’exactitude des contenus
                      publiés par les utilisateurs, ni le succès des échanges ou des rencontres.
                    </p>
                    <p className="text-xl mb-4">
                      Kalimera ne saurait être tenue responsable des contenus, propos ou comportements des utilisateurs,
                      ni des conséquences des échanges ou rencontres entre eux, ni des interruptions temporaires des
                      Services liées à la maintenance, à un incident technique, à des impératifs de sécurité ou à un cas
                      de force majeure.
                    </p>
                    <p className="text-xl mb-4">
                      Chaque utilisateur demeure seul responsable de son utilisation des Services, des contenus qu’il
                      publie et de ses échanges avec les autres utilisateurs.
                    </p>
                    <p className="text-xl">
                      La responsabilité de Kalimera ne pourra être engagée qu’en cas de faute prouvée qui lui est
                      directement imputable, dans les limites prévues par la loi.
                    </p>
                  </>
                ),
              },
              {
                title: "12. Données personnelles",
                content: (
                  <p className="text-xl">
                    Vos données personnelles sont traitées conformément à notre Politique de confidentialité et au RGPD.
                  </p>
                ),
              },
              {
                title: "13. Modifications des Conditions d’utilisation et des services",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Kalimera se réserve le droit de modifier, à tout moment, les présentes Conditions d’utilisation
                      ainsi que tout ou partie des Services, notamment pour des raisons techniques, juridiques,
                      éditoriales, de sécurité ou d’amélioration du fonctionnement de la plateforme.
                    </p>
                    <p className="text-xl mb-4">
                      Les utilisateurs seront informés, par tout moyen approprié, de toute modification substantielle
                      affectant les Services ou leurs droits et obligations.
                    </p>
                    <p className="text-xl mb-4">
                      Sauf disposition légale impérative contraire, les modifications entrent en vigueur à compter de
                      leur mise en ligne ou à toute autre date indiquée par Kalimera.
                    </p>
                    <p className="text-xl mb-4">
                      En poursuivant l’utilisation des Services après leur entrée en vigueur, l’utilisateur est réputé
                      avoir pris connaissance des modifications et les accepter.
                    </p>
                    <p className="text-xl">
                      Aucune modification ne saurait toutefois avoir pour effet de priver l’utilisateur des droits qui
                      lui sont reconnus par la loi.
                    </p>
                  </>
                ),
              },
              {
                title: "14. Notifications et messages relatifs aux Services",
                content: (
                  <p className="text-xl">
                    En utilisant les Services, vous consentez à ce que nous vous envoyions des messages concernant votre
                    compte ou les Services. Ces messages peuvent être partagés directement sur les Services, par le
                    biais de notifications d’application ou par d’autres moyens associés à votre compte, tels que
                    l’e-mail. Il vous est recommandé de vérifier vos paramètres afin de contrôler le type de messages
                    que vous recevez de notre part. Vous reconnaissez et acceptez que nous ne pouvons être tenus pour
                    responsables de votre manquement à maintenir l’exactitude de vos coordonnées.
                  </p>
                ),
              },
              {
                title: "15. Applicabilité",
                content: (
                  <p className="text-xl">
                    Dans le cas où une ou plusieurs dispositions des Conditions d’utilisation sont jugées inapplicables
                    en vertu des lois ou règlements applicables ou suite à une décision finale d’un tribunal ou d’une
                    autorité compétente, les autres dispositions restent pleinement en vigueur dans la mesure permise
                    par la loi, les règlements ou les décisions de justice applicables.
                  </p>
                ),
              },
              {
                title: "16. Cession",
                content: (
                  <p className="text-xl">
                    Tous nos droits et obligations en vertu des présentes Conditions d’utilisation sont librement
                    cessibles dans le cadre d’une fusion, acquisition, vente commerciale ou cession d’actifs, ou par
                    effet de la loi, sous réserve que nous nous efforcions de garantir que vos droits et obligations ne
                    soient pas affectés par une telle transaction.
                  </p>
                ),
              },
              {
                title: "17. Demandes et réclamations",
                content: (
                  <p className="text-xl">
                    Pour toute demande ou réclamation concernant votre utilisation des Services, vous êtes invité(e) à
                    consulter la page d’Aide. Vous pouvez contacter le Service Client en cas de besoin d’assistance
                    supplémentaire par email :{" "}
                    <a href="mailto:contact@monkalimera.fr" className="text-primary hover:underline">
                      contact@monkalimera.fr
                    </a>
                  </p>
                ),
              },
              {
                title: "18. Loi applicable – Litiges",
                content: (
                  <>
                    <p className="text-xl mb-4">
                      Les présentes Conditions d’utilisation sont régies, interprétées et appliquées conformément au
                      droit français.
                    </p>
                    <p className="text-xl mb-4">
                      En cas de difficulté ou de litige relatif à l’utilisation des Services, l’utilisateur est invité à
                      adresser en priorité une réclamation écrite à Kalimera, afin de rechercher une solution amiable.
                    </p>
                    <p className="text-xl mb-4">
                      À défaut de résolution amiable dans un délai raisonnable à compter de cette réclamation écrite,
                      l’utilisateur consommateur peut recourir gratuitement à un médiateur de la consommation,
                      conformément aux dispositions du Code de la consommation. Les coordonnées du médiateur compétent :
                      [Coordonnées du médiateur à insérer]
                    </p>
                    <p className="text-xl">
                      À défaut d’accord amiable ou de médiation, le litige sera porté devant les juridictions françaises
                      compétentes, conformément aux règles de droit commun.
                    </p>
                  </>
                ),
              },
              {
                title: "19. Rappel des dispositions légales applicables",
                content: (
                  <>
                    <p className="text-xl mb-2">
                      L’utilisateur consommateur bénéficie, conformément aux dispositions légales en vigueur, des droits
                      relatifs :
                    </p>
                    <ul className="list-disc list-inside text-xl space-y-1 ml-4 mb-4">
                      <li>à la résiliation en ligne des contrats conclus par voie électronique ;</li>
                      <li>
                        à la garantie légale de conformité applicable aux contenus numériques et services numériques.
                      </li>
                    </ul>
                    <p className="text-xl">
                      Ces droits s’exercent dans les conditions prévues par le Code de la consommation, notamment les
                      articles L.215-1, L.215-1-1 et L.224-25-12 et suivants.
                    </p>
                  </>
                ),
              },
            ].map((section, i) => (
              <div key={i} data-reveal data-reveal-delay={String(300 + (i % 5) * 50)}>
                {section.title !== "Préambule" && (
                  <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-6 mt-12 border-b border-border pb-2">
                    {section.title}
                  </h2>
                )}
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
