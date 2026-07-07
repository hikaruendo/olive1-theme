import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { articles } from "@/lib/journal";

export const metadata: Metadata = {
  title: "読み物｜Olive1 — 目利きのオリーブオイル読本",
  description:
    "良いエクストラバージンオリーブオイルの見分け方、ラベルの読み方、国産の値段、鮮度と保存。数字で選ぶための読み物を、目利きの視点で。",
  openGraph: {
    title: "読み物｜Olive1",
    description: "オリーブオイルを数字で選ぶための、目利きの読み物。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function JournalIndex() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <nav className="crumb wrap" aria-label="パンくず">
          <Link href="/#top">ホーム</Link>
          <span>/</span>
          <span className="cur">読み物</span>
        </nav>

        <section className="section">
          <div className="wrap">
            <p className="label">Journal ／ 読み物</p>
            <h1>目利きの、読みもの。</h1>
            <p className="lead">
              良いオリーブオイルの見分け方から、ラベルの読み方、国産の値段、鮮度の話まで。感想ではなく、数字で選ぶための手がかりを集めました。
            </p>
            <div className="jr-grid" style={{ marginTop: 36 }}>
              {articles.map((a) => (
                <Link className="art" href={`/journal/${a.slug}`} key={a.slug}>
                  <div className="media">
                    <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                  </div>
                  <div className="body">
                    <div className="cat">{a.cat}</div>
                    <h3>{a.title}</h3>
                    <p className="art-dek">{a.dek}</p>
                    <span className="more">読む →</span>
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
