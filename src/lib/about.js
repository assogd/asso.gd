import fs from 'node:fs'
import path from 'node:path'

function parseValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return value.replace(/^["']|["']$/g, '')
}

export function getAboutContent() {
  const filePath = path.join(process.cwd(), 'src/content/about.md')
  const source = fs.readFileSync(filePath, 'utf8')
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---\n?/)
  const frontmatter = {}

  if (frontmatterMatch) {
    frontmatterMatch[1].split('\n').forEach((line) => {
      const match = line.match(/^([\w-]+):\s*(.+)$/)
      if (match) {
        frontmatter[match[1]] = parseValue(match[2])
      }
    })
  }

  const body = source.replace(frontmatterMatch?.[0] || '', '').trim()
  const sections = body.split(/^## /m)
  const intro = sections.shift() || ''

  return {
    ...frontmatter,
    intro: intro.trim(),
    sections: sections.map((section) => {
      const [title, ...content] = section.split('\n')
      return { title: title.trim(), content: content.join('\n').trim() }
    })
  }
}
