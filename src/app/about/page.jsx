import { fetchGraphQL } from '@/lib/graphql'
import { AllPages, SinglePage, SinglePageSeo } from '@/queries/pages'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Main } from '@/components/ui/containers'
import { Heading1, Heading2 } from '@/components/ui/headings'
import MegaCover from '@/components/mega-cover'
import clsx from 'clsx'

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
    <Main className="p-4 pt-4">
      <Heading1 className="sr-only">About</Heading1>
      {page?.content.map((section) => {
        switch (section.__typename) {
          case 'Text':
            return (
              <section className={clsx('', section.className)}>
                <RichText
                  content={section.content.raw}
                  renderers={{
                    h2: ({ children }) => <Heading2>{children}</Heading2>,
                    p: ({ children }) => (
                      <p className="mb-4 last:mb-0">{children}</p>
                    ),
                    li: ({ children }) => (
                      <li className="odd:ml-0 even:ml-4">{children}</li>
                    )
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

      <MegaCover />
    </Main>
  )
}
