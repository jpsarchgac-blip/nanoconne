export type IcePhase = "idle" | "lobby" | "prompt" | "draw" | "vote" | "results"

export type IceTopic = {
  id: string
  line: string
}

export type IceAxisId = "funny" | "beauty" | "clear"

export type IceRating = {
  funny: number
  beauty: number
  clear: number
}

export type IceRankingRow = {
  id: string
  nick: string
  score: number
}

export type IceSpotlight = {
  nick: string
  image: string
  votes: number
}

export type IceBallot = {
  drawingId: string
  image: string
}

export type IceMine = {
  funny: number
  beauty: number
  clear: number
  total: number
  rank: number
  received: number
}

export type IceRoomView = {
  started: boolean
  startedAt: number | null
  phase: IcePhase
  round: number
  totalRounds: number
  topic: IceTopic | null
  phaseEndsAt: number | null
  drawStartedAt: number | null
  writeBaseMs: number
  writeBonusMaxMs: number
  serverNow: number
  revision: string
  count: number
  ranking: IceRankingRow[]
  submitted: boolean
  ballots: IceBallot[]
  ratings: Record<string, IceRating>
  mine: IceMine | null
  spotlight: IceSpotlight[]
}

export const ICE_AXES: { id: IceAxisId; label: string }[] = [
  { id: "funny", label: "おもしろさ" },
  { id: "beauty", label: "きれいさ" },
  { id: "clear", label: "わかりやすさ" },
]

export const ICE_SCORE_MAX = 5
export const ICE_DEFAULT_SCORE = 3
export const ICE_BALLOT_COUNT = 3

/** 試作の参加者上限（README / 設計書と一致） */
export const ICE_MAX_PLAYERS = 20
export const ICE_MAX_NICK_LEN = 12
export const ICE_MAX_IMAGE_BYTES = 400_000
/** ロビー自動開始に必要な人数 */
export const ICE_LOBBY_MIN_PLAYERS = 2

/** 書く時間残りがこの ms 以下で自動 submit（icebreak.vue） */
export const ICE_SUBMIT_URGENCY_MS = 500
/** 回収フェーズでこの ms 以下で自動 submit */
export const ICE_SUBMIT_COLLECT_MS = 1200

export const ICE_CLOCK_TICK_MS = 200
export const ICE_ADMIN_POLL_MS = 2000

export const ICE_TOPICS: IceTopic[] = [
  { id: "nanosuke", line: "ナノ助が初日に言いそうな一言" },
  { id: "gf-tool", line: "GFを、食べ物か道具でひとつ" },
  { id: "course", line: "2日目、企画側の自分 / 開発側の自分" },
  { id: "view23", line: "23階の窓から見えるもの" },
  { id: "inhouse", line: "「常駐じゃない開発」を一枚" },
  { id: "book", line: "ペラっと本棚の、好きな1冊" },
  { id: "morning", line: "インターン初日の朝、目の前にあるもの" },
  { id: "skywalker", line: "Skywalker を、1枚で表す" },
  { id: "kobe", line: "神戸の旧居留地で見たもの" },
  { id: "remote", line: "テレワークの、自分の机" },
  { id: "final", line: "最終発表の、30秒前" },
  { id: "visualize", line: "GFの「可視化」を、絵にする" },
  { id: "plan-dev", line: "企画と開発の、ちょうど真ん中" },
  { id: "nick", line: "今日のニックネームの由来" },
]

export const ICE_TIMING = {
  lobbyMs: 12_000,
  promptMs: 4_000,
  writeBaseMs: 45_000,
  writeBonusMaxMs: 10_000,
  collectGraceMs: 1_500,
  voteMs: 48_000,
  rounds: 2,
}

/** 読書リワード Lv 0〜5 → 追加 milliseconds（Lv あたり +2 秒） */
export function writeBonusMs(level: number) {
  const clamped = Math.max(0, Math.min(5, Math.floor(Number(level) || 0)))
  return clamped * 2_000
}

export type IcePhaseLabelContext = "admin" | "screen"

const ICE_PHASE_LABELS: Record<Exclude<IcePhase, "idle">, string> = {
  lobby: "ニックネーム待ち",
  prompt: "お題",
  draw: "書いています",
  vote: "評価中",
  results: "トップ3",
}

/** 管理・投影で共有するフェーズ表示名。idle だけ文脈で異なる。 */
export function icePhaseLabel(phase: IcePhase, context: IcePhaseLabelContext = "screen"): string {
  if (phase === "idle") {
    return context === "admin" ? "まだ開始していません" : "開始待ち"
  }
  return ICE_PHASE_LABELS[phase]
}

/** 管理・投影画面の見出し（未開始時も含む） */
export function iceSessionHeadline(
  session: Pick<IceRoomView, "started" | "phase">,
  context: IcePhaseLabelContext,
): string {
  if (!session.started) return icePhaseLabel("idle", context)
  return icePhaseLabel(session.phase, context)
}

export type IceTimerMode = "screen" | "player"

/** ポーリング GET のたびに serverNow が返る。クライアント時計との差を補正する。 */
export function estimateNow(serverNow: number, syncedAt: number, clientNow: number): number {
  return serverNow + (clientNow - syncedAt)
}

export function phaseRemainingMs(phaseEndsAt: number | null, estimatedNow: number): number {
  if (!phaseEndsAt) return 0
  return phaseEndsAt - estimatedNow
}

/**
 * 参加者個人の「書く時間」終了時刻。
 * サーバー phaseEndsAt は writeBonusMaxMs 込み（全員最大待ち）。個人ボーナスはクライアント演出。
 */
