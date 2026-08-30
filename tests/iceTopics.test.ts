import { describe, expect, it, beforeEach } from "vitest"
import { resetIceConfigForTests, updateIceConfig, getIceConfig } from "../server/utils/iceTopics"
import { ICE_TOPICS } from "../utils/icebreak"

describe("iceTopics", () => {
  beforeEach(() => {
    resetIceConfigForTests()
  })

  it("clamps rounds to 1-8", () => {
    updateIceConfig({ rounds: 0 })
    expect(getIceConfig().rounds).toBe(1)
    updateIceConfig({ rounds: 99 })
    expect(getIceConfig().rounds).toBe(8)
  })

  it("falls back when all topics are empty", () => {
    updateIceConfig({ topics: [{ line: "  " }] })
    expect(getIceConfig().topics.length).toBe(3)
    expect(getIceConfig().topics[0]?.line).toBe(ICE_TOPICS[0]?.line)
  })
})
