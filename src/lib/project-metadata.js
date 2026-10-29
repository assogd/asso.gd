import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { extractArenaProjectOg } from '@/lib/arena-image-wall'
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
