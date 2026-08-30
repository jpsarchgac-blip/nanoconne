import { describe, expect, it } from "vitest"
import { getBookAccess, setBookVisible } from "../server/utils/room"

describe("book access", () => {
  it("returns readable only when visible", () => {
    setBookVisible("gf", false)
    expect(getBookAccess("gf")).toMatchObject({ readable: false })
    setBookVisible("gf", true)
    expect(getBookAccess("gf")).toMatchObject({ readable: true })
  })
})
