import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaitlistForm } from "@/components/waitlist-form";
import { CountUp } from "@/components/count-up";
import { StrengthTile } from "@/components/strength-tile";
import { getOil, oils } from "@/lib/oils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return oils.map((oil) => ({ slug: oil.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const oil = getOil(slug);
  if (!oil) return { title: "Olive1" };
  const title = `Olive1 ${oil.tag.charAt(0) + oil.tag.slice(1).toLowerCase()}｜スペシャルティ エクストラバージンオリーブオイル`;
  const description = `${oil.summary} ポリフェノール ${oil.lab.polyphenol} mg/kg・酸度 ${oil.lab.acidity}%・収穫 ${oil.lab.harvest}年。測定法とCoAを公開。事前登録受付中。`;
  return {
    title,
    description,
    openGraph: { title, description, locale: "ja_JP", type: "website" },
  };
}

const faqs = [
  {
    q: "いつ買えますか？",
    a: "初回ロットの入荷時期が決まり次第、事前登録の方へいちばん先にご案内します。まずはクラブに入ってお待ちください。",
  },
  {
    q: "価格はいくらですか？",
    a: "“高級すぎない、毎日生で使える中間価格”を目指しています。確定価格は初回ロットと一緒にご案内します。",
  },
  {
    q: "ポリフェノールはどう測っていますか？",
    a: "総ポリフェノール（没食子酸換算）などの測定方法で数値が変わります。だからラベルと商品ページには、数字だけでなく“測定方法と測定月”まで併記します。",
  },
  {
    q: "保存方法は？",
    a: "光・熱・時間で酸化が進みます。直射日光を避け、冷暗所で、開封後は早めに使い切るのがおすすめです。",
  },
];

