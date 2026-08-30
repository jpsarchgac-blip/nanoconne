export type NanoProduct = {
  id: string
  name: string
  tag: string
  line: string
  chips: string[]
  image: string
  url: string
  /** 横長スクショ向けの見せ方 */
  imageMode?: "pan-x" | "pan-y" | "zoom" | "static"
}

export const NANO_PRODUCTS: Record<string, NanoProduct> = {
  skywalker: {
    id: "skywalker",
    name: "Skywalker",
    tag: "開発の土台",
    line: "AI×GFで、使い続けたくなるシステムを組み立てる",
    chips: ["企画から運用", "アプリ・基幹", "GF標準搭載"],
    image: "/sozai/pc_mainvisual_skywalker_20260630.png",
    url: "https://www.skywalker-cloud.com/",
    imageMode: "pan-x",
  },
  linka: {
    id: "linka",
    name: "AI LinKa",
    tag: "おもてなしAI",
    line: "手続き・接客・問い合わせを、AIが代わりに対応",
    chips: ["24時間365日", "Web・店舗・サイネージ", "ドラッグで会話設計"],
    image: "/sozai/pc_mainvisual_linka_20260630.png",
    url: "https://ai-linka.com/",
    imageMode: "pan-x",
  },
  mieroom: {
    id: "mieroom",
    name: "みえるーむ",
    tag: "オフィスDX",
    line: "社員・会議室・備品を見える化し、働き方をつなぐ",
    chips: ["ハイブリッド対応", "座席・会議室", "社内AI問い合わせ"],
    image: "/sozai/pc_mainvisual_mieroom_20250221_1.png",
    url: "https://ai-metaroom.com/",
    imageMode: "pan-x",
  },
  jankara: {
    id: "jankara",
    name: "ジャンカラ会員アプリ",
    tag: "導入事例",
    line: "受付なし入室・店舗検索・ポイントまで、会員体験を一枚に",
    chips: ["すぐカラ予約", "160店舗以上", "Skywalker開発"],
    image: "/sozai/pc_mainvisual_jankara.jpg",
    url: "https://www.nanoconnect.co.jp/results/jumbo-karaoke/",
    imageMode: "pan-x",
  },
  automotive: {
    id: "automotive",
    name: "オートモーティブ",
    tag: "車載開発",
    line: "カーナビ・IVI・ECUまで、クルマ社会の開発を支援",
    chips: ["カーナビ/IVI", "ECU組込み", "コネクテッド"],
    image: "/sozai/pc_mainvisual_ecu_20200507.png",
    url: "https://www.nanoconnect.co.jp/products/automotive/",
    imageMode: "pan-x",
  },
}
