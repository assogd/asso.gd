import { fetchGraphQL } from '@/lib/graphql'
import {
  AllProjects,
  SingleProject,
  SingleProjectSeo
} from '@/queries/projects'
import { notFound } from 'next/navigation'
import { Main } from '@/components/ui/containers'
import { TextBlock, Caption } from '@/components/ui/rich-texts'
import { capitalizeFirstLetter } from '@/lib/text'
import { StandardPlayer } from '@/components/ui/players'
import clsx from 'clsx'

export async function generateMetadata({ params }) {
  const projectData = await fetchGraphQL(SingleProjectSeo, {
    slug: params.slug
  })
  const project = projectData?.project

  const { title, description, image } = project?.seo ?? []

  return {
    title: title ?? `${project?.title} – Adam Richards`,
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
  const projectData = await fetchGraphQL(AllProjects)
  const projects = projectData?.projects

  return projects.map((project) => ({
    slug: project.slug
  }))
}

export default async function Post({ params }) {
  const { project } = await fetchGraphQL(SingleProject, { slug: params.slug })
  console.log(project)
  if (!project) return notFound()

  const { title, client, director, type, content } = project

  return (
    <Main>
      <header className="text-center col-span-full px-4 pt-48 pb-40 grid gap-16">
        <h1 className="text-2xl extra-tracking uppercase font-serif">
          {title}
        </h1>
        <ul className="max-w-sm mx-auto grid gap-0">
          {client && (
            <li className="flex items-baseline justify-center gap-2">
              <div className="uppercase text-sm">Client</div>
              <div className="text-md font-serif">{client.name}</div>
            </li>
          )}
          {director && (
            <li className="flex items-baseline justify-center gap-2">
              <div className="uppercase text-sm">Director</div>
              <div className="text-md font-serif">{director.name}</div>
            </li>
          )}
          {type && (
            <li className="flex items-baseline justify-center gap-2">
              <div className="uppercase text-sm">Type</div>
              <div className="text-md font-serif">
                {capitalizeFirstLetter(type)}
              </div>
            </li>
          )}
        </ul>
      </header>
      {content.map((section) => {
        switch (section.__typename) {
          case 'TextBlock':
            return <TextBlock {...section} key={section.id} />
          case 'Video':
            return (
              <figure
                key={section.id}
                className={clsx(
                  section.className,
                  'relative left-1/2 -translate-x-1/2'
                )}
              >
                <StandardPlayer {...section} />
                {section?.caption && <Caption content={section.caption} />}
              </figure>
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
