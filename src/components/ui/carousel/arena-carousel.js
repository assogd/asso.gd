'use client'
import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { use100vh } from 'react-div-100vh'
import { useCursorNavigation } from '@/hooks/carousel/use-cursor-navigation'
import { useSlideNavigation } from '@/hooks/carousel/use-slide-navigation'

/**
 * Simple carousel component for Arena data
 * Features:
 * - Click/touch navigation (left half = prev, right half = next)
 * - Cursor changes based on mouse position (w-resize/e-resize)
 * - Smooth transitions between slides
 */
export const ArenaCarousel = ({ items = [] }) => {
  const [active, setActive] = useState(0)
  const height = use100vh()
  const { handlePrev, handleNext } = useSlideNavigation(items.length)
  const {
    containerRef,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchEnd
  } = useCursorNavigation(
    () => handlePrev(setActive),
    () => handleNext(setActive)
  )

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No items to display</p>
      </div>
    )
  }

  // Only render active slide and adjacent slides for performance
  const shouldRenderSlide = (index) => {
    const total = items.length
    return (
      index === active ||
      index === (active + 1) % total ||
      index === (active - 1 + total) % total
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative select-none"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, index) => {
        if (!shouldRenderSlide(index)) return null

        // Determine if image is landscape (width > height)
        const isLandscape =
          item.image?.width && item.image?.height
            ? item.image.width > item.image.height
            : false

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === active ? 1 : 0
            }}
            transition={{ duration: 0 }}
            className={clsx(
              'absolute inset-0 flex items-center justify-center',
              index === active
                ? 'pointer-events-auto z-10'
                : 'pointer-events-none z-0'
            )}
          >
            <div
              className={clsx(
                'relative w-full h-full flex items-center justify-center py-[clamp(2.5rem,20vh,6rem)]',
                isLandscape ? 'px-2' : 'px-12'
              )}
            >
              {item.image?.url && (
                <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                  <Image
                    src={item.image.url}
                    alt={item.title || 'Carousel image'}
                    width={item.image.width || 1600}
                    height={item.image.height || 1200}
                    className="object-contain w-full h-full max-h-[640px]"
                    sizes="100vw"
                    priority={index === active && index < 2}
                    loading={index === active ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                </div>
              )}

              {/* Caption overlay */}
              {item.title && index === active && (
                <div className="absolute bottom-4 inset-x-0 sm:inset-x-10 text-center px-4 z-20">
                  <div className="sm:fixed sm:bottom-4 sm:left-4 extra-tracking">
                    {active + 1}/{items.length}
                  </div>
                  <div>{item.title}</div>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
