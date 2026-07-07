import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getArticle, articles, type JournalBlock } from "@/lib/journal";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "読み物｜Olive1" };
  const title = `${article.title}｜Olive1 読み物`;
  const description = article.dek;
  return {
    title,
    description,
    keywords: article.keywords,
    openGraph: { title, description, locale: "ja_JP", type: "article" },
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = article.related
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* breadcrumb */}
        <nav className="crumb wrap" aria-label="パンくず">
          <Link href="/#top">ホーム</Link>
          <span>/</span>
          <Link href="/journal">読み物</Link>
          <span>/</span>
          <span className="cur">{article.cat}</span>
        </nav>

        {/* SECTION: article hero */}
        <article className="article">
          <header className="wrap article-head">
            <p className="label" style={{ justifyContent: "center" }}>
              {article.cat} ／ 読み物
            </p>
            <h1>{article.title}</h1>
            <p className="article-dek">{article.dek}</p>
            <p className="article-meta">読み時間 約{article.readMin}分</p>
          </header>

          <div className="wrap article-hero-media">
            <Image
              src={article.hero}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>

          <div className="wrap prose">
            {article.blocks.map((block, i) => (
              <Block block={block} key={i} />
            ))}
          </div>

          {article.video && (
            <div className="wrap article-video">
              <p className="label" style={{ justifyContent: "center" }}>
                Watch ／ 動画で見る
              </p>
              <div className="reel">
                <video
                  src={article.video}
                  poster={article.videoPoster}
                  controls
                  muted
                  playsInline
                  preload="none"
                />
              </div>
            </div>
          )}
        </article>

        {/* SECTION: related */}
        {related.length > 0 && (
          <section className="section tinted">
            <div className="wrap">
              <p className="label">Keep reading ／ 続けて読む</p>
              <h2>この話の、つづき。</h2>
              <div className="jr-grid">
                {related.map((a) => (
                  <Link className="art" href={`/journal/${a.slug}`} key={a.slug}>
                    <div className="media">
                      <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                    </div>
                    <div className="body">
                      <div className="cat">{a.cat}</div>
                      <h3>{a.title}</h3>
                      <span className="more">読む →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/journal" className="btn btn-ghost" style={{ marginTop: 28 }}>
                読み物の一覧へ
              </Link>
            </div>
          </section>
        )}

        {/* SECTION: club cta */}
        <section className="section" id="club">
          <div className="wrap">
            <div className="club club-cta">
              <div>
                <p className="label">Olive1 Club</p>
                <h2>数字で選べる一本を、いちばん先に。</h2>
                <p>
                  産地を探す旅の続きと、初回ロットの入荷日・価格・検査値が決まったタイミングの先行案内をお届けします。
                </p>
              </div>
              <Link href="/#club" className="btn btn-citrus">
                クラブに入る（無料）
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
