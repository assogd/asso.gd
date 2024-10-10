import { fetchGraphQL } from '@/lib/graphql'
import { LatestAnnouncement } from '@/queries/settings'

export async function GET(request) {
  try {
    const result = await fetchGraphQL(LatestAnnouncement)
    const settings = result?.settingss?.[0]

    if (settings && settings.announcement) {
      return new Response(JSON.stringify({ message: settings.announcement }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'No announcement found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch announcement' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
