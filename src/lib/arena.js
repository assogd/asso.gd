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
 * Fetch channel data with blocks included
 * @param {string} channelSlug - Channel slug
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Channel data with blocks
 */
export async function fetchArenaChannelWithBlocks(channelSlug, options = {}) {
  try {
    // Fetch the channel which already includes contents/blocks
    const channel = await fetchArenaChannel(channelSlug, options)
    return channel
  } catch (error) {
    console.error(`Error fetching Are.na channel with blocks:`, error)
    throw error
  }
}
