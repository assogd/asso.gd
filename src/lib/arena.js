// Cache configuration - never revalidate unless manually triggered
const CACHE_CONFIG = {
  next: { 
    revalidate: false, // Never automatically revalidate
    tags: ['arena-data'] // Tag for manual revalidation
  },
  cache: 'force-cache' // Force cache usage even in development
}
// Are.na collection whose channels are the site's project pages.
const PROJECTS_CHANNEL_SLUG = 'projects-p6rlwzfff3a'

/**
 * Build the default Are.na API request headers.
 * @returns {object} Headers for Are.na API requests
 */
function getArenaHeaders() {
  return {
      'Authorization': `Bearer ${process.env.ARENA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
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
    const fetchOptions = options.fresh
      ? { cache: 'no-store' }
      : CACHE_CONFIG

    // In "fresh" (preview) mode, bust any caching layer keyed only by URL
    // (e.g. Netlify's fetch cache) by making every request unique.
    const cacheBuster = options.fresh ? `&_=${Date.now()}` : ''

    const headers = getArenaHeaders()

    // Are.na's combined "channel + contents" endpoint is cached much more
    // aggressively on their side than the dedicated contents endpoint, and
    // editing an existing block (e.g. its title) doesn't bust that cache -
    // it can keep serving a stale block for minutes. Fetch channel metadata
    // and contents separately, using the contents endpoint for fresh blocks.
    const [channelResponse, contentsResponse] = await Promise.all([
      fetch(`https://api.are.na/v2/channels/${channelSlug}?per=1${cacheBuster}`, {
        headers,
        ...fetchOptions
      }),
      fetch(`https://api.are.na/v2/channels/${channelSlug}/contents?per=100${cacheBuster}`, {
        headers,
        ...fetchOptions
      })
    ])

    if (!channelResponse.ok) {
      throw new Error(`Failed to fetch channel: ${channelResponse.status}`)
    }

    if (!contentsResponse.ok) {
      throw new Error(`Failed to fetch channel contents: ${contentsResponse.status}`)
    }

    const channel = await channelResponse.json()
    const { contents } = await contentsResponse.json()

    // Add timestamp to track when data was fetched
    const result = {
      ...channel,
      contents,
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

/**
 * Fetch the project channels listed in the Projects collection.
 * @param {object} options - Fetch options (`fresh` bypasses the cache)
 * @returns {Promise<Array<{slug: string, title: string}>>} Projects
 */
export async function fetchArenaProjects(options = {}) {
  const channel = await fetchArenaChannel(PROJECTS_CHANNEL_SLUG, options)

  return (channel.contents || [])
    .filter((block) => block.class === 'Channel' && block.slug)
    .map((block) => ({ slug: block.slug, title: block.title || block.slug }))
}
