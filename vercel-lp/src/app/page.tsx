import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { WaitlistForm } from "@/components/waitlist-form";
import { CountUp } from "@/components/count-up";
import { StrengthTile } from "@/components/strength-tile";
import { SiteFooter } from "@/components/site-footer";
import { oils } from "@/lib/oils";
import { articles } from "@/lib/journal";

const promises = [
  {
    num: "01",
    title: "数値を、ぜんぶ見せる。",
    body: "ポリフェノール量・酸度・収穫年。感想ではなく数字で選べるようにします。",
    points: ["総ポリフェノール／HPLC等の測定法も併記", "ラボの検査分析書（CoA）を公開"],
  },
  {
    num: "02",
    title: "産地を、自分の足で。",
    body: "どこの誰から仕入れるかを決める前に、畑と搾油機を現地で確かめます。小豆島から地中海へ。",
    points: ["畑・手元・ボトルの実写", "旅の過程ごと公開"],
  },
  {
    num: "03",
    title: "毎日、生で使える一本。",
    body: "高級すぎない中間価格で。味噌汁にもトマトにも、火を入れず“ひと回し”。",
    points: ["火を入れない仕上げに", "強度で選べる3本"],
  },
];

const phenoScale = [
  { range: "100–250", width: "38%", label: "一般的な市販EVOO", strong: false },
  { range: "250+", width: "64%", label: "スペシャルティの入口", strong: false },
  { range: "300+", width: "92%", label: "Olive1が探す基準", strong: true },
];

const disclosureItems = [
  "ポリフェノール値",
  "測定方法",
  "酸度",
  "収穫年",
  "産地・品種",
  "搾油日",
];

const journeyClips = [
  { src: "/videos/journey-ferry.mp4", poster: "/images/posters/journey-ferry.jpg", num: "01", caption: "フェリーで島へ" },
  { src: "/videos/journey-grove.mp4", poster: "/images/posters/journey-grove.jpg", num: "02", caption: "畑を歩く" },
  { src: "/videos/journey-mill.mp4", poster: "/images/posters/journey-mill.jpg", num: "03", caption: "搾油機を見る" },
  { src: "/videos/journey-tasting-oils.mp4", poster: "/images/posters/journey-tasting-oils.jpg", num: "04", caption: "飲み比べる" },
];

const meals = [
  "味噌汁にひと回し",
  "絹豆腐に塩とEVOO",
  "トマトに塩とEVOO",
  "大さじ1を朝に",
  "パスタの仕上げに",
  "アヒージョに",
];

const faqs = [
  {
    q: "なぜ、まだ買えないのですか？",
    a: "いま最初の一本を選んでいる最中だからです。産地を自分の足で確かめ、検査値を確認してから初回ロットを決めます。事前登録の方には、入荷・価格・検査値が固まり次第いちばん先にご案内します。",
    open: true,
  },
  {
    q: "産地未訪問なのに、大丈夫ですか？",
    a: "だからこそ、選んでいる途中を全部公開しています。畑・搾油機・検査分析書（CoA）を見てから仕入れ先を決めます。過程を隠さないことが、Olive1の信頼のつくり方です。",
  },
  {
    q: "ポリフェノールの数値は、どうやって測っていますか？",
    a: "総ポリフェノール、HPLC、NMRなど測定方法で数値が変わります。だからラベルと商品ページには、数字だけでなく“測定方法と測定月”まで併記します。",
  },
  {
    q: "いつ届きますか？",
    a: "初回ロットの入荷時期が決まり次第、事前登録の方へ先にお知らせします。喉テスト（極小ポーション）も、ローンチ準備が整い次第、先行でお届け予定です。",
  },
  {
    q: "クラブは解約できますか？",
    a: "はい。メールはいつでも解除できます。しつこい案内は送りません。将来クラブが定期便になっても、スキップ・解約は自由な設計にします。",
  },
  {
    q: "価格帯は？",
    a: "“高級すぎない、毎日生で使える中間価格”を目指しています。確定価格は初回ロットと一緒にご案内します。",
  },
];

