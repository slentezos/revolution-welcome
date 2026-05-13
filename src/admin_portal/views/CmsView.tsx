import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { adminSupabase } from "@/admin_portal/lib/supabase";
import {
  ENTITY_OPTIONS,
  SEO_LIMITS,
  buildBlogPostingJsonLd,
  slugify,
  type ArticleRow,
  type EntityCategory,
  type EntityTag,
  type SeoMetadata,
} from "@/admin_portal/lib/cms";
import { formatDateShortFr } from "@/admin_portal/lib/dates";
import { toast } from "sonner";

const NAVY = "var(--ap-bg)";
const SURFACE = "var(--ap-surface)";
const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const TEXT = "var(--ap-text)";
const MUTED = "var(--ap-muted)";

type DraftArticle = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  cover_image_alt: string;
  status: "draft" | "scheduled" | "published";
  author_name: string;
  author_avatar_url: string;
  author_bio: string;
  author_linkedin: string;
  author_twitter: string;
  primary_topic: string;
  related_article_ids: string[];
  seo_metadata: SeoMetadata;
  publication_date: string | null; // YYYY-MM-DD
  read_time_minutes: number | null;
  published_at: string | null;
  updated_at?: string;
};

const EMPTY_DRAFT: DraftArticle = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  cover_image_alt: "",
  status: "draft",
  author_name: "",
  author_avatar_url: "",
  author_bio: "",
  author_linkedin: "",
  author_twitter: "",
  primary_topic: "",
  related_article_ids: [],
  seo_metadata: { metaTitle: "", metaDescription: "", canonicalUrl: "", entityTags: [] },
  publication_date: null,
  read_time_minutes: null,
  published_at: null,
};

