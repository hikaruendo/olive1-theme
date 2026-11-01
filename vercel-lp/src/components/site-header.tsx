"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, otherLang, splitPath, type Lang } from "@/lib/i18n";
import { ui } from "@/content/ui";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = ui[lang].nav;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Absolute (home-anchored) hrefs so the nav works from every route — on
  // /journal a bare "#journey" would resolve against the current path.
  const links = [
    { href: href(lang, "/#journey"), label: t.journey },
    { href: href(lang, "/#transparency"), label: t.transparency },
    { href: href(lang, "/#oils"), label: t.oils },
    { href: href(lang, "/journal"), label: t.journal },
    { href: href(lang, "/#club"), label: t.club },
  ];

  // 同じページを別の言語で開くリンク（/reserve ⇄ /en/reserve）
  const switchHref = href(otherLang(lang), splitPath(pathname ?? "/").path);

  return (
    <header className={`site${scrolled ? " scrolled" : ""}`}>
      <div className="wrap nav">
        <Link className="brand" href={href(lang, "/")} onClick={() => setOpen(false)}>
          Olive<small>1</small>
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href={switchHref} className="lang-switch" aria-label={t.switchAria} hrefLang={otherLang(lang)}>
            {t.switchTo}
          </Link>
        </nav>
        <Link href={href(lang, "/#club")} className="btn btn-primary">
          {t.joinClub}
        </Link>
        <button
          className="menu-btn"
          aria-label={t.menu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>
      <div className={`mobile-menu${open ? " open" : ""}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href={switchHref} className="lang-switch" hrefLang={otherLang(lang)} onClick={() => setOpen(false)}>
          {t.switchTo}
        </Link>
        <Link href={href(lang, "/#club")} className="btn btn-primary" onClick={() => setOpen(false)}>
          {t.joinClub}
        </Link>
      </div>
    </header>
  );
}
