import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getArticle, getArticles, journalText, type JournalBlock } from "@/lib/journal";
import { alternates, href, isLang, langs, ogLocale } from "@/lib/i18n";
import { ui } from "@/content/ui";

type Params = { lang: string; slug: string };

export function generateStaticParams(): Params[] {
  return langs.flatMap((lang) => getArticles(lang).map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = isLang(raw) ? raw : "ja";
  const t = journalText[lang];
  const article = getArticle(lang, slug);
  if (!article) return { title: t.fallbackTitle };
  const title = `${article.title}${t.articleSuffix}`;
  const description = article.dek;
  return {
    title,
    description,
    keywords: article.keywords,
    alternates: alternates(`/journal/${slug}`),
    openGraph: { title, description, locale: ogLocale[lang], type: "article" },
  };
}

function Block({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case "h":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "callout":
      return <p className="callout">{block.text}</p>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const article = getArticle(lang, slug);
  if (!article) notFound();
  const t = journalText[lang];
  const c = ui[lang].crumb;
  const cta = ui[lang].clubCta;

  const related = article.related
    .map((s) => getArticle(lang, s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <SiteHeader lang={lang} />

      <main id="top">
        {/* breadcrumb */}
        <nav className="crumb wrap" aria-label={c.aria}>
          <Link href={href(lang, "/#top")}>{c.home}</Link>
          <span>/</span>
          <Link href={href(lang, "/journal")}>{c.journal}</Link>
          <span>/</span>
          <span className="cur">{article.cat}</span>
        </nav>

        {/* SECTION: article hero */}
        <article className="article">
          <header className="wrap article-head">
            <p className="label" style={{ justifyContent: "center" }}>
              {article.cat}
              {t.labelSuffix}
            </p>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.dek}</p>
            <p className="article-meta">{t.readTime(article.readMin)}</p>
          </header>

          <div className="wrap article-hero-media">
            <Image src={article.hero} alt={article.title} fill priority sizes="(max-width: 900px) 100vw, 900px" />
          </div>

          <div className="wrap prose">
            {article.blocks.map((block, i) => (
              <Block block={block} key={i} />
            ))}
          </div>

          {article.video && (
            <div className="wrap article-video">
              <p className="label" style={{ justifyContent: "center" }}>
                {t.watch}
              </p>
              <div className="reel">
                <video src={article.video} poster={article.videoPoster} controls muted playsInline preload="none" />
              </div>
            </div>
          )}
        </article>

        {/* SECTION: related */}
        {related.length > 0 && (
          <section className="section tinted">
            <div className="wrap">
              <p className="label">{t.keepReading}</p>
              <h2>{t.related}</h2>
              <div className="jr-grid">
                {related.map((a) => (
                  <Link className="art" href={href(lang, `/journal/${a.slug}`)} key={a.slug}>
                    <div className="media">
                      <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                    </div>
                    <div className="body">
                      <div className="cat">{a.cat}</div>
                      <h3>{a.title}</h3>
                      <span className="more">{t.read}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href={href(lang, "/journal")} className="btn btn-ghost" style={{ marginTop: 28 }}>
                {t.backToList}
              </Link>
            </div>
          </section>
        )}

        {/* SECTION: club cta */}
        <section className="section" id="club">
          <div className="wrap">
            <div className="club club-cta">
              <div>
                <p className="label">{cta.label}</p>
                <h2>{cta.title}</h2>
                <p>{cta.body}</p>
              </div>
              <Link href={href(lang, "/#club")} className="btn btn-citrus">
                {cta.button}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </>
  );
}
