import { emptyIceView, type IceRoomView } from "~/utils/icebreak"

type PlayerSession = {
  id: string
  nick: string
  secret: string
}

type RoomPollResponse =
  | IceRoomView
  | { unchanged: true; revision: string; serverNow: number }

export { pollIntervalMs } from "~/utils/icebreak"

export function useRoom(options?: { player?: Ref<PlayerSession | null> }) {
  const session = useState<IceRoomView>("room-session", () => emptyIceView())
  const lastRevision = useState("room-revision", () => "")
  const { adminFetch } = useAdmin()

  async function refresh() {
    const playerId = options?.player?.value?.id
    const query: Record<string, string> = {}
    if (playerId) query.playerId = playerId
    if (lastRevision.value) query.rev = lastRevision.value

    const result = await $fetch<RoomPollResponse>("/api/room", { query })
    if ("unchanged" in result && result.unchanged) {
      session.value = {
        ...session.value,
        serverNow: result.serverNow,
      }
      return result
    }
    session.value = result
    lastRevision.value = result.revision
    return result
  }

  async function startIcebreak() {
    await adminFetch("/api/room", { method: "POST", body: { action: "start" } })
    lastRevision.value = ""
    await refresh()
  }

  async function skipLobby() {
    await adminFetch("/api/room", { method: "POST", body: { action: "skipLobby" } })
    lastRevision.value = ""
    await refresh()
  }

  async function adminPost<T>(url: string, body: unknown) {
    return adminFetch<T>(url, { method: "POST", body })
  }

  return {
    session,
    lastRevision,
    refresh,
    startIcebreak,
    skipLobby,
    adminPost,
  }
}
