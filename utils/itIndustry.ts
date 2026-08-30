export const IT_RECRUIT_ROLES = [
  { name: "企画営業", line: "基本の募集", tag: "main" },
  { name: "ITエンジニア", line: "基本の募集", tag: "main" },
  { name: "デザイナー", line: "たまに募集", tag: "opt" },
]

export const IT_INDUSTRY_TYPES = [
  {
    id: "software",
    name: "ソフトウェア",
    short: "ソフト",
    hint: "自社パッケージを作る",
    examples: "Microsoft · サイボウズ",
    nano: true,
    tone: "#7B6AE8",
  },
  {
    id: "sier",
    name: "SIer",
    short: "SIer",
    hint: "大きな仕組みを受注して組み立てる",
    examples: "NTTデータ · 富士通",
    nano: true,
    tone: "#5088C6",
  },
  {
    id: "net",
    name: "ネットビジネス",
    short: "ネット",
    hint: "Web サービスで事業を作る",
    examples: "Google · メルカリ",
    nano: true,
    tone: "#2FBEA6",
  },
  {
    id: "hardware",
    name: "ハードメーカー",
    short: "ハード",
    hint: "機器そのものを作る",
    examples: "トヨタ · ソニー",
    nano: false,
    tone: "#888",
  },
]

/** 4円ベン図の円配置（viewBox 260×248） */
export const IT_VENN_CIRCLE_LAYOUT = [
  { id: "software", cx: 82, cy: 82, titleY: 48, subY: 62 },
  { id: "hardware", cx: 178, cy: 82, titleY: 48, subY: 62 },
  { id: "sier", cx: 82, cy: 160, titleY: 174, subY: 188 },
  { id: "net", cx: 178, cy: 160, titleY: 174, subY: 188 },
] as const

export const IT_VENN_RADIUS = 56

export const IT_VENN_OVERLAPS = [
  { id: "sh", label: "ソフト×ハード", line: "組込OS", x: 130, y: 78 },
  { id: "ss", label: "ソフト×SIer", line: "パッケージ", x: 72, y: 118 },
  { id: "hn", label: "ハード×ネット", line: "IoT", x: 188, y: 118 },
  { id: "sn", label: "SIer×ネット", line: "Web構築", x: 130, y: 168 },
]

/** ナノコネが位置する3領域（業界分類） */
export const IT_NANO_VENN_IDS = ["software", "sier", "net"] as const

/** ナノコネが位置する3領域（技術領域） */
export const IT_NANO_DOMAIN_IDS = ["web", "ctrl", "app"] as const

export const IT_TECH_DOMAINS = [
  { id: "web", name: "WEB系", line: "制作 / システム開発", hint: "制作とシステム開発は別物", examples: "EC · ポータル · LP", nano: true, tone: "#5088C6" },
  { id: "ctrl", name: "制御系", line: "組み込みなど", hint: "車載 · IoT · ECU", examples: "車載 · IoT · ECU", nano: true, tone: "#2FBEA6" },
  { id: "app", name: "アプリ系", line: "スマホアプリ", hint: "会員アプリ · SaaS", examples: "会員アプリ · SaaS", nano: true, tone: "#7B6AE8" },
  { id: "biz", name: "業務系", line: "汎用系", hint: "会計 · 人事 · ERP", examples: "会計 · 人事 · ERP", nano: false, tone: "#888" },
]

export const IT_DOMAIN_OVERLAP = {
  label: "またがる例",
  name: "ゲーム",
  line: "制御 × WEB × アプリ",
  domainIds: ["ctrl", "web", "app"],
}

