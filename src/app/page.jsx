import { notFound } from 'next/navigation'
import { HeroImage } from '@/components/ui/assets'
import { SinglePage, SinglePageSeo } from '@/queries/pages'
import { LastUpdatedProfile } from '@/queries/profiles'
import { fetchGraphQL } from '@/lib/graphql'

/*export async function generateMetadata() {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'home' })
  const page = pageData?.page

  const { title, description, image } = page?.seo ?? []

  return {
    title: title ?? 'Adam Richards',
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
}*/

export default async function Home() {
  /*const profileData = await fetchGraphQL(LastUpdatedProfile)
  const profile = profileData?.profiles?.[0]

  const pageData = await fetchGraphQL(SinglePage, { slug: 'home' })
  const page = pageData?.page

  if (!page) return notFound()*/
  return null
}
