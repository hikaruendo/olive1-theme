import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href="/#top">
              Olive<span style={{ color: "var(--citrus)" }}>1</span>
            </Link>
            <p style={{ marginTop: 12, maxWidth: "34ch", color: "#a7b28c" }}>
              東京発のスペシャルティEVOO。数値を公開し、産地を自分の足で確かめて、毎日のごはんに届けます。
            </p>
          </div>
          <div>
            <h4>探す</h4>
            <ul>
              <li><Link href="/oils/medium">ラインナップ</Link></li>
              <li><Link href="/#transparency">品質の見方</Link></li>
              <li><Link href="/#journey">旅の記録</Link></li>
              <li><Link href="/journal">読み物</Link></li>
            </ul>
          </div>
          <div>
            <h4>クラブ</h4>
            <ul>
              <li><Link href="/#club">クラブに入る</Link></li>
              <li><Link href="/#faq">よくある質問</Link></li>
              <li><Link href="/#about">考え方</Link></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
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
          <span>特定商取引法 · プライバシーポリシー · クラブ規約</span>
        </div>
      </div>
    </footer>
  );
}
