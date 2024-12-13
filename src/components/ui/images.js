'use client'
import Image from 'next/image'
import { UncoverWhenInView } from './animations'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

export const RegularImage = ({
  file,
  caption,
  className,
  manualWidth,
  delay = 0 // Default delay to 0 seconds
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      // Delay the animation if a delay is specified
      const timeout = setTimeout(() => setIsReady(true), delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isLoaded, delay])

  if (!file?.width) return null

  // Calculate aspect ratio
  const aspectRatio = file.width / file.height

  // If manualWidth is set, calculate height based on aspect ratio
  const width = manualWidth || file.width
  const height = manualWidth
    ? Math.round(manualWidth / aspectRatio)
    : file.height

  const hasMaxHeight = className.includes('max-h-')

  return (
    <figure className={clsx('relative', className)}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 uppercase">
        Image
      </div>
      <UncoverWhenInView
        isReady={isReady}
        className={clsx('w-full', hasMaxHeight && 'h-full')}
      >
        <Image
          src={file.url}
          width={width}
          height={height}
          alt={file.alt ?? ''}
          className={clsx(
            'w-full object-center object-contain',
            hasMaxHeight && 'h-full'
          )}
          onLoad={() => setIsLoaded(true)}
        />
      </UncoverWhenInView>
      {caption && <figcaption className="text-sm mt-1">{caption}</figcaption>}
    </figure>
  )
}
