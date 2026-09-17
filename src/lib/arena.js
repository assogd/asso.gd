// Cache configuration - never revalidate unless manually triggered
const CACHE_CONFIG = {
  next: { 
    revalidate: false, // Never automatically revalidate
    tags: ['arena-data'] // Tag for manual revalidation
  },
  cache: 'force-cache' // Force cache usage even in development
}

/**
 * Fetch a channel from Are.na with caching
 * @param {string} channelSlug - The slug of the channel to fetch
 * @param {object} options - Additional options for the request
 * @returns {Promise<object>} Channel data
 */
export async function fetchArenaChannel(channelSlug, options = {}) {
  try {
    const fetchOptions = options.fresh
      ? { cache: 'no-store' }
      : CACHE_CONFIG

    // Use Next.js fetch with caching for server-side rendering
    const response = await fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, {
      headers: {
        'Authorization': `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch channel: ${response.status}`)
    }
    
    const channel = await response.json()
    
    // Add timestamp to track when data was fetched
    const result = {
      ...channel,
      _fetchedAt: new Date().toISOString()
    }
    
    return result
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
