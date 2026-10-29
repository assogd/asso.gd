import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaProjectContents } from '@/lib/arena-image-wall'
import { generateProjectMetadata } from '@/lib/project-metadata'
import { ProjectContent } from '@/components/project-content'
import { PublishButton } from '@/components/publish-button'
import { Marquee } from '@/components/marquee'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function loadProjectChannel(slug) {
  return fetchArenaChannelWithBlocks(slug, {
    fresh: process.env.PREVIEW_MODE === 'true'
  })
}

export const generateMetadata = generateProjectMetadata

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const host = (await headers()).get('host') || ''
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)

  let channel

  try {
    channel = await loadProjectChannel(slug)
  } catch (error) {
    console.error(`Failed to fetch Arena project channel ${slug}:`, error)
    notFound()
  }

  const items = transformArenaProjectContents(channel?.contents || []).reverse()

  if (items.length === 0) {
    notFound()
  }

  return (
    <main className="">
      <h1 className="sr-only">{channel.title}</h1>
      <ProjectContent items={items} />
      {((process.env.PREVIEW_MODE === 'true' &&
        process.env.HIDE_PUBLISH_BUTTON !== 'true') ||
        isLocalhost) && <PublishButton isLocalhost={isLocalhost} />}
      <footer className="px-4 pt-12 pb-12 text-center grid gap-4">
        <span className="italic">End of page.</span>
        <div>
          Would you like to <Link href="/">browse images at the homepage</Link>{' '}
          or <Link href="/about">read texts about the studio</Link>?
        </div>
      </footer>
    </main>
  )
}
