import { fetchGraphQL } from '@/lib/graphql'
import { AllPages, SinglePage, SinglePageSeo } from '@/queries/pages'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { ParagraphRenderer } from '@/lib/richText'
import { Main } from '@/components/ui/containers'
import { Heading1 } from '@/components/ui/headings'

export async function generateMetadata({ params }) {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: params.slug })
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

export async function generateStaticParams() {
  const pageData = await fetchGraphQL(AllPages)
  const pages = pageData?.pages

  return pages.map((page) => ({
    slug: page.slug
  }))
}

export default async function Post({ params }) {
  const { page } = await fetchGraphQL(SinglePage, { slug: params.slug })
  if (!page || !page?.content?.length) return notFound()

  return (
    <Main>
      {page?.content.map((section) => {
        switch (section.__typename) {
          case 'Text':
            return (
              <RichText
                content={section.body.raw}
                renderers={{
                  h1: ({ children }) => <Heading1>{children}</Heading1>,
                  p: ({ children }) => (
                    <ParagraphRenderer>{children}</ParagraphRenderer>
                  )
                }}
              />
            )
          default: {
            console.log(section.__typename)
            return null
          }
        }
      })}
    </Main>
  )
}
