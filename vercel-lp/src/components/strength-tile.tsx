// Typographic SKU tile used instead of a (reused) product photo.
// The background darkens with strength (Light → Intense), so the visual
// itself reads as intensity. No image, no faces.

type Props = {
  tag: string; // LIGHT / MEDIUM / INTENSE
  strength: 1 | 2 | 3 | number;
  sub?: string; // やさしい / ふつう / しっかり
};

export function StrengthTile({ tag, strength, sub }: Props) {
  return (
    <div className={`strength-tile st-${strength}`}>
      <div className="st-top">
        <span className="st-eyebrow">The Oils</span>
        <span className="st-num">0{strength}</span>
      </div>
      <div className="st-mid">
        <span className="st-tag">{tag}</span>
        {sub && <span className="st-sub">{sub}</span>}
      </div>
      <div className="st-bottom">
        <span className="st-meter" aria-hidden>
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= strength ? "on" : ""} />
          ))}
        </span>
        <span className="st-lvl">強度 {strength} / 3</span>
      </div>
    </div>
  );
}
