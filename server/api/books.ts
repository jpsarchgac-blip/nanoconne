import { getBooks, setBookVisible } from "../utils/room"
import { requireAdmin } from "../utils/adminAuth"

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    return getBooks()
  }
  if (event.method === "POST") {
    requireAdmin(event)
    const body = await readBody<{ id: string; visible: boolean }>(event)
    return setBookVisible(body.id, body.visible)
  }
})
