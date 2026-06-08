import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";

const disclosureItems = [
  "ポリフェノール検査",
  "酸度",
  "収穫年",
  "産地",
  "品種",
  "搾油日",
];

const meals = [
  "味噌汁にひと回し",
  "絹豆腐に塩とEVOO",
  "トマトに塩とEVOO",
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Olive1">
        <a className="brand-mark" href="#top">
          Olive1
        </a>
        <nav>
          <a href="#origin">産地</a>
          <a href="#transparency">品質表示</a>
          <a href="#waitlist">登録</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-media">
          <Image
            src="/images/hero-bottle-mobile.png"
            alt="Olive1 bottle on a dark wooden table with fresh olives"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
            className="desktop-hero"
          />
          <Image
            src="/images/hero-bottle-mobile.png"
            alt="Olive1 bottle on a dark wooden table for mobile hero"
            fill
            priority
            sizes="100vw"
            className="mobile-hero"
          />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Tokyo specialty EVOO</p>
          <h1>毎日のごはんに、信頼できるEVOOを。</h1>
          <p className="hero-copy">
            Olive1は、検査結果、収穫年、酸度をラベルで公開する
            スペシャルティEVOOです。初回ロットの入荷案内を、登録いただいた方から
            お届けします。
          </p>
        </div>
      </section>

      <section className="waitlist-band" id="waitlist">
        <div className="waitlist-panel">
          <div className="waitlist-copy">
            <p className="script-label">Waitlist</p>
            <h2>入荷前に、選べる情報を先に届けます。</h2>
            <p>
              入荷日、価格、ラベル内容が決まったらメールでお知らせします。
              売り込みというより、ちゃんと選べる情報を先に共有する感じです。
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <section className="section origin-section" id="origin">
        <div className="section-copy">
          <p className="script-label">Shodoshima Visit</p>
          <h2>小豆島で、畑から見てきました。</h2>
          <p>
            枝についた小さな実、畑の土、作り手の説明。写真だけで全部は伝わらないけど、
            どこから仕入れるかを決める前に、現地で確かめることはできます。
            Olive1はそこを飛ばさずに作ります。
          </p>
        </div>
        <figure className="image-frame image-frame-tall">
          <Image
            src="/images/shodoshima-hands-olives.jpg"
            alt="Hands checking young olives on an olive branch in Shodoshima"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </figure>
      </section>

      <section className="section transparency-section" id="transparency">
        <div className="section-copy">
          <p className="script-label">Transparency</p>
          <h2>ラベルで、ちゃんと選べるようにします。</h2>
          <p>
            香りの印象だけでなく、検査結果や収穫情報も判断材料として公開する方針です。
            初回ロットが確定してから、ラベルにも商品ページにも同じ情報を載せます。
          </p>
          <div className="disclosure-grid" aria-label="Olive1 disclosure items">
            {disclosureItems.map((item) => (
              <div className="disclosure-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="image-frame image-frame-grove">
          <Image
            src="/images/shodoshima-branch-detail.jpg"
            alt="Olive branches with young olives in Shodoshima"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="section split-section">
        <div className="origin-gallery" aria-label="Shodoshima olive grove photos">
          <div className="image-frame origin-gallery-main">
            <Image
              src="/images/shodoshima-grove-wide.jpg"
              alt="Olive trees growing in a Shodoshima grove"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
            />
          </div>
          <div className="image-frame origin-gallery-detail">
            <Image
              src="/images/shodoshima-grove-rows.jpg"
              alt="Rows of olive trees and dark soil in Shodoshima"
              fill
              sizes="(max-width: 900px) 45vw, 18vw"
            />
          </div>
        </div>
        <div className="section-copy">
          <p className="script-label">Journey</p>
          <h2>「おいしそう」だけで、選ばないために。</h2>
          <p>
            オリーブオイルは、品種、収穫タイミング、搾油までの時間で印象が変わります。
            だからOlive1では、初回ロットが決まる前の段階から、産地と作り手の情報を
            きちんと残していきます。
          </p>
        </div>
      </section>

      <section className="section table-section" id="table">
        <div className="section-copy compact">
          <p className="script-label">Everyday Table</p>
          <h2>和食にも、ちゃんと合います。</h2>
          <p>
            味噌汁、豆腐、トマト。火を入れない仕上げに使うと、香りと苦みが
            料理の輪郭を少しだけ引き上げます。EVOOの苦みや辛みは、
            主にフェノール化合物に由来するとされています。
          </p>
          <ul>
            {meals.map((meal) => (
              <li key={meal}>{meal}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
