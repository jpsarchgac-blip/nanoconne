import { logoutAdmin } from "../../utils/adminAuth"

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "POST only" })
  }
  logoutAdmin(event)
  return { ok: true }
})
