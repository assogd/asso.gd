// Cache configuration - never revalidate unless manually triggered
const CACHE_CONFIG = {
  next: { 
    revalidate: false, // Never automatically revalidate
    tags: ['arena-data'] // Tag for manual revalidation
  }
}

/**
 * Fetch a channel from Are.na with caching
 * @param {string} channelSlug - The slug of the channel to fetch
 * @param {object} options - Additional options for the request
 * @returns {Promise<object>} Channel data
 */
export async function fetchArenaChannel(channelSlug, options = {}) {
  try {
    // Use Next.js fetch with caching for server-side rendering
    const response = await fetch(`https://api.are.na/v2/channels/${channelSlug}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      ...CACHE_CONFIG
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch channel: ${response.status}`)
    }
    
    const channel = await response.json()
    
    // Check if this is a cache hit by looking for existing _fetchedAt
    // If it exists, preserve it; if not, add a new timestamp
    const existingTimestamp = channel._fetchedAt
    const timestamp = existingTimestamp || new Date().toISOString()
    
    return {
      ...channel,
      _fetchedAt: timestamp
    }
  } catch (error) {
    console.error(`Error fetching Are.na channel ${channelSlug}:`, error)
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