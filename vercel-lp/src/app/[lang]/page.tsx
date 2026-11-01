import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteFooter } from "@/components/site-footer";
import { getArticles } from "@/lib/journal";
import { href, isLang } from "@/lib/i18n";
import { home } from "@/content/home";

// 文言は content/home.ts（ja/en）。ここは構造だけ。
// ブランドの3本柱（Consistency / Social Impact / Genuine）は内部の判断基準。
// 顧客向けには抽象名詞で掲げず、検証可能な行動の約束として見せる（show, don't tell）。

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = home[lang];
  const articles = getArticles(lang);
  const L = (path: string) => href(lang, path);

  return (
    <>
      {/* SECTION: announcement */}
      <div className="topbar">
        {t.topbar.lead}
        <b>{t.topbar.strong}</b>
        {t.topbar.rest}
      </div>

      {/* SECTION: header */}
      <SiteHeader lang={lang} />

      <main id="top">
        {/* SECTION: hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eng">{t.hero.eng}</p>
              <h1>
                {t.hero.h1a}
                {lang === "ja" && <br />}
                <span className="hl">{t.hero.h1hl}</span>
                {t.hero.h1b}
              </h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="hero-cta">
                <a href="#club" className="btn btn-primary">
                  {t.hero.ctaPrimary}
                </a>
                <a href="#journey" className="btn btn-ghost">
                  {t.hero.ctaGhost}
                </a>
              </div>
              <div className="hero-trust">
                {t.hero.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-media">
              <div className="media">
                <Image
                  src="/images/hero-grove-shodoshima.jpg"
                  alt={t.hero.imgAlt}
                  fill
                  priority
                  sizes="(max-width: 860px) 100vw, 46vw"
                />
              </div>
              <div className="hero-badge">
                {t.hero.badgePrefix}
                <b>{t.hero.badgePlace}</b>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: promise (01/02/03) */}
        <section className="section tinted" id="promise">
          <div className="wrap">
            <p className="label">{t.promise.label}</p>
            <h2>{t.promise.title}</h2>
            <div className="promise-grid">
              {t.promise.items.map((p) => (
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
            <p className="label">{t.transparency.label}</p>
            <h2>{t.transparency.title}</h2>
            <div className="trans-grid">
              <div>
                <p className="lead">{t.transparency.lead}</p>

                <div className="stat-row">
                  <div className="stat pending">
                    <div className="k">Polyphenol</div>
                    <div className="v">
                      {t.transparency.pending}
                      <small> mg/kg</small>
                    </div>
                    <div className="n">{t.transparency.polyphenolNote}</div>
                  </div>
                  <div className="stat pending">
                    <div className="k">Acidity</div>
                    <div className="v">
                      {t.transparency.pending}
                      <small> %</small>
                    </div>
                    <div className="n">{t.transparency.acidityNote}</div>
                  </div>
                  <div className="stat pending">
                    <div className="k">Harvest</div>
                    <div className="v">2026</div>
                    <div className="n">{t.transparency.harvestNote}</div>
                  </div>
                </div>

                <div className="pheno" aria-label={t.transparency.phenoAria}>
                  {t.transparency.phenoScale.map((row) => (
                    <div className="bar" key={row.range}>
                      <span className="rng">{row.range}</span>
                      <div>
                        <div className="track">
                          <span className="fill" style={{ width: row.width }} />
                        </div>
                        <span className="lb">{row.strong ? <b>{row.label}</b> : row.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="disc" aria-label={t.transparency.discAria}>
                  {t.transparency.disclosure.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <p className="note">{t.transparency.note}</p>
                <Link href={L("/journal/label-reading")} className="btn btn-ghost" style={{ marginTop: 18 }}>
                  {t.transparency.more}
                </Link>
              </div>

              <figure className="coa">
                <div className="media">
                  <Image src="/images/coa-sample.jpg" alt={t.transparency.coaAlt} fill sizes="(max-width: 860px) 100vw, 46vw" />
                </div>
                <div className="seal">LAB REPORT</div>
                <figcaption>{t.transparency.coaCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* SECTION: 今年の一本（初回SKU＝国産） */}
        <section className="section tinted" id="oils">
          <div className="wrap">
            <div className="oils-head">
              <div>
                <p className="label">{t.oils.label}</p>
                <h2>{t.oils.title}</h2>
              </div>
              <div className="oils-note">{t.oils.note}</div>
            </div>
            <div className="first-bottle">
              <figure className="fb-media">
                <Image src="/images/harvest-hand-olives.jpg" alt={t.oils.imgAlt} fill sizes="(max-width: 860px) 100vw, 46vw" />
              </figure>
              <div className="fb-body">
                <ul className="fb-spec">
                  {t.oils.spec.map((row) => (
                    <li key={row.k}>
                      <span>{row.k}</span>
                      <b>{row.v}</b>
                    </li>
                  ))}
                </ul>
                <p className="fb-note">{t.oils.body}</p>
                <a href="#club" className="btn btn-citrus">
                  {t.oils.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: first sip (喉テスト) */}
        <section className="section">
          <div className="wrap">
            <div className="sip">
              <div>
                <p className="label">{t.sip.label}</p>
                <h2>{t.sip.title}</h2>
                <p>{t.sip.body}</p>
                <p className="fine">{t.sip.fine}</p>
                <Link href={L("/journal/throat-test")} className="btn btn-citrus" style={{ marginTop: 20 }}>
                  {t.sip.cta}
                </Link>
              </div>
              <div className="sip-visual">
                <Image src="/images/sip-oil.jpg" alt={t.sip.imgAlt} fill sizes="(max-width: 860px) 100vw, 30vw" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: journey (videos) */}
        <section className="section journey" id="journey">
          <div className="wrap">
            <div className="journey-top">
              <div className="journey-intro">
                <p className="label">{t.journey.label}</p>
                <h2>{t.journey.title}</h2>
                <p className="lead">{t.journey.lead}</p>
              </div>
              <figure className="journey-reel">
                <video src="/videos/reel-journey.mp4" poster="/images/posters/reel-journey.jpg" controls muted playsInline preload="none" />
                <figcaption>{t.journey.reelCaption}</figcaption>
              </figure>
            </div>
            <div className="clips">
              {t.journey.clips.map((clip) => (
                <figure className="clip" key={clip.src}>
                  <div className="vid">
                    {/* 素材は 1280x720 のものだけ。低解像度・縦横比の合わないクリップは引き伸ばしになるので載せない */}
                    <video src={clip.src} poster={clip.poster} autoPlay muted loop playsInline preload="metadata" />
                  </div>
                  <figcaption>
                    <b>{clip.num}</b> {clip.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="episode2">
              <h3>{t.journey.ep2Title}</h3>
              <p>{t.journey.ep2Body}</p>
              <div className="harvest-photos">
                {/* 第2話（2026年10月の収穫）。他社のラベルや人の顔が映らないものだけ */}
                {t.journey.photos.map((photo) => (
                  <figure className="clip" key={photo.src}>
                    <div className="photo">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 50vw, 23vw" />
                    </div>
                    <figcaption>
                      <b>{photo.num}</b> {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <a
              href="https://instagram.com/olive1_official"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ marginTop: 28 }}
            >
              {t.journey.cta}
            </a>
          </div>
        </section>

        {/* SECTION: about */}
        <section className="section tinted about" id="about">
          <div className="wrap about-grid">
            <figure className="media" style={{ margin: 0 }}>
              <Image src="/images/shodoshima-hands-olives.jpg" alt={t.about.imgAlt} fill sizes="(max-width: 860px) 100vw, 40vw" />
            </figure>
            <div>
              <p className="label">{t.about.label}</p>
              <h2>{t.about.title}</h2>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <Link href={L("/journal")} className="btn btn-ghost">
                {t.about.cta}
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
                  <p className="label">{t.club.label}</p>
                  <h2>
                    {t.club.h2a}
                    <br />
                    {t.club.h2b}
                  </h2>
                  <p>{t.club.body}</p>
                </div>
                <WaitlistForm lang={lang} />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: journal (education / SEO) */}
        <section className="section" id="journal">
          <div className="wrap">
            <p className="label">{t.journal.label}</p>
            <h2>{t.journal.title}</h2>
            <div className="jr-grid">
              {articles.map((a) => (
                <Link className="art" href={L(`/journal/${a.slug}`)} key={a.slug}>
                  <div className="media">
                    <Image src={a.hero} alt={a.title} fill sizes="(max-width: 520px) 100vw, 25vw" />
                  </div>
                  <div className="body">
                    <div className="cat">{a.cat}</div>
                    <h3>{a.title}</h3>
                    <span className="more">{t.journal.read}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href={L("/journal")} className="btn btn-ghost" style={{ marginTop: 28 }}>
              {t.journal.all}
            </Link>
          </div>
        </section>

        {/* SECTION: usage (目的別 / 和食) */}
        <section className="section tinted use">
          <div className="wrap use-grid">
            <div>
              <p className="label">{t.use.label}</p>
              <h2>{t.use.title}</h2>
              <p className="lead">{t.use.lead}</p>
              <ul>
                {t.use.meals.map((meal) => (
                  <li key={meal}>{meal}</li>
                ))}
              </ul>
              <Link href={L("/journal")} className="btn btn-ghost">
                {t.use.cta}
              </Link>
            </div>
            <figure className="media" style={{ margin: 0 }}>
              <Image src="/images/usage-tkg-evoo.jpg" alt={t.use.imgAlt} fill sizes="(max-width: 860px) 100vw, 46vw" />
            </figure>
          </div>
        </section>

        {/* SECTION: voices (gated until real data) */}
        <section className="section voices">
          <div className="wrap">
            <p className="label">{t.voices.label}</p>
            <h2>{t.voices.title}</h2>
            <div className="gate">
              <p>{t.voices.body}</p>
            </div>
          </div>
        </section>

        {/* SECTION: faq */}
        <section className="section tinted" id="faq">
          <div className="wrap">
            <p className="label" style={{ justifyContent: "center" }}>
              {t.faq.label}
            </p>
            <h2 style={{ textAlign: "center" }}>{t.faq.title}</h2>
            <div className="faq faq-list">
              {t.faq.items.map((f) => (
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
            <p className="label">{t.final.label}</p>
            <h2>{t.final.title}</h2>
            <a href="#club" className="btn btn-primary">
              {t.final.cta}
            </a>
          </div>
        </section>
      </main>

      {/* SECTION: footer */}
      <SiteFooter lang={lang} />
    </>
  );
}
