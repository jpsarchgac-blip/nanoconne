import { sanitizePortalLinks } from "./urlSafe"
import { loadJson, saveJson } from "./persist"

export type PortalLink = {
  label: string
  href: string
}

export type InternPortal = {
  period: string
  requiredDays: string
  optionalDays: string
  venue: string
  zoom: string
  courses: string
  prizeNote: string
  taskOutline: string
  links: PortalLink[]
}

const defaultPortal: InternPortal = {
  period: "2026年8月18日（火）〜8月31日（月）、最終日 9/4（金）",
  requiredDays: "8/18 初日 · 8/19 コース選択 · 9/4 最終発表",
  optionalDays: "8/20〜31 作業期間（10:00〜16:00）· スキル講座",
  venue: "神戸朝日ビル4F 神戸朝日ホール（本社23F）+ Zoom",
  zoom: "初日・最終日は現地+Zoom。作業期間は Zoom",
  courses: "IT企画営業コース / ITエンジニアコース（8/19 に選択）",
  prizeNote: "入賞者には総額200万円相当の豪華賞品",
  taskOutline: "GF を組み込んだ Web 体験の企画〜制作",
  links: [
    {
      label: "インターンについて（採用ページ）",
      href: "https://www.nanoconnect.co.jp/recruit/",
    },
    {
      label: "昨年のインターン初日（動画）",
      href: "https://www.youtube.com/watch?v=F7EqOUlwJi4",
    },
  ],
}

const portal: InternPortal = loadJson("portal", defaultPortal)

function persistPortal() {
  saveJson("portal", portal)
}

export function getPortal() {
  return portal
}

export function updatePortal(patch: Partial<InternPortal>) {
  Object.assign(portal, patch)
  if (patch.links) portal.links = sanitizePortalLinks(patch.links)
  persistPortal()
  return portal
}
