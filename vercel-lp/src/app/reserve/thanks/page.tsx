import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBankInfo, getStripePaymentLink, maxQty, product, yen } from "@/lib/reserve";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "予約を受け付けました｜Olive1",
  robots: { index: false, follow: false },
};

type Search = { id?: string; qty?: string; receive?: string; method?: string };

export default async function ThanksPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" && /^R-\d{8}-\d{4}$/.test(sp.id) ? sp.id : "";
  const qtyRaw = Number(sp.qty);
  const qty = Number.isInteger(qtyRaw) && qtyRaw >= 1 && qtyRaw <= maxQty ? qtyRaw : 1;
  const receive = sp.receive === "ship" ? "ship" : "event";
  const method = sp.method === "card" ? "card" : "bank";
  const subtotal = product.price * qty;
  const bank = method === "bank" ? getBankInfo() : null;
  const stripe = method === "card" ? getStripePaymentLink() : null;

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="section">
          <div className="wrap reserve-thanks">
            <p className="label">Reserved ／ 予約</p>
            <h1>予約を受け付けました。</h1>
            {id && (
              <p className="lead">
                予約番号は <b className="mono">{id}</b> です。確認メールを送りました。届かない時は迷惑メールフォルダも見てください。
              </p>
            )}

            <dl className="reserve-facts">
              <div>
                <dt>商品</dt>
                <dd>
                  {product.name} {product.size}（瓶詰め {product.bottlingDate}）
                </dd>
              </div>
              <div>
                <dt>本数</dt>
                <dd>{qty}本</dd>
              </div>
              <div>
                <dt>小計</dt>
                <dd>{yen(subtotal)}（税込・送料別）</dd>
              </div>
              <div>
                <dt>受け取り</dt>
                <dd>{receive === "event" ? product.event : "発送（12月予定・送料は別途ご案内）"}</dd>
              </div>
            </dl>

            {method === "bank" && bank && (
              <div className="waitlist-form reserve-bank">
                <p className="form-title">お振込先</p>
                <dl className="reserve-facts">
                  <div>
                    <dt>銀行</dt>
                    <dd>
                      {bank.bank} {bank.branch}
                    </dd>
                  </div>
                  <div>
                    <dt>口座</dt>
                    <dd>
                      {bank.type} {bank.number}
                    </dd>
                  </div>
                  <div>
                    <dt>名義</dt>
                    <dd>{bank.holder}</dd>
                  </div>
                  <div>
                    <dt>金額</dt>
                    <dd>{yen(subtotal)}{receive === "ship" ? "（送料は別途）" : ""}</dd>
                  </div>
                </dl>
                <p className="reserve-note">
                  振込名義の先頭に予約番号の下4桁を入れていただけると照合が早いです。入金を確認したら、本番号（n/{product.bottles}）をメールでお知らせします。
                </p>
              </div>
            )}

            {method === "card" && (
              <div className="waitlist-form reserve-bank">
                <p className="form-title">カード決済</p>
                <p>決済を確認したら、本番号（n/{product.bottles}）をメールでお知らせします。</p>
                {stripe && (
                  <p>
                    決済ページに進まなかった場合は{" "}
                    <a href={`${stripe}${stripe.includes("?") ? "&" : "?"}client_reference_id=${encodeURIComponent(id)}`} className="link">
                      こちら
                    </a>
                    から。本数は決済ページで {qty}本 を選んでください。
                  </p>
                )}
              </div>
            )}

            <p style={{ marginTop: 28 }}>
              <Link href="/" className="btn btn-ghost">
                ホームへ戻る
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
