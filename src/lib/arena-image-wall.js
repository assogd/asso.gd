/**
 * Find the project a block links to. Projects are linked manually by adding
 * a Markdown link to the block's description whose last path segment is a
 * project slug, e.g. `[Read more](/project/sibbjans)`.
 * @param {string} description - Block description
 * @param {Map<string, {slug: string, title: string}>} projectsBySlug
 * @returns {{slug: string, title: string}|null} Linked project, if any
 */
function findLinkedProject(description, projectsBySlug) {
  for (const [, href] of (description || '').matchAll(/\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)) {
    const segments = href.split(/[?#]/)[0].split('/').filter(Boolean)
    const project = projectsBySlug.get(segments[segments.length - 1])
    if (project) return project
  }

  return null
}

/**
 * Transform Arena channel blocks into image-wall-ready format
 * @param {Array} blocks - Array of Arena blocks
 * @param {Array<{slug: string, title: string}>} projects - Projects from the
 *   Projects collection, used to resolve links in block descriptions
 * @returns {Array} Transformed blocks for the image wall
 */
export function transformArenaBlocksForImageWall(blocks, projects = []) {
  const projectsBySlug = new Map(projects.map((project) => [project.slug, project]))

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
      project: findLinkedProject(block.description, projectsBySlug)
    }))
}

/**
 * Parse an Are.na "meta block" - a Text block whose author marked its
 * description as "Meta block", used for a short list of key/value facts
 * (Client, Segment, Type, etc.) that should render as a stat sheet rather
 * than prose. Content looks like:
 *   Rooted in culture
 *   Client: Sibbjäns
 *   Segment: Hospitality
 * @param {string} content - Raw block content
 * @returns {Array<{key: string, value: string}>} Parsed fields
 */
function parseMetaBlockFields(content) {
  return content
    .split('\n')
    .slice(1) // first line duplicates the block title
    .map((line) => {
      // Are.na formats each field as a Markdown list item (e.g. "- Key: value");
      // strip that list marker so it doesn't leak into the parsed key.
      const unlisted = line.replace(/^\s*[-*+]\s+/, '')
      const separatorIndex = unlisted.indexOf(':')
      if (separatorIndex === -1) return null

      const key = unlisted.slice(0, separatorIndex).trim()
      const value = unlisted.slice(separatorIndex + 1).trim()
      if (!key || !value) return null

      return { key, value }
    })
    .filter(Boolean)
}

/**
 * Transform image and text blocks from an Are.na project channel while
 * preserving their channel order.
 * @param {Array} blocks - Array of Are.na channel blocks
 * @returns {Array} Transformed project content for the image wall
 */
export function transformArenaProjectContents(blocks) {
  if (!Array.isArray(blocks)) {
    return []
  }

  return blocks.flatMap((block) => {
    const imageItem = transformArenaBlocksForImageWall([block])[0]

    if (imageItem) {
      return [imageItem]
    }

    if (block.class === 'Text' && block.description?.trim() === 'Meta block') {
      return [{
        id: block.id,
        type: 'meta',
        title: block.title || '',
        fields: parseMetaBlockFields(block.content || '')
      }]
    }

    if (block.class === 'Text' && (block.content || block.title || block.description)) {
      return [{
        id: block.id,
        type: 'text',
        title: block.title || '',
        description: block.description || '',
        content: block.content || ''
      }]
    }

    return []
  })
}
