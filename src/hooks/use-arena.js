import { useState, useEffect } from 'react'
import useSWR from 'swr'

/**
 * Custom hook for fetching Are.na channel data
 * @param {string} channelSlug - The channel slug to fetch
 * @param {object} options - Additional options
 * @returns {object} Channel data and loading state
 */
export function useArenaChannel(channelSlug, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    channelSlug ? `/api/arena?action=channel&channel=${channelSlug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  )

  return {
    channel: data,
    isLoading,
    isError: error,
    mutate
  }
}

/**
 * Custom hook for fetching Are.na blocks
 * @param {string} channelSlug - The channel slug
 * @param {object} options - Fetch options
 * @returns {object} Blocks data and loading state
 */
export function useArenaBlocks(channelSlug, options = {}) {
  const { page = 1, per = 20 } = options
  const { data, error, isLoading, mutate } = useSWR(
    channelSlug ? `/api/arena?action=blocks&channel=${channelSlug}&page=${page}&per=${per}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  )

  return {
    blocks: data,
    isLoading,
    isError: error,
    mutate
  }
}

/**
 * Custom hook for fetching Are.na data formatted for carousel
 * @param {string} channelSlug - The channel slug
 * @param {object} options - Fetch options
 * @returns {object} Carousel data and loading state
 */
export function useArenaCarousel(channelSlug, options = {}) {
  const { page = 1, per = 20 } = options
  const { data, error, isLoading, mutate } = useSWR(
    channelSlug ? `/api/arena?action=carousel&channel=${channelSlug}&page=${page}&per=${per}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  )

  return {
    content: data || [],
    isLoading,
    isError: error,
    mutate
  }
}

/**
 * Fetcher function for SWR
 * @param {string} url - URL to fetch
 * @returns {Promise<any>} Fetched data
 */
async function fetcher(url) {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await response.json()
    error.status = response.status
    throw error
  }
  
  return response.json()
}

/**
 * Hook for managing multiple Are.na channels
 * @param {Array<string>} channelSlugs - Array of channel slugs
 * @param {object} options - Options for each channel
 * @returns {object} Combined data from all channels
 */
export function useMultipleArenaChannels(channelSlugs, options = {}) {
  const [combinedData, setCombinedData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (!channelSlugs || channelSlugs.length === 0) {
      setIsLoading(false)
      return
    }

    const fetchAllChannels = async () => {
      setIsLoading(true)
      setErrors([])
      
      try {
        const promises = channelSlugs.map(slug => 
          fetch(`/api/arena?action=carousel&channel=${slug}`)
            .then(res => res.json())
            .catch(err => {
              console.error(`Error fetching channel ${slug}:`, err)
              return { error: err.message, slug }
            })
        )

        const results = await Promise.all(promises)
        
        const successfulData = results
          .filter(result => !result.error)
          .flat()
        
        const channelErrors = results
          .filter(result => result.error)
          .map(result => ({ slug: result.slug, error: result.error }))

        setCombinedData(successfulData)
        setErrors(channelErrors)
      } catch (error) {
        console.error('Error fetching multiple channels:', error)
        setErrors([{ error: error.message }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllChannels()
  }, [channelSlugs])

  return {
    content: combinedData,
    isLoading,
    errors,
    hasErrors: errors.length > 0
  }
}
