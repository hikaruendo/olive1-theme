import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReserveForm } from "@/components/reserve-form";
import { getBankInfo, getReserveStatus, getStripePaymentLink, product, yen } from "@/lib/reserve";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `予約｜Olive1 — ${product.name} ${product.size}`,
  description: `2026年10月、小豆島で収穫・搾油した油を${product.bottles}本。瓶詰め${product.bottlingDate}。本番号付きで、12月の会で手渡しか発送。`,
  openGraph: {
    title: `予約｜Olive1 — ${product.name}`,
    description: `${product.harvest}。${product.bottlingDate}瓶詰め。${product.bottles}本。`,
    locale: "ja_JP",
    type: "website",
  },
};

const facts = [
  { k: "収穫・搾油", v: product.harvest },
  { k: "瓶詰め", v: product.bottlingDate },
  { k: "容量", v: product.size },
  { k: "本数", v: `${product.bottles}本（本番号 n/${product.bottles}）` },
  { k: "価格", v: `${yen(product.price)}（税込・送料別）` },
  { k: "受け取り", v: `${product.event}、または発送` },
];

export default function ReservePage() {
  const status = getReserveStatus();
  const cardAvailable = !!getStripePaymentLink();
  const bankAvailable = !!getBankInfo();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <nav className="crumb wrap" aria-label="パンくず">
          <Link href="/#top">ホーム</Link>
          <span>/</span>
          <span className="cur">予約</span>
        </nav>

        <section className="section">
          <div className="wrap reserve-grid">
            <div className="reserve-copy">
              <p className="label">Reserve ／ 予約</p>
              <h1>
                {product.bottlingDate.replace("2026年", "")}に詰めた。
                <br />
                使い切る。
              </h1>
              <p className="lead">
                2026年10月、小豆島で、僕も収穫と搾油に加わった実の油です。10月いっぱい毎日搾ってタンクに貯め、月末に一度だけ瓶に詰めました。{product.bottles}本。1本ずつ本番号を付けます。
              </p>
              <dl className="reserve-facts">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="reserve-note">
                酸度と過酸化物価は瓶詰め時に1回測り、測定方法と一緒に公開します。測り終えるまでは数字を書きません。
              </p>
            </div>

            <div className="reserve-side">
              {status === "open" && <ReserveForm cardAvailable={cardAvailable} bankAvailable={bankAvailable} />}
              {status === "closed" && (
                <div className="waitlist-form reserve-closed">
                  <p className="form-title">予約は11月26日（木）から</p>
                  <p>
                    受付が始まったら、クラブのメールでいちばん先にお知らせします。
                  </p>
                  <Link href="/#club" className="btn btn-primary">
                    クラブに入る
                  </Link>
                </div>
              )}
              {status === "soldout" && (
                <div className="waitlist-form reserve-closed">
                  <p className="form-title">今年の分は、すべて予約が入りました</p>
                  <p>来年の予約はクラブのメールでお知らせします。</p>
                  <Link href="/#club" className="btn btn-primary">
                    クラブに入る
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
