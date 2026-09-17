import { notFound } from 'next/navigation'
import siteContent from '@/content/site.json'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaBlocksForImageWall } from '@/lib/arena-image-wall'
import { ArenaImageWall } from '@/components/arena-image-wall'
import { PublishButton } from '@/components/publish-button'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { title, description } = siteContent.seo.home

  return {
    title,
    description,
    openGraph: { description }
  }
}

export default async function Home() {
  // Fetch the adddgd channel data
  let imageItems = []

  try {
    const channel = await fetchArenaChannelWithBlocks('adddgd', {
      fresh: process.env.PREVIEW_MODE === 'true'
    })
    if (channel?.contents) {
      imageItems = transformArenaBlocksForImageWall(channel.contents).reverse()
    }
  } catch (error) {
    console.error('Failed to fetch Arena channel:', error)
  }

  // Show not found page if no data available
  if (imageItems.length === 0) {
    notFound()
  }

  return (
    <main className="pt-24">
      <ArenaImageWall items={imageItems} />
      {process.env.PREVIEW_MODE === 'true' && <PublishButton />}
    </main>
  )
}
