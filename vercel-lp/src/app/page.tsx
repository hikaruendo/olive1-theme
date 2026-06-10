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
          <a href="#waitlist">登録</a>
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
            <p className="script-label">Waitlist</p>
            <h2>この旅の続きを、最前列で。</h2>
            <p>
              登録いただいた方には、旅の進み具合と、初回ロットの入荷日・価格・
              検査値が決まったタイミングでメールを送ります。
              売り込みというより、ちゃんと選べる情報を先に共有する感じです。
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
            だから秋、収穫期にもう一度行きます。その先は地中海。
            最初の一本が決まるまでの過程は、ここで全部公開します。
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

      <section className="section process-section">
        <div className="process-media-grid" aria-label="Shodoshima tasting and production photos">
          <figure className="image-frame process-card process-card-tasting">
            <Image
              src="/images/shodoshima-tasting-cropped.jpg"
              alt="Hands tasting olive oil samples at a glass table"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
          </figure>
          <figure className="image-frame process-card">
            <Image
              src="/images/shodoshima-filling-line.jpg"
              alt="Olive oil bottles lined up beside a filling machine"
              fill
              sizes="(max-width: 900px) 50vw, 18vw"
            />
          </figure>
          <figure className="image-frame process-card">
            <Image
              src="/images/shodoshima-machine.jpg"
              alt="Olive oil processing machine in a Shodoshima facility"
              fill
              sizes="(max-width: 900px) 50vw, 18vw"
            />
          </figure>
        </div>
        <div className="section-copy">
          <p className="script-label">Tasting & Mill</p>
          <h2>味だけでなく、作られ方も見ます。</h2>
          <p>
            複数のオイルを同じ場所で比べて、香り、苦み、辛み、余韻を確認。
            そのうえで、搾油機や充填まわりも見て、どう扱われているかを記録します。
            選ぶ前の確認を、ちゃんと積み上げます。
          </p>
        </div>
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
        <div className="image-frame image-frame-grove">
          <Image
            src="/images/shodoshima-branch-detail.jpg"
            alt="Olive branches with young olives in Shodoshima"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
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
