import { fetchGraphQL } from '@/lib/graphql'
import { AllPages, SinglePage, SinglePageSeo } from '@/queries/pages'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Main } from '@/components/ui/containers'
import { Heading1 } from '@/components/ui/headings'
import MegaCover from '@/components/mega-cover'

export async function generateMetadata({ params }) {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'about' })
  const page = pageData?.page

  const { title, description, image } = page?.seo ?? []

  return {
    title: title ? `${title} – Tarot` : 'Tarot',
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

export default async function Post({ params }) {
  const { page } = await fetchGraphQL(SinglePage, { slug: 'about' })
  console.log(page)
  if (!page || !page?.content?.length) return notFound()

  return (
    <Main className="p-4 pt-16">
      {page?.content.map((section) => {
        switch (section.__typename) {
          case 'Text':
            return (
              <section className={section.className}>
                <RichText
                  content={section.content.raw}
                  renderers={{
                    h1: ({ children }) => <Heading1>{children}</Heading1>,
                    p: ({ children }) => <p>{children}</p>
                  }}
                />
              </section>
            )
          default: {
            console.log(section.__typename)
            return null
          }
        }
      })}
      <nav className={'fixed right-0 top-0 select-none'}>
        <Link href="/" className={'block p-4'}>
          Back to Images
        </Link>
      </nav>
      <MegaCover />
    </Main>
  )
}
