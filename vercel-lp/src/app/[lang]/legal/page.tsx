import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { alternates, href, isLang, ogImages, ogLocale } from "@/lib/i18n";
import { legalText } from "@/content/legal";
import { ui } from "@/content/ui";

type Params = { lang: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ja";
  const m = legalText[lang].meta;
  return {
    title: m.title,
    description: m.description,
    alternates: alternates("/legal"),
    openGraph: { title: m.title, description: m.description, locale: ogLocale[lang], type: "website", images: ogImages },
  };
}

// 特定商取引法に基づく表記。予約フォームの確認欄からリンクする
export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = legalText[lang];
  const c = ui[lang].crumb;

  return (
    <>
      <SiteHeader lang={lang} />
      <main id="top">
        <nav className="crumb wrap" aria-label={c.aria}>
          <Link href={href(lang, "/#top")}>{c.home}</Link>
          <span>/</span>
          <span className="cur">{t.crumb}</span>
        </nav>

        <section className="section">
          <div className="wrap legal-page">
            <p className="label">{t.label}</p>
            <h1>{t.h1}</h1>
            <p className="lead">{t.lead}</p>
            <dl className="reserve-facts">
              {t.rows.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="reserve-note">{t.updated}</p>
            <p style={{ marginTop: 28 }}>
              <Link href={href(lang, "/reserve")} className="btn btn-ghost">
                {t.back}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
