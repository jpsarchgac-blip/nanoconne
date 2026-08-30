import { pollIntervalMs, type IcePhase } from "~/utils/icebreak"

/** フェーズに応じた間隔で refresh を繰り返す（screen / icebreak 共通） */
export function useRoomPoll(
  refresh: () => Promise<unknown>,
  getPhase: () => IcePhase,
  onAfterRefresh?: () => void,
) {
  onMounted(() => {
    const tick = async () => {
      await refresh()
      onAfterRefresh?.()
    }

    tick()

    let poll: ReturnType<typeof setInterval> | undefined
    const schedulePoll = () => {
      if (poll) clearInterval(poll)
      poll = setInterval(tick, pollIntervalMs(getPhase()))
    }

    schedulePoll()
    watch(getPhase, schedulePoll)

    onUnmounted(() => {
      if (poll) clearInterval(poll)
    })
  })
}
