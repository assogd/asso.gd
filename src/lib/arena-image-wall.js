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
      return block.image && (block.image.large?.url || block.image.display?.url || block.image.thumb?.url)
    })
    .map((block) => ({
      id: block.id,
      title: block.title || '',
      description: block.description || '',
      image: {
        // Prefer the larger rendition so text-heavy images (book covers,
        // posters) stay sharp on high-DPI screens.
        url: block.image.large?.url || block.image.display?.url || block.image.thumb?.url,
        alt: block.image.alt || '',
        width: block.image.large?.width || block.image.display?.width || block.image.thumb?.width,
        height: block.image.large?.height || block.image.display?.height || block.image.thumb?.height
      },
      source: block.source?.url || null,
      created_at: block.created_at,
      // Set by `attachConnectedProjects` - the other Are.na channel this
      // block belongs to, if any, used to link the tile to a project page.
      project: block.connectedProject
        ? { slug: block.connectedProject.slug, title: block.connectedProject.title }
        : null
    }))
}
