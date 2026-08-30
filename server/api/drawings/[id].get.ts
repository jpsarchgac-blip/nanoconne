import { readDrawingFile } from "../../utils/drawings"

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id")
  if (!id || !/^[a-f0-9-]{36}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" })
  }
  const file = readDrawingFile(id)
  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  }
  setHeader(event, "Content-Type", file.type)
  setHeader(event, "Cache-Control", "public, max-age=3600")
  return file.body
})
