'use client'
import Image from 'next/image'
import { UncoverWhenInView } from './animations'
import clsx from 'clsx'
import { useState } from 'react'

export const RegularImage = ({ file, caption, className }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <figure className={clsx(className)}>
      <UncoverWhenInView isReady={isLoaded}>
        <Image
          src={file.url}
          width={file.width}
          height={file.height}
          alt={file.alt ?? ''}
          className="w-full"
          onLoadingComplete={() => setIsLoaded(true)} // Set isLoaded to true when the image is fully loaded
        />
      </UncoverWhenInView>
      {caption && <figcaption className="text-sm mt-1">{caption}</figcaption>}
    </figure>
  )
}
