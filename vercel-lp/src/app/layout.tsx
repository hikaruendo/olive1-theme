import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Shippori_Mincho, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

// 見出し用の明朝。Instagram のカルーセルと同じ editorial のトーンに揃える。
const shippori = Shippori_Mincho({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title:
    "Olive1 | 見えるEVOO、毎日のごはんに｜スペシャルティ エクストラバージンオリーブオイル",
  description:
    "ポリフェノール量・酸度・収穫年を、測定法まで添えてラベルに公開する、東京発のスペシャルティEVOO（エクストラバージンオリーブオイル）。産地を自分の足で確かめる旅ごと公開中。事前登録受付中。",
  openGraph: {
    title: "Olive1 | 見えるEVOO、毎日のごはんに",
    description:
      "数値を公開し、産地を自分の足で確かめて届ける、東京発のスペシャルティEVOO。事前登録受付中。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${zenKaku.variable} ${shippori.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Fontshare: Latin display + accent (Next hoists <link> into <head>) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap"
        />
        {children}
      </body>
    </html>
  );
}