/** Splits markdown content into paragraphs (string[]) per Article contract. */
const splitParagraphs = (raw: string): string[] =>
  raw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export function CmsView() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftArticle>(EMPTY_DRAFT);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const { data, error } = await (adminSupabase as any)
        .from("articles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  useEffect(() => {
    if (!selectedId) {
      setDraft(EMPTY_DRAFT);
      return;
    }
    const a: any = articles.find((x: any) => x.id === selectedId);
    if (!a) return;
    setDraft({
      id: a.id,
      title: a.title ?? "",
      slug: a.slug ?? "",
      category: a.category ?? "",
      excerpt: a.excerpt ?? "",
      content: a.content ?? "",
      cover_image_url: a.cover_image_url ?? "",
      cover_image_alt: a.cover_image_alt ?? "",
      status: (a.status as DraftArticle["status"]) ?? "draft",
      author_name: a.author_name ?? "",
      author_avatar_url: a.author_avatar_url ?? "",
      author_bio: a.author_bio ?? "",
      author_linkedin: a.author_linkedin ?? "",
      author_twitter: a.author_twitter ?? "",
      primary_topic: a.primary_topic ?? "",
      related_article_ids: (a.related_article_ids as string[]) ?? [],
      seo_metadata: (a.seo_metadata as SeoMetadata) ?? {},
      publication_date: a.publication_date ?? null,
      read_time_minutes: a.read_time_minutes ?? null,
      published_at: a.published_at,
      updated_at: a.updated_at,
    });
  }, [selectedId, articles]);

  const paragraphs = useMemo(() => splitParagraphs(draft.content), [draft.content]);

  const jsonLd = useMemo(
    () =>
      buildBlogPostingJsonLd({
        title: draft.title,
        excerpt: draft.excerpt,
        slug: draft.slug || slugify(draft.title),
        coverImageUrl: draft.cover_image_url,
        coverImageAlt: draft.cover_image_alt,
        author: {
          name: draft.author_name,
          bio: draft.author_bio,
          linkedin: draft.author_linkedin,
          twitter: draft.author_twitter,
        },
        primaryTopic: draft.primary_topic,
        entityTags: draft.seo_metadata.entityTags,
        publishedAt: draft.publication_date
          ? new Date(draft.publication_date).toISOString()
          : draft.published_at,
        updatedAt: draft.updated_at,
      }),
    [draft],
  );

  const persist = async (status: DraftArticle["status"]) => {
    const slug = draft.slug || slugify(draft.title);
    const seo_metadata: SeoMetadata = { ...draft.seo_metadata, jsonLd };
    const payload: any = {
      title: draft.title,
      slug,
      category: draft.category || null,
      excerpt: draft.excerpt || null,
      content: draft.content || null,
      cover_image_url: draft.cover_image_url || null,
      cover_image_alt: draft.cover_image_alt || null,
      status,
      author_name: draft.author_name || null,
      author_avatar_url: draft.author_avatar_url || null,
      author_bio: draft.author_bio || null,
      author_linkedin: draft.author_linkedin || null,
      author_twitter: draft.author_twitter || null,
      primary_topic: draft.primary_topic || null,
      related_article_ids: draft.related_article_ids,
      seo_metadata,
      publication_date: draft.publication_date,
      read_time_minutes: draft.read_time_minutes,
      published_at:
        status === "published"
          ? draft.published_at ?? new Date().toISOString()
          : draft.published_at,
    };
    if (draft.id) {
      const { error } = await (adminSupabase as any).from("articles").update(payload).eq("id", draft.id);
      if (error) throw error;
      return draft.id;
    }
    const { data, error } = await (adminSupabase as any)
      .from("articles")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  };

  const draftMutation = useMutation({
    mutationFn: () => persist("draft"),
    onSuccess: (id) => {
      toast.success("Brouillon enregistré");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      setSelectedId(id);
    },
    onError: (e: any) => toast.error(e.message ?? "Erreur lors de l'enregistrement"),
  });

  const publishMutation = useMutation({
    mutationFn: () => persist("published"),
    onSuccess: (id) => {
      toast.success("Article publié — cache éditorial revalidé");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["editorial", "articles"] });
      setSelectedId(id);
    },
    onError: (e: any) => toast.error(e.message ?? "Erreur lors de la publication"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (adminSupabase as any).from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article supprimé");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      setSelectedId(null);
    },
  });

  const titleCount = draft.seo_metadata.metaTitle?.length ?? 0;
  const descCount = draft.seo_metadata.metaDescription?.length ?? 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
      {/* Article list */}
      <aside
        className="rounded-xl border p-3 h-fit xl:sticky xl:top-4"
        style={{ background: SURFACE, borderColor: BORDER }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold tracking-wide text-xl" style={{ color: TEXT }}>
            Articles
          </h2>
          <button
            onClick={() => setSelectedId(null)}
            className="font-medium text-xl px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2"
            style={{ background: GOLD, color: NAVY }}
          >
            + Nouveau
          </button>
        </div>
        {isLoading ? (
          <p className="text-xl" style={{ color: MUTED }}>Chargement…</p>
        ) : articles.length === 0 ? (
          <p className="text-xl" style={{ color: MUTED }}>Aucun article.</p>
        ) : (
          <ul className="space-y-1">
            {articles.map((a: any) => (
              <li key={a.id}>
                <button
                  onClick={() => setSelectedId(a.id)}
                  className="w-full text-left px-2 py-2 rounded-md text-xl transition-colors"
                  style={{
                    background: selectedId === a.id ? "rgba(201,169,97,0.12)" : "transparent",
                    color: TEXT,
                    border: `1px solid ${selectedId === a.id ? GOLD : "transparent"}`,
                  }}
                >
                  <div className="font-medium truncate">{a.title || "(Sans titre)"}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={a.status as any} />
                    <span className="text-xl" style={{ color: MUTED }}>
                      {formatDateShortFr(a.updated_at)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Split: editor (left) | live preview (right) */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        {/* ========== EDITOR ========== */}
        <main className="space-y-4 min-w-0">
          <Section title="Article">
            <Field label="Titre">
              <input
                className={inputCls}
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: d.slug || slugify(e.target.value),
                  }))
                }
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Slug (URL)">
                <input
                  className={inputCls}
                  value={draft.slug}
                  onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))}
                />
              </Field>
              <Field label="Catégorie" hint="Ex. Art de vivre, Gastronomie">
                <input
                  className={inputCls}
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Date de publication" hint="DD/MM/YYYY">
                <input
                  type="date"
                  className={inputCls}
                  value={draft.publication_date ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, publication_date: e.target.value || null }))
                  }
                />
              </Field>
              <Field label="Temps de lecture (min)">
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={draft.read_time_minutes ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      read_time_minutes: e.target.value ? parseInt(e.target.value, 10) : null,
                    }))
                  }
                />
              </Field>
              <Field label="Statut">
                <select
                  className={inputCls}
                  value={draft.status}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, status: e.target.value as DraftArticle["status"] }))
                  }
                >
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Programmé</option>
                  <option value="published">Publié</option>
                </select>
              </Field>
            </div>
            <Field label="Extrait">
              <textarea
                className={inputCls}
                rows={2}
                value={draft.excerpt}
                onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              />
            </Field>
            <Field
              label="Contenu (Markdown)"
              hint={`${paragraphs.length} paragraphe(s) détecté(s) — séparés par double retour`}
            >
              <textarea
                className={inputCls}
                rows={10}
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              />
            </Field>
          </Section>

          <Section title="Image principale">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="URL de la couverture">
                <input
                  className={inputCls}
                  value={draft.cover_image_url}
                  onChange={(e) => setDraft((d) => ({ ...d, cover_image_url: e.target.value }))}
                />
              </Field>
              <Field label="ALT-Text (obligatoire)" hint="Accessibilité & Image SEO">
                <input
                  className={inputCls}
                  required
                  value={draft.cover_image_alt}
                  onChange={(e) => setDraft((d) => ({ ...d, cover_image_alt: e.target.value }))}
                />
              </Field>
            </div>
          </Section>

          <Section title="Configuration SEO (Google)">
            <Field
              label="Meta Title"
              hint={`${titleCount} / ${SEO_LIMITS.metaTitle} caractères`}
              warn={titleCount > SEO_LIMITS.metaTitle}
            >
              <input
                className={inputCls}
                maxLength={SEO_LIMITS.metaTitle + 20}
                value={draft.seo_metadata.metaTitle ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, seo_metadata: { ...d.seo_metadata, metaTitle: e.target.value } }))
                }
              />
            </Field>
            <Field
              label="Meta Description"
              hint={`${descCount} / ${SEO_LIMITS.metaDescription} caractères`}
              warn={descCount > SEO_LIMITS.metaDescription}
            >
              <textarea
                className={inputCls}
                rows={2}
                maxLength={SEO_LIMITS.metaDescription + 20}
                value={draft.seo_metadata.metaDescription ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    seo_metadata: { ...d.seo_metadata, metaDescription: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="URL Canonique" hint="Optionnel — cross-posting">
              <input
                className={inputCls}
                placeholder="https://exemple.com/article"
                value={draft.seo_metadata.canonicalUrl ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    seo_metadata: { ...d.seo_metadata, canonicalUrl: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Topic Principal" hint="Force un slug court & pertinent">
              <input
                className={inputCls}
                value={draft.primary_topic}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    primary_topic: v,
                    slug: slugify(v || d.title),
                  }));
                }}
              />
            </Field>
          </Section>

          <Section title="GEO & LLM — Entity Tagging">
            <EntityTagPicker
              value={draft.seo_metadata.entityTags ?? []}
              onChange={(tags) =>
                setDraft((d) => ({ ...d, seo_metadata: { ...d.seo_metadata, entityTags: tags } }))
              }
            />
          </Section>

          <Section title="E-E-A-T — Auteur">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nom">
                <input
                  className={inputCls}
                  value={draft.author_name}
                  onChange={(e) => setDraft((d) => ({ ...d, author_name: e.target.value }))}
                />
              </Field>
              <Field label="URL Avatar">
                <input
                  className={inputCls}
                  placeholder="https://…/avatar.jpg"
                  value={draft.author_avatar_url}
                  onChange={(e) => setDraft((d) => ({ ...d, author_avatar_url: e.target.value }))}
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  className={inputCls}
                  placeholder="https://linkedin.com/in/…"
                  value={draft.author_linkedin}
                  onChange={(e) => setDraft((d) => ({ ...d, author_linkedin: e.target.value }))}
                />
              </Field>
              <Field label="Twitter / X">
                <input
                  className={inputCls}
                  placeholder="https://x.com/…"
                  value={draft.author_twitter}
                  onChange={(e) => setDraft((d) => ({ ...d, author_twitter: e.target.value }))}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Bio courte">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={draft.author_bio}
                    onChange={(e) => setDraft((d) => ({ ...d, author_bio: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Maillage interne — Articles reliés">
            <RelatedPicker
              articles={(articles as any[]).filter((a: any) => a.id !== draft.id)}
              value={draft.related_article_ids}
              onChange={(ids) => setDraft((d) => ({ ...d, related_article_ids: ids }))}
            />
          </Section>

          <div
            className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 py-3"
            style={{ background: `linear-gradient(to top, ${NAVY}, transparent)` }}
          >
            <div>
              {draft.id && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer cet article ?")) deleteMutation.mutate(draft.id!);
                  }}
                  className="text-xl px-3 py-2 rounded-md border"
                  style={{ borderColor: BORDER, color: "#FCA5A5" }}
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => draftMutation.mutate()}
                disabled={!draft.title || draftMutation.isPending}
                className="text-xl font-semibold px-4 py-2 rounded-md border disabled:opacity-50"
                style={{ borderColor: GOLD, color: GOLD, background: "transparent" }}
              >
                {draftMutation.isPending ? "Enregistrement…" : "Brouillon"}
              </button>
              <button
                onClick={() => publishMutation.mutate()}
                disabled={!draft.title || publishMutation.isPending}
                className="text-xl font-semibold px-4 py-2 rounded-md disabled:opacity-50"
                style={{ background: GOLD, color: NAVY }}
              >
                {publishMutation.isPending ? "Publication…" : "Publier"}
              </button>
            </div>
          </div>
        </main>

        {/* ========== LIVE PREVIEW ========== */}
        <aside className="space-y-4 min-w-0 2xl:sticky 2xl:top-4 2xl:self-start 2xl:max-h-[calc(100vh-2rem)] 2xl:overflow-y-auto">
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: SURFACE, borderColor: BORDER }}
          >
            <div className="px-4 py-2 flex items-center justify-between border-b" style={{ borderColor: BORDER }}>
              <span className="uppercase tracking-[0.18em] font-semibold text-xl" style={{ color: GOLD }}>
                Aperçu en direct
              </span>
              <span className="text-xl" style={{ color: MUTED }}>
                /editorial/{draft.slug || slugify(draft.title) || "…"}
              </span>
            </div>
            <LivePreview draft={draft} paragraphs={paragraphs} />
          </div>

          <Section title="JSON-LD (BlogPosting) — Aperçu">
            <pre
              className="text-xl leading-relaxed p-3 rounded-md overflow-x-auto max-h-96"
              style={{ background: NAVY, border: `1px solid ${BORDER}`, color: MUTED }}
            >
              {JSON.stringify(jsonLd, null, 2)}
            </pre>
          </Section>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
 * LIVE PREVIEW — strict mirror of EditorialArticle.tsx
 * ============================================================ */
