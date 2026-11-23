// 日英の2言語。日本語はURLに接頭辞なし（/reserve）、英語は /en（/en/reserve）。
// proxy.ts が接頭辞なしのパスを内部的に /ja/... に書き換えるので、
// app/[lang] の中では常に lang が "ja" か "en" のどちらか。

export const langs = ["ja", "en"] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = "ja";

export function isLang(v: string): v is Lang {
  return (langs as readonly string[]).includes(v);
}

// 内部パス（/reserve, /journal/x, /#club）を、その言語の公開URLにする
export function href(lang: Lang, path: string) {
  if (lang === defaultLang) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`; // /#club → /en#club
  return `/en${path}`;
}

// 公開URLのパスから、言語と内部パスを取り出す（言語切り替え用）。
// サーバー側の usePathname は proxy で書き換えた /ja/... を返すことがあるので、/ja も剥がす
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "en", path: pathname.slice(3) || "/" };
  }
  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    return { lang: "ja", path: pathname.slice(3) || "/" };
  }
  return { lang: "ja", path: pathname || "/" };
}

export const otherLang = (lang: Lang): Lang => (lang === "ja" ? "en" : "ja");

export const siteUrl = "https://olive.kando1.com";

// metadata.alternates 用。ja と en の両方のURLを返す
export function alternates(path: string) {
  return {
    canonical: path,
    languages: {
      ja: href("ja", path),
      en: href("en", path),
      "x-default": href("ja", path),
    },
  };
}

export const ogLocale: Record<Lang, string> = { ja: "ja_JP", en: "en_US" };

// 共有されたときの画像（src/app/opengraph-image.png＝白地にラベル付きの瓶）。
// ページ側で openGraph を書くと親の画像が引き継がれないので、各ページの openGraph にこれを足す。
export const ogImages = [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Hikaru's Olive | Olive1" }];
