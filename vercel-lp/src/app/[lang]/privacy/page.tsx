import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { alternates, href, isLang, ogImages, ogLocale } from "@/lib/i18n";
import { privacyText } from "@/content/privacy";
import { ui } from "@/content/ui";

type Params = { lang: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ja";
  const m = privacyText[lang].meta;
  return {
    title: m.title,
    description: m.description,
    alternates: alternates("/privacy"),
    openGraph: { title: m.title, description: m.description, locale: ogLocale[lang], type: "website", images: ogImages },
  };
}

// プライバシーポリシー。フッターと、クラブ・予約のフォームからリンクする
export default async function PrivacyPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = privacyText[lang];
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
            {t.sections.map((s) => (
              <section className="legal-section" key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((p) => <p key={p}>{p}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p) => <p key={p}>{p}</p>)}
              </section>
            ))}
            <p className="reserve-note">{t.updated}</p>
            <p style={{ marginTop: 28 }}>
              <Link href={href(lang, "/")} className="btn btn-ghost">
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
