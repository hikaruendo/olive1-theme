// 予約ページの商品画像の場所に置く仮の絵。ラベルのデザインができたら、瓶の写真に差し替えてこの部品は消す。
// 瓶の形は実物（首のある濃緑の角瓶・黒いキャップ）に合わせている。ラベルの位置は点線の枠だけ。

type Props = { title: string; sub: string; alt: string };

export function LabelInProgress({ title, sub, alt }: Props) {
  return (
    <figure className="label-wip">
      <svg className="label-wip-bottle" viewBox="0 0 200 430" role="img" aria-label={alt}>
        <defs>
          <linearGradient id="wip-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1d2a14" />
            <stop offset="0.22" stopColor="#3a4f24" />
            <stop offset="0.55" stopColor="#2a3a1b" />
            <stop offset="1" stopColor="#141d0e" />
          </linearGradient>
          <linearGradient id="wip-cap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#141414" />
            <stop offset="0.3" stopColor="#3a3a3a" />
            <stop offset="1" stopColor="#0c0c0c" />
          </linearGradient>
        </defs>
        {/* 影 */}
        <ellipse cx="100" cy="416" rx="62" ry="7" fill="rgba(36,48,25,0.16)" />
        {/* キャップ */}
        <rect x="66" y="8" width="68" height="34" rx="10" fill="url(#wip-cap)" />
        <rect x="64" y="40" width="72" height="30" rx="5" fill="url(#wip-cap)" />
        <rect x="64" y="52" width="72" height="2" fill="rgba(255,255,255,0.12)" />
        {/* 首・肩・胴 */}
        <path
          d="M74 70 H126 V92 C126 112 152 120 152 150 V396 C152 404 146 410 138 410 H62 C54 410 48 404 48 396 V150 C48 120 74 112 74 92 Z"
          fill="url(#wip-glass)"
        />
        {/* ガラスの光 */}
        <path d="M62 158 V388" stroke="rgba(255,255,255,0.16)" strokeWidth="5" strokeLinecap="round" />
        {/* ラベルの位置（まだ空） */}
        <rect className="label-wip-frame" x="62" y="196" width="76" height="150" rx="8" fill="rgba(247,241,228,0.08)" stroke="#f7f1e4" strokeWidth="1.6" strokeDasharray="6 6" />
      </svg>
      <figcaption>
        <b>{title}</b>
        <span>{sub}</span>
      </figcaption>
    </figure>
  );
}
