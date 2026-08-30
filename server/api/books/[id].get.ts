import { getBookAccess } from "../../utils/room"

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id required" })
  }
  const access = getBookAccess(id)
  if (!access) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }
  return access
})
