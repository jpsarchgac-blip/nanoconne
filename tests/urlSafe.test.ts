import { describe, expect, it } from "vitest"
import { isSafeHttpUrl, sanitizePortalLinks } from "../server/utils/urlSafe"

describe("urlSafe", () => {
  it("accepts http(s) only", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true)
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false)
  })

  it("filters unsafe portal links", () => {
    const links = sanitizePortalLinks([
      { label: "OK", href: "https://nanoconnect.co.jp" },
      { label: "Bad", href: "javascript:void(0)" },
      { label: "", href: "https://x.com" },
    ])
    expect(links).toEqual([{ label: "OK", href: "https://nanoconnect.co.jp" }])
  })
})
