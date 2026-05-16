import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";

const disclosureItems = [
  "ポリフェノール値",
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
          <a href="#transparency">品質表示</a>
          <a href="#table">使い方</a>
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
            Olive1は、ポリフェノール値、収穫年、酸度をラベルで公開する
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

      <section className="section transparency-section" id="transparency">
        <div className="section-copy">
          <p className="script-label">Transparency</p>
          <h2>ラベルで、ちゃんと選べるようにします。</h2>
          <p>
            Olive1は香りだけでなく、検査結果や収穫情報も判断材料として
            公開する方針です。初回ロットが確定してから、ラベルにも商品ページにも
            同じ情報を載せます。
          </p>
          <div className="disclosure-grid" aria-label="Olive1 disclosure items">
            {disclosureItems.map((item) => (
              <div className="disclosure-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="image-frame">
          <Image
            src="/images/hero-bottle-desktop.png"
            alt="Olive1 bottle on dark wood with fresh olives"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="section split-section">
        <div className="image-frame">
          <Image
            src="/images/journey-grove.png"
            alt="Hands holding an Olive1 bottle in a Mediterranean olive grove"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="section-copy">
          <p className="script-label">Journey</p>
          <h2>産地を探すところから、ブランドを作っています。</h2>
          <p>
            どこの畑で、いつ採れて、どんな検査結果だったか。そこまで見えるEVOOを、
            日本の食卓に合う形で届けます。派手な説明より、ラベルの情報を信じられる
            ほうがいいと思っています。
          </p>
        </div>
      </section>

      <section className="section table-section" id="table">
        <div className="section-copy compact">
          <p className="script-label">Everyday Table</p>
          <h2>和食にも、ちゃんと合います。</h2>
          <p>
            味噌汁、豆腐、トマト。火を入れない仕上げに使うと、香りと苦みが
            料理の輪郭を少しだけ引き上げます。
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
