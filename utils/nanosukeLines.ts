export const nanosukeLines = [
  "今日は、なんとなく晴れなの！",
  "ペラっと、めくると軽いなの！",
  "GFは、ゲームじゃないなの！",
  "神戸の風、気持ちいいなの！",
  "インターン、文系でもOKなの！",
  "右から左に、本が流れるなの！",
  "ナノコネは、青が似合うなの！",
  "コーヒー、もう一杯いけるなの！",
  "初日は、ちょっとドキドキなの！",
  "Zoomも、現地も、同じ場なの！",
  "Skywalker、かっこいい名前なの！",
  "何気ない話、好きなの！",
  "29卒、よろしくなの！",
  "本棚、今日もにぎやかなの！",
  "タップより、めくる方が好きなの！",
]

export function pickNanosukeLine(exclude?: string) {
  const pool = exclude
    ? nanosukeLines.filter((line) => line !== exclude)
    : nanosukeLines
  return pool[Math.floor(Math.random() * pool.length)] ?? nanosukeLines[0]
}
