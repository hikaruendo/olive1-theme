import type { Lang } from "@/lib/i18n";
import { seller } from "@/lib/reserve";

// プライバシーポリシー（/privacy）。
// 実際にこのサイトが集めて預けているものだけを書く。集めるものや預け先を変えたら、ここも直す。
// 対応するコード：api/waitlist（クラブ）・api/reserve（予約）・api/stripe/webhook（カードの入金）・layout の Analytics と Fontshare。

type Section = { h: string; p?: string[]; list?: string[]; after?: string[] };

const ja = {
  meta: {
    title: "プライバシーポリシー｜Olive1",
    description: "Olive1（kando1合同会社）が、クラブへの登録と予約でお預かりする情報、使う目的、預け先、開示や削除の方法について。",
  },
  label: "Privacy ／ 個人情報",
  h1: "プライバシーポリシー",
  lead: "Olive1 がお預かりする情報と、その使い方です。集めるのは、クラブのメールと予約に必要なものだけです。",
  crumb: "プライバシーポリシー",
  sections: [
    {
      h: "1. 事業者",
      list: [
        `${seller.company}（屋号 Olive1）`,
        `代表社員　${seller.person}`,
        seller.address,
        `お問い合わせ　${seller.email}`,
      ],
    },
    {
      h: "2. お預かりする情報",
      p: ["このサイトでお預かりするのは、次の情報です。"],
      list: [
        "クラブへの登録：メールアドレス、興味のあること（任意）、登録した日時、表示していた言語",
        "予約：お名前、メールアドレス、本数、受け取り方法、発送先（発送の場合）、お支払い方法、紹介してくれた人の名前（任意）、メモ（任意）、予約した日時",
        "カードでのお支払い：決済は Stripe のページで行います。カード番号は Olive1 には届きません。Stripe から受け取るのは、お名前、メールアドレス、配送先、決済した金額と結果です",
        "銀行振込でのお支払い：振込の名義と金額（入金の確認に使います）",
        "お問い合わせ：メールに書かれた内容と、メールアドレス",
        "サイトの閲覧：見られたページ、どこから来たか、国、端末やブラウザの種類といった統計（Vercel Web Analytics）。Cookie は使わず、個人を特定しません。サイトを配信するサーバーには、IPアドレスなどのアクセス記録が残ります。書体の一部は Fontshare から読み込むため、その際にIPアドレスなどが同社に送られます",
      ],
    },
    {
      h: "3. 使う目的",
      list: [
        "予約の受付と確認、入金の確認、発送または手渡し、本番号などのご連絡",
        "クラブのメールの配信（入荷や予約のお知らせ、旅の記録）。予約をされた方にも、翌年の予約のご案内などをお送りします",
        "お問い合わせへの返信",
        "サイトと商品の改善（個人を特定しない統計として）",
        "法令で定められた取引の記録の保存",
      ],
      after: ["クラブのメールは、メールの中の配信停止の案内か、上のお問い合わせ先へのご連絡で、いつでも止められます。"],
    },
    {
      h: "4. 情報の預け先",
      p: [
        "上の目的に必要な範囲で、次の事業者のサービスに情報を預けています。米国の事業者を含みます。",
      ],
      list: [
        "Resend（米国）：メールの送信、クラブの名簿",
        "Google（米国）：予約の台帳（スプレッドシート）、メールの受信",
        "Stripe（米国、日本ではストライプジャパン株式会社）：カード決済",
        "Vercel（米国）：サイトの配信、閲覧の統計",
        "日本郵便など配送事業者：発送（お名前と発送先）",
      ],
    },
    {
      h: "5. 第三者への提供",
      p: [
        "上の預け先を除き、ご本人の同意なく第三者に情報を渡しません。法令にもとづく場合は例外です。情報を売ることはありません。",
      ],
    },
    {
      h: "6. 保存する期間",
      list: [
        "予約と入金の記録：法令で定められた期間（帳簿書類として7年）",
        "クラブの登録：配信を止めるまで。削除をご希望の場合はご連絡ください",
      ],
    },
    {
      h: "7. 安全のための管理",
      p: [
        "お預かりした情報に触れるのは、運営責任者だけです。預け先のサービスは、アクセスできる人を限って使っています。漏えいなどが起きた場合は、法令に従って、ご本人と関係機関にお知らせします。",
      ],
    },
    {
      h: "8. 開示・訂正・削除のご請求",
      p: [
        `ご自身の情報について、開示、訂正、追加、削除、利用の停止を請求できます。${seller.email} までメールでご連絡ください。ご本人であることを確かめたうえで、遅れずに対応します。ご意見や苦情も同じ宛先で受け付けます。`,
      ],
    },
    {
      h: "9. 変更",
      p: ["集める情報や預け先を変えた時は、このページを書き換えてお知らせします。"],
    },
  ] as Section[],
  updated: "2026年11月16日 制定",
  back: "ホームへ戻る",
};

