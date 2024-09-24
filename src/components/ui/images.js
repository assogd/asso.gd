'use client'
import Image from 'next/image'
import { UncoverWhenInView } from './animations'
import clsx from 'clsx'
import { useState } from 'react'

export const RegularImage = ({ file, caption, className, manualWidth }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  // Calculate aspect ratio
  const aspectRatio = file.width / file.height

  // If manualWidth is set, calculate height based on aspect ratio
  const width = manualWidth || file.width
  const height = manualWidth
    ? Math.round(manualWidth / aspectRatio)
    : file.height

  return (
    <figure className={clsx(className)}>
      <UncoverWhenInView isReady={isLoaded}>
        <Image
          src={file.url}
          width={width}
          height={height}
          alt={file.alt ?? ''}
          className="w-full"
          onLoad={() => setIsLoaded(true)}
        />
      </UncoverWhenInView>
      {caption && <figcaption className="text-sm mt-1">{caption}</figcaption>}
    </figure>
  )
}
