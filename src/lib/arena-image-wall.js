/**
 * Transform Arena channel blocks into image-wall-ready format
 * @param {Array} blocks - Array of Arena blocks
 * @returns {Array} Transformed blocks for the image wall
 */
export function transformArenaBlocksForImageWall(blocks) {
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
        alt: block.image.alt || '',
        width: block.image.display?.width || block.image.thumb?.width,
        height: block.image.display?.height || block.image.thumb?.height
      },
      source: block.source?.url || null,
      created_at: block.created_at
    }))
}