export default async function OilPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const oil = getOil(slug);
  if (!oil) notFound();

  const others = oils.filter((o) => o.slug !== oil.slug);
  const labRows = [
    { k: "ポリフェノール", v: `${oil.lab.polyphenol} mg/kg`, note: `${oil.lab.method}／測定 ${oil.lab.measuredMonth}` },
    { k: "酸度", v: `${oil.lab.acidity} %`, note: "遊離脂肪酸（低いほど新鮮）" },
    { k: "過酸化物価", v: `${oil.lab.peroxide} meq O₂/kg`, note: "酸化の指標（低いほど良）" },
    { k: "収穫年", v: `${oil.lab.harvest}`, note: "シングルハーベスト" },
    { k: "搾油日", v: oil.lab.pressingDate, note: "収穫から搾油までを短く" },
    { k: "品種", v: oil.variety.replace("品種：", ""), note: oil.origin.replace("産地：", "産地：") },
  ];

  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* breadcrumb */}
        <nav className="crumb wrap" aria-label="パンくず">
          <Link href="/#top">ホーム</Link>
          <span>/</span>
          <Link href="/#oils">ラインナップ</Link>
          <span>/</span>
          <span className="cur">{oil.sku}</span>
        </nav>

        {/* SECTION: pdp hero */}
        <section className="section pdp-hero">
          <div className="wrap pdp-grid">
            <div className="pdp-gallery">
              <div className="media">
                <StrengthTile
                  tag={oil.tag}
                  strength={oil.strength}
                  sub={oil.sku.split("／")[1]?.trim()}
                />
              </div>
            </div>
            <div className="pdp-info">
              <p className="eng">The Oils ／ {oil.tag}</p>
              <h1>{oil.sku}</h1>
              <p className="pdp-sum">{oil.summary}</p>

              <div className="pdp-strength">
                <span className="dots">
                  {[1, 2, 3].map((i) => (
                    <i key={i} className={i <= oil.strength ? "on" : ""} />
                  ))}
                </span>
                <span>強度 {oil.strength} / 3 ・ {oil.title}</span>
              </div>

              <div className="pdp-quick">
                <div>
                  <div className="k">Polyphenol</div>
                  <div className="v"><CountUp to={oil.lab.polyphenol} /><small> mg/kg</small></div>
                </div>
                <div>
                  <div className="k">Acidity</div>
                  <div className="v"><CountUp to={oil.lab.acidity} decimals={2} /><small> %</small></div>
                </div>
                <div>
                  <div className="k">Harvest</div>
                  <div className="v"><CountUp to={oil.lab.harvest} /></div>
                </div>
              </div>

              <p className="pdp-use">{oil.use}</p>

              <div className="pdp-buy">
                <div className="pdp-price">
                  <span className="pl">価格</span>
                  <span className="pv">初回ロットで確定</span>
                  <span className="pn">事前登録で先行案内します</span>
                </div>
                <a href="#club" className="btn btn-primary">先行案内を受け取る（無料）</a>
                <a href="#club" className="btn btn-ghost">喉テストを待つ</a>
              </div>
              <p className="note">プレローンチ中のため、いまは購入ではなく事前登録の受付です。</p>
            </div>
          </div>
        </section>

        {/* SECTION: lab panel (Citizens of Soil style) */}
        <section className="section tinted" id="lab">
          <div className="wrap">
            <p className="label">Lab Report ／ 検査値</p>
            <h2>この一本の、数字。</h2>
            <p className="lead">感想ではなく、測った数字で選べるように。測定方法と測定月まで併記し、検査分析書（CoA）そのものも公開します。</p>
            <div className="lab-wrap">
              <table className="lab-table">
                <thead>
                  <tr><th>項目</th><th>数値</th><th>測定方法・備考</th></tr>
                </thead>
                <tbody>
                  {labRows.map((r) => (
                    <tr key={r.k}>
                      <th scope="row">{r.k}</th>
                      <td className="num">{r.v}</td>
                      <td className="mnote">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figure className="coa lab-coa">
                <div className="media">
                  <Image src="/images/coa-sample.jpg" alt={`${oil.sku} の検査分析書（CoA）`} fill sizes="(max-width: 860px) 100vw, 40vw" />
                </div>
                <div className="seal">LAB REPORT</div>
                <figcaption>検査分析書（CoA）の例。実物をそのまま公開します。</figcaption>
                <a className="btn btn-ghost" href="/images/coa-sample.jpg" target="_blank" rel="noopener">
                  CoA（検査分析書）を見る
                </a>
              </figure>
            </div>
            <p className="note">※数値は例です。初回ロット確定後に実測値へ差し替えます。</p>
          </div>
        </section>

        {/* SECTION: pressing report (Fresh-Pressed style) */}
        <section className="section">
          <div className="wrap pressing-grid">
            <div>
              <p className="label">Pressing Report ／ 搾油レポート</p>
              <h2>いつ、どこで、どう搾ったか。</h2>
              <p className="lead">{oil.pressingReport}</p>
              <div className="pressing-facts">
                <div><span className="k">搾油日</span><span className="v">{oil.lab.pressingDate}</span></div>
                <div><span className="k">品種</span><span className="v">{oil.variety.replace("品種：", "")}</span></div>
                <div><span className="k">{oil.origin.split("：")[0]}</span><span className="v">{oil.origin.split("：")[1]}</span></div>
              </div>
              <Link href="/#journey" className="btn btn-ghost">この産地を旅で見る</Link>
            </div>
            <figure className="media" style={{ margin: 0 }}>
              <Image src="/images/mill-press.jpg" alt="岬工房の搾油機（搾油の現場）" fill sizes="(max-width: 860px) 100vw, 46vw" />
            </figure>
          </div>
        </section>

        {/* SECTION: tasting & throat test */}
        <section className="section tinted">
          <div className="wrap tasting-grid">
            <div className="tasting-card">
              <p className="label">Tasting ／ 味わい</p>
              <h2>喉で、確かめる。</h2>
              <p className="lead">EVOOの個性は、香り・苦み・そして飲んだあと喉に残る辛みに出ます。ローンチ時に「喉テスト」の極小ポーションを、事前登録の方へ先行でお届け予定です。</p>
              <ul className="taste-list">
                {oil.tasting.map((t) => (
                  <li key={t} className="chip">{t}</li>
                ))}
              </ul>
            </div>
            <div className="pairing-card">
              <p className="eng">Pairings ／ 使い方</p>
              <div className="pairings">
                {oil.pairings.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: other oils */}
        <section className="section">
          <div className="wrap">
            <p className="label">Compare ／ ほかの強度</p>
            <h2>強度で、選ぶ。</h2>
            <div className="cross-grid">
              {others.map((o) => (
                <Link className="cross" href={`/oils/${o.slug}`} key={o.slug}>
                  <div className="media">
                    <StrengthTile
                      tag={o.tag}
                      strength={o.strength}
                      sub={o.sku.split("／")[1]?.trim()}
                    />
                  </div>
                  <div className="cross-body">
                    <span className="sku">{o.sku}</span>
                    <h3>{o.title}</h3>
                    <div className="strength">
                      <span className="dots">
                        {[1, 2, 3].map((i) => (
                          <i key={i} className={i <= o.strength ? "on" : ""} />
                        ))}
                      </span>
                      強度 {o.strength} / 3
                    </div>
                    <span className="more">この一本を見る →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: club (waitlist) */}
        <section className="section" id="club">
          <div className="wrap">
            <div className="club">
              <div className="club-grid">
                <div>
                  <p className="label">Olive1 Club</p>
                  <h2>{oil.sku} の、先行案内。</h2>
                  <p>初回ロットの入荷日・価格・検査値が決まったら、この一本の続報を事前登録の方へ先にお届けします。喉テストのご案内もこちらから。</p>
                </div>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: faq */}
        <section className="section tinted" id="faq">
          <div className="wrap">
            <p className="label" style={{ justifyContent: "center" }}>FAQ ／ よくある質問</p>
            <h2 style={{ textAlign: "center" }}>この一本の、気になるところ。</h2>
            <div className="faq faq-list">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
