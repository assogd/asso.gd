import { fetchGraphQL } from '@/lib/graphql'
import { AllPages, SinglePage, SinglePageSeo } from '@/queries/pages'
import Link from 'next/link'
import { RegularImage } from '@/components/ui/images'
import { notFound } from 'next/navigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Main } from '@/components/ui/containers'
import {
  PortraitClientCard2 as ClientCard,
  LogoSlider
} from '@/components/ui/cards'
import { Heading1, Heading2, Heading3 } from '@/components/ui/headings'
import MegaCover from '@/components/mega-cover'
import clsx from 'clsx'

export async function generateMetadata({ params }) {
  const pageData = await fetchGraphQL(SinglePageSeo, { slug: 'about' })
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

export default async function Post({ params }) {
  const { page } = await fetchGraphQL(SinglePage, { slug: 'about' })
  if (!page || !page?.content?.length) return notFound()

  return (
    <Main className="px-4 pt-0 pb-12">
      <Heading1 className="sr-only">About</Heading1>
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
            return (
              <RegularImage
                {...item}
                delay={2}
                sizes={'(max-width: 768px) 50vw, 33vw'}
              />
            )
          case 'EntrySection':
            return null
            const cards =
              item.reference
                ?.filter((entry) => entry.__typename === 'Profile')
                .map((entry) => <ClientCard key={entry.id} {...entry} />) || []

            return cards.length > 0 ? (
              <div className={clsx(item.className, 'pb-8 pt-8 select-none')}>
                {item.title && (
                  <Heading2 className="border-b py-3 text-center">
                    {item.title}
                  </Heading2>
                )}
                <div className="-mx-4 py-4">
                  <LogoSlider>{cards}</LogoSlider>
                </div>
              </div>
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
