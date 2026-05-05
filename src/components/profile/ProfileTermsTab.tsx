import dashboardHero from "@/assets/dashboard-hero.jpg";

const sections = [
{
  title: "1. Objet",
  content: "Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Mon Kalimera, service de mise en relation pour les personnes de 50 ans et plus résidant en Île-de-France."
},
{
  title: "2. Inscription",
  content: "L'inscription est réservée aux personnes physiques âgées de 50 ans minimum. Chaque utilisateur s'engage à fournir des informations exactes et à jour lors de son inscription. La vérification du numéro de téléphone est obligatoire."
},
{
  title: "3. Abonnement et tarification",
  content: "Mon Kalimera propose des abonnements sans reconduction tacite. Le paiement est unique et correspond à la durée choisie. Aucune option payante supplémentaire ne sera proposée."
},
{
  title: "4. Protection des données",
  content: "Vos données personnelles sont traitées conformément au RGPD. Elles ne sont jamais partagées avec des tiers à des fins commerciales. Vous pouvez demander la suppression de vos données à tout moment."
},
{
  title: "5. Garantie satisfait ou remboursé",
  content: "Si aucun match compatible n'est proposé dans les 30 jours suivant l'inscription, un remboursement intégral est garanti sur simple demande."
}];


export default function ProfileTermsTab() {
  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24 order-2 lg:order-1">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Cadre juridique
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Conditions d'utilisation
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Transparence et protection de vos données, au cœur de nos engagements.
          </p>
        </div>
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[50vh] order-1 lg:order-2">
          <img decoding="async" src={dashboardHero} alt="Conditions" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/10 to-transparent" />
        </div>
      </section>

      {/* Terms content */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28 max-w-5xl">
          <div className="space-y-10">
            {sections.map((s) =>
            <div key={s.title}>
                <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-4">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-xl">{s.content}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

}