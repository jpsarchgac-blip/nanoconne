import {
  ICE_BALLOT_COUNT,
  ICE_DEFAULT_SCORE,
  ICE_LOBBY_MIN_PLAYERS,
  ICE_MAX_IMAGE_BYTES,
  ICE_MAX_NICK_LEN,
  ICE_MAX_PLAYERS,
  ICE_TIMING,
  clampScore,
  type IceMine,
  type IcePhase,
  type IceRating,
  type IceRoomView,
  type IceSpotlight,
  type IceTopic,
} from "../../utils/icebreak"
import { deleteDrawingFile, drawingUrl, saveDrawingFile } from "./drawings"
import { getIceConfig } from "./iceTopics"
import { loadJson, saveJson } from "./persist"

export type Book = {
  id: string
  title: string
  visible: boolean
}

export type Player = {
  id: string
  nick: string
  secret: string
  score: number
  funny: number
  beauty: number
  clear: number
  received: number
}

type Drawing = {
  id: string
  playerId: string
  nick: string
  round: number
  funny: number
  beauty: number
  clear: number
  voters: number
}

type Vote = {
  voterId: string
  drawingId: string
  round: number
  funny: number
  beauty: number
  clear: number
}

export type Room = {
  started: boolean
  startedAt: number | null
  players: Player[]
  phase: IcePhase
  round: number
  topic: IceTopic | null
  phaseEndsAt: number | null
  drawStartedAt: number | null
  drawings: Drawing[]
  assignment: Record<string, string[]>
  votes: Vote[]
}

const defaultBooks: Book[] = [
  { id: "it", title: "IT業界とは？", visible: true },
  { id: "it-jobs", title: "IT業界での職種", visible: true },
  { id: "nano", title: "ナノコネとは？", visible: true },
  { id: "gf", title: "GFとは？", visible: true },
  { id: "work", title: "労働環境", visible: true },
  { id: "intern", title: "インターンについて", visible: true },
]

const books: Book[] = loadJson("books", defaultBooks)

function freshRoom(): Room {
  return {
    started: false,
    startedAt: null,
    players: [],
    phase: "idle",
    round: 0,
    topic: null,
    phaseEndsAt: null,
    drawStartedAt: null,
    drawings: [],
    assignment: {},
    votes: [],
  }
}

const room: Room = loadJson("room", freshRoom())

function persistBooks() {
  saveJson("books", books)
}

function persistRoom() {
  saveJson("room", room)
}

function clearDrawingFiles() {
  for (const drawing of room.drawings) deleteDrawingFile(drawing.id)
}

function resetPlay() {
  clearDrawingFiles()
  room.phase = "lobby"
  room.round = 0
  room.topic = null
  room.phaseEndsAt = null
  room.drawStartedAt = null
  room.drawings = []
  room.assignment = {}
  room.votes = []
}

function blankPlayer(id: string, nick: string): Player {
  return {
    id,
    nick,
    secret: crypto.randomUUID(),
    score: 0,
    funny: 0,
    beauty: 0,
    clear: 0,
    received: 0,
  }
}

function verifyPlayer(playerId: string, secret?: string) {
  const player = room.players.find((item) => item.id === playerId)
  if (!player || !secret || player.secret !== secret) return null
  return player
}

export function roomRevision() {
  // ポーリング差分検知用。ranking() を含むため GET のたびにソートが走る。
  return [
    room.phase,
    room.round,
    room.phaseEndsAt ?? 0,
    room.players.length,
    room.drawings.length,
    room.votes.length,
    ranking()
      .map((row) => `${row.id}:${row.score}`)
      .join(";"),
  ].join(":")
}

export function getBooks() {
  return books
}

export function getBookAccess(id: string) {
  const book = books.find((item) => item.id === id)
  if (!book) return null
  return {
    id: book.id,
    title: book.title,
    visible: book.visible,
    readable: book.visible,
  }
}

export function setBookVisible(id: string, visible: boolean) {
  const book = books.find((item) => item.id === id)
  if (book) book.visible = visible
  persistBooks()
  return books
}

export function getRoom() {
  // GET /api/room でも tickRoom が走る。期限切れフェーズは読み取り中に進む。
  tickRoom()
  return room
}

export function startRoom() {
  clearDrawingFiles()
  room.started = true
  room.startedAt = Date.now()
  room.players = []
  resetPlay()
  room.phaseEndsAt = (room.startedAt ?? Date.now()) + ICE_TIMING.lobbyMs
  persistRoom()
  return room
}

export function joinRoom(
  nick: string,
  reconnect?: { playerId: string; secret: string },
) {
  tickRoom()
  const trimmed = nick.trim().slice(0, ICE_MAX_NICK_LEN)
  if (!trimmed) return { error: "ニックネームを入れてください" as const }
  if (!room.started) return { error: "まだ開始されていません" as const }
  if (room.phase === "results") return { error: "この場は終わっています" as const }
  if (room.players.length >= ICE_MAX_PLAYERS) {
    return { error: `試作は${ICE_MAX_PLAYERS}人までです` as const }
  }

  if (reconnect) {
    const player = verifyPlayer(reconnect.playerId, reconnect.secret)
    if (!player) return { error: "再接続できませんでした" as const }
    if (player.nick !== trimmed) return { error: "ニックネームが一致しません" as const }
    return {
      player: { id: player.id, nick: player.nick, secret: player.secret },
    }
  }

  const existing = room.players.find((player) => player.nick === trimmed)
  if (existing) {
    return { error: "このニックネームは使われています" as const }
  }
  const player = blankPlayer(crypto.randomUUID(), trimmed)
  room.players.push(player)
  persistRoom()
  return {
    player: { id: player.id, nick: player.nick, secret: player.secret },
  }
}

export function skipLobby() {
  tickRoom()
  if (!room.started) return { error: "まだ開始されていません" as const }
  if (room.phase !== "lobby") return { error: "いまはロビーではありません" as const }
  beginPrompt()
  persistRoom()
  return { ok: true as const }
}

export function ranking() {
  return [...room.players].sort((a, b) => b.score - a.score || a.nick.localeCompare(b.nick, "ja"))
}

export function submitDrawing(playerId: string, secret: string, image: string) {
  tickRoom()
  if (room.phase !== "draw") return { error: "いまは書けません" as const }
  const player = verifyPlayer(playerId, secret)
  if (!player) return { error: "場に入っていません" as const }
  if (!image.startsWith("data:image/jpeg") && !image.startsWith("data:image/png")) {
    return { error: "絵を送れませんでした" as const }
  }
  if (image.length > ICE_MAX_IMAGE_BYTES) return { error: "絵が大きすぎます" as const }

  const current = room.drawings.find(
    (item) => item.playerId === playerId && item.round === room.round,
  )
  const drawingId = current?.id ?? crypto.randomUUID()
  if (!saveDrawingFile(drawingId, image)) {
    return { error: "絵を保存できませんでした" as const }
  }
  if (current) {
    persistRoom()
    return { ok: true as const }
  }
  room.drawings.push({
    id: drawingId,
    playerId,
    nick: player.nick,
    round: room.round,
    funny: 0,
    beauty: 0,
    clear: 0,
    voters: 0,
  })
  persistRoom()
  return { ok: true as const }
}

export function voteOn(
  playerId: string,
  secret: string,
  drawingId: string,
  patch: Partial<IceRating>,
) {
  tickRoom()
  if (room.phase !== "vote") return { error: "いまは評価できません" as const }
  if (!verifyPlayer(playerId, secret)) return { error: "場に入っていません" as const }
  const assigned = room.assignment[playerId] ?? []
  if (!assigned.includes(drawingId)) return { error: "届いていません" as const }
  const drawing = room.drawings.find((item) => item.id === drawingId)
  if (!drawing) return { error: "絵が見つかりません" as const }

  let vote = room.votes.find(
    (item) => item.voterId === playerId && item.drawingId === drawingId && item.round === room.round,
  )
  if (!vote) {
    vote = {
      voterId: playerId,
      drawingId,
      round: room.round,
      funny: 0,
      beauty: 0,
      clear: 0,
    }
    room.votes.push(vote)
  }
  if (patch.funny != null) vote.funny = clampScore(patch.funny)
  if (patch.beauty != null) vote.beauty = clampScore(patch.beauty)
  if (patch.clear != null) vote.clear = clampScore(patch.clear)
  retally()
  persistRoom()
  return {
    ok: true as const,
    rating: { funny: vote.funny, beauty: vote.beauty, clear: vote.clear },
  }
}

function avg(sum: number, count: number) {
  if (!count) return 0
  return Math.round((sum / count) * 10) / 10
}

function retally() {
  for (const player of room.players) {
    player.funny = 0
    player.beauty = 0
    player.clear = 0
    player.received = 0
    player.score = 0
  }
  for (const drawing of room.drawings) {
    drawing.funny = 0
    drawing.beauty = 0
    drawing.clear = 0
    drawing.voters = 0
  }
  for (const vote of room.votes) {
    // 3 軸すべて 1〜5 が入った票だけ有効（0 は未入力）
    if (!vote.funny || !vote.beauty || !vote.clear) continue
    const drawing = room.drawings.find((item) => item.id === vote.drawingId)
    const author = drawing && room.players.find((item) => item.id === drawing.playerId)
    if (!drawing || !author) continue
    drawing.funny += vote.funny
    drawing.beauty += vote.beauty
    drawing.clear += vote.clear
    drawing.voters += 1
    author.funny += vote.funny
    author.beauty += vote.beauty
    author.clear += vote.clear
    author.received += 1
  }
  for (const player of room.players) {
    const funny = avg(player.funny, player.received)
    const beauty = avg(player.beauty, player.received)
    const clear = avg(player.clear, player.received)
    player.score = player.received ? Math.round(((funny + beauty + clear) / 3) * 10) / 10 : 0
  }
}

function applyDefaultVotes() {
  // 投票期限後: 未入力の軸は ICE_DEFAULT_SCORE（3 点）を補完
  for (const [voterId, drawingIds] of Object.entries(room.assignment)) {
    for (const drawingId of drawingIds) {
      let vote = room.votes.find(
        (item) => item.voterId === voterId && item.drawingId === drawingId && item.round === room.round,
      )
      if (!vote) {
        vote = {
          voterId,
          drawingId,
          round: room.round,
          funny: ICE_DEFAULT_SCORE,
          beauty: ICE_DEFAULT_SCORE,
          clear: ICE_DEFAULT_SCORE,
        }
        room.votes.push(vote)
        continue
      }
      if (!vote.funny) vote.funny = ICE_DEFAULT_SCORE
      if (!vote.beauty) vote.beauty = ICE_DEFAULT_SCORE
      if (!vote.clear) vote.clear = ICE_DEFAULT_SCORE
    }
  }
  retally()
}

function goResults() {
  room.phase = "results"
  room.phaseEndsAt = null
  room.topic = null
  room.assignment = {}
}

function beginPrompt() {
  const { rounds, topics } = getIceConfig()
  if (room.round >= rounds) {
    goResults()
    return
  }
  room.round += 1
  room.topic = topics[(room.round - 1) % topics.length] ?? topics[0] ?? null
  room.phase = "prompt"
  room.phaseEndsAt = Date.now() + ICE_TIMING.promptMs
  room.drawStartedAt = null
  room.assignment = {}
}

function enterDraw() {
  room.phase = "draw"
  room.drawStartedAt = Date.now()
  // 全員の最大ボーナス + 回収猶予で phaseEndsAt を切る。個人ボーナスはクライアント演出のみ。
  room.phaseEndsAt =
    room.drawStartedAt +
    ICE_TIMING.writeBaseMs +
    ICE_TIMING.writeBonusMaxMs +
    ICE_TIMING.collectGraceMs
}

function enterVote() {
  const pool = room.drawings.filter((item) => item.round === room.round)
  if (pool.length < 2) {
    endVote()
    return
  }
  const assignment: Record<string, string[]> = {}
  room.players.forEach((player, index) => {
    const others = pool.filter((item) => item.playerId !== player.id)
    if (!others.length) return
    const count = Math.min(ICE_BALLOT_COUNT, others.length)
    const picks: string[] = []
    for (let step = 0; step < count; step += 1) {
      const pick = others[(index + step) % others.length]
      if (pick && !picks.includes(pick.id)) picks.push(pick.id)
    }
    assignment[player.id] = picks
  })
  room.assignment = assignment
  room.phase = "vote"
  room.phaseEndsAt = Date.now() + ICE_TIMING.voteMs
}

function endVote() {
  applyDefaultVotes()
  const { rounds } = getIceConfig()
  if (room.round >= rounds) {
    goResults()
    return
  }
  beginPrompt()
}

export function tickRoom() {
  if (!room.started || room.phase === "idle" || room.phase === "results") return
  const now = Date.now()
  const before = roomRevision()

  if (room.phase === "lobby") {
    if (
      room.players.length >= ICE_LOBBY_MIN_PLAYERS &&
      room.startedAt &&
      now >= room.startedAt + ICE_TIMING.lobbyMs
    ) {
      beginPrompt()
    }
    if (roomRevision() !== before) persistRoom()
    return
  }

  if (!room.phaseEndsAt || now < room.phaseEndsAt) return

  if (room.phase === "prompt") enterDraw()
  else if (room.phase === "draw") enterVote()
  else if (room.phase === "vote") endVote()
  if (roomRevision() !== before) persistRoom()
}

function spotlight(): IceSpotlight[] {
  const { rounds } = getIceConfig()
  for (let round = rounds; round >= 1; round -= 1) {
    const spots = room.drawings
      .filter((item) => item.round === round)
      .map((item) => ({
        nick: item.nick,
        image: drawingUrl(item.id),
        votes: item.voters ? avg(item.funny + item.beauty + item.clear, item.voters * 3) : 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3)
    if (spots.length) return spots
  }
  return []
}

function mineFor(playerId: string): IceMine | null {
  const player = room.players.find((item) => item.id === playerId)
  if (!player) return null
  const ranks = ranking()
  const rank = ranks.findIndex((row) => row.id === playerId) + 1
  return {
    funny: avg(player.funny, player.received),
    beauty: avg(player.beauty, player.received),
    clear: avg(player.clear, player.received),
    total: player.score,
    rank: rank || ranks.length,
    received: player.received,
  }
}

export function resetRoomForTests() {
  clearDrawingFiles()
  Object.assign(room, freshRoom())
  saveJson("room", room)
}

/** @internal テスト用 */
export function forcePhaseForTests(phase: IcePhase) {
  room.phase = phase
  if (phase === "draw") {
    room.drawStartedAt = Date.now()
    room.phaseEndsAt = Date.now() + ICE_TIMING.writeBaseMs
  }
}

export function roomView(playerId?: string): IceRoomView {
  // roomView / GET でも tickRoom。期限切れならフェーズ遷移してから view を組み立てる。
  tickRoom()
  const assigned = playerId ? (room.assignment[playerId] ?? []) : []
  const ballots =
    room.phase === "vote"
      ? assigned
          .map((id) => room.drawings.find((item) => item.id === id))
          .filter((item): item is Drawing => Boolean(item))
          .map((item) => ({ drawingId: item.id, image: drawingUrl(item.id) }))
      : []
  const ratings: Record<string, IceRating> = {}
  if (playerId) {
    for (const vote of room.votes) {
      if (vote.voterId !== playerId || vote.round !== room.round) continue
      ratings[vote.drawingId] = {
        funny: vote.funny,
        beauty: vote.beauty,
        clear: vote.clear,
      }
    }
  }
  const submitted = Boolean(
    playerId &&
      room.drawings.some((item) => item.playerId === playerId && item.round === room.round),
  )

  return {
    started: room.started,
    startedAt: room.startedAt,
    phase: room.started ? room.phase : "idle",
    round: room.round,
    totalRounds: getIceConfig().rounds,
    topic: room.topic,
    phaseEndsAt: room.phaseEndsAt,
    drawStartedAt: room.drawStartedAt,
    writeBaseMs: ICE_TIMING.writeBaseMs,
    writeBonusMaxMs: ICE_TIMING.writeBonusMaxMs,
    serverNow: Date.now(),
    revision: roomRevision(),
    count: room.players.length,
    ranking: ranking().map((row) => ({ id: row.id, nick: row.nick, score: row.score })),
    submitted,
    ballots,
    ratings,
    mine: playerId && (room.phase === "results" || room.phase === "vote") ? mineFor(playerId) : null,
    spotlight: room.phase === "results" ? spotlight() : [],
  }
}
