import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CharteBienveillance() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <Layout>
      <LegalSubMenu />
      <section ref={revealRef} className="section-luxury bg-background py-[50px]">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <span
            data-reveal
            className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6 block text-center text-lg">
            
            Nos engagements
          </span>
          <h1
            data-reveal
            data-reveal-delay="150"
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6">
            
            Charte de sécurité et de bienveillance
          </h1>
          <div data-reveal data-reveal-delay="250" className="divider-gold mx-auto mb-16" />

          <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
            {[
            {
              title: "Un climat serein et respectueux",
              content:
              <>
                    <p className="text-xl mb-4">
                      Kalimera est un service de rencontres sérieux, pensé pour des seniors qui souhaitent nouer une
                      relation sincère, stable et respectueuse. La qualité des échanges, la sécurité des adhérents et la
                      bienveillance entre les membres sont au cœur de notre démarche.
                    </p>
                    <p className="text-xl mb-4">
                      Nous vous invitons à vous comporter sur la plateforme avec la même courtoisie, la même retenue et
                      le même respect que dans la vie réelle. Chacun doit pouvoir échanger dans un climat serein, sans
                      subir de propos blessants, d’agressivité, de harcèlement, d’intimidation ou de manque de respect.
                    </p>
                    <p className="text-xl mb-4">
                      La politesse et la délicatesse sont essentielles, en particulier au début d’une relation. Une
                      phrase que l’on croit légère ou drôle peut être mal comprise ou mal vécue. Prenez le temps de
                      découvrir l’autre avec tact, simplicité et considération.
                    </p>
                    <p className="text-xl">
                      Kalimera n’est pas un espace pour les propos déplacés, les sollicitations sexuelles non désirées
                      ou les comportements inappropriés. Nous souhaitons préserver un cadre rassurant, digne et
                      respectueux pour chacun.
                    </p>
                  </>

            },
            {
              title: "Sécurité et protection de la vie privée",
              content:
              <>
                    <p className="text-xl mb-4">
                      Pour votre sécurité, il est recommandé de ne pas communiquer trop rapidement vos informations
                      personnelles, telles que votre numéro de téléphone, votre adresse email, votre adresse postale,
                      votre lieu de travail ou toute autre donnée sensible. La plateforme met à votre disposition des
                      outils de communication permettant d’échanger plus sereinement sans divulguer immédiatement vos
                      coordonnées personnelles.
                    </p>
                    <p className="text-xl mb-4">
                      Dans un souci de sécurité et de qualité, Kalimera procède à une vérification manuelle des demandes
                      d’adhésion, ainsi que des photos, vidéos et informations transmises lors de l’inscription. Cette
                      vigilance contribue à préserver un environnement fiable et protecteur.
                    </p>
                    <p className="text-xl">
                      Par précaution, les contenus visuels ou informations permettant d’identifier trop directement
                      votre domicile, votre lieu de travail, vos proches ou certains éléments sensibles de votre vie
                      privée peuvent être refusés, masqués ou supprimés.
                    </p>
                  </>

            },
            {
              title: "Confidentialité renforcée",
              content:
              <p className="text-xl">
                    Si vous le souhaitez, vous pouvez opter pour une confidentialité renforcée. Dans ce cas, vos
                    informations ne seront visibles qu’après votre acceptation d’une proposition de rencontre. Cette
                    option vous permet de ne pas révéler votre identité à des adhérents dont le profil ne vous intéresse
                    pas.
                  </p>

            },
            {
              title: "Un usage strictement personnel et discret",
              content:
              <>
                    <p className="text-xl mb-4">
                      Kalimera n’a pas vocation à être utilisé à des fins commerciales, promotionnelles ou
                      publicitaires. Toute utilisation de la plateforme pour promouvoir une activité, une entreprise, un
                      commerce ou des services est contraire à son esprit et pourra entraîner l’exclusion du membre
                      concerné.
                    </p>
                    <p className="text-xl">
                      Les informations relatives aux autres adhérents, qu’elles soient publiques ou échangées dans un
                      cadre privé, doivent être traitées avec discrétion et respect. Elles ne peuvent en aucun cas être
                      utilisées à des fins commerciales, malveillantes, illicites ou contraires à la vie privée. Il en
                      va de même pour tout contenu protégé par des droits d’auteur.
                    </p>
                  </>

            },
            {
              title: "Signalement et accompagnement",
              content:
              <>
                    <p className="text-xl mb-4">
                      Si un échange vous met mal à l’aise, si un comportement vous paraît inapproprié ou si un membre ne
                      respecte pas les règles de la plateforme, vous pouvez le signaler facilement depuis votre espace
                      personnel en cliquant sur « Signaler ».
                    </p>
                    <p className="text-xl">
                      Nous vous invitons également à consulter nos Conseils de sécurité, notamment pour préparer votre
                      vidéo de présentation, échanger avec confiance et organiser une première rencontre dans les
                      meilleures conditions.
                    </p>
                  </>

            }].
            map((section, i) =>
            <div key={i} data-reveal data-reveal-delay={String(300 + i * 120)}>
                <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">{section.title}</h2>
                {section.content}
              </div>
            )}

            <div data-reveal data-reveal-delay="1000" className="bg-secondary p-8 md:p-10 text-center">
              <p className="text-foreground font-medium text-2xl leading-relaxed">
                En rejoignant Kalimera, vous contribuez à faire vivre un espace de rencontre fondé sur la confiance, la
                dignité, la courtoisie et la bienveillance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

}