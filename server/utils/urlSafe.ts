export function isSafeHttpUrl(href: string) {
  try {
    const url = new URL(href.trim())
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function sanitizePortalLinks(links: { label: string; href: string }[]) {
  return links
    .map((link) => ({
      label: link.label.trim(),
      href: link.href.trim(),
    }))
    .filter((link) => link.label.length > 0 && isSafeHttpUrl(link.href))
}
