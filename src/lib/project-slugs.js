import { fetchArenaChannelWithBlocks } from '@/lib/arena'
import { isHiddenBlock } from '@/lib/arena-image-wall'

const PROJECT_LINK = /(?:asso\.gd)?\/project\/([a-z0-9][a-z0-9-_]*)/gi

// Projects are linked from the captions of the homepage channel's blocks.
export async function getProjectSlugs() {
  try {
    const channel = await fetchArenaChannelWithBlocks('adddgd')
    const slugs = new Set()
    for (const block of channel?.contents || []) {
      if (isHiddenBlock(block)) continue
      const text = `${block.description || ''} ${block.content || ''}`
      for (const match of text.matchAll(PROJECT_LINK)) {
        slugs.add(match[1].toLowerCase())
      }
    }
    return [...slugs]
  } catch (error) {
    console.error('Failed to collect project slugs:', error)
    return []
  }
}
