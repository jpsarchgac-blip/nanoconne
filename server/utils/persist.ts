import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

export function dataPath(...parts: string[]) {
  return join(process.cwd(), ".data", ...parts)
}

export function ensureDataDir() {
  mkdirSync(dataPath(), { recursive: true })
}

export function loadJson<T>(name: string, fallback: T): T {
  const path = dataPath(`${name}.json`)
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return fallback
  }
}

export function saveJson(name: string, data: unknown) {
  ensureDataDir()
  writeFileSync(dataPath(`${name}.json`), JSON.stringify(data, null, 2), "utf8")
}
