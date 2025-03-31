'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const UncoverWhenInView = dynamic(
  () => import('./animations').then((mod) => mod.UncoverWhenInView),
  { ssr: false }
)
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useMegaCover } from '@/components/mega-cover-context'

export const RegularImage = ({
  file,
  caption,
  className,
  manualWidth,
  sizes = '(max-width: 768px) 100vw, (min-width: 769px) and (max-width: 1200px) 50vw, 33vw',
  delay = 0,
  clipPathCompatible = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false) // Tracks if the image is loaded
  const [isDelayElapsed, setIsDelayElapsed] = useState(false) // Tracks if the delay has elapsed
  const [isReady, setIsReady] = useState(false) // Tracks if the component is fully ready
  const { hasRun } = useMegaCover() // Get the `hasRun` state from the context

  useEffect(() => {
    // Calculate the appropriate delay
    const adjustedDelay = hasRun && delay > 0 ? 1 : delay

    // Start the delay timer immediately
    const timeout = setTimeout(
      () => setIsDelayElapsed(true),
      adjustedDelay * 1000
    )

    return () => clearTimeout(timeout)
  }, [delay, hasRun])

  useEffect(() => {
    // Component is ready only when both image is loaded and delay has elapsed
    if (isLoaded && isDelayElapsed) {
      setIsReady(true)
    }
  }, [isLoaded, isDelayElapsed])

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
        clipPathCompatible={clipPathCompatible}
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
          sizes={sizes}
          onLoad={() => setIsLoaded(true)} // Trigger when the image loads
        />
      </UncoverWhenInView>
      {caption && <figcaption className="text-sm mt-1">{caption}</figcaption>}
    </figure>
  )
}
