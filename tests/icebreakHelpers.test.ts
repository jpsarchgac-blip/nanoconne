import { describe, expect, it } from "vitest"
import {
  ICE_LOBBY_MIN_PLAYERS,
  ICE_SUBMIT_COLLECT_MS,
  ICE_SUBMIT_URGENCY_MS,
  icePhaseLabel,
  iceSessionHeadline,
  phaseTimerTotalMs,
  playerClockLabel,
  shouldAutoSubmitDraw,
  emptyIceView,
} from "../utils/icebreak"

describe("icebreak helpers", () => {
  it("phase labels differ only for idle by context", () => {
    expect(icePhaseLabel("idle", "admin")).toBe("まだ開始していません")
    expect(icePhaseLabel("idle", "screen")).toBe("開始待ち")
    expect(icePhaseLabel("draw", "admin")).toBe(icePhaseLabel("draw", "screen"))
  })

  it("screen headline uses context-specific idle label", () => {
    expect(iceSessionHeadline({ started: false, phase: "idle" }, "screen")).toBe("開始待ち")
    expect(iceSessionHeadline({ started: false, phase: "idle" }, "admin")).toBe(
      "まだ開始していません",
    )
  })

  it("screen draw timer uses max bonus on server timeline", () => {
    const session = {
      ...emptyIceView(),
      started: true,
      phase: "draw" as const,
      writeBaseMs: 45_000,
      writeBonusMaxMs: 10_000,
    }
    expect(phaseTimerTotalMs(session, "screen")).toBe(45_000 + 10_000 + 1_500)
  })

  it("player draw timer switches to collect grace when write locked", () => {
    const session = {
      ...emptyIceView(),
      started: true,
      phase: "draw" as const,
      writeBaseMs: 45_000,
      writeBonusMaxMs: 10_000,
    }
    expect(
      phaseTimerTotalMs(session, "player", { bonusMs: 4_000, writeLocked: false }),
    ).toBe(49_000)
    expect(
      phaseTimerTotalMs(session, "player", { bonusMs: 4_000, writeLocked: true }),
    ).toBe(1_500)
  })

  it("player lobby clock shows remaining players", () => {
    expect(
      playerClockLabel({ phase: "lobby", count: 1, ballots: [] }, 5000, 0),
    ).toBe(`あと ${ICE_LOBBY_MIN_PLAYERS - 1} 人`)
  })

  it("auto submit thresholds", () => {
    expect(shouldAutoSubmitDraw("draw", ICE_SUBMIT_URGENCY_MS, 5000)).toBe(true)
    expect(shouldAutoSubmitDraw("draw", 1000, ICE_SUBMIT_COLLECT_MS)).toBe(true)
    expect(shouldAutoSubmitDraw("vote", 0, 0)).toBe(false)
  })
})
