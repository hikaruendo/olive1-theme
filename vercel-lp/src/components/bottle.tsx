import Image from "next/image";
import { useId } from "react";

// ラベルを貼った瓶の絵。瓶は実物（首のある濃緑の角瓶・黒いキャップ）に合わせた SVG、
// ラベルは鉄崎さんの正面パネル（35mm×85mm）をそのまま載せる。胴の幅はおよそ 40mm。
// 位置と大きさは globals.css の .bottle-label（viewBox 112×410 に対する割合）。

type Props = { alt: string; sizes?: string; priority?: boolean };

export function Bottle({ alt, sizes = "160px", priority = false }: Props) {
  const id = useId();
  const glass = `${id}-glass`;
  const cap = `${id}-cap`;
  return (
    <figure className="bottle">
      <svg viewBox="44 4 112 410" aria-hidden="true">
        <defs>
          <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1d2a14" />
            <stop offset="0.22" stopColor="#3a4f24" />
            <stop offset="0.55" stopColor="#2a3a1b" />
            <stop offset="1" stopColor="#141d0e" />
          </linearGradient>
          <linearGradient id={cap} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#141414" />
            <stop offset="0.3" stopColor="#3a3a3a" />
            <stop offset="1" stopColor="#0c0c0c" />
          </linearGradient>
        </defs>
        {/* キャップ */}
        <rect x="66" y="8" width="68" height="34" rx="10" fill={`url(#${cap})`} />
        <rect x="64" y="40" width="72" height="30" rx="5" fill={`url(#${cap})`} />
        <rect x="64" y="52" width="72" height="2" fill="rgba(255,255,255,0.12)" />
        {/* 首・肩・胴 */}
        <path
          d="M74 70 H126 V92 C126 112 152 120 152 150 V396 C152 404 146 410 138 410 H62 C54 410 48 404 48 396 V150 C48 120 74 112 74 92 Z"
          fill={`url(#${glass})`}
        />
      </svg>
      <span className="bottle-label">
        <Image src="/images/brand/label_front.png" alt={alt} fill sizes={sizes} priority={priority} />
      </span>
    </figure>
  );
}
