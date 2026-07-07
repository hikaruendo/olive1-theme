"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#journey", label: "旅の記録" },
  { href: "#transparency", label: "品質の見方" },
  { href: "#oils", label: "ラインナップ" },
  { href: "#journal", label: "読み物" },
  { href: "#club", label: "クラブ" },
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
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          Olive<small>1</small>
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#club" className="btn btn-primary">
          クラブに入る
        </a>
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
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#club" className="btn btn-primary" onClick={() => setOpen(false)}>
          クラブに入る
        </a>
      </div>
    </header>
  );
}
