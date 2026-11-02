import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReserveForm } from "@/components/reserve-form";
import { getBankInfo, getReserveStatus, getStripePaymentLink, maxQty, product, yen } from "@/lib/reserve";
import { sheetRemaining } from "@/lib/sheet";
import { alternates, href, isLang, ogLocale } from "@/lib/i18n";
import { reserveText } from "@/content/reserve";
import { ui } from "@/content/ui";

export const dynamic = "force-dynamic";

type Params = { lang: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ja";
  const m = reserveText[lang].meta;
  return {
    title: m.title,
    description: m.description,
    alternates: alternates("/reserve"),
    openGraph: { title: m.ogTitle, description: m.ogDescription, locale: ogLocale[lang], type: "website" },
  };
}

export default async function ReservePage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = reserveText[lang];
  const c = ui[lang].crumb;
  const envStatus = getReserveStatus();
  // 受付中の時だけ台帳から残り本数を読む。0なら売り切れ表示に切り替える
  const remaining = envStatus === "open" ? await sheetRemaining() : null;
  const status = envStatus === "open" && remaining === 0 ? "soldout" : envStatus;
  const selectable = Math.min(maxQty, remaining ?? maxQty);
  const cardAvailable = !!getStripePaymentLink();
  const bankAvailable = !!getBankInfo();

  const facts = [
    { k: t.page.facts.harvest, v: t.product.harvest },
    { k: t.page.facts.bottling, v: t.product.bottlingDate },
    { k: t.page.facts.size, v: product.size },
    { k: t.page.facts.bottles, v: t.page.facts.bottlesValue },
    { k: t.page.facts.price, v: `${yen(product.price)}${t.page.facts.priceSuffix}` },
    { k: t.page.facts.receive, v: `${t.product.event}${t.page.facts.receiveSuffix}` },
    ...(status === "open" && remaining !== null ? [{ k: t.page.facts.remaining, v: t.page.facts.remainingValue(remaining) }] : []),
  ];

  return (
    <>
      <SiteHeader lang={lang} />
      <main id="top">
        <nav className="crumb wrap" aria-label={c.aria}>
          <Link href={href(lang, "/#top")}>{c.home}</Link>
          <span>/</span>
          <span className="cur">{c.reserve}</span>
        </nav>

        <section className="section">
          <div className="wrap reserve-grid">
            <div className="reserve-copy">
              <p className="label">{t.page.label}</p>
              <h1>
                {t.page.h1Prefix}
                {t.product.bottlingLabel}
                {t.page.h1a}
                <br />
                {t.page.h1b}
              </h1>
              <p className="lead">{t.page.lead}</p>
              <dl className="reserve-facts">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="reserve-note">{t.page.note}</p>
            </div>

            <div className="reserve-side">
              {status === "open" && <ReserveForm lang={lang} cardAvailable={cardAvailable} bankAvailable={bankAvailable} maxSelectable={selectable} />}
              {status === "closed" && (
                <div className="waitlist-form reserve-closed">
                  <p className="form-title">{t.page.closedTitle}</p>
                  <p>{t.page.closedBody}</p>
                  <Link href={href(lang, "/#club")} className="btn btn-primary">
                    {t.page.joinClub}
                  </Link>
                </div>
              )}
              {status === "soldout" && (
                <div className="waitlist-form reserve-closed">
                  <p className="form-title">{t.page.soldoutTitle}</p>
                  <p>{t.page.soldoutBody}</p>
                  <Link href={href(lang, "/#club")} className="btn btn-primary">
                    {t.page.joinClub}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
