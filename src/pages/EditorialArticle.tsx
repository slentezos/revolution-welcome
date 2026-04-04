import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { articles } from "@/data/editorialArticles";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerArticle from "@/assets/gift-banner-article.jpg";

export default function EditorialArticle() {
  const { slug } = useParams<{slug: string;}>();
  const revealRef = useScrollReveal<HTMLElement>();

  const articleIndex = articles.findIndex((a) => a.slug === slug);
  const article = articles[articleIndex];

  if (!article) return <Navigate to="/editorial" replace />;

  const nextArticle = articles[(articleIndex + 1) % articles.length];
  const prevArticle = articles[(articleIndex - 1 + articles.length) % articles.length];

  return (
    <Layout>
      {/* Split Hero — image left, info right (Quintessentially style) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover min-h-[50vh] lg:min-h-full" />
          
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-secondary">
          <span className="tracking-[0.3em] uppercase text-muted-foreground mb-6 text-xl">
            {article.category}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed text-2xl">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-14 h-14 rounded-full object-cover" />
            
            <div>
              <p className="font-medium text-foreground text-xl">
                Rédigé par <span className="font-semibold">{article.author.name}</span>
              </p>
              <div className="flex items-center gap-3 text-base text-muted-foreground mt-1">
                <span className="text-xl">{article.date}</span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1 text-xl">
                  <Clock className="h-3 w-3" />
                  {article.readTime} de lecture
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section ref={revealRef} className="py-16 md:py-24 bg-background">
        <div className="container-main mx-auto px-6 md:px-12 max-w-3xl">
          <div className="space-y-8">
            {article.content.map((paragraph, i) =>
            <p
              key={i}
              data-reveal
              data-reveal-delay={String(i * 100)}
              className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              
                {paragraph}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="divider-gold mx-auto my-16" />

          {/* Back link */}
          <div data-reveal className="text-center">
            <Link
              to="/editorial"
              className="inline-flex items-center gap-2 tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors text-xl">
              
              <ArrowLeft className="h-4 w-4" />
              Retour à l'éditorial
            </Link>
          </div>
        </div>
      </section>

      {/* Next / Prev Articles */}
      <section className="border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Link
            to={`/editorial/${prevArticle.slug}`}
            className="group block border-b md:border-b-0 md:border-r border-border">
            <div className="relative overflow-hidden aspect-[3/2]">
              <img
                src={prevArticle.image}
                alt={prevArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
            </div>
            <div className="p-8 md:p-12 flex items-center gap-6">
              <ArrowLeft className="h-5 w-5 text-muted-foreground shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="tracking-[0.2em] uppercase text-muted-foreground block mb-2 text-xl">
                  Article précédent
                </span>
                <span className="font-heading text-foreground group-hover:text-muted-foreground transition-colors text-xl md:text-3xl">
                  {prevArticle.title}
                </span>
              </div>
            </div>
          </Link>
          <Link
            to={`/editorial/${nextArticle.slug}`}
            className="group block">
            <div className="relative overflow-hidden aspect-[3/2]">
              <img
                src={nextArticle.image}
                alt={nextArticle.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
            </div>
            <div className="p-8 md:p-12 flex items-center justify-end gap-6 text-right">
              <div>
                <span className="tracking-[0.2em] uppercase text-muted-foreground block mb-2 text-xl">
                  Article suivant
                </span>
                <span className="font-heading text-foreground group-hover:text-muted-foreground transition-colors text-xl md:text-3xl">
                  {nextArticle.title}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
      {/* Gift Banner */}
      <GiftBannerSection image={giftBannerArticle} />
    </Layout>);

}