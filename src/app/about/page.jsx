import { fetchGraphQL } from '@/lib/graphql'
import { AllPages, SinglePage, SinglePageSeo } from '@/queries/pages'
import Link from 'next/link'
import { RegularImage } from '@/components/ui/images'
import { notFound } from 'next/navigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Main } from '@/components/ui/containers'
import { ClientCard } from '@/components/ui/cards'
import { Heading1, Heading2, Heading3 } from '@/components/ui/headings'
import MegaCover from '@/components/mega-cover'
import Announcement from '@/components/announcement'
import clsx from 'clsx'

export async function generateMetadata({ params }) {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'about' })
  const page = pageData?.page

  const { title, description, image } = page?.seo ?? []

  return {
    title: title ? `${title} – ADDD` : 'ADDD',
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
  if (!page || !page?.content?.length) return notFound()

  return (
    <Main className="p-4 pt-0 md:pt-20">
      <Heading1 className="sr-only">About</Heading1>
      <Announcement />
      {page?.content.map((item) => {
        switch (item.__typename) {
          case 'Text':
            return (
              <section className={clsx('', item.className)}>
                <RichText
                  content={item.content.raw}
                  renderers={{
                    h2: ({ children }) => <Heading2>{children}</Heading2>,
                    h3: ({ children }) => <Heading3>{children}</Heading3>,
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
          case 'Image':
            return <RegularImage {...item} />
          case 'EntrySection':
            const cards =
              item.reference
                ?.filter((entry) => entry.__typename === 'Profile')
                .map((entry) => <ClientCard key={entry.id} {...entry} />) || []

            return cards.length > 0 ? (
              <div className={clsx(item.className)}>{cards}</div>
            ) : null
          default: {
            console.log(item.__typename)
            return null
          }
        }
      })}
      <MegaCover />
    </Main>
  )
}
