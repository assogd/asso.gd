import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaBlocksForImageWall } from '@/lib/arena-image-wall'
import { ArenaImageWall } from '@/components/arena-image-wall'
import { PublishButton } from '@/components/publish-button'

export const dynamic = 'force-dynamic'

async function loadProjectChannel(slug) {
  return fetchArenaChannelWithBlocks(slug, {
    fresh: process.env.PREVIEW_MODE === 'true'
  })
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const channel = await loadProjectChannel(slug)
    return {
      title: channel?.title,
      description: channel?.metadata?.description || undefined
    }
  } catch (error) {
    console.error(`Failed to build metadata for project ${slug}:`, error)
    return {}
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const host = (await headers()).get('host') || ''
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)

  let channel

  try {
    channel = await loadProjectChannel(slug)
  } catch (error) {
    console.error(`Failed to fetch Arena project channel ${slug}:`, error)
    notFound()
  }

  const items = transformArenaBlocksForImageWall(channel?.contents || []).reverse()

  if (items.length === 0) {
    notFound()
  }

  return (
    <main className="pt-24">
      <h1 className="p-4 text-center">{channel.title}</h1>
      <ArenaImageWall items={items} loop={false} />
      {(process.env.PREVIEW_MODE === 'true' || isLocalhost) && (
        <PublishButton isLocalhost={isLocalhost} />
      )}
    </main>
  )
}
