import { notFound } from 'next/navigation'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaBlocksForImageWall } from '@/lib/arena-image-wall'
import { ProjectModal } from '@/components/project-modal'

export default async function ProjectModalPage({ params }) {
  const { slug } = await params

  let channel

  try {
    channel = await fetchArenaChannelWithBlocks(slug, {
      fresh: process.env.PREVIEW_MODE === 'true'
    })
  } catch (error) {
    console.error(`Failed to fetch Arena project channel ${slug}:`, error)
    notFound()
  }

  const items = transformArenaBlocksForImageWall(channel?.contents || []).reverse()

  if (items.length === 0) {
    notFound()
  }

  return <ProjectModal title={channel.title} items={items} />
}