const en: typeof ja = {
  meta: {
    title: "Privacy policy｜Olive1",
    description: "What Olive1 (kando1 LLC) collects when you join the club or reserve a bottle, why, where it is kept, and how to ask for access or deletion.",
  },
  label: "Privacy",
  h1: "Privacy policy",
  lead: "What Olive1 collects and how it is used. Only what the club emails and reservations need.",
  crumb: "Privacy policy",
  sections: [
    {
      h: "1. Who is responsible",
      list: [
        `${seller.companyEn}, trading as Olive1`,
        `Representative: ${seller.personEn}`,
        seller.addressEn,
        `Contact: ${seller.email}`,
      ],
    },
    {
      h: "2. What is collected",
      p: ["This site collects the following."],
      list: [
        "Joining the club: email address, what you are interested in (optional), the time you joined, and the language you were viewing",
        "Reserving: name, email address, number of bottles, how you will receive them, shipping address (if shipped), payment method, the name of the person who referred you (optional), notes (optional), and the time of the reservation",
        "Paying by card: payment happens on Stripe's page. Your card number never reaches Olive1. Stripe passes on your name, email address, shipping address, and the amount and result of the payment",
        "Paying by bank transfer: the name on the transfer and the amount, used to match your payment",
        "Contacting Olive1: the content of your email and your email address",
        "Browsing the site: pages viewed, where you came from, country, and device and browser type, as statistics (Vercel Web Analytics). No cookies are used and you are not identified. The server that delivers the site keeps access records such as IP addresses. Some typefaces load from Fontshare, which receives your IP address when they load",
      ],
    },
    {
      h: "3. What it is used for",
      list: [
        "Taking and confirming reservations, matching payments, shipping or handing over bottles, and telling you your bottle number",
        "Sending club emails (arrivals, reservation openings, notes from the journey). People who reserve also receive notices such as next year's reservations",
        "Replying to enquiries",
        "Improving the site and the products, using statistics that do not identify you",
        "Keeping transaction records as the law requires",
      ],
      after: ["You can stop club emails at any time, using the unsubscribe note in an email or by writing to the contact address above."],
    },
    {
      h: "4. Where it is kept",
      p: ["For the purposes above, information is held with the following service providers, including companies in the United States."],
      list: [
        "Resend (United States): sending email, the club list",
        "Google (United States): the reservation ledger (a spreadsheet), incoming email",
        "Stripe (United States; Stripe Japan in Japan): card payments",
        "Vercel (United States): delivering the site, browsing statistics",
        "Japan Post and other carriers: shipping (name and address)",
      ],
    },
    {
      h: "5. Sharing with others",
      p: [
        "Apart from the providers above, information is not given to anyone else without your consent, except where the law requires it. It is never sold.",
      ],
    },
    {
      h: "6. How long it is kept",
      list: [
        "Reservation and payment records: for the period the law requires (seven years, as accounting records)",
        "Club membership: until you unsubscribe. Write in if you would like it deleted",
      ],
    },
    {
      h: "7. Keeping it safe",
      p: [
        "Only the person responsible for Olive1 handles this information. Access to the services that hold it is restricted. If a leak or similar incident happens, you and the authorities are told as the law requires.",
      ],
    },
    {
      h: "8. Access, correction and deletion",
      p: [
        `You can ask to see, correct, add to, delete or stop the use of your information. Email ${seller.email}. Requests are handled without delay once your identity is confirmed. Comments and complaints go to the same address.`,
      ],
    },
    {
      h: "9. Changes",
      p: ["If what is collected or where it is kept changes, this page is updated to say so."],
    },
  ] as Section[],
  updated: "Effective November 16, 2026",
  back: "Back to home",
};

export const privacyText: Record<Lang, typeof ja> = { ja, en };