export default function Home() {
  return (
    <>
      {/* SECTION: announcement */}
      <div className="topbar">
        プレローンチ ─ <b>事前登録受付中</b>。初回ロットの入荷日・価格・検査値を、いちばん先にお知らせします。
      </div>

      {/* SECTION: header */}
      <SiteHeader />

      <main id="top">
        {/* SECTION: hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eng">Tokyo Specialty EVOO</p>
              <h1>
                毎日のごはんに、
                <br />
                <span className="hl">見えるEVOO</span>を。
              </h1>
              <p className="lead">
                ポリフェノール量・酸度・収穫年を、測定法まで添えてラベルに公開する、スペシャルティ
                エクストラバージンオリーブオイル。まだ最初の一本を選んでいる途中です。産地を自分の足で確かめる旅ごと、公開しながら作っています。
              </p>
              <div className="hero-cta">
                <a href="#club" className="btn btn-primary">
                  最前列の席を取る（無料）
                </a>
                <a href="#journey" className="btn btn-ghost">
                  旅を見る
                </a>
              </div>
              <div className="hero-trust">
                <span className="chip">数値をラベル公開</span>
                <span className="chip">産地を自分の足で</span>
                <span className="chip">毎日生で使える中間価格</span>
              </div>
            </div>
            <div className="hero-media">
              <div className="media">
                <Image
                  src="/images/hero-grove-shodoshima.jpg"
                  alt="小豆島のオリーブ古木（Episode 1 の産地）"
                  fill
                  priority
                  sizes="(max-width: 860px) 100vw, 46vw"
                />
              </div>
              <div className="hero-badge">
                📍 Episode 1 <b>小豆島</b>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: promise (01/02/03) */}
        <section className="section tinted" id="promise">
          <div className="wrap">
            <p className="label">Why Olive1</p>
            <h2>顔は出しません。信頼は、この3つで。</h2>
            <div className="promise-grid">
              {promises.map((p) => (
                <article className="p-card" key={p.num}>
                  <div className="p-num">{p.num}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <ul className="p-list">
                    {p.points.map((pt) => (
                      <li className="chip" key={pt}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: transparency (numbers block) */}
        <section className="section" id="transparency">
          <div className="wrap">
            <p className="label">Transparency ／ 品質の見方</p>
            <h2>ラベルで、ちゃんと選べるように。</h2>
            <div className="trans-grid">
              <div>
                <p className="lead">
                  香りの印象だけでなく、検査結果や収穫情報も判断材料として公開します。ポリフェノールは、喉のピリッとした辛みや苦みのもと。数値は測定方法で変わるので、数字だけでなく“測り方”まで併記します。
                </p>

                <div className="stat-row">
                  <div className="stat">
                    <div className="k">Polyphenol</div>
                    <div className="v">
                      <CountUp to={412} />
                      <small> mg/kg</small>
                    </div>
                    <div className="n">総ポリフェノール</div>
                  </div>
                  <div className="stat">
                    <div className="k">Acidity</div>
                    <div className="v">
                      <CountUp to={0.19} decimals={2} />
                      <small> %</small>
                    </div>
                    <div className="n">酸度（低いほど良）</div>
                  </div>
                  <div className="stat">
                    <div className="k">Harvest</div>
                    <div className="v">
                      <CountUp to={2025} />
                    </div>
                    <div className="n">収穫年</div>
                  </div>
                </div>

                <div className="pheno" aria-label="ポリフェノールの目安">
                  {phenoScale.map((row) => (
                    <div className="bar" key={row.range}>
                      <span className="rng">{row.range}</span>
                      <div>
                        <div className="track">
                          <span className="fill" style={{ width: row.width }} />
                        </div>
                        <span className="lb">
                          {row.strong ? <b>{row.label}</b> : row.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="disc" aria-label="ラベルで公開する項目">
                  {disclosureItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <p className="note">
                  ※数値は例です。初回ロット確定後に、実測値をラベルと商品ページに掲載します。
                </p>
                <Link href="/journal/label-reading" className="btn btn-ghost" style={{ marginTop: 18 }}>
                  品質の見方をもっと読む
                </Link>
              </div>

              <figure className="coa">
                <div className="media">
                  <Image
                    src="/images/coa-sample.jpg"
                    alt="エクストラバージンオリーブオイルの検査分析書（CoA）の例。酸度やUV値を記載"
                    fill
                    sizes="(max-width: 860px) 100vw, 46vw"
                  />
                </div>
                <div className="seal">LAB REPORT</div>
                <figcaption>検査分析書（CoA）の例。仕入れ判断に使っている実物です。</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* SECTION: oils (Light / Medium / Intense) */}
        <section className="section tinted" id="oils">
          <div className="wrap">
            <div className="oils-head">
              <div>
                <p className="label">The Oils ／ 予定ラインナップ</p>
                <h2>強度で選ぶ、3本。</h2>
              </div>
              <div className="oils-note">プレローンチ中。価格・入荷は事前登録者へ先行案内します。</div>
            </div>
            <div className="oils-grid">
              {oils.map((oil) => (
                <article className="oil" key={oil.slug}>
                  <Link className="cap" href={`/oils/${oil.slug}`} aria-label={`${oil.sku} の詳細`}>
                    <StrengthTile
                      tag={oil.tag}
                      strength={oil.strength}
                      sub={oil.sku.split("／")[1]?.trim()}
                    />
                  </Link>
                  <div className="body">
                    <span className="sku">{oil.sku}</span>
                    <h3>{oil.title}</h3>
                    <div className="strength">
                      <span className="dots">
                        {[1, 2, 3].map((i) => (
                          <i key={i} className={i <= oil.strength ? "on" : ""} />
                        ))}
                      </span>
                      強度 {oil.strength} / 3
                    </div>
                    <p className="use">{oil.use}</p>
                    <p className="variety">{oil.variety}</p>
                    <Link href={`/oils/${oil.slug}`} className="btn btn-citrus">
                      この一本を見る
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: first sip (喉テスト) */}
        <section className="section">
          <div className="wrap">
            <div className="sip">
              <div>
                <p className="label">First Sip ／ お試し</p>
                <h2>まずは、喉で確かめる。</h2>
                <p>
                  EVOOの良し悪しは、飲んだあと喉に残るピリッとした辛みで分かります。ローンチ時に、極小ポーションの「喉テスト」を、事前登録の方から先にお届けする予定です。
                </p>
                <p className="fine">
                  ※サンプルはローンチ準備中です。いまお約束できるのは、事前登録者への先行案内です。
                </p>
                <a href="#club" className="btn btn-citrus" style={{ marginTop: 20 }}>
                  事前登録して喉テストを待つ
                </a>
              </div>
              <div className="sip-visual">
                <Image
                  src="/images/sip-oil.jpg"
                  alt="小皿に注いだEVOOひと口分の“喉テスト”"
                  fill
                  sizes="(max-width: 860px) 100vw, 30vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: journey (videos) */}
        <section className="section journey" id="journey">
          <div className="wrap">
            <div className="journey-top">
              <div className="journey-intro">
                <p className="label">The Journey ／ 旅の記録</p>
                <h2>第1話は、小豆島。</h2>
                <p className="lead">
                  2026年6月、日本最大のオリーブ産地・小豆島へ。フェリーで海を渡り、畑を歩き、搾油機を見て、同じテーブルで何本も飲み比べました。6月は収穫の時期ではないので、手摘みも搾りたてもまだ撮れていません。次は秋の収穫期、その先は地中海の産地へ。
                </p>
              </div>
              <figure className="journey-reel">
                <video
                  src="/videos/reel-journey.mp4"
                  poster="/images/posters/reel-journey.jpg"
                  controls
                  muted
                  playsInline
                  preload="none"
                />
                <figcaption>第1話ダイジェスト（動画）</figcaption>
              </figure>
            </div>
            <div className="clips">
              {journeyClips.map((clip) => (
                <figure className="clip" key={clip.src}>
                  <div className="vid">
                    <video
                      src={clip.src}
                      poster={clip.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <figcaption>
                    <b>{clip.num}</b> {clip.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <a
              href="https://instagram.com/olive1_official"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ marginTop: 28 }}
            >
              旅の記録を全部見る（Instagram）
            </a>
          </div>
        </section>

        {/* SECTION: about (no faces) */}
        <section className="section tinted about" id="about">
          <div className="wrap about-grid">
            <figure className="media" style={{ margin: 0 }}>
              <Image
                src="/images/shodoshima-hands-olives.jpg"
                alt="小豆島で枝についた若い実を確かめる手元（顔は写していない）"
                fill
                sizes="(max-width: 860px) 100vw, 40vw"
              />
            </figure>
            <div>
              <p className="label">About ／ 考え方</p>
              <h2>未完のまま、公開する理由。</h2>
              <p>
                ふつうは“完成した店”だけを見せます。でもEVOOは、どこの誰から、どんな検査値で仕入れるかで中身がまるで変わる。だから私たちは、選んでいる途中を隠さず、一緒に旅する席にしました。
              </p>
              <p>
                顔は出しません。信頼は、公開する数値と、現地で撮った実写と、目利きの言葉でつくります。産地未訪問はいまの弱点ですが、あなたと一緒に旅できる“未完の物語”でもあります。
              </p>
              <Link href="/journal" className="btn btn-ghost">
                考え方を読む
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: club (waitlist / main conversion) */}
        <section className="section" id="club">
          <div className="wrap">
            <div className="club">
              <div className="club-grid">
                <div>
                  <p className="label">Olive1 Club</p>
                  <h2>
                    先に知れる、
                    <br />
                    食べるのが好きな人のクラブ。
                  </h2>
                  <p>
                    産地を探す旅の続き、初回ロットの入荷日・価格・検査値が決まったタイミングの先行案内をお届けします。まずは一緒に選ぶための、小さな案内所みたいな場所です。
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: journal (education / SEO) */}
        <section className="section" id="journal">
          <div className="wrap">
            <p className="label">Journal ／ 読み物</p>
            <h2>目利きの、読みもの。</h2>
            <div className="jr-grid">
              {articles.map((a) => (
                <Link className="art" href={`/journal/${a.slug}`} key={a.slug}>
                  <div className="media">
                    <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                  </div>
                  <div className="body">
                    <div className="cat">{a.cat}</div>
                    <h3>{a.title}</h3>
                    <span className="more">読む →</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/journal" className="btn btn-ghost" style={{ marginTop: 28 }}>
              記事一覧へ
            </Link>
          </div>
        </section>

        {/* SECTION: usage (目的別 / 和食) */}
        <section className="section tinted use">
          <div className="wrap use-grid">
            <div>
              <p className="label">Everyday ／ 使い方</p>
              <h2>和食にも、ちゃんと合う。</h2>
              <p className="lead">
                火を入れない仕上げに使うと、香りと苦みが料理の輪郭を少しだけ引き上げます。EVOOの苦みや喉に残る辛みは、オレオカンタールなどのフェノール化合物と関係するとされています。
              </p>
              <ul>
                {meals.map((meal) => (
                  <li key={meal}>{meal}</li>
                ))}
              </ul>
              <Link href="/journal" className="btn btn-ghost">
                使い方・レシピを見る
              </Link>
            </div>
            <figure className="media" style={{ margin: 0 }}>
              <Image
                src="/images/usage-tomato-evoo.jpg"
                alt="スライスしたトマトにEVOOをひと回しかける"
                fill
                sizes="(max-width: 860px) 100vw, 46vw"
              />
            </figure>
          </div>
        </section>

        {/* SECTION: voices (gated until real data) */}
        <section className="section voices">
          <div className="wrap">
            <p className="label">Voices ／ お客様の声</p>
            <h2>声は、ローンチのあとで。</h2>
            <div className="gate">
              <div className="cnt">
                <CountUp to={128} />人
              </div>
              <p>
                いま、これだけの人が旅の途中にいます。実際に使った感想は、届いてから正直に載せます。だから今は、事前登録の数だけをお見せします。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: faq */}
        <section className="section tinted" id="faq">
          <div className="wrap">
            <p className="label" style={{ justifyContent: "center" }}>
              FAQ ／ よくある質問
            </p>
            <h2 style={{ textAlign: "center" }}>買う前の、気になるところ。</h2>
            <div className="faq faq-list">
              {faqs.map((f) => (
                <details key={f.q} open={f.open}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: final cta */}
        <section className="section final">
          <div className="wrap">
            <p className="label">Join the journey</p>
            <h2>最前列の席は、いまなら空いています。</h2>
            <a href="#club" className="btn btn-primary">
              クラブに入る（無料）
            </a>
          </div>
        </section>
      </main>

      {/* SECTION: footer */}
      <SiteFooter />
    </>
  );
}
