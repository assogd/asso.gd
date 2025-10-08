import Arena from 'are.na'
import { IS_DEV_MODE } from '@/lib/config'

// Initialize Are.na client
const arena = new Arena({
  accessToken: process.env.ARENA_ACCESS_TOKEN
})

/**
 * Fetch a channel from Are.na
 * @param {string} channelSlug - The slug of the channel to fetch
 * @param {object} options - Additional options for the request
 * @returns {Promise<object>} Channel data
 */
export async function fetchArenaChannel(channelSlug, options = {}) {
  try {
    const channel = await arena.channel(channelSlug).get(options)
    return channel
  } catch (error) {
    console.error(`Error fetching Are.na channel ${channelSlug}:`, error)
    throw error
  }
}

/**
 * Fetch blocks from a specific channel
 * @param {string} channelSlug - The slug of the channel
 * @param {object} options - Query options (page, per, direction, etc.)
 * @returns {Promise<object>} Blocks data
 */
export async function fetchArenaBlocks(channelSlug, options = {}) {
  try {
    const blocks = await arena.channel(channelSlug).blocks(options)
    return blocks
  } catch (error) {
    console.error(`Error fetching Are.na blocks for channel ${channelSlug}:`, error)
    throw error
  }
}

/**
 * Fetch a specific block by ID
 * @param {number} blockId - The ID of the block
 * @returns {Promise<object>} Block data
 */
export async function fetchArenaBlock(blockId) {
  try {
    const block = await arena.block(blockId).get()
    return block
  } catch (error) {
    console.error(`Error fetching Are.na block ${blockId}:`, error)
    throw error
  }
}

/**
 * Search channels on Are.na
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} Search results
 */
export async function searchArenaChannels(query, options = {}) {
  try {
    const results = await arena.search.channels(query, options)
    return results
  } catch (error) {
    console.error(`Error searching Are.na channels:`, error)
    throw error
  }
}

/**
 * Get user information
 * @param {string} username - Username to fetch
 * @returns {Promise<object>} User data
 */
export async function fetchArenaUser(username) {
  try {
    const user = await arena.user(username).get()
    return user
  } catch (error) {
    console.error(`Error fetching Are.na user ${username}:`, error)
    throw error
  }
}

/**
 * Transform Are.na block data to match your carousel format
 * @param {object} block - Are.na block data
 * @returns {object} Transformed block data
 */
export function transformArenaBlockToCarouselItem(block) {
  return {
    id: block.id,
    title: block.title,
    description: block.description,
    source: block.source,
    image: block.image?.display?.url || block.image?.thumb?.url,
    video: block.source?.url && block.source?.provider === 'YouTube' ? block.source.url : null,
    created_at: block.created_at,
    updated_at: block.updated_at,
    user: block.user,
    // Add any additional fields you need for your carousel
    duration: 5000, // Default duration, you can customize this
    theme: 'light' // Default theme, you can customize this
  }
}

/**
 * Transform Are.na channel data to carousel content
 * @param {object} channel - Are.na channel data
 * @returns {Array} Array of carousel items
 */
export function transformArenaChannelToCarouselContent(channel) {
  if (!channel.contents || !Array.isArray(channel.contents)) {
    return []
  }
  
  return channel.contents.map(block => transformArenaBlockToCarouselItem(block))
}

/**
 * Fetch and transform channel data for carousel use
 * @param {string} channelSlug - Channel slug
 * @param {object} options - Fetch options
 * @returns {Promise<Array>} Transformed carousel content
 */
export async function fetchArenaChannelForCarousel(channelSlug, options = {}) {
  try {
    const channel = await fetchArenaChannel(channelSlug, options)
    return transformArenaChannelToCarouselContent(channel)
  } catch (error) {
    console.error(`Error fetching Are.na channel for carousel:`, error)
    throw error
  }
}
