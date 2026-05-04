import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { articles, categories } from "@/data/editorialArticles";
import editorialHero from "@/assets/editorial-hero.jpg";
import GiftBannerSection from "@/components/home/GiftBannerSection";
import giftBannerEditorial from "@/assets/gift-banner-editorial.jpg";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const ArticleCard = ({ article }: {article: (typeof articles)[0];}) =>
<Link to={`/editorial/${article.slug}`} className="group block">
    <article className="h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3] mb-6">
        <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      
      </div>
      <span className="font-heading italic text-muted-foreground mb-3 block text-3xl">{article.category}</span>
      <h3 className="font-heading text-2xl text-foreground mb-3 leading-snug group-hover:text-muted-foreground transition-colors duration-300 md:text-4xl">
        {article.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3 text-xl">{article.excerpt}</p>
      <div>
        <span className="inline-block bg-primary text-primary-foreground px-6 py-3 font-medium tracking-wide transition-all duration-300 group-hover:shadow-elevated group-hover:translate-y-[-1px] text-lg">
          Lire l'article
        </span>
      </div>
    </article>
  </Link>;


export default function Editorial() {
  const revealRef = useScrollReveal<HTMLElement>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const featured = articles[0];
  const filtered = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;
  const gridArticles = filtered.slice(activeCategory ? 0 : 1);

  // Split into: first 6, editor's picks (3), then remaining in batches
  const firstBatch = gridArticles.slice(0, INITIAL_COUNT);
  const editorsPicks = articles.slice(0, 3);
  const remaining = gridArticles.slice(INITIAL_COUNT);
  const visibleRemaining = remaining.slice(0, Math.max(0, visibleCount - INITIAL_COUNT));
  const hasMore = visibleCount < gridArticles.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  return (
    <Layout>
      {/* Hero – Full bleed */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={editorialHero} alt="L'éditorial" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-heading text-7xl md:text-8xl lg:text-9xl font-medium text-primary-foreground block mb-6">
            L'éditorial
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Inspirations, conseils et art de vivre pour des rencontres qui ont du sens.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <ArrowDown className="h-6 w-6 text-primary-foreground/60" />
        </div>
      </section>

      {/* Featured Article – Full-bleed split */}
      {!activeCategory &&
      <section ref={revealRef} className="bg-background">
          <Link to={`/editorial/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-0 group" data-reveal>
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[70vh]">
              <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            </div>
            <div className="flex flex-col justify-center p-10 md:p-16 lg:p-24 bg-secondary">
              <span className="tracking-[0.3em] uppercase text-muted-foreground mb-6 text-2xl">{featured.category}</span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-6 leading-tight group-hover:text-muted-foreground transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed max-w-lg text-2xl">{featured.excerpt}</p>
              <div className="flex items-center gap-4">
                <img
                src={featured.author.avatar}
                alt={featured.author.name}
                className="w-12 h-12 rounded-full object-cover" />
              
                <div>
                  <p className="font-medium text-foreground text-xl">{featured.author.name}</p>
                  <p className="text-muted-foreground text-2xl">
                    {featured.date} · {featured.readTime} de lecture
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      }

      {/* Category Filter */}
      <section className="py-16 md:py-24 bg-background">
        <div className="px-4 md:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => {
                setActiveCategory(null);
                setVisibleCount(INITIAL_COUNT);
              }}
              className={`px-5 py-2.5 text-sm tracking-wide transition-all duration-300 ${
              !activeCategory ?
              "bg-primary text-primary-foreground" :
              "bg-secondary text-muted-foreground hover:text-foreground"}`
              }>
              
              Tous les articles
            </button>
            {categories.map((cat) =>
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(INITIAL_COUNT);
              }}
              className={`px-5 py-2.5 text-sm tracking-wide transition-all duration-300 ${
              activeCategory === cat ?
              "bg-primary text-primary-foreground" :
              "bg-secondary text-muted-foreground hover:text-foreground"}`
              }>
              
                {cat}
              </button>
            )}
          </div>

          {/* First 6 articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-16">
            {firstBatch.map((article) =>
            <ArticleCard key={article.slug} article={article} />
            )}
          </div>
        </div>
      </section>

      {/* Editor's Picks – text under image, same card style */}
      {!activeCategory &&
      <section className="py-16 md:py-24 bg-secondary">
          <div className="px-4 md:px-8 lg:px-12 xl:px-20">
            <div className="text-center mb-16">
              <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-xl">
                Sélection de la rédaction
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">Nos coups de cœur</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-16">
              {editorsPicks.map((article) =>
            <ArticleCard key={`pick-${article.slug}`} article={article} />
            )}
            </div>
          </div>
        </section>
      }

      {/* Remaining articles + See more */}
      {(visibleRemaining.length > 0 || hasMore) &&
      <section className="py-16 md:py-24 bg-background">
          <div className="px-4 md:px-8 lg:px-12 xl:px-20">
            {visibleRemaining.length > 0 &&
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-16 mb-16">
                {visibleRemaining.map((article) =>
            <ArticleCard key={`more-${article.slug}`} article={article} />
            )}
              </div>
          }
            {hasMore &&
          <div className="text-center">
                <button
              onClick={handleShowMore}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 font-medium tracking-wide text-lg transition-all duration-300 hover:shadow-elevated hover:translate-y-[-1px]">
              
                  Voir plus d'articles
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
          }
          </div>
        </section>
      }

      {/* Gift Banner */}
      <GiftBannerSection image={giftBannerEditorial} />
    </Layout>);

}