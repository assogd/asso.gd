import { notFound } from 'next/navigation'
import { HeroImage } from '@/components/ui/assets'
import { SinglePage, SinglePageSeo } from '@/queries/pages'
import { GalleryById } from '@/queries/galleries'
import { fetchGraphQL } from '@/lib/graphql'
import { MainCarousel } from '@/components/ui/carousel/'

export async function generateMetadata() {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'home' })
  const page = pageData?.page

  const { title, description, image } = page?.seo ?? []

  return {
    title: title ?? 'ADDD',
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
  const pageData = await fetchGraphQL(SinglePage, { slug: 'home' })
  const page = pageData?.page

  const galleryData = await fetchGraphQL(GalleryById, {
    id: 'cm0fdalorfvgo07w2wji3wbv0'
  })
  const gallery = galleryData?.gallery

  if (!page) return notFound()
  return (
    <main>
      <h1 className="sr-only">Projects</h1>
      <MainCarousel {...gallery} />
    </main>
  )
}
