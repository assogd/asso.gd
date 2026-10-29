import { notFound } from 'next/navigation'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { transformArenaProjectContents } from '@/lib/arena-image-wall'
import {
  buildProjectJsonLd,
  generateProjectMetadata
} from '@/lib/project-metadata'
import {
  isPreviewMode,
  renderFreshInPreview,
  showPublishInPreview
} from '@/lib/preview'
import { ProjectContent } from '@/components/project-content'
import { ProjectRevealGate } from '@/components/project-reveal-gate'
import { PublishButton } from '@/components/publish-button'
import { Marquee } from '@/components/marquee'
import Link from 'next/link'

async function loadProjectChannel(slug) {
  return fetchArenaChannelWithBlocks(slug, { fresh: isPreviewMode })
}

export const generateMetadata = generateProjectMetadata

export default async function ProjectPage({ params }) {
  await renderFreshInPreview()
  const { slug } = await params

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProjectJsonLd(slug, channel))
        }}
      />
      <h1 className="sr-only">{channel.title}</h1>
      <ProjectRevealGate>
        <ProjectContent items={items} />
        <footer className="px-4 pt-12 pb-12 text-center grid gap-4">
          <span className="italic">End of page.</span>
          <div>
            Would you like to <Link href="/">browse images at the homepage</Link>{' '}
            or <Link href="/about">read texts about the studio</Link>?
          </div>
        </footer>
      </ProjectRevealGate>
      <PublishButton showInPreview={showPublishInPreview} />
    </main>
  )
}
