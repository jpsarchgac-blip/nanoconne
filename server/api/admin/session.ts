import { adminCsrf, isAdminRequest } from "../../utils/adminAuth"

export default defineEventHandler(async (event) => {
  const ok = isAdminRequest(event)
  return { ok, csrf: ok ? adminCsrf(event) : null }
})
