'use client'
import Image from 'next/image'
import { FadeInOnLoad } from './animations'

export const HeroImage = ({ url, width, height, alt }) => {
  return (
    <FadeInOnLoad className={'mx-auto w-72 pt-4 px-12'}>
      <Image
        src={url}
        width={width}
        height={height}
        alt={alt}
        className="w-full"
      />
    </FadeInOnLoad>
  )
}
