import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBankInfo, getStripePaymentLink, maxQty, product, yen } from "@/lib/reserve";
import { href, isLang } from "@/lib/i18n";
import { reserveText } from "@/content/reserve";

export const dynamic = "force-dynamic";

type Params = { lang: string };
type Search = { id?: string; qty?: string; receive?: string; method?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : "ja";
  return { title: reserveText[lang].meta.thanksTitle, robots: { index: false, follow: false } };
}

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = reserveText[lang].thanks;
  const sp = await searchParams;
  const id = typeof sp.id === "string" && /^R-\d{8}-\d{4}$/.test(sp.id) ? sp.id : "";
  const qtyRaw = Number(sp.qty);
  const hasQty = Number.isInteger(qtyRaw) && qtyRaw >= 1 && qtyRaw <= maxQty;
  const qty = hasQty ? qtyRaw : 1;
  const receive = sp.receive === "ship" ? "ship" : "event";
  const method = sp.method === "card" ? "card" : "bank";
  const subtotal = product.price * qty;
  const bank = method === "bank" ? getBankInfo() : null;
  const stripe = method === "card" ? getStripePaymentLink() : null;
  const bottlingDate = reserveText[lang].product.bottlingDate;
  const event = reserveText[lang].product.event;

  return (
    <>
      <SiteHeader lang={lang} />
      <main id="top">
        <section className="section">
          <div className="wrap reserve-thanks">
            <p className="label">{t.label}</p>
            <h1>{t.title}</h1>
            {id && (
              <p className="lead">
                {t.leadA}
                <b className="mono">{id}</b>
                {t.leadB}
              </p>
            )}

            <dl className="reserve-facts">
              <div>
                <dt>{t.product}</dt>
                <dd>
                  {product.name} {product.size}（{t.bottlingPrefix}
                  {bottlingDate}）
                </dd>
              </div>
              {hasQty && (
                <div>
                  <dt>{t.qty}</dt>
                  <dd>{t.qtyValue(qty)}</dd>
                </div>
              )}
              {hasQty && (
                <div>
                  <dt>{t.subtotal}</dt>
                  <dd>
                    {yen(subtotal)}
                    {t.subtotalSuffix}
                  </dd>
                </div>
              )}
              <div>
                <dt>{t.receive}</dt>
                <dd>{receive === "event" ? event : t.receiveShip}</dd>
              </div>
            </dl>

            {method === "bank" && bank && (
              <div className="waitlist-form reserve-bank">
                <p className="form-title">{t.bankTitle}</p>
                <dl className="reserve-facts">
                  <div>
                    <dt>{t.bank}</dt>
                    <dd>
                      {bank.bank} {bank.branch}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.account}</dt>
                    <dd>
                      {bank.type} {bank.number}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.holder}</dt>
                    <dd>{bank.holder}</dd>
                  </div>
                  <div>
                    <dt>{t.amount}</dt>
                    <dd>
                      {yen(subtotal)}
                      {receive === "ship" ? t.shippingExtra : ""}
                    </dd>
                  </div>
                </dl>
                <p className="reserve-note">{t.bankNote}</p>
              </div>
            )}

            {method === "card" && (
              <div className="waitlist-form reserve-bank">
                <p className="form-title">{t.cardTitle}</p>
                <p>{hasQty ? t.cardWithQty : t.cardReturn}</p>
                {stripe && hasQty && (
                  <p>
                    {t.cardFallbackA}
                    <a
                      href={`${stripe}${stripe.includes("?") ? "&" : "?"}client_reference_id=${encodeURIComponent(id)}${lang === "ja" ? "&locale=ja" : ""}`}
                      className="link"
                    >
                      {t.cardFallbackLink}
                    </a>
                    {t.cardFallbackB(qty)}
                  </p>
                )}
              </div>
            )}

            <p style={{ marginTop: 28 }}>
              <Link href={href(lang, "/")} className="btn btn-ghost">
                {t.home}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
