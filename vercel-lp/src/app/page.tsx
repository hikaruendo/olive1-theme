import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";

const disclosureItems = [
  "ポリフェノール値",
  "測定方法",
  "酸度",
  "収穫年",
  "産地・品種",
  "搾油日",
];

const meals = [
  "味噌汁にひと回し",
  "絹豆腐に塩とEVOO",
  "トマトに塩とEVOO",
];

const phenoScale = [
  { range: "100–250 mg/kg", label: "一般的な市販EVOO" },
  { range: "250+ mg/kg", label: "スペシャルティの入口" },
  { range: "300+ mg/kg", label: "Olive1が探す基準" },
];

const journeyClips = [
  {
    src: "/videos/journey-ferry.mp4",
    poster: "/images/posters/journey-ferry.jpg",
    caption: "フェリーで島へ",
  },
  {
    src: "/videos/journey-grove.mp4",
    poster: "/images/posters/journey-grove.jpg",
    caption: "畑を歩く",
  },
  {
    src: "/videos/journey-mill.mp4",
    poster: "/images/posters/journey-mill.jpg",
    caption: "搾油機を見る",
  },
  {
    src: "/videos/journey-tasting.mp4",
    poster: "/images/posters/journey-tasting.jpg",
    caption: "飲み比べる",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Olive1">
        <a className="brand-mark" href="#top">
          Olive1
        </a>
        <nav>
          <a href="#journey">旅の記録</a>
          <a href="#transparency">品質表示</a>
          <a href="#waitlist">クラブ</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-media">
          <Image
            src="/images/shodoshima-grove-wide.jpg"
            alt="Olive trees growing in a Shodoshima grove"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
            className="desktop-hero"
          />
          <Image
            src="/images/shodoshima-grove-wide.jpg"
            alt="Olive trees growing in a Shodoshima grove"
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
            Olive1は、ポリフェノール値、酸度、収穫年をラベルで公開する
            スペシャルティEVOOです。いまはまだ、最初の一本を選んでいる途中。
            小豆島から地中海へ、産地を自分の足で確かめる旅の過程ごと
            公開しながら作っています。
          </p>
        </div>
      </section>

      <section className="waitlist-band" id="waitlist">
        <div className="waitlist-panel">
          <div className="waitlist-copy">
            <p className="script-label">Olive1 Club</p>
            <h2>先に知れる、食べるのが好きな人のクラブです。</h2>
            <p>
              Olive1クラブでは、産地を探す旅の続き、初回ロットの入荷日・価格・
              検査値が決まったタイミングの先行案内をお届けします。
              まずは一緒に選ぶための、小さな案内所みたいな場所です。
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <section className="section split-section journey-section" id="journey">
        <div className="section-copy">
          <p className="script-label">Episode 1</p>
          <h2>旅の第1話は、小豆島。</h2>
          <p>
            2026年6月、日本最大のオリーブ産地・小豆島へ。フェリーで海を渡り、
            畑を歩き、搾油機を見て、同じテーブルで何本も飲み比べてきました。
            6月は収穫の時期ではないので、手摘みも搾りたてもまだ撮れていません。
          </p>
          <ul className="episode-list">
            <li>第2話：秋、収穫期の小豆島</li>
            <li>第3話：地中海の産地へ</li>
          </ul>
        </div>
        <div className="journey-grid" aria-label="Shodoshima journey video clips">
          {journeyClips.map((clip) => (
            <figure className="journey-clip" key={clip.src}>
              <video
                src={clip.src}
                poster={clip.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <figcaption>{clip.caption}</figcaption>
            </figure>
          ))}
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
          <p>
            たとえばポリフェノール。喉のピリッとした辛みや苦みのもとになる、
            味の個性の指標です。数値は測定方法（総ポリフェノール、HPLC、NMR）で
            変わるので、数字だけでなく測り方まで併記します。
          </p>
          <div className="pheno-scale" aria-label="Polyphenol scale">
            {phenoScale.map((row) => (
              <div className="pheno-row" key={row.label}>
                <span className="pheno-range">{row.range}</span>
                <span className="pheno-label">{row.label}</span>
              </div>
            ))}
          </div>
          <div className="disclosure-grid" aria-label="Olive1 disclosure items">
            {disclosureItems.map((item) => (
              <div className="disclosure-item" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <figure className="image-frame image-frame-document">
          <Image
            src="/images/coa-sample.jpg"
            alt="Laboratory test report for extra virgin olive oil showing acidity and UV values"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <figcaption>検査分析書（CoA）の例：仕入れ判断に使っている実物です</figcaption>
        </figure>
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
