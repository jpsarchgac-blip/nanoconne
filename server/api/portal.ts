import { getPortal, updatePortal } from "../utils/portal"
import { requireAdmin } from "../utils/adminAuth"

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    return getPortal()
  }

  requireAdmin(event)
  const body = await readBody<Partial<ReturnType<typeof getPortal>>>(event)
  return updatePortal(body ?? {})
})
