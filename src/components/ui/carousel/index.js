'use client'
import { Caption } from '@/components/ui/rich-texts'
import { StandardPlayer } from '@/components/ui/players'
import Image from 'next/image'
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from './progressBar'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { use100vh } from 'react-div-100vh'
import { useMedia } from 'use-media'

export const MainCarousel = ({ content }) => {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pressStartRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const height = use100vh()
  const isMobile = useMedia({
    maxWidth: 767,
    pointer: 'coarse'
  })

  useEffect(() => {
    const slideTheme = content[active]?.theme ?? 'light'
    const startThemeTransition = setTimeout(() => {
      if (theme !== slideTheme) {
        setTheme(slideTheme)
      }
    }, 50)

    return () => clearTimeout(startThemeTransition)
  }, [setTheme, active, theme])

  const totalDuration = 8000
  const holdThreshold = 500

  // Start the timer and progress bar
  const startTimer = () => {
    if (!isPaused) {
      const initialProgressTime = progress * (totalDuration / 100)
      startTimeRef.current = Date.now() - initialProgressTime

      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current
        setProgress((elapsedTime / totalDuration) * 100)

        if (elapsedTime >= totalDuration) {
          clearInterval(intervalRef.current)
          setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
          setProgress(0)
        }
      }, 16)
    }
  }

  // Pause the timer and store progress
  const pauseTimer = () => {
    setIsPaused(true)
    clearInterval(intervalRef.current)
  }

  // Resume the timer after pause
  const resumeTimer = () => {
    setIsPaused(false)
    startTimer() // Restart from the last saved progress
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(intervalRef.current)
  }, [active, isPaused])

  const handlePrev = () => {
    clearInterval(intervalRef.current)
    setActive((prev) => (prev > 0 ? prev - 1 : content.length - 1))
    setProgress(0)
    startTimer()
  }

  const handleNext = () => {
    clearInterval(intervalRef.current)
    setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
    setProgress(0)
    startTimer()
  }

  const handleMouseDown = () => {
    pressStartRef.current = Date.now()
    pauseTimer()
  }

  const handleMouseUp = (e) => {
    const pressDuration = Date.now() - pressStartRef.current
    const screenWidth = window.innerWidth
    const clickX = e.clientX

    // Only navigate if the hold duration was short (distinguish hold from click)
    if (pressDuration < holdThreshold) {
      if (clickX < screenWidth / 2) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    resumeTimer()
  }

  const handleMouseLeave = () => {
    if (isPaused) resumeTimer()
  }

  const handleTouchStart = (e) => {
    pressStartRef.current = Date.now()
    pauseTimer()
    const startTouchX = e.touches[0].clientX
    e.target.dataset.startTouchX = startTouchX // Store touch start point for swipe detection
  }

  const handleTouchEnd = (e) => {
    const touchX = e.changedTouches[0].clientX
    const screenWidth = window.innerWidth
    const pressDuration = Date.now() - pressStartRef.current
    const startTouchX = e.target.dataset.startTouchX

    // Detect if it was a swipe gesture
    const swipeThreshold = 50
    if (Math.abs(touchX - startTouchX) > swipeThreshold) {
      if (touchX > startTouchX) {
        handlePrev() // Swipe right
      } else {
        handleNext() // Swipe left
      }
    } else if (pressDuration < holdThreshold) {
      // Only navigate if touch was not a long hold
      if (touchX < screenWidth / 2) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    resumeTimer()
  }

  const shouldRenderSlide = (i) => {
    return (
      i === active ||
      i === active + 1 ||
      i === active - 1 ||
      (active === content.length - 1 && i === 0)
    )
  }

  return (
    <section
      className={'relative w-screen overflow-hidden select-none'}
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {content.map(
        (item, i) =>
          shouldRenderSlide(i) && (
            <div
              key={item.id}
              className={clsx(
                'absolute inset-0 transition-opacity duration-200',
                active === i ? 'opacity-100 visible' : 'opacity-0 invisible'
              )}
            >
              <div className="grid grid-cols-12 grid-rows-12 max-h-full h-full">
                {item.assets.map((asset) => {
                  switch (asset.__typename) {
                    case 'Image':
                      return (
                        <Image
                          key={asset.id}
                          src={asset.file.url}
                          width={asset.file.width}
                          height={asset.file.height}
                          alt={asset.file.alt ?? ''}
                          className={clsx(
                            'object-center h-full object-contain pointer-events-none',
                            asset.className,
                            !asset.className.includes('row-') &&
                              'row-span-full mb-4'
                          )}
                          draggable="false"
                          loading={i === active ? 'eager' : 'lazy'}
                          priority={i === active}
                        />
                      )
                    case 'Video':
                      return (
                        <StandardPlayer
                          key={asset.id}
                          {...asset}
                          className={clsx(
                            'object-center h-full pointer-events-none',
                            asset.className,
                            !asset.className.includes('row-') &&
                              'row-span-full mb-4'
                          )}
                          paused={isPaused}
                        />
                      )
                    default:
                      return null
                  }
                })}
              </div>
              {item.caption?.raw && (
                <div className="fixed bottom-8 left-16">
                  <Caption content={item.caption} />
                </div>
              )}
            </div>
          )
      )}

      <motion.div
        animate={{
          opacity: isPaused ? 0 : 1,
          transition: { delay: 0.1, duration: 0.1 }
        }}
        className="fixed top-0 left-0 p-4"
      >
        (Hold to Pause)
      </motion.div>

      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 flex gap-1 px-4 py-2',
          isPaused && 'opacity-0'
        )}
      >
        {content.map((_, i) => (
          <ProgressBar
            key={i}
            progress={progress}
            isActive={i === active}
            isViewed={i < active}
          />
        ))}
      </div>
    </section>
  )
}
