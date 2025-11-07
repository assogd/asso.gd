import { notFound } from 'next/navigation'
import { SinglePageSeo } from '@/queries/pages'
import { fetchGraphQL } from '@/lib/graphql'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaBlocksForCarousel } from '@/lib/arena-carousel'
import { ArenaCarousel } from '@/components/ui/carousel/arena-carousel'

export async function generateMetadata() {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'home' })
  const page = pageData?.page

  const { title, description, image } = page?.seo ?? []

  return {
    title: title ?? 'Asso',
    description: description,
    openGraph: {
      description: description,
      images: [
        {
          url: image?.url
        }
      ]
    }
  }
}

export default async function Home() {
  // Fetch the adddgd channel data
  let carouselItems = []

  try {
    const channel = await fetchArenaChannelWithBlocks('adddgd')
    if (channel?.contents) {
      carouselItems = transformArenaBlocksForCarousel(
        channel.contents
      ).reverse()
    }
  } catch (error) {
    console.error('Failed to fetch Arena channel:', error)
  }

  // Show not found page if no data available
  if (!carouselItems || carouselItems.length === 0) {
    notFound()
  }

  return (
    <main className="fixed inset-0">
      <ArenaCarousel items={carouselItems} />
    </main>
  )
}
