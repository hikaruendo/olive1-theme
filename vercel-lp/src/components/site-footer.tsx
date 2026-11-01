import Link from "next/link";
import { href, type Lang } from "@/lib/i18n";
import { ui } from "@/content/ui";

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = ui[lang];
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href={href(lang, "/#top")}>
              Olive<span style={{ color: "var(--citrus)" }}>1</span>
            </Link>
            <p style={{ marginTop: 12, maxWidth: "34ch", color: "#a7b28c" }}>{t.footer.tagline}</p>
          </div>
          <div>
            <h4>{t.footer.explore}</h4>
            <ul>
              <li><Link href={href(lang, "/#oils")}>{t.nav.oils}</Link></li>
              <li><Link href={href(lang, "/#transparency")}>{t.nav.transparency}</Link></li>
              <li><Link href={href(lang, "/#journey")}>{t.nav.journey}</Link></li>
              <li><Link href={href(lang, "/journal")}>{t.nav.journal}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.club}</h4>
            <ul>
              <li><Link href={href(lang, "/#club")}>{t.footer.joinClub}</Link></li>
              <li><Link href={href(lang, "/#faq")}>{t.footer.faq}</Link></li>
              <li><Link href={href(lang, "/#about")}>{t.footer.about}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.follow}</h4>
            <ul>
              <li>
                <a href="https://instagram.com/olive1_official" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-btm">
          <span>© 2026 Olive1</span>
          <span>{t.footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}
