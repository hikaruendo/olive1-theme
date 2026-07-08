"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Absolute (home-anchored) hrefs so the nav works from every route — on
// /journal or /oils a bare "#journey" would resolve against the current path.
const links = [
  { href: "/#journey", label: "旅の記録" },
  { href: "/#transparency", label: "品質の見方" },
  { href: "/#oils", label: "ラインナップ" },
  { href: "/journal", label: "読み物" },
  { href: "/#club", label: "クラブ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site${scrolled ? " scrolled" : ""}`}>
      <div className="wrap nav">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          Olive<small>1</small>
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/#club" className="btn btn-primary">
          クラブに入る
        </Link>
        <button
          className="menu-btn"
          aria-label="メニュー"
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
        <Link href="/#club" className="btn btn-primary" onClick={() => setOpen(false)}>
          クラブに入る
        </Link>
      </div>
    </header>
  );
}
