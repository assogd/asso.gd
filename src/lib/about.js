import { imageSize } from 'image-size'
import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { isHiddenBlock } from '@/lib/arena-image-wall'
import { isPreviewMode, renderFreshInPreview } from '@/lib/preview'

// Are.na doesn't return image dimensions, so read them from the file to
// reserve the right space before the image loads.
async function getImageSize(url) {
  try {
    const response = await fetch(url, { cache: 'force-cache' })
    const { width, height } = imageSize(
      new Uint8Array(await response.arrayBuffer())
    )
    return { width, height }
  } catch {
    return {}
  }
}

const ABOUT_CHANNEL = 'about-the-studio'

// Are.na returns newest blocks first; the channel is arranged top-down.
// Single newlines become hard line breaks so addresses keep their layout.
function withLineBreaks(text) {
  return text.replace(/([^\n])\n(?=[^\n])/g, '$1  \n')
}

export async function getAboutContent() {
  await renderFreshInPreview()
  try {
    const channel = await fetchArenaChannelWithBlocks(ABOUT_CHANNEL, {
      fresh: isPreviewMode
    })
    const blocks = [...(channel?.contents || [])]
      .filter((block) => !isHiddenBlock(block))
      .reverse()
    const introIndex = blocks.findIndex(
      (block) => block.class === 'Text' && block.title === 'Introduction'
    )
    const [introBlock] = introIndex >= 0 ? blocks.splice(introIndex, 1) : []

    return {
      intro: introBlock?.content?.trim() || null,
      blocks: (
        await Promise.all(
          blocks.map(async (block) => {
            if (block.class === 'Text' && block.content?.trim()) {
              return {
                id: block.id,
                type: 'text',
                content: withLineBreaks(block.content.trim())
              }
            }
            const image = block.image
            const src =
              image?.original?.url || image?.large?.url || image?.display?.url
            if (block.class === 'Image' && src) {
              return {
                id: block.id,
                type: 'image',
                src,
                title: block.title || '',
                ...(await getImageSize(src))
              }
            }
            return null
          })
        )
      ).filter(Boolean)
    }
  } catch (error) {
    console.error('Failed to fetch about channel:', error)
    return { intro: null, blocks: [] }
  }
}
