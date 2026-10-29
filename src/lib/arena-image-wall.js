const LAYOUT_DIRECTIVE = /^[ \t]*layout:[ \t]*(\S+)[ \t]*$/im

/**
 * Art-direction hint set in a block's description as a "layout: full" line.
 * @param {string} description - Raw block description
 * @returns {string|null} Layout name, if any
 */
function parseLayout(description) {
  return description?.match(LAYOUT_DIRECTIVE)?.[1].toLowerCase() || null
}

function stripLayoutDirective(description) {
  return (description || '').replace(LAYOUT_DIRECTIVE, '')
}

/**
 * Caption Markdown for a block: the first paragraph of its description, with
 * inline links and soft line breaks kept, or the title when there's none.
 * @param {object} block - Arena block
 * @returns {string} Caption Markdown
 */
function buildCaption(block) {
  const firstParagraph = stripLayoutDirective(block.description).trim().split(/\n\s*\n/)[0]
  const caption = firstParagraph
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .trim()

  return caption || block.title || ''
}

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
      return (
        block.image &&
        (block.image.original?.url ||
          block.image.large?.url ||
          block.image.display?.url ||
          block.image.thumb?.url)
      )
    })
    .map((block) => ({
      id: block.id,
      title: block.title || '',
      description: block.description || '',
      caption: buildCaption(block),
      figcaption: stripLayoutDirective(block.description).trim(),
      layout: parseLayout(block.description),
      image: {
        // Are.na's generated renditions are JPEG/WebP quality 75. Use the
        // original so Next can resize and compress it once at the requested
        // display quality instead of re-encoding an already-lossy rendition.
        url:
          block.image.original?.url ||
          block.image.large?.url ||
          block.image.display?.url ||
          block.image.thumb?.url,
        alt: block.image.alt || '',
        width:
          block.image.width ||
          block.image.original?.width ||
          block.image.large?.width ||
          block.image.display?.width ||
          block.image.thumb?.width,
        height:
          block.image.height ||
          block.image.original?.height ||
          block.image.large?.height ||
          block.image.display?.height ||
          block.image.thumb?.height
      },
      source: block.source?.url || null,
      created_at: block.created_at,
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

const OG_DIRECTIVE = /^[ \t]*type:[ \t]*og[ \t]*$/im

const HIDDEN_DIRECTIVE = /^[ \t]*type:[ \t]*hidden[ \t]*$/im

/** Blocks whose description has a "type: hidden" line are never rendered. */
export function isHiddenBlock(block) {
  return HIDDEN_DIRECTIVE.test(block?.description || '')
}

function isOgBlock(block) {
  return OG_DIRECTIVE.test(block.description || '')
}

/**
 * Social-sharing metadata from a project channel's "og" block: an image block
 * whose description ends with a "type: og" line. Its title, description and
 * image are used for link previews and are not rendered on the page.
 * @param {Array} blocks - Array of Are.na channel blocks
 * @returns {{title: string, description: string, image: string}|null}
 */
export function extractArenaProjectOg(blocks) {
  const block = Array.isArray(blocks) ? blocks.find(isOgBlock) : null
  if (!block) return null

  // A rendition keeps the preview light; the original can be several MB.
  const image =
    block.image?.large?.url ||
    block.image?.display?.url ||
    block.image?.original?.url ||
    ''

  return {
    title: block.title || '',
    description: (block.description || '').replace(OG_DIRECTIVE, '').trim(),
    image
  }
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
    if (isOgBlock(block) || isHiddenBlock(block)) return []

    if (block.class === 'Channel') {
      const images = transformArenaBlocksForImageWall(
        (block.contents || []).filter((child) => !isHiddenBlock(child))
      ).reverse()
      return images.length
        ? [{ id: block.id, type: 'collection', title: block.title || '', images }]
        : []
    }

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
