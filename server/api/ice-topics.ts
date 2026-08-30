import { getIceConfig, updateIceConfig } from "../utils/iceTopics"
import { requireAdmin } from "../utils/adminAuth"

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    return getIceConfig()
  }

  requireAdmin(event)
  const body = await readBody<{ rounds?: number; topics?: { id?: string; line: string }[] }>(event)
  return updateIceConfig(body ?? {})
})
