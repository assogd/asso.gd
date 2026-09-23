import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import siteContent from '@/content/site.json'
import { fetchArenaChannelWithBlocks, attachConnectedProjects } from '@/lib/arena'
import { transformArenaBlocksForImageWall } from '@/lib/arena-image-wall'
import { HomeFeed } from '@/components/home-feed'
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
  const host = (await headers()).get('host') || ''
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)

  // Fetch the adddgd channel data
  let imageItems = []

  try {
    const channel = await fetchArenaChannelWithBlocks('adddgd', {
      fresh: process.env.PREVIEW_MODE === 'true'
    })
    if (channel?.contents) {
      const blocksWithProjects = await attachConnectedProjects(channel.contents)
      imageItems = transformArenaBlocksForImageWall(blocksWithProjects).reverse()
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
      <HomeFeed items={imageItems} />
      {(process.env.PREVIEW_MODE === 'true' || isLocalhost) && (
        <PublishButton isLocalhost={isLocalhost} />
      )}
    </main>
  )
}
