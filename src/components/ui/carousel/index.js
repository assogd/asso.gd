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
  const [wasHolding, setWasHolding] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const router = useRouter()
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pressStartRef = useRef(null)
  const isHoldingRef = useRef(false)
  const isSwipingRef = useRef(false)
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

  const desktopShortHoldThreshold = 250
  const mobileShortHoldThreshold = 100
  const holdThreshold = 500
  const shortHoldThreshold = isMobile
    ? mobileShortHoldThreshold
    : desktopShortHoldThreshold
  const swipeThreshold = 50

  // Adjust this function to use the current slide's duration
  const getSlideDuration = () => {
    return content[active]?.duration ?? 8000 // Default to 8000 if no duration is provided
  }

  const getTotalDuration = () => {
    return content.reduce((sum, slide) => sum + (slide.duration ?? 8000), 0)
  }

  const totalDuration = getTotalDuration()

  // Start the timer and progress bar with throttling
  const startTimer = () => {
    if (!isPaused) {
      const currentDuration = getSlideDuration() // Get the duration for the current slide
      const initialProgressTime = progress * (currentDuration / 100)
      startTimeRef.current = Date.now() - initialProgressTime

      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current
        setProgress((elapsedTime / currentDuration) * 100)

        if (elapsedTime >= currentDuration) {
          clearInterval(intervalRef.current)
          setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
          setProgress(0)
        }
      }, 100) // Throttled to 100ms
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
    if (!isLocked) {
      setIsLocked(true) // Prevent further navigation
      clearInterval(intervalRef.current)
      setActive((prev) => (prev > 0 ? prev - 1 : content.length - 1))
      setProgress(0)
      startTimer()
      setTimeout(() => setIsLocked(false), 300) // Debounce time of 300ms
    }
  }

  const handleNext = () => {
    if (!isLocked) {
      setIsLocked(true) // Prevent further navigation
      clearInterval(intervalRef.current)
      setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
      setProgress(0)
      startTimer()
      setTimeout(() => setIsLocked(false), 300) // Debounce time of 300ms
    }
  }

  const handleMouseDown = () => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false // Reset hold flag
    isSwipingRef.current = false // Reset swipe flag
    setWasHolding(false) // Reset the was holding state
    pauseTimer()
  }

  const handleMouseUp = (e) => {
    const pressDuration = Date.now() - pressStartRef.current
    const screenWidth = window.innerWidth
    const clickX = e.clientX

    if (pressDuration >= shortHoldThreshold && pressDuration < holdThreshold) {
      setWasHolding(true)
    } else if (pressDuration >= holdThreshold) {
      isHoldingRef.current = true
      setWasHolding(true)
    } else {
      if (!isHoldingRef.current && !isSwipingRef.current && !wasHolding) {
        if (clickX < screenWidth / 2) {
          handlePrev()
        } else {
          handleNext()
        }
      }
    }

    isHoldingRef.current = false
    setWasHolding(false)
    resumeTimer()
  }

  const handleMouseLeave = () => {
    if (isPaused) resumeTimer()
  }

  const handleTouchStart = (e) => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false // Reset hold flag
    isSwipingRef.current = false // Reset swipe flag
    setWasHolding(false) // Reset the was holding state
    pauseTimer()
    const startTouchX = e.touches[0].clientX
    e.target.dataset.startTouchX = startTouchX // Store touch start point for swipe detection
  }

  const handleTouchMove = (e) => {
    const startTouchX = parseFloat(e.target.dataset.startTouchX || 0)
    const currentTouchX = e.touches[0].clientX

    if (Math.abs(currentTouchX - startTouchX) > swipeThreshold) {
      isSwipingRef.current = true
    }
  }

  const handleTouchEnd = (e) => {
    const touchX = e.changedTouches[0].clientX
    const screenWidth = window.innerWidth
    const pressDuration = Date.now() - pressStartRef.current
    const startTouchX = parseFloat(e.target.dataset.startTouchX)

    if (pressDuration >= shortHoldThreshold && pressDuration < holdThreshold) {
      setWasHolding(true)
    } else if (pressDuration >= holdThreshold) {
      isHoldingRef.current = true
      setWasHolding(true)
    } else {
      if (!isHoldingRef.current && !isSwipingRef.current && !wasHolding) {
        if (touchX < screenWidth / 2) {
          handlePrev()
        } else {
          handleNext()
        }
      } else if (isSwipingRef.current && !wasHolding) {
        if (touchX > startTouchX) {
          handlePrev() // Swipe right
        } else {
          handleNext() // Swipe left
        }
      }
    }

    isHoldingRef.current = false
    setWasHolding(false)
    resumeTimer()
  }

  // Render fewer slides on mobile (only active one)
  const shouldRenderSlide = (i) => {
    if (isMobile) {
      return i === active // Only render the active slide on mobile
    }
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
      onTouchMove={handleTouchMove}
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
                          preload={i === active ? 'auto' : 'none'}
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
        {content.map((slide, i) => (
          <ProgressBar
            key={i}
            progress={progress}
            isActive={i === active}
            isViewed={i < active}
            duration={slide.duration ?? 8000}
            totalDuration={totalDuration}
          />
        ))}
      </div>
    </section>
  )
}
