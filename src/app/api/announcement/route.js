import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET(request) {
  try {
    const markdown = await fs.readFile(
      path.join(process.cwd(), 'src/content/announcement.md'),
      'utf8'
    )

    return Response.json({ message: { markdown } })
  } catch (error) {
    console.error('Failed to read repository announcement:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to read announcement' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
