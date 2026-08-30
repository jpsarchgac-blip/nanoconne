export type SpreadPhase = "起" | "承" | "転" | "結"

export type SpreadScene =
  | "map-split"
  | "three-places"
  | "two-roles"
  | "building"
  | "terms-cards"
  | "it-recruit"
  | "it-industry-venn"
  | "it-tech-domains"
  | "it-subcontract"
  | "it-work-mix"
  | "it-nano-summary"
  | "it-jobs-recruit"
  | "it-jobs-pyramid"
  | "it-jobs-pyramid-annotate"
  | "it-jobs-targets"
  | "it-jobs-nano-targets"
  | "company-world"
  | "products"
  | "product-skywalker"
  | "product-linka"
  | "product-mieroom"
  | "product-jankara"
  | "product-automotive"
  | "client-map"
  | "gf-shadow"
  | "two-courses-seed"
  | "service-shift"
  | "user-core"
  | "gf-value"
  | "gf-framework"
  | "gf-process"
  | "gf-cases"
  | "gf-twelve"
  | "gf-pick"
  | "gf-elements"
  | "site-mirror"
  | "office-home"
  | "work-engineer"
  | "work-office-outside"
  | "work-office-inside"
  | "work-meeting"
  | "work-flex-day"
  | "work-styles"
  | "work-benefits"
  | "work-growth"
  | "work-style-seed"
  | "day-timeline"
  | "benefit-tags"
  | "culture-moments"
  | "growth-desks"
  | "compete-seed"
  | "compete-flow"
  | "schedule-flags"
  | "intern-courses"
  | "intern-poster"
  | "intern-video"
  | "action-links"

export type BookSpread = {
  phase: SpreadPhase
  title: string
  body: string
  points?: string[]
  note?: string
  scene: SpreadScene
}

export type BookContent = {
  id: string
  spreads: BookSpread[]
}

