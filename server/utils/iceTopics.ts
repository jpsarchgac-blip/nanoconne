import { ICE_TIMING, ICE_TOPICS, type IceTopic } from "../../utils/icebreak"
import { loadJson, saveJson } from "./persist"

export type IceConfig = {
  rounds: number
  topics: IceTopic[]
}

const defaultConfig: IceConfig = {
  rounds: ICE_TIMING.rounds,
  topics: ICE_TOPICS.map((topic) => ({ ...topic })),
}

const config: IceConfig = loadJson("ice-topics", defaultConfig)

function slug(line: string) {
  return line
    .trim()
    .slice(0, 24)
    .replace(/\s+/g, "-")
    .replace(/[^\w\u3040-\u30ff\u4e00-\u9faf-]/g, "")
    .slice(0, 16) || "topic"
}

function persistConfig() {
  saveJson("ice-topics", config)
}

export function getIceConfig(): IceConfig {
  return {
    rounds: config.rounds,
    topics: config.topics.map((topic) => ({ ...topic })),
  }
}

export function updateIceConfig(patch: Partial<IceConfig>) {
  if (typeof patch.rounds === "number") {
    config.rounds = Math.max(1, Math.min(8, Math.floor(patch.rounds)))
  }
  if (patch.topics) {
    config.topics = patch.topics
      .map((topic, index) => ({
        id: topic.id?.trim() || `${slug(topic.line)}-${index}`,
        line: topic.line.trim(),
      }))
      .filter((topic) => topic.line.length > 0)
  }
  if (!config.topics.length) {
    config.topics = ICE_TOPICS.slice(0, 3).map((topic) => ({ ...topic }))
  }
  persistConfig()
  return getIceConfig()
}

/** @internal テスト用 */
export function resetIceConfigForTests() {
  config.rounds = defaultConfig.rounds
  config.topics = defaultConfig.topics.map((topic) => ({ ...topic }))
  persistConfig()
}
