'use client'

import { useRef, useState } from 'react'
import clsx from 'clsx'
import { FadeImage } from './fade-image'
import { Caption } from './caption'

const SWIPE_THRESHOLD = 40

/**
 * One-slide-at-a-time carousel for a collection. Swipe
 * or drag to navigate, click the left/right half of the image to go
 * back/forward, or use the dots below.
 */
export function ProjectCarousel({ images, title }) {
  const [selected, setSelected] = useState(0)
  const startX = useRef(0)
  const count = images.length

  // Size the frame to the first image so the dots sit right under it.
  const first = images[0].image
  const aspectRatio =
    first.width && first.height ? `${first.width} / ${first.height}` : '6 / 5'

  const go = (index) => setSelected((index + count) % count)

  function handlePointerUp(event) {
    const delta = event.clientX - startX.current
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      go(selected + (delta < 0 ? 1 : -1))
      return
    }
    if (Math.abs(delta) > 5) return

    const rect = event.currentTarget.getBoundingClientRect()
    go(selected + (event.clientX - rect.left < rect.width / 2 ? -1 : 1))
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title || 'Collection'}
      className="project-carousel w-full max-w-2xl pt-8 pb-12"
    >
      <div
        onPointerDown={(event) => {
          startX.current = event.clientX
        }}
        onPointerUp={handlePointerUp}
        className="grid cursor-pointer touch-pan-y select-none"
        style={{ aspectRatio }}
      >
        {images.map((item, index) => {
          const { url, alt, width, height } = item.image
          return (
            <div
              key={item.id}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={index !== selected}
              className={clsx(
                'relative col-start-1 row-start-1',
                index === selected ? 'opacity-100' : 'opacity-0'
              )}
            >
              <FadeImage
                src={url}
                alt={alt || item.title || 'Asso archive image'}
                width={width}
                height={height}
                priority
                fade={index !== 0}
                sizes="100vw"
                quality={90}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          )
        })}
      </div>
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {images.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === selected}
              onClick={() => go(index)}
              className={clsx(
                'h-1 w-1 rounded-full border border-current',
                index === selected && 'bg-current'
              )}
            />
          ))}
        </div>
      )}
      {images[selected].figcaption && (
        <p className="mt-4 text-center text-sm">
          <Caption>{images[selected].figcaption}</Caption>
        </p>
      )}
    </section>
  )
}
