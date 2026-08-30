import {
  joinRoom,
  roomRevision,
  roomView,
  skipLobby,
  startRoom,
  submitDrawing,
  voteOn,
} from "../utils/room"
import { requireAdmin } from "../utils/adminAuth"

type RoomPatchResponse = {
  unchanged: true
  revision: string
  serverNow: number
}

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    // roomView 内で tickRoom が走る（ポーリング GET がタイマー進行のトリガー）
    const query = getQuery(event)
    const playerId = typeof query.playerId === "string" ? query.playerId : undefined
    const view = roomView(playerId)
    const rev = typeof query.rev === "string" ? query.rev : undefined
    if (rev && rev === view.revision) {
      return {
        unchanged: true,
        revision: view.revision,
        serverNow: Date.now(),
      } satisfies RoomPatchResponse
    }
    return view
  }

  const body = await readBody<{
    action: "start" | "join" | "submit" | "vote" | "skipLobby"
    nick?: string
    playerId?: string
    playerSecret?: string
    image?: string
    drawingId?: string
    funny?: number
    beauty?: number
    clear?: number
  }>(event)

  if (body?.action === "start") {
    requireAdmin(event)
    startRoom()
    return roomView()
  }
  if (body?.action === "skipLobby") {
    requireAdmin(event)
    const result = skipLobby()
    if ("error" in result) return result
    return roomView()
  }
  if (body?.action === "join") {
    const reconnect =
      body.playerId && body.playerSecret
        ? { playerId: body.playerId, secret: body.playerSecret }
        : undefined
    const result = joinRoom(body.nick ?? "", reconnect)
    if ("error" in result) return result
    return { ...result, view: roomView(result.player.id) }
  }
  if (body?.action === "submit" && body.playerId && body.playerSecret && body.image) {
    const result = submitDrawing(body.playerId, body.playerSecret, body.image)
    if ("error" in result) return result
    return { ...result, view: roomView(body.playerId) }
  }
  if (
    body?.action === "vote" &&
    body.playerId &&
    body.playerSecret &&
    body.drawingId
  ) {
    const result = voteOn(body.playerId, body.playerSecret, body.drawingId, {
      funny: body.funny,
      beauty: body.beauty,
      clear: body.clear,
    })
    if ("error" in result) return result
    return { ...result, view: roomView(body.playerId) }
  }

  throw createError({ statusCode: 400, statusMessage: "不明な操作です" })
})
