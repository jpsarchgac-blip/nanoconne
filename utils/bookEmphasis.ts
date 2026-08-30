export type EmphasisSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "mark"; value: string }

const EMPHASIS_RE = /(\*\*(.+?)\*\*|==(.+?)==)/g

export function parseEmphasis(text: string): EmphasisSegment[] {
  if (!text) return [{ type: "text", value: "" }]

  const segments: EmphasisSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(EMPHASIS_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) })
    }
    if (match[2]) segments.push({ type: "bold", value: match[2] })
    else if (match[3]) segments.push({ type: "mark", value: match[3] })
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) })
  }

  return segments.length ? segments : [{ type: "text", value: text }]
}