export function writePhaseEndsAt(
  drawStartedAt: number | null,
  writeBaseMs: number,
  bonusMs: number,
): number | null {
  if (!drawStartedAt) return null
  return drawStartedAt + writeBaseMs + bonusMs
}

export function writeRemainingMs(
  drawStartedAt: number | null,
  writeBaseMs: number,
  bonusMs: number,
  estimatedNow: number,
): number {
  const endsAt = writePhaseEndsAt(drawStartedAt, writeBaseMs, bonusMs)
  if (!endsAt) return 0
  return endsAt - estimatedNow
}

/** 個人の書く時間が終わったら true（以降は回収フェーズ表示） */
export function isWriteLocked(phase: IcePhase, writeRemainingMs: number): boolean {
  return phase !== "draw" || writeRemainingMs <= 0
}

/**
 * リングタイマーの total（分母）。
 * - screen: サーバー phaseEndsAt ベース（全員最大ボーナス + 回収）
 * - player: 書く間は個人ボーナス、回収中は collectGraceMs
 */
export function phaseTimerTotalMs(
  session: Pick<IceRoomView, "started" | "phase" | "writeBaseMs" | "writeBonusMaxMs">,
  mode: IceTimerMode,
  opts?: { bonusMs?: number; writeLocked?: boolean },
): number {
  if (!session.started) return 0
  const { phase } = session
  if (phase === "lobby") return ICE_TIMING.lobbyMs
  if (phase === "prompt") return ICE_TIMING.promptMs
  if (phase === "vote") return ICE_TIMING.voteMs
  if (phase === "draw") {
    if (mode === "screen") {
      return session.writeBaseMs + session.writeBonusMaxMs + ICE_TIMING.collectGraceMs
    }
    const bonusMs = opts?.bonusMs ?? 0
    if (!opts?.writeLocked) return session.writeBaseMs + bonusMs
    return ICE_TIMING.collectGraceMs
  }
  return 0
}

export function phaseTimerLeftMs(
  session: Pick<IceRoomView, "phase" | "phaseEndsAt" | "drawStartedAt" | "writeBaseMs">,
  mode: IceTimerMode,
  estimatedNow: number,
  opts?: { bonusMs?: number; writeLocked?: boolean },
): number {
  if (session.phase === "draw" && mode === "player" && !opts?.writeLocked) {
    return writeRemainingMs(
      session.drawStartedAt,
      session.writeBaseMs,
      opts?.bonusMs ?? 0,
      estimatedNow,
    )
  }
  return phaseRemainingMs(session.phaseEndsAt, estimatedNow)
}

export function phaseTimerCaption(phase: IcePhase, opts?: { writeLocked?: boolean }): string {
  if (phase === "draw") return opts?.writeLocked ? "回収" : "書く"
  if (phase === "vote") return "評価"
  if (phase === "prompt") return "お題"
  return ""
}

export function formatIceSec(ms: number): string {
  return `${Math.max(0, Math.ceil(ms / 1000))}秒`
}

/** 参加者画面の時計テキスト（人数・枚数など UI 固有） */
export function playerClockLabel(
  session: Pick<IceRoomView, "phase" | "count" | "ballots">,
  phaseLeftMs: number,
  writeLeftMs: number,
): string {
  if (session.phase === "lobby") {
    if (session.count < ICE_LOBBY_MIN_PLAYERS) {
      return `あと ${Math.max(0, ICE_LOBBY_MIN_PLAYERS - session.count)} 人`
    }
    return `まもなく ${formatIceSec(phaseLeftMs)}`
  }
  if (session.phase === "prompt") return `お題 ${formatIceSec(phaseLeftMs)}`
  if (session.phase === "draw") {
    if (writeLeftMs > 0) return `書く ${formatIceSec(writeLeftMs)}`
    return `回収 ${formatIceSec(phaseLeftMs)}`
  }
  if (session.phase === "vote") {
    return `評価 ${formatIceSec(phaseLeftMs)} · ${session.ballots.length}枚`
  }
  return ""
}

/** フェーズごとのルーム GET 間隔（ms） */
export function pollIntervalMs(phase: IcePhase): number {
  if (phase === "vote") return 1200
  if (phase === "draw") return 900
  if (phase === "prompt") return 1000
  if (phase === "lobby") return 2000
  return 2500
}

/** 書く時間終了間近で自動 submit すべきか */
export function shouldAutoSubmitDraw(
  phase: IcePhase,
  writeLeftMs: number,
  phaseLeftMs: number,
): boolean {
  if (phase !== "draw") return false
  return writeLeftMs <= ICE_SUBMIT_URGENCY_MS || phaseLeftMs <= ICE_SUBMIT_COLLECT_MS
}

export function clampScore(value: number) {
  const n = Math.round(Number(value) || 0)
  if (n < 1 || n > ICE_SCORE_MAX) return 0
  return n
}

export function emptyRating(): IceRating {
  return { funny: 0, beauty: 0, clear: 0 }
}

export function emptyIceView(): IceRoomView {
  return {
    started: false,
    startedAt: null,
    phase: "idle",
    round: 0,
    totalRounds: ICE_TIMING.rounds,
    topic: null,
    phaseEndsAt: null,
    drawStartedAt: null,
    writeBaseMs: ICE_TIMING.writeBaseMs,
    writeBonusMaxMs: ICE_TIMING.writeBonusMaxMs,
    serverNow: Date.now(),
    revision: "idle",
    count: 0,
    ranking: [],
    submitted: false,
    ballots: [],
    ratings: {},
    mine: null,
    spotlight: [],
  }
}
