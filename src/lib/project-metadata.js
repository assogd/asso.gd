import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { extractArenaProjectOg } from '@/lib/arena-image-wall'
import { SITE_URL } from '@/lib/site'
import { isPreviewMode, renderFreshInPreview } from '@/lib/preview'

const TITLE_SUFFIX = ' – Asso Stockholm'

/**
 * Metadata for a project page, shared by /project/[slug] and its intercepted
 * modal so the tab title matches however the project is opened. The
 * channel's "og" block overrides the title, description and image.
 */
export async function generateProjectMetadata({ params }) {
  await renderFreshInPreview()
  const { slug } = await params

  try {
    const channel = await fetchArenaChannelWithBlocks(slug, {
      fresh: isPreviewMode
    })
    const og = extractArenaProjectOg(channel?.contents)
    const title = `${og?.title || channel?.title}${TITLE_SUFFIX}`
    const description =
      og?.description || channel?.metadata?.description || undefined
    const images = og?.image ? [og.image] : undefined

    return {
      title: { absolute: title },
      description,
      openGraph: { title, description, images },
      twitter: { card: 'summary_large_image', title, description, images }
    }
  } catch (error) {
    console.error(`Failed to build metadata for project ${slug}:`, error)
    return {}
  }
}

/** schema.org CreativeWork for a project page, built from its Are.na channel. */
export function buildProjectJsonLd(slug, channel) {
  const og = extractArenaProjectOg(channel?.contents)
  const description =
    og?.description || channel?.metadata?.description || undefined
  const url = `${SITE_URL}/project/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    url,
    name: og?.title || channel?.title,
    ...(description && { description }),
    ...(og?.image && { image: og.image }),
    ...(channel?.created_at && { dateCreated: channel.created_at }),
    creator: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` }
  }
}
