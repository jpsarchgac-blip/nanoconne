import type { H3Event } from "h3"
import { randomUUID, timingSafeEqual } from "node:crypto"

const COOKIE = "peratto-admin"
const CSRF_HEADER = "x-csrf-token"

type AdminSession = {
  csrf: string
  expires: number
}

const sessions = new Map<string, AdminSession>()

function adminCredentials(event: H3Event) {
  const config = useRuntimeConfig(event)
  return {
    user: String(config.adminUser || "admin"),
    pass: String(config.adminPass || ""),
  }
}

function isProduction(event: H3Event) {
  return process.env.NODE_ENV === "production"
}

function cookieOptions(event: H3Event) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProduction(event),
    path: "/",
    maxAge: 60 * 60 * 12,
  }
}

function purgeExpiredSessions() {
  const now = Date.now()
  for (const [token, session] of sessions) {
    if (session.expires <= now) sessions.delete(token)
  }
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function isAdminRequest(event: H3Event) {
  purgeExpiredSessions()
  const token = getCookie(event, COOKIE)
  if (!token) return false
  const session = sessions.get(token)
  return Boolean(session && session.expires > Date.now())
}

export function adminCsrf(event: H3Event) {
  purgeExpiredSessions()
  const token = getCookie(event, COOKIE)
  if (!token) return null
  const session = sessions.get(token)
  if (!session || session.expires <= Date.now()) return null
  return session.csrf
}

export function requireAdmin(event: H3Event) {
  purgeExpiredSessions()
  const token = getCookie(event, COOKIE)
  const session = token ? sessions.get(token) : undefined
  if (!session || session.expires <= Date.now()) {
    throw createError({ statusCode: 401, statusMessage: "管理者として入ってください" })
  }
  const csrf = getRequestHeader(event, CSRF_HEADER)
  if (!csrf || !safeEqual(csrf, session.csrf)) {
    throw createError({ statusCode: 403, statusMessage: "操作を確認できませんでした" })
  }
}

export function loginAdmin(event: H3Event, user: string, password: string) {
  const { user: adminUser, pass: adminPass } = adminCredentials(event)
  if (!adminPass) {
    return { ok: false as const, error: "管理者パスワードが設定されていません" }
  }
  if (user.trim() !== adminUser || password !== adminPass) {
    return { ok: false as const, error: "管理者名かパスワードが違います" }
  }

  purgeExpiredSessions()
  const token = randomUUID()
  const csrf = randomUUID()
  sessions.set(token, { csrf, expires: Date.now() + 60 * 60 * 12 * 1000 })
  setCookie(event, COOKIE, token, cookieOptions(event))
  return { ok: true as const, csrf }
}

export function logoutAdmin(event: H3Event) {
  const token = getCookie(event, COOKIE)
  if (token) sessions.delete(token)
  deleteCookie(event, COOKIE, { path: "/" })
}

/** @internal テスト用 */
export function resetAdminSessionsForTests() {
  sessions.clear()
}
