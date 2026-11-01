import { NextResponse, type NextRequest } from "next/server";

// 日本語は接頭辞なしのURL（/reserve）を /ja/reserve に内部書き換え。
// 英語は /en/... をそのまま通す。/ja/... を直接開かれたら接頭辞なしへリダイレクト（URLを1つに保つ）。
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ja${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // API・Next内部・拡張子付きの静的ファイル（画像・動画・アイコン）は対象外
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
