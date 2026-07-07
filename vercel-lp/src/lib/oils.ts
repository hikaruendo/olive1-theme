// Shared product data for the lineup cards (home) and the PDP (/oils/[slug]).
// Prelaunch: lab values are illustrative examples and are replaced with the
// measured values of the confirmed first lot.

export type OilSlug = "light" | "medium" | "intense";

export type Oil = {
  slug: OilSlug;
  tag: "LIGHT" | "MEDIUM" | "INTENSE";
  sku: string; // e.g. "Light ／ やさしい"
  title: string; // short use headline
  strength: 1 | 2 | 3;
  summary: string; // one-line for PDP hero
  use: string; // use cases
  variety: string; // 品種（予定）
  origin: string; // 産地（予定）
  image: string;
  lab: {
    polyphenol: number; // mg/kg
    method: string; // 測定方法
    measuredMonth: string; // 測定月
    acidity: number; // %
    peroxide: number; // meq O2/kg
    harvest: number; // 収穫年
    pressingDate: string; // 搾油日
  };
  pressingReport: string;
  tasting: string[];
  pairings: string[];
};

export const oils: Oil[] = [
  {
    slug: "light",
    tag: "LIGHT",
    sku: "Light ／ やさしい",
    title: "朝と、生野菜に。",
    strength: 1,
    summary: "青い香りはひかえめ。まず“毎日かけられる軽さ”からEVOOに慣れたい人へ。",
    use: "パン、マリネ、サラダ、白身魚のカルパッチョ。香りをそっと添えたいときに。",
    variety: "品種：アルベキーナ系（予定）",
    origin: "産地：地中海の候補産地（検証中）",
    image: "/images/hero-bottle-desktop.png",
    lab: {
      polyphenol: 236,
      method: "総ポリフェノール（没食子酸換算）",
      measuredMonth: "2025年12月",
      acidity: 0.22,
      peroxide: 6.4,
      harvest: 2025,
      pressingDate: "2025年11月（予定）",
    },
    pressingReport:
      "収穫から搾油までを短くし、低温で搾ることを条件に選定します。青い刺激より、なめらかさと素直な果実感を優先した設計です。",
    tasting: ["若草・青リンゴのやわらかな香り", "苦みひかえめ", "喉のピリつきは軽い"],
    pairings: ["トマトに塩とEVOO", "絹豆腐に塩とEVOO", "サラダのドレッシング", "大さじ1を朝に"],
  },
  {
    slug: "medium",
    tag: "MEDIUM",
    sku: "Medium ／ ふつう",
    title: "毎日のごはんに。",
    strength: 2,
    summary: "香り・苦み・辛みのバランス型。味噌汁からパスタまで、いちばん使い回しがきく一本。",
    use: "味噌汁・冷奴・トマト・スープ・パスタ。和食の仕上げにひと回し。",
    variety: "品種：ブレンド（予定）",
    origin: "産地：地中海の候補産地（検証中）",
    image: "/images/hero-bottle-desktop.png",
    lab: {
      polyphenol: 412,
      method: "総ポリフェノール（没食子酸換算）",
      measuredMonth: "2025年12月",
      acidity: 0.19,
      peroxide: 5.1,
      harvest: 2025,
      pressingDate: "2025年11月（予定）",
    },
    pressingReport:
      "産地を自分の足で確かめ、畑と搾油機を見てから仕入れます。搾油日・品種・産地をラベルに明記し、検査分析書（CoA）も公開します。",
    tasting: ["青い草・アーティチョークの香り", "中程度の苦み", "喉に残るピリッとした辛み"],
    pairings: ["味噌汁にひと回し", "トマトに塩とEVOO", "パスタの仕上げに", "アヒージョに"],
  },
  {
    slug: "intense",
    tag: "INTENSE",
    sku: "Intense ／ しっかり",
    title: "肉と、仕上げに。",
    strength: 3,
    summary: "ポリフェノール高め。苦みと辛みがはっきり、料理の輪郭を立てたいときの一本。",
    use: "焼いた肉、豆のスープ、パスタ、グリル野菜。強い料理の仕上げのひと回しに。",
    variety: "品種：コラティーナ系（予定）",
    origin: "産地：南イタリアの候補産地（検証中）",
    image: "/images/hero-bottle-desktop.png",
    lab: {
      polyphenol: 548,
      method: "総ポリフェノール（没食子酸換算）",
      measuredMonth: "2025年12月",
      acidity: 0.17,
      peroxide: 4.6,
      harvest: 2025,
      pressingDate: "2025年10月（予定）",
    },
    pressingReport:
      "早摘みで搾ることを条件に選定します。ポリフェノールが高いぶん、喉の辛みと苦みははっきり。強い料理に負けない一本を狙います。",
    tasting: ["青いトマトの葉・黒こしょうの香り", "しっかりした苦み", "喉に強く残る辛み"],
    pairings: ["焼いた肉に", "豆のスープに", "パスタの仕上げに", "グリル野菜に"],
  },
];

export function getOil(slug: string): Oil | undefined {
  return oils.find((o) => o.slug === slug);
}
