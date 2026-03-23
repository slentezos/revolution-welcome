import Layout from "@/components/layout/Layout";
import LegalSubMenu from "@/components/layout/LegalSubMenu";

export default function SignalerContenu() {
  return (
    <Layout>
      <LegalSubMenu />
      <section className="section-luxury bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground text-center mb-6">
            Signaler un contenu illégal
          </h1>
        </div>
      </section>
    </Layout>
  );
}
