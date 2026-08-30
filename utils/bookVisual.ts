export type BookVisual = {
  id: string
  title: string
  kicker: string
  line: string
  accent: string
}

export const bookVisuals: BookVisual[] = [
  {
    id: "it",
    title: "IT業界とは？",
    kicker: "地図",
    line: "同じITでも、仕事の場所は分かれる。",
    accent: "#01ACE0",
  },
  {
    id: "it-jobs",
    title: "IT業界での職種",
    kicker: "工程",
    line: "企画から運用まで、誰が何を担うか。",
    accent: "#5088C6",
  },
  {
    id: "nano",
    title: "ナノコネとは？",
    kicker: "会社",
    line: "小さなつながりから、驚きを届ける。",
    accent: "#EE6D7A",
  },
  {
    id: "gf",
    title: "GFとは？",
    kicker: "技術",
    line: "ゲームではなく、価値まで届ける技術。",
    accent: "#6B79E4",
  },
  {
    id: "work",
    title: "労働環境",
    kicker: "一日",
    line: "働く一日が、想像できるように。",
    accent: "#2FBEA6",
  },
  {
    id: "intern",
    title: "インターンについて",
    kicker: "地図",
    line: "コンペの地図を、先に持つ。",
    accent: "#EFB22A",
  },
]

export function visualOf(id: string) {
  return bookVisuals.find((item) => item.id === id)
}
