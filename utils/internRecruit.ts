export const INTERN_RECRUIT_URL = "https://www.nanoconnect.co.jp/recruit/"

export const INTERN_VIDEO_URL = "https://www.youtube.com/watch?v=F7EqOUlwJi4"

export const INTERN_VIDEO_EMBED = "https://www.youtube.com/embed/F7EqOUlwJi4"

export const INTERN_POSTER = "/sozai/IS2028poster.jpg"

export const INTERN_SCHEDULE = [
  { n: "8/18", title: "初日", line: "説明会（現地+Zoom）" },
  { n: "8/19", title: "選択", line: "情報収集・コース選択" },
  { n: "8/20", title: "制作", line: "作業期間（任意参加）" },
  { n: "9/4", title: "発表", line: "発表会（現地+Zoom）" },
]

export const INTERN_COMPETE_STEPS = [
  { n: "01", title: "ニーズ", line: "困りごとを聞く" },
  { n: "02", title: "つくる", line: "成果物を出す" },
  { n: "03", title: "評価", line: "第三者が見る" },
] as const

export const INTERN_FLAGS = [
  { name: "8/18", kind: "must" as const },
  { name: "8/19", kind: "must" as const },
  { name: "作業", kind: "opt" as const },
  { name: "審査", kind: "must" as const },
  { name: "9/4", kind: "must" as const },
]

export const INTERN_COURSES = [
  {
    id: "plan",
    tag: "コース 1",
    name: "企画",
    line: "IT企画営業コース",
    image: "/sozai/roudou/03_kikaku.png",
    points: ["困りごとを言葉にする", "提案まで持っていく"],
  },
  {
    id: "dev",
    tag: "コース 2",
    name: "開発",
    line: "ITエンジニアコース",
    image: "/sozai/roudou/02_kaihatsu.png",
    points: ["動くところまで作る", "直して、また出す"],
  },
] as const