export const bookContents: BookContent[] = [
  {
    id: "intern",
    spreads: [
      {
        phase: "起",
        title: "2028 コンペインターン",
        body: "==2028年4月入社向け==の、**コンペ形式インターンシップ**です。**GF** を組み込んだ Web サービスの**企画・開発**を、短期間で体験します。",
        points: [
          "**文理 OK**。企画・プログラミング未経験でも参加可",
          "入賞者には、==総額 200 万円相当の賞品==",
          "現地（**神戸**）と **Zoom** のハイブリッド開催",
        ],
        note: "https://www.nanoconnect.co.jp/recruit/",
        scene: "intern-poster",
      },
      {
        phase: "承",
        title: "コンペ形式のインターン",
        body: "**ニーズの確認 → 成果物の提出 → 第三者による評価**。実務の流れを、数日で疑似体験します。==選考そのものではなく==、自分に合うかを知る場です。",
        points: [
          "**GF** の考え方で、Web の体験を考える",
          "**チーム**でも、**一人**でも進める",
          "成果物と、==途中の進め方==の両方を見る",
        ],
        scene: "compete-seed",
      },
      {
        phase: "承",
        title: "スケジュール",
        body: "**8/18（火）〜8/31（月）**、最終日 **9/4（金）**。==初日・2 日目・最終日==は基本参加。作業期間は都合の合う日だけでも OK です。",
        points: [
          "**8/18**：インターン説明会（13:30〜18:00）",
          "**8/19**：情報収集とコース選択（09:00〜18:00）",
          "**8/20〜31**：作業期間（10:00〜16:00、任意）",
          "**9/4**：発表会（13:30〜18:00）",
        ],
        scene: "compete-flow",
      },
      {
        phase: "承",
        title: "必須と任意",
        body: "基本参加日は ==8/18、8/19、9/4== です。欠席した日は、**録画視聴**で追いつけます。作業期間中は、自由に参加できます。",
        points: [
          "**必須**：初日、コース選択、最終発表",
          "**任意**：8/20〜31 の作業日、スキル講座",
          "都合がつかない日は、==事前に連絡==を",
        ],
        scene: "schedule-flags",
      },
      {
        phase: "転",
        title: "企画か、開発か",
        body: "**IT 企画営業コース（企画）**と **IT エンジニアコース（開発）**。**2 日目**の説明のあと、どちらかを選びます。",
        points: [
          "**企画**：困りごとを言葉にして、提案する",
          "**開発**：動くところまで作って、直す",
          "==2 日目までに==、どちらが近いかを考えておく",
        ],
        scene: "intern-courses",
      },
      {
        phase: "転",
        title: "去年の初日",
        body: "昨年のインターン初日の様子です。当日の空気や、顔合わせの雰囲気を、==先に見ておけます==。",
        points: [
          "初日は、全体説明と **GF 入門**",
          "**現地**と **Zoom** が同時進行",
          "当日は、**ニックネーム**でアイスブレイク",
        ],
        note: "https://www.youtube.com/watch?v=F7EqOUlwJi4",
        scene: "intern-video",
      },
      {
        phase: "結",
        title: "今日からすること",
        body: "右が、いまの案内です。詳しい日程と予約は、==採用ページ==から確認してください。",
        points: [
          "まず右の**期間**と**必須日**を見る",
          "採用ページで、==予約とフォーム入力==",
          "わからないことは、**採用窓口**へ",
        ],
        note: "https://www.nanoconnect.co.jp/recruit/",
        scene: "action-links",
      },
    ],
  },
  {
    id: "gf",
    spreads: [
      {
        phase: "起",
        title: "ゲームそのものではない",
        body: "ゲームが夢中になる理由を分解して、仕事やサービスの体験に組み込む。ナノコネはこれを **GF（ゲーミフィケーション）** と呼びます。==点数を付けることでも、アプリをゲームにすることでもありません==。",
        points: [
          "目的は、使った人が「**分かった**」「**続けたい**」と思えること",
          "ランキングは手段。==順位そのものが成果ではない==",
          "インターン初日のこの絵本も、その考え方でできている",
        ],
        scene: "service-shift",
      },
      {
        phase: "承",
        title: "初めての人を基準にする",
        body: "設計の中心は「**いま来た人は、どれくらい知っているか**」。専門の言葉を知っている前提は置きません。==インターン初日のあなた==が、その想定ユーザです。",
        points: [
          "最初の成功は、**短く・早く**",
          "わからなくても、==前のページに戻れる==",
          "用語は、出てきたその場で説明する",
        ],
        scene: "user-core",
      },
      {
        phase: "転",
        title: "要素が、動いて分かる",
        body: "ナノコネは、夢中になる仕組みを **12の要素** にまとめています。==全部を暗記しなくて大丈夫==。右の名前を押すと、その動きを見られます。",
        points: [
          "**集中**：ペイン排除 · レベルデザイン · ゴール設定 · 可視化 · インターフェース",
          "**楽しむ**：デザイアー · ファーストキャッチ · コミュニケーション · リワード · ディレクション",
          "**ユーザ**：平均ユーザーレベル · チューンナップ",
        ],
        note: "全部を暗記しなくていい。次のページで、==この絵本が選んだものだけ==残します。",
        scene: "gf-twelve",
      },
      {
        phase: "転",
        title: "全部は、使わない",
        body: "**12あるから全部入れる、ではありません**。サービスに合わせて選ぶ。この絵本も、==経験値バーや育成ゲームにはしません==。",
        points: [
          "**下段の2つ**は中核。いま来た人に合わせ、出したあと直す",
          "上段は**集中**、中段は**楽しむ**。必要なものだけ取る",
          "**選ぶこと自体**が、GFの設計",
        ],
        scene: "gf-pick",
      },
      {
        phase: "結",
        title: "いまめくったことが、GF",
        body: "右は、この絵本が使っている仕掛けです。届けたい価値は「==インターンと会社が分かること==」。演出はそのための道具です。",
        points: [
          "本棚＝最初のつかみ（**ファーストキャッチ**）",
          "めくる＝触って変わる操作（**インターフェース**）",
          "アイスブレイクの順位＝進みが見える（**可視化**）",
          "会社は、この考え方を製品の土台にもしている（**Skywalker**）",
        ],
        scene: "site-mirror",
      },
    ],
  },
  {
    id: "nano",
    spreads: [
      {
        phase: "起",
        title: "驚きを、あなたのもとへ",
        body: "社名「ナノコネ」は **nano（10億分の1）** と **connect（つながり）** ——小さなつながりから生まれた名前です。目の前の「**あなた**」に、期待を超える驚きを届ける。それがミッションです。",
        points: [
          "Mission：==驚きを あなたのもとへ==",
          "小さなつながりを大切にし、大きな価値を生む",
          "**神戸発**。**AI×ゲーミフィケーション**で世の中に貢献",
        ],
        note: "https://www.nanoconnect.co.jp/about/philosophy/",
        scene: "company-world",
      },
      {
        phase: "承",
        title: "Skywalker",
        body: "**Skywalker** は、**AI** と **GF** を載せてサービスを組み立てる開発の土台です。アプリから基幹まで、==企画から運用まで伴走==します。",
        points: [
          "新規開発も、既存システムの**リプレイス**も対象",
          "**GF** の仕掛けを標準機能として組み込める",
          "**LinKa** や **みえるーむ** も、この土台の上にある",
        ],
        note: "https://www.skywalker-cloud.com/",
        scene: "product-skywalker",
      },
      {
        phase: "承",
        title: "AI LinKa",
        body: "**LinKa** は、Web や店舗での手続き・接客・問い合わせを **AI** が代わりに対応する、おもてなし AI エージェントです。",
        points: [
          "来店予約や査定など、==専門業務まで対応==",
          "PC・スマホ・サイネージなど**複数端末**に対応",
          "**GF** で、人間味のある会話空間をつくる",
        ],
        note: "https://ai-linka.com/",
        scene: "product-linka",
      },
      {
        phase: "承",
        title: "みえるーむ",
        body: "**みえるーむ**は、社員や会議室、備品の状況を**見える化**する組織マネジメントシステムです。==ハイブリッドワーク==にも向いています。",
        points: [
          "座席・会議室の空きが、==ひと目で分かる==",
          "**生成 AI** が社内問い合わせに答える",
          "テレワークでも、一体感を保ちやすい",
        ],
        note: "https://ai-metaroom.com/",
        scene: "product-mieroom",
      },
      {
        phase: "転",
        title: "ジャンカラ会員アプリ",
        body: "西日本中心のカラオケ「**ジャンカラ**」の公式アプリです。会員登録後、==受付なしで入室できる「すぐカラ」==が代表的な機能です。",
        points: [
          "店舗検索、クーポン、ポイントまで**一枚に**",
          "**160 店舗以上**の会員体験を支える",
          "**Skywalker** で企画から開発・運用まで担当",
        ],
        note: "https://www.nanoconnect.co.jp/results/jumbo-karaoke/",
        scene: "product-jankara",
      },
      {
        phase: "転",
        title: "オートモーティブ",
        body: "車載分野では、**カーナビ・IVI・ECU** などの開発を支援します。コネクテッド化や **EV 化**が進む自動車業界のパートナーです。",
        points: [
          "カーナビ、IVI、ECU など**幅広い領域**",
          "受託開発や常駐など、形態は**案件ごと**",
          "Skywalker 以外の**専門開発**もここに入る",
        ],
        note: "https://www.nanoconnect.co.jp/products/automotive/",
        scene: "product-automotive",
      },
      {
        phase: "結",
        title: "エンジニアの働き方",
        body: "開発は**常駐ではなく**、==社内へのアサイン==です。**AI** と **GF** を組み込んだ Web・アプリ開発を、**テレワーク×フレックス**で進めます。",
        points: [
          "**神戸本社 23 階**。旧居留地から 360° の眺望",
          "時短勤務やテレワークで、==育児と両立==する社員も",
          "くわしい制度は「**労働環境**」の冊へ",
        ],
        note: "https://www.nanoconnect.co.jp/recruit-career/engineer/",
        scene: "work-style-seed",
      },
    ],
  },
  {
    id: "it",
    spreads: [
      {
        phase: "起",
        title: "IT 業界の分類",
        body: "IT 業界は大きく **4つ** に分かれます。右の円が動いてから、名前が付きます。円が重なる部分は、==複数の領域をまたぐ仕事==や、1社が複数の顔を持つケースです。**ナノコネ**はハード以外の3領域に位置します。",
        points: [
          "**ソフトウェアメーカー**：自社パッケージを作る",
          "**SIer**：大きな仕組みを受注して組み立てる",
          "**ネットビジネス**：Web サービスで事業を作る",
          "**重なり**：1社が複数領域を担うことも",
        ],
        scene: "it-industry-venn",
      },
      {
        phase: "承",
        title: "技術領域の分類",
        body: "技術の切り口でも業界は分かれます。右の枠が動いてから、名前が付きます。**WEB 系**は「**制作**」と「**システム開発**」で別物。ゲームのように==複数領域にまたがる==仕事もあります。ナノコネは**汎用系以外**が中心です。",
        points: [
          "**WEB 系**：制作業界 / システム開発業界",
          "**制御系**：組み込み · 車載など",
          "**アプリ系 · 業務系（汎用系）**",
          "またがる例：**ゲーム** → 制御×WEB×アプリ",
        ],
        scene: "it-tech-domains",
      },
      {
        phase: "承",
        title: "下請けの仕組み",
        body: "IT 業界には**下請け**の構造があります。右の層が細くなるほど、==お金も期限も減ります==。発注者から何次も請けが分かれ、上ほど調整・下ほど現場に近い仕事になります。**オフショア / ニアショア**も同じ構造の中にあります。",
        points: [
          "**1 次請け**：全体調整 · 東京に多い",
          "**2 次以降**：分割受注 · 他地域に多い",
          "下へ行くほど**単価↓** · **常駐**が増える",
          "**オフショア / ニアショア**もこの構造の中",
        ],
        scene: "it-subcontract",
      },
      {
        phase: "転",
        title: "働き方の割合",
        body: "業界全体では、**常駐開発が約 85%** と大多数です。自社開発は成功率が低く、受託はリスクが高い。常駐は利益は中くらいでローリスクですが、==実務経験が積めない期間==も出ます。",
        points: [
          "業界：**自社 5% · 受託 10% · 常駐 85%**",
          "常駐は **4・5 次請け** になることも",
          "ナノコネ：**研究 10% · 受託 40% · 常駐 50%**",
          "**2 次受け**は 2〜3 社程度",
        ],
        scene: "it-work-mix",
      },
      {
        phase: "結",
        title: "ナノコネの座標",
        body: "ここまでの表をまとめると、ナノコネの位置はこうなります。==ハード・汎用系・下請け末端ではなく==、**企画から開発まで伴走**する会社です。",
        points: [
          "業界：**ソフト / SIer / ネット**（ハード以外）",
          "技術：**WEB / 制御 / アプリ**（汎用系以外）",
          "下請け：**ほぼ 1 次請け**",
          "次は「**IT業界での職種**」の冊へ",
        ],
        scene: "it-nano-summary",
      },
    ],
  },
  {
    id: "it-jobs",
    spreads: [
      {
        phase: "起",
        title: "開発工程のピラミッド",
        body: "IT の仕事は大きく **4段階** に分かれます。上に行くほど **上流工程** と呼ばれ、==企画・提案寄り==の仕事になります。上流ほど案件数も担う企業数も少ない、という傾向があります。",
        points: [
          "上：**コンサル**（ITコンサル / 営業）",
          "要件定義・設計：**PM / PL**",
          "プログラミング・テスト：**SE · PG · テスター**",
          "下：**運用保守**（テクニカルサポート）",
        ],
        scene: "it-jobs-pyramid",
      },
      {
        phase: "承",
        title: "各段の職種",
        body: "同じ4段のピラミッドです。右に、各段の**職種名**が乗ります。プログラミング・テストでは ==SE が大枠で PG を含み、その中にテスター==が入ります。",
        points: [
          "**コンサル**：課題整理と提案",
          "**PM / PL**：要件と設計",
          "**SE ⊃ PG ⊃ テスター**",
          "**運用保守**：問い合わせと保守",
        ],
        scene: "it-jobs-pyramid-annotate",
      },
      {
        phase: "転",
        title: "提供先の3つ",
        body: "できあがったシステムの提供先は **3つ** に分けられます。右に人が出たあと、**B to C** などの名前が付きます。企業によって得意分野は違います。==1社が複数を手がける==こともあります。",
        points: [
          "**B to C**：一般の人が使うサービス",
          "**B to B**：企業向けのシステム",
          "**in B**：社内業務の仕組み",
          "1社が複数を手がけることもある",
        ],
        scene: "it-jobs-targets",
      },
      {
        phase: "結",
        title: "ナノコネのポジション",
        body: "ナノコネは、**B to C · B to B · in B** のすべてを手がけます。==上流の企画提案から開発まで一貫==し、**セールスエンジニア**が最上段を担います。",
        points: [
          "**3つの提供先**すべてに対応",
          "**企画提案 → 設計 → 開発 → 運用**",
          "次のページで、ナノコネの募集を見る",
        ],
        scene: "it-jobs-nano-targets",
      },
      {
        phase: "結",
        title: "ナノコネの募集",
        body: "ナノコネの採用は、基本的に **企画営業** と **IT エンジニア** です。**デザイナー**の募集も、たまに出ます。",
        points: [
          "**企画営業**：課題を見つけ、体験を提案する",
          "**IT エンジニア**：設計から実装まで開発する",
          "夏インターンも、==この2コース==が中心",
          "コースの選び方と申込は「**インターンについて**」の冊",
        ],
        note: "https://www.nanoconnect.co.jp/recruit-career/engineer/",
        scene: "it-jobs-recruit",
      },
    ],
  },
  {
    id: "work",
    spreads: [
      {
        phase: "起",
        title: "エンジニアの仕事",
        body: "**AI** や **GF** を組み込んだ Web システム・アプリ開発をお任せします。==常駐ではなく、社内開発へのアサイン==です。",
        points: [
          "Web・業務系・アプリ。**PHP + JavaScript** など",
          "他言語からの**スキルチェンジ**も歓迎",
          "**企画から運用まで**、チームで伴走する",
        ],
        note: "https://www.nanoconnect.co.jp/recruit-career/engineer/",
        scene: "work-engineer",
      },
      {
        phase: "承",
        title: "神戸本社",
        body: "旧居留地の象徴的なビル、**23 階ワンフロア**がオフィスです。全面ガラス張りで、==ポートタワーと同じ高さ==から神戸を 360° 見渡せます。",
        points: [
          "勤務地は**神戸本社**、または**自宅テレワーク**",
          "**常駐勤務はなし**",
          "異国情緒あふれる、神戸の中心地",
        ],
        scene: "work-office-outside",
      },
      {
        phase: "承",
        title: "オフィスの中",
        body: "窓際の開発席から、緑のカーペットのフロアまで。==対話しやすいレイアウト==で、**社内開発**を進めます。",
        points: [
          "**デュアルモニター**など、開発に必要な環境",
          "解放感のある、明るいフロア",
          "出社日は、==顔を合わせて相談==しやすい",
        ],
        scene: "work-office-inside",
      },
      {
        phase: "承",
        title: "会議と対話",
        body: "会議室からも神戸の街が見えます。**リモート参加**も前提に、企画・開発・振り返りを進めます。",
        points: [
          "硬い敬語だけ、ではない空気",
          "わからないことは、==その場で聞いてよい==",
          "**オレンジポスト**で、改善案も出せる",
        ],
        scene: "work-meeting",
      },
      {
        phase: "転",
        title: "フレックスの一日",
        body: "**7:00〜11:00** の間で出社時間を選べます。**コアタイムは 11:00〜14:00**。昼休憩のあと **15 分** は、==お昼寝の時間==です。",
        points: [
          "標準労働 **1 日 8 時間**のフレックス",
          "**お昼寝制度**で、午後の集中を取り戻す",
          "日によって出社時間を==変えても OK==",
        ],
        scene: "work-flex-day",
      },
      {
        phase: "転",
        title: "8つの働き方",
        body: "**テレワーク**、**短時間勤務**、**産休育休**、研究開発、自社サービス企画、キャリア支援など。==ライフステージに合わせて選べます==。",
        points: [
          "**テレワーク手当**あり",
          "時短勤務で **PL** と==育児を両立==する社員も",
          "部署ごとに、次世代技術の**研究予算**",
        ],
        scene: "work-styles",
      },
      {
        phase: "結",
        title: "制度と、育つ仕組み",
        body: "**年間休日 125 日**、**私服 OK**、書籍購入、社内バーなど。==数字の全文は採用ページ==で確認してください。",
        points: [
          "社員企画が通れば、==製品化プロジェクト==へ",
          "**半年ごと**のキャリア面談",
          "インターンも、==この文化の入口==",
        ],
        note: "https://www.nanoconnect.co.jp/recruit-career/engineer/",
        scene: "work-growth",
      },
    ],
  },
]

export function contentOf(id: string) {
  return bookContents.find((book) => book.id === id)
}