/** 下請け：金額・期限が次次に渡るイメージ（%は受け取る割合の目安） */
export const IT_SUBCONTRACT_CHAIN = [
  { tier: "クライアント", short: "CL", role: "発注", place: "最終利用者 · 大企業など", money: 100, deadline: "52w", weeks: 52, nano: false },
  { tier: "1次請け", short: "1次", role: "全体調整", place: "東京に多い", money: 82, deadline: "24w", weeks: 24, nano: true },
  { tier: "2次請け", short: "2次", role: "分割受注", place: "他地域に多い", money: 68, deadline: "16w", weeks: 16, nano: false },
  { tier: "3次請け", short: "3次", role: "再委託", place: "他地域に多い", money: 54, deadline: "10w", weeks: 10, nano: false },
  { tier: "4次請け", short: "4次", role: "常駐寄り", place: "現場に近い", money: 42, deadline: "6w", weeks: 6, nano: false },
  { tier: "5次+", short: "5次", role: "現場実装", place: "単価↓ · 常駐が増える", money: 32, deadline: "3w", weeks: 3, nano: false },
] as const

export const IT_SUBCONTRACT_NOTES = [
  "1次がクライアントから金額・期限（week）を受け取る",
  "2・3・4・5次…と渡すたびにマージンと期間が減る",
  "オフショア / ニアショアも同じ構造",
]

/** @deprecated */
export const IT_SUBCONTRACT_FLOW = IT_SUBCONTRACT_CHAIN.slice(0, 4).map((item, i) => ({
  tier: item.tier,
  note: item.role,
  detail: i === 0 ? "最終利用者・大企業など" : `単価${item.money}%目安 · ${item.deadline}`,
  nano: item.nano,
}))

/** @deprecated */
export const IT_SUBCONTRACT_TIERS = IT_SUBCONTRACT_CHAIN.slice(1).map((item) => ({
  tier: item.tier.replace("次請け", "").replace("+", "+"),
  note: item.role,
  pay: `${item.money}%`,
}))

export const IT_WORK_MIX = {
  industry: [
    { label: "自社開発・研究", ratio: 5, risk: "新規は成功率低", color: "#7B6AE8" },
    { label: "受託開発", ratio: 10, risk: "リスク高", color: "#2FBEA6" },
    { label: "常駐開発", ratio: 85, risk: "利益中・ローリスク", color: "#E8A838" },
  ],
  nano: [
    { label: "研究", ratio: 10, color: "#7B6AE8" },
    { label: "受託開発", ratio: 40, color: "#2FBEA6" },
    { label: "常駐開発", ratio: 50, color: "#E8A838" },
  ],
}

export type NanoCoordinateRow = {
  name: string
  detail: string
  nano: boolean
}

export const IT_NANO_COORDINATES = [
  {
    source: "業界分類",
    rows: [
      { name: "ソフトウェア", detail: "Microsoft · サイボウズ 等", nano: true },
      { name: "SIer", detail: "NTTデータ · 富士通 等", nano: true },
      { name: "ネットビジネス", detail: "Google · メルカリ 等", nano: true },
      { name: "ハードメーカー", detail: "トヨタ · ソニー 等", nano: false },
    ] satisfies NanoCoordinateRow[],
  },
  {
    source: "技術領域",
    rows: [
      { name: "WEB系", detail: "制作 / システム開発", nano: true },
      { name: "制御系", detail: "組み込み · 車載 · IoT", nano: true },
      { name: "アプリ系", detail: "スマホアプリ · SaaS", nano: true },
      { name: "業務系", detail: "会計 · 人事 · ERP", nano: false },
    ] satisfies NanoCoordinateRow[],
  },
  {
    source: "下請け",
    rows: [
      { name: "クライアント", detail: "発注 · 全体像", nano: false },
      { name: "1次請け", detail: "全体調整 · ナノコネはここ", nano: true },
      { name: "2次請け", detail: "分割受注", nano: false },
      { name: "3次請け", detail: "再委託 · 常駐寄り", nano: false },
      { name: "4・5次", detail: "現場実装 · 単価↓", nano: false },
    ] satisfies NanoCoordinateRow[],
  },
] as const
