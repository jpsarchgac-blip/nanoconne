export type GfMotion =
  | "pain"
  | "level"
  | "goal"
  | "visualize"
  | "interface"
  | "desire"
  | "first-catch"
  | "talk"
  | "reward"
  | "direction"
  | "avg-user"
  | "tune"

export type GfGroup = "集中" | "楽しむ" | "ユーザ"

export type GfElement = {
  id: number
  name: string
  hint: string
  example: string
  motion: GfMotion
  group: GfGroup
}

/**
 * ナノコネ 12要素。
 * 出典：デブサミ2019関西（仲功児）CodeZine レポート。
 * コンセントレーション5 + エンターテイン5 + ユーザ像2。
 * 公式事例ページの名称は「ディレクション」（登壇では「ディレクション＆エフェクト」）。
 */
export const GF_ELEMENTS: GfElement[] = [
  {
    id: 1,
    name: "ペイン排除",
    hint: "中身と関係ないストレスを、先になくす",
    example: "重い・わかりにくい・戻れない、を残さない",
    motion: "pain",
    group: "集中",
  },
  {
    id: 2,
    name: "レベルデザイン",
    hint: "易しさと難しさの起伏で、熱中させる",
    example: "Biz-Ex：難易度のコントラスト",
    motion: "level",
    group: "集中",
  },
  {
    id: 3,
    name: "ゴール設定",
    hint: "いま、どこへ向かえばいいかが見える",
    example: "WheeLog!：投稿で称号が段階的に付く",
    motion: "goal",
    group: "集中",
  },
  {
    id: 4,
    name: "可視化",
    hint: "進み具合が、数字や形で目に入る",
    example: "WheeLog!：今日の走行距離が見える",
    motion: "visualize",
    group: "集中",
  },
  {
    id: 5,
    name: "インターフェース",
    hint: "触った反応が、すぐ返ってくる",
    example: "情報銀行：話すように入力できる",
    motion: "interface",
    group: "集中",
  },
  {
    id: 6,
    name: "デザイアー",
    hint: "もっと知りたい、やってみたい、を引き出す",
    example: "情報銀行：MYタウンが育って、続きが気になる",
    motion: "desire",
    group: "楽しむ",
  },
  {
    id: 7,
    name: "ファーストキャッチ",
    hint: "最初の一瞬で、「これは自分向けだ」と伝える",
    example: "ルビット：使い始めるときに価値を見せる",
    motion: "first-catch",
    group: "楽しむ",
  },
  {
    id: 8,
    name: "コミュニケーション",
    hint: "一人で終わらせず、人とつながる",
    example: "WheeLog!：スポットにつぶやきを乗せる",
    motion: "talk",
    group: "楽しむ",
  },
  {
    id: 9,
    name: "リワード",
    hint: "手間のあとに、釣り合う返しがある",
    example: "情報銀行：入力に見合う便益",
    motion: "reward",
    group: "楽しむ",
  },
  {
    id: 10,
    name: "ディレクション",
    hint: "次に何をすればいいか、気持ちよく導く",
    example: "ルビット：世界観の中で次の行動を示す",
    motion: "direction",
    group: "楽しむ",
  },
  {
    id: 11,
    name: "平均ユーザーレベル",
    hint: "いま来た人の知識に合わせて、置く",
    example: "インターン初日のあなたが、その想定",
    motion: "avg-user",
    group: "ユーザ",
  },
  {
    id: 12,
    name: "チューンナップ",
    hint: "出したあとも、使い方を見て直す",
    example: "運用で、平均に合わせて機能を調整する",
    motion: "tune",
    group: "ユーザ",
  },
]

export const GF_GROUP_ORDER: GfGroup[] = ["集中", "楽しむ", "ユーザ"]

export const GF_SHORT: Record<number, string> = {
  1: "ペイン",
  2: "レベル",
  3: "ゴール",
  4: "可視化",
  5: "操作",
  6: "欲求",
  7: "つかみ",
  8: "交流",
  9: "報酬",
  10: "誘導",
  11: "平均",
  12: "調整",
}

/** この絵本が実際に使っている要素（全部は使わない） */
export const GF_BOOK_USED_IDS = [4, 5, 7, 10, 11, 12] as const

export function gfByGroup(group: GfGroup) {
  return GF_ELEMENTS.filter((el) => el.group === group)
}

export function isGfBookUsed(id: number) {
  return (GF_BOOK_USED_IDS as readonly number[]).includes(id)
}
