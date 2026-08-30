export type DevLayer = {
  id: string
  phase: string
  roles: string[]
  detail?: string
  tone: string
  text: string
  upstream?: boolean
}

/** 開発工程ピラミッド（上→下） */
export const DEV_PYRAMID_LAYERS: DevLayer[] = [
  {
    id: "consult",
    phase: "コンサル",
    roles: ["ITコンサル", "営業"],
    detail: "課題を整理し、提案につなげる",
    tone: "#7B6AE8",
    text: "#fff",
    upstream: true,
  },
  {
    id: "design",
    phase: "要件定義・設計",
    roles: ["PM", "PL"],
    detail: "何を作るか決め、設計を描く",
    tone: "#5088C6",
    text: "#fff",
    upstream: true,
  },
  {
    id: "build",
    phase: "プログラミング・テスト",
    roles: ["SE", "PG", "テスター"],
    detail: "SE ⊃ PG ⊃ テスター の入れ子",
    tone: "#2FBEA6",
    text: "#fff",
  },
  {
    id: "ops",
    phase: "運用保守",
    roles: ["テクニカルサポート"],
    detail: "稼働後の問い合わせと保守",
    tone: "#E8A838",
    text: "#fff",
  },
]

export const DELIVERY_TARGETS = [
  {
    id: "b2c",
    label: "B to C",
    line: "一般の人向け",
    example: "アプリ · Webサービス",
    icon: "user",
    tone: "#EE6D7A",
  },
  {
    id: "b2b",
    label: "B to B",
    line: "企業向け",
    example: "業務システム · 受託",
    icon: "building",
    tone: "#5088C6",
  },
  {
    id: "inb",
    label: "in B",
    line: "社内向け",
    example: "社内DX · 基幹",
    icon: "office",
    tone: "#2FBEA6",
  },
] as const

export type DeliveryTarget = (typeof DELIVERY_TARGETS)[number]
