import { notFound } from 'next/navigation'
import { isPreviewMode, renderFreshInPreview, showPublishInPreview } from '@/lib/preview'
import siteContent from '@/content/site.json'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaBlocksForImageWall } from '@/lib/arena-image-wall'
import { HomeFeed } from '@/components/home-feed'
import { PublishButton } from '@/components/publish-button'

export async function generateMetadata() {
  const { title, description } = siteContent.seo.home

  return {
    title,
    description,
    openGraph: { description }
  }
}

export default async function Home() {
  await renderFreshInPreview()

  // Fetch the adddgd channel data
  let imageItems = []

  try {
    const channel = await fetchArenaChannelWithBlocks('adddgd', {
      fresh: isPreviewMode
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
      <HomeFeed items={imageItems} />
      <PublishButton showInPreview={showPublishInPreview} />
    </main>
  )
}
