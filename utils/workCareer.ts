export const RECRUIT_ENGINEER_URL =
  "https://www.nanoconnect.co.jp/recruit-career/engineer/"

export type OfficeSlide = {
  image: string
  label: string
  caption: string
}

export type WorkStyleItem = {
  name: string
  line: string
  image: string
}

export type RecruitRequirement = {
  label: string
  value: string
}

export const OFFICE_OUTSIDE: OfficeSlide[] = [
  {
    image: "/sozai/office/01_corporation_exterior.jpg",
    label: "外観",
    caption: "旧居留地の高層ビル。23階ワンフロア",
  },
  {
    image: "/sozai/office/02_kyukyoryuchi.jpg",
    label: "旧居留地",
    caption: "神戸の中心地、38番館",
  },
  {
    image: "/sozai/office/03_Kobe-skyline.jpg",
    label: "神戸",
    caption: "ポートタワーと同じ高さの眺望",
  },
]

export const OFFICE_INSIDE: OfficeSlide[] = [
  {
    image: "/sozai/office/01_office_windowseat.jpg",
    label: "窓際",
    caption: "全面ガラス。360°で神戸を見渡す",
  },
  {
    image: "/sozai/office/02_office_kaihatu.jpg",
    label: "開発席",
    caption: "デュアルモニターと開放的なフロア",
  },
  {
    image: "/sozai/office/03_office_kaihatsu.jpg",
    label: "開発フロア",
    caption: "チームで並んで作る、社内開発",
  },
]

export const ENGINEER_CHIPS = [
  "AI×GF開発",
  "社内開発",
  "常駐なし",
  "PHP+JS",
  "テレワーク",
  "フレックス",
]

export const FLEX_DAY = [
  { time: "7:00〜", line: "出社時間は選べる" },
  { time: "11:00", line: "コアタイム開始" },
  { time: "13:00", line: "昼休憩のあと" },
  { time: "+15分", line: "お昼寝で生産性UP" },
  { time: "14:00", line: "コアタイム終了" },
]

export const WORK_STYLES: WorkStyleItem[] = [
  { name: "テレワーク", line: "神戸本社か自宅。手当あり", image: "/sozai/roudou/04_telework.png" },
  { name: "フレックス", line: "7:00〜11:00に出社", image: "/sozai/roudou/05_flextime.png" },
  { name: "お昼寝", line: "毎日15分。消灯まで", image: "/sozai/roudou/01_sleep.png" },
  { name: "短時間勤務", line: "4時間・6時間を選択可", image: "/sozai/roudou/06_shorttime.png" },
  { name: "産休育休", line: "女性100%、男性36%", image: "/sozai/roudou/07_sankyu.png" },
  { name: "研究開発", line: "部署ごとに次世代技術", image: "/sozai/roudou/02_kaihatsu.png" },
  { name: "自社企画", line: "社員の夢を製品化", image: "/sozai/roudou/03_kikaku.png" },
  { name: "キャリア支援", line: "半年ごとに面談", image: "/sozai/roudou/08_career.png" },
]

export const WORK_BENEFITS = [
  "年休125日",
  "私服OK",
  "書籍購入",
  "社内バー",
  "家族手当",
  "資格奨励",
  "eラーニング",
  "表彰制度",
]

export const WORK_CULTURE = [
  "質問していい",
  "失敗を隠さない",
  "オレンジポスト",
]

export const WORK_RECRUIT_REQUIREMENTS: RecruitRequirement[] = [
  {
    label: "応募資格",
    value: "高卒以上。開発実務3年以上。PHP・JavaScript 等。ブランク・スキルチェンジ歓迎",
  },
  {
    label: "勤務地",
    value: "神戸本社、または自宅テレワーク（常駐なし）",
  },
  {
    label: "勤務時間",
    value: "フレックス（8h/日）。出社 7:00〜11:00、コア 11:00〜14:00",
  },
  {
    label: "給与",
    value: "457万〜800万円。昇給年2回、賞与年2回",
  },
  {
    label: "休日休暇",
    value: "年間125日。完全週休2日。有給初年度10日",
  },
  {
    label: "選考",
    value: "書類 → 人事面接 → 社長面接 → 内定",
  },
]

/** 7ページ目右パネル用（要点のみ） */
export const WORK_GROWTH_HIGHLIGHTS = [
  { label: "勤務", value: "神戸本社 / テレワーク" },
  { label: "時間", value: "フレックス 8h/日" },
  { label: "給与", value: "457万〜800万円" },
] as const

export const OFFICE_PREVIEW = OFFICE_INSIDE[0]
