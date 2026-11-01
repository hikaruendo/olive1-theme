import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getArticles, journalText } from "@/lib/journal";
import { alternates, href, isLang, ogLocale } from "@/lib/i18n";
import { ui } from "@/content/ui";

type Params = { lang: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ja";
  const t = journalText[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates("/journal"),
    openGraph: { title: t.ogTitle, description: t.ogDescription, locale: ogLocale[lang], type: "website" },
  };
}

export default async function JournalIndex({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = journalText[lang];
  const c = ui[lang].crumb;
  const cta = ui[lang].clubCta;
  const articles = getArticles(lang);

  return (
    <>
      <SiteHeader lang={lang} />

      <main id="top">
        <nav className="crumb wrap" aria-label={c.aria}>
          <Link href={href(lang, "/#top")}>{c.home}</Link>
          <span>/</span>
          <span className="cur">{c.journal}</span>
        </nav>

        <section className="section">
          <div className="wrap">
            <p className="label">{t.label}</p>
            <h1>{t.title}</h1>
            <p className="lead">{t.lead}</p>
            <div className="jr-grid" style={{ marginTop: 36 }}>
              {articles.map((a) => (
                <Link className="art" href={href(lang, `/journal/${a.slug}`)} key={a.slug}>
                  <div className="media">
                    <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                  </div>
                  <div className="body">
                    <div className="cat">{a.cat}</div>
                    <h3>{a.title}</h3>
                    <p className="art-dek">{a.dek}</p>
                    <span className="more">{t.read}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
