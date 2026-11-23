import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Zen_Kaku_Gothic_New, IBM_Plex_Mono, Shantell_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { alternates, isLang, langs, ogLocale, siteUrl, type Lang } from "@/lib/i18n";
import { home } from "@/content/home";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

// 屋号「Olive1」だけに使う、手で書いたようなゴシック
const shantell = Shantell_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "ja";
  const t = home[lang].meta;
  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    alternates: alternates("/"),
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      locale: ogLocale[lang],
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${zenKaku.variable} ${plexMono.variable} ${shantell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Fontshare: Latin accent (General Sans) (Next hoists <link> into <head>) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
        {children}
        {/* Vercel Web Analytics（訪問数と出どころ。utm_source / utm_medium も記録される） */}
        <Analytics />
      </body>
    </html>
  );
}
