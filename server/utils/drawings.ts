import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import { dataPath, ensureDataDir } from "./persist"

export function drawingUrl(id: string) {
  return `/api/drawings/${id}`
}

export function saveDrawingFile(id: string, dataUrl: string) {
  const match = dataUrl.match(/^data:image\/(png|jpeg);base64,(.+)$/i)
  if (!match) return false
  const ext = match[1].toLowerCase() === "png" ? "png" : "jpg"
  const body = Buffer.from(match[2], "base64")
  if (body.length > 300_000) return false
  ensureDataDir()
  mkdirSync(dataPath("drawings"), { recursive: true })
  for (const oldExt of ["jpg", "jpeg", "png"]) {
    const oldPath = dataPath("drawings", `${id}.${oldExt}`)
    if (existsSync(oldPath)) unlinkSync(oldPath)
  }
  writeFileSync(dataPath("drawings", `${id}.${ext}`), body)
  return true
}

export function readDrawingFile(id: string) {
  for (const ext of ["jpg", "jpeg", "png"]) {
    const path = dataPath("drawings", `${id}.${ext}`)
    if (!existsSync(path)) continue
    return {
      body: readFileSync(path),
      type: ext === "png" ? "image/png" : "image/jpeg",
    }
  }
  return null
}

export function deleteDrawingFile(id: string) {
  for (const ext of ["jpg", "jpeg", "png"]) {
    const path = dataPath("drawings", `${id}.${ext}`)
    if (existsSync(path)) unlinkSync(path)
  }
}
