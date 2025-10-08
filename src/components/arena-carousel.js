'use client'
import { MainCarousel } from '@/components/ui/carousel'
import { useArenaCarousel, useMultipleArenaChannels } from '@/hooks/use-arena'
import { transformArenaBlockToCarouselItem } from '@/lib/arena'

/**
 * Carousel component that displays Are.na channel content
 * @param {object} props - Component props
 * @param {string} props.channelSlug - Are.na channel slug
 * @param {object} props.options - Additional options for fetching data
 * @param {object} props.carouselProps - Props to pass to MainCarousel
 * @returns {JSX.Element} ArenaCarousel component
 */
export function ArenaCarousel({ 
  channelSlug, 
  options = {}, 
  carouselProps = {},
  fallbackContent = null 
}) {
  const { content, isLoading, isError } = useArenaCarousel(channelSlug, options)

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Are.na content...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load Are.na content</p>
          <p className="text-gray-600 text-sm">
            Channel: {channelSlug}
          </p>
          {fallbackContent && (
            <div className="mt-8">
              {fallbackContent}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show empty state
  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No content found in this channel</p>
          <p className="text-gray-500 text-sm">
            Channel: {channelSlug}
          </p>
          {fallbackContent && (
            <div className="mt-8">
              {fallbackContent}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Transform Are.na content to match your carousel format
  const transformedContent = content.map(item => ({
    id: item.id,
    assets: [
      {
        id: item.id,
        __typename: item.video ? 'Video' : 'Image',
        file: item.video ? null : {
          url: item.image,
          alt: item.title || '',
          width: 1600,
          height: 1200
        },
        source: item.video ? {
          url: item.video,
          provider: 'YouTube'
        } : null,
        className: 'col-span-12 row-span-12 object-cover'
      }
    ],
    caption: item.description ? {
      raw: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: item.description
              }
            ]
          }
        ]
      }
    } : null,
    duration: item.duration || 5000,
    theme: item.theme || 'light'
  }))

  return (
    <MainCarousel 
      content={transformedContent} 
      {...carouselProps}
    />
  )
}

/**
 * Component for displaying multiple Are.na channels in one carousel
 * @param {object} props - Component props
 * @param {Array<string>} props.channelSlugs - Array of channel slugs
 * @param {object} props.options - Options for fetching data
 * @param {object} props.carouselProps - Props to pass to MainCarousel
 * @returns {JSX.Element} MultiChannelArenaCarousel component
 */
export function MultiChannelArenaCarousel({ 
  channelSlugs = [], 
  options = {}, 
  carouselProps = {},
  fallbackContent = null 
}) {
  const { content, isLoading, errors, hasErrors } = useMultipleArenaChannels(channelSlugs, options)

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content from {channelSlugs.length} channels...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (hasErrors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Some channels failed to load</p>
          <div className="text-gray-600 text-sm mb-4">
            {errors.map((error, index) => (
              <p key={index}>
                {error.slug ? `Channel ${error.slug}: ${error.error}` : error.error}
              </p>
            ))}
          </div>
          {fallbackContent && (
            <div className="mt-8">
              {fallbackContent}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show empty state
  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No content found in any channels</p>
          <p className="text-gray-500 text-sm">
            Channels: {channelSlugs.join(', ')}
          </p>
          {fallbackContent && (
            <div className="mt-8">
              {fallbackContent}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Transform content (same as single channel)
  const transformedContent = content.map(item => ({
    id: item.id,
    assets: [
      {
        id: item.id,
        __typename: item.video ? 'Video' : 'Image',
        file: item.video ? null : {
          url: item.image,
          alt: item.title || '',
          width: 1600,
          height: 1200
        },
        source: item.video ? {
          url: item.video,
          provider: 'YouTube'
        } : null,
        className: 'col-span-12 row-span-12 object-cover'
      }
    ],
    caption: item.description ? {
      raw: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: item.description
              }
            ]
          }
        ]
      }
    } : null,
    duration: item.duration || 5000,
    theme: item.theme || 'light'
  }))

  return (
    <MainCarousel 
      content={transformedContent} 
      {...carouselProps}
    />
  )
}
