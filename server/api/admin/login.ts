import { loginAdmin } from "../../utils/adminAuth"

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "POST only" })
  }
  const body = await readBody<{ user?: string; password?: string }>(event)
  return loginAdmin(event, body.user ?? "", body.password ?? "")
})