function LivePreview({
  draft,
  paragraphs,
}: {
  draft: DraftArticle;
  paragraphs: string[];
}) {
  const dateLabel = draft.publication_date
    ? formatDateShortFr(draft.publication_date)
    : "—";
  const readTimeLabel = draft.read_time_minutes ? `${draft.read_time_minutes} min` : "—";

  return (
    <div className="bg-background text-foreground">
      {/* Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[40vh]">
        <div className="relative overflow-hidden bg-muted">
          {draft.cover_image_url ? (
            <img
              src={draft.cover_image_url}
              alt={draft.cover_image_alt || draft.title}
              className="w-full h-full object-cover min-h-[30vh]"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[30vh] text-muted-foreground text-xl">
              Image principale
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-6 lg:p-10 bg-secondary">
          <span className="tracking-[0.3em] uppercase text-muted-foreground mb-4 text-xl">
            {draft.category || "Catégorie"}
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl text-foreground mb-4 leading-tight">
            {draft.title || "Titre de l'article"}
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed text-xl">
            {draft.excerpt || "Extrait éditorial — résumé incitatif de quelques lignes."}
          </p>
          <div className="flex items-center gap-4">
            {draft.author_avatar_url ? (
              <img
                src={draft.author_avatar_url}
                alt={draft.author_name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-muted" />
            )}
            <div>
              <p className="font-medium text-foreground text-xl">
                Rédigé par{" "}
                <span className="font-semibold">{draft.author_name || "Auteur"}</span>
              </p>
              <div className="flex items-center gap-3 text-muted-foreground mt-1">
                <span className="text-xl">{dateLabel}</span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1 text-xl">
                  <Clock className="h-3 w-3" />
                  {readTimeLabel} de lecture
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-10 bg-background">
        <div className="mx-auto px-6 max-w-3xl">
          <div className="space-y-6">
            {paragraphs.length === 0 ? (
              <p className="text-xl text-muted-foreground italic">
                Le contenu (Markdown) apparaîtra ici, paragraphe par paragraphe.
              </p>
            ) : (
              paragraphs.map((p, i) => (
                <p key={i} className="text-xl leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))
            )}
          </div>

          <div className="divider-gold mx-auto my-10" />

          <div className="text-center">
            <span className="inline-flex items-center gap-2 tracking-[0.2em] uppercase text-muted-foreground text-xl">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'éditorial
            </span>
          </div>
        </div>
      </section>

      {/* Author E-E-A-T card */}
      {(draft.author_bio || draft.author_linkedin || draft.author_twitter) && (
        <section className="border-t border-border bg-secondary py-8">
          <div className="mx-auto px-6 max-w-3xl flex gap-4 items-start">
            {draft.author_avatar_url && (
              <img
                src={draft.author_avatar_url}
                alt={draft.author_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <p className="font-heading text-2xl text-foreground mb-1">
                {draft.author_name}
              </p>
              {draft.author_bio && (
                <p className="text-xl text-muted-foreground leading-relaxed mb-2">
                  {draft.author_bio}
                </p>
              )}
              <div className="flex gap-3 text-xl">
                {draft.author_linkedin && (
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    LinkedIn <ArrowRight className="h-3 w-3" />
                  </span>
                )}
                {draft.author_twitter && (
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    X <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ============================================================
 * Form primitives
 * ============================================================ */
const inputCls =
  "w-full rounded-md border bg-transparent px-3 py-2 text-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-slate-950";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-xl border p-4 space-y-3"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <h3
        className="uppercase tracking-[0.18em] font-semibold text-xl"
        style={{ color: GOLD }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  warn,
  children,
}: {
  label: string;
  hint?: string;
  warn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-xl" style={{ color: TEXT }}>
          {label}
        </span>
        {hint && (
          <span className="text-xl" style={{ color: warn ? "#FCA5A5" : MUTED }}>
            {hint}
          </span>
        )}
      </div>
      <div style={{ ["--tw-ring-color" as string]: GOLD }}>{children}</div>
      <style>{`label input, label textarea, label select { border-color: ${BORDER}; }`}</style>
    </label>
  );
}

function StatusBadge({ status }: { status: "draft" | "scheduled" | "published" }) {
  const map = {
    draft: { label: "Brouillon", color: "#94A3B8" },
    scheduled: { label: "Programmé", color: "#60A5FA" },
    published: { label: "Publié", color: GOLD },
  } as const;
  const s = map[status] ?? map.draft;
  return (
    <span
      className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
      style={{ color: s.color, borderColor: s.color }}
    >
      {s.label}
    </span>
  );
}

function EntityTagPicker({
  value,
  onChange,
}: {
  value: EntityTag[];
  onChange: (tags: EntityTag[]) => void;
}) {
  const isOn = (cat: EntityCategory, val: string) =>
    value.some((t) => t.category === cat && t.value === val);
  const toggle = (cat: EntityCategory, val: string) => {
    if (isOn(cat, val)) onChange(value.filter((t) => !(t.category === cat && t.value === val)));
    else onChange([...value, { category: cat, value: val }]);
  };
  const labels: Record<EntityCategory, string> = {
    region: "Région",
    theme: "Thème",
    audience: "Cible",
  };
  return (
    <div className="space-y-3">
      {(Object.keys(ENTITY_OPTIONS) as EntityCategory[]).map((cat) => (
        <div key={cat}>
          <div className="text-xl mb-1.5 uppercase tracking-wider" style={{ color: MUTED }}>
            {labels[cat]}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ENTITY_OPTIONS[cat].map((opt) => {
              const on = isOn(cat, opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(cat, opt)}
                  className="px-2 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 text-xl"
                  style={{
                    background: on ? GOLD : "transparent",
                    color: on ? NAVY : TEXT,
                    borderColor: on ? GOLD : BORDER,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RelatedPicker({
  articles,
  value,
  onChange,
}: {
  articles: ArticleRow[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const MAX = 3;
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else if (value.length < MAX) onChange([...value, id]);
    else toast.warning(`Maximum ${MAX} articles reliés`);
  };
  if (articles.length === 0)
    return <p className="text-xl" style={{ color: MUTED }}>Aucun autre article disponible.</p>;
  return (
    <div className="space-y-1 max-h-48 overflow-y-auto">
      {articles.map((a) => {
        const on = value.includes(a.id);
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => toggle(a.id)}
            className="w-full text-left text-xl px-2 py-1.5 rounded-md border flex items-center justify-between"
            style={{
              background: on ? "rgba(201,169,97,0.1)" : "transparent",
              borderColor: on ? GOLD : BORDER,
              color: TEXT,
            }}
          >
            <span className="truncate text-lg">{a.title}</span>
            {on && <span className="text-lg" style={{ color: GOLD }}>✓</span>}
          </button>
        );
      })}
      <div className="text-xl mt-1" style={{ color: MUTED }}>
        {value.length} / {MAX} sélectionnés
      </div>
    </div>
  );
}
