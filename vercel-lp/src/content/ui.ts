import type { Lang } from "@/lib/i18n";

// ヘッダー・フッター・フォーム・共通の文言。日本語が原文。英語は直訳にしない。
const ja = {
  nav: {
    journey: "旅の記録",
    transparency: "品質の見方",
    oils: "今年の一本",
    journal: "読み物",
    club: "クラブ",
    reserve: "予約",
    joinClub: "クラブに入る",
    menu: "メニュー",
    switchTo: "English",
    switchAria: "英語で見る",
  },
  footer: {
    tagline: "東京発のスペシャルティEVOO。数値を公開し、産地を自分の足で確かめて、毎日のごはんに届けます。",
    explore: "探す",
    reserve: "予約する",
    club: "クラブ",
    joinClub: "クラブに入る",
    faq: "よくある質問",
    about: "考え方",
    follow: "Follow",
    legal: "特定商取引法 · プライバシーポリシー · クラブ規約",
  },
  crumb: { home: "ホーム", journal: "読み物", reserve: "予約", aria: "パンくず" },
  waitlist: {
    title: "Olive1クラブに参加する",
    email: "メールアドレス",
    interestsLegend: "興味のあること（任意・複数可）",
    interests: ["毎日使い", "ギフト", "飲む健康", "レシピ"],
    submit: "クラブに入る",
    sending: "送信中",
    failed: "参加できませんでした。",
    joined: "クラブに参加しました。",
  },
  clubCta: {
    label: "Olive1 Club",
    title: "数字で選べる一本を、いちばん先に。",
    body: "産地を探す旅の続きと、初回ロットの入荷日・価格・検査値が決まったタイミングの先行案内をお届けします。",
    button: "クラブに入る（無料）",
  },
};

const en: typeof ja = {
  nav: {
    journey: "The Journey",
    transparency: "Reading Quality",
    oils: "This Year's Bottle",
    journal: "Journal",
    club: "Club",
    reserve: "Reserve",
    joinClub: "Join the club",
    menu: "Menu",
    switchTo: "日本語",
    switchAria: "日本語で見る",
  },
  footer: {
    tagline: "Specialty extra virgin olive oil from Tokyo. Lab numbers published, origins checked in person, made for everyday meals.",
    explore: "Explore",
    reserve: "Reserve a bottle",
    club: "Club",
    joinClub: "Join the club",
    faq: "FAQ",
    about: "Our thinking",
    follow: "Follow",
    legal: "Legal notice · Privacy policy · Club terms",
  },
  crumb: { home: "Home", journal: "Journal", reserve: "Reserve", aria: "Breadcrumb" },
  waitlist: {
    title: "Join the Olive1 Club",
    email: "Email",
    interestsLegend: "What are you here for? (optional)",
    interests: ["Everyday use", "Gifts", "Daily spoonful", "Recipes"],
    submit: "Join the club",
    sending: "Sending",
    failed: "Could not join. Please try again.",
    joined: "You are in the club.",
  },
  clubCta: {
    label: "Olive1 Club",
    title: "The first to hear about a bottle you can judge by its numbers.",
    body: "Updates from the search for origins, and early notice when the first lot has a date, a price and lab results.",
    button: "Join the club (free)",
  },
};

export const ui: Record<Lang, typeof ja> = { ja, en };
