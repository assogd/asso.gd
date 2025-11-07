/**
 * Transform Arena channel blocks into carousel-ready format
 * @param {Array} blocks - Array of Arena blocks
 * @returns {Array} Transformed blocks for carousel
 */
export function transformArenaBlocksForCarousel(blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return []
  }

  return blocks
    .filter((block) => {
      // Only include blocks with images
      return block.image && (block.image.display?.url || block.image.thumb?.url)
    })
    .map((block) => ({
      id: block.id,
      title: block.title || '',
      description: block.description || '',
      image: {
        url: block.image.display?.url || block.image.thumb?.url,
        width: block.image.display?.width || block.image.thumb?.width,
        height: block.image.display?.height || block.image.thumb?.height
      },
      source: block.source?.url || null,
      created_at: block.created_at
    }))
}
