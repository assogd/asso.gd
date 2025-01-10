'use client'
import { Caption } from '@/components/ui/rich-texts'
import { StandardPlayer } from '@/components/ui/players'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from './progressBar'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { use100vh } from 'react-div-100vh'
import { useMedia } from 'use-media'
import { usePreloadAdjacentAssets } from '@/hooks/carousel/use-preload-assets'
import { useFirstImageLoaded } from '@/hooks/use-first-image-loaded'

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
  const isMobile = useMedia({ maxWidth: 767, pointer: 'coarse' })
  const isSmallScreen = useMedia({ maxWidth: '640px' })
  const { setIsFirstImageLoaded } = useFirstImageLoaded()
  const [isFirstImageLoadedInternally, setIsFirstImageLoadedInternally] =
    useState(false)

  //usePreloadAdjacentAssets(content, active)

  useEffect(() => {
    const slideTheme = content[active]?.theme ?? 'light'
    if (theme !== slideTheme) {
      setTheme(slideTheme)
    }
  }, [setTheme, active, theme])

  const handleFirstImageLoad = () => {
    if (!isFirstImageLoadedInternally) {
      setIsFirstImageLoadedInternally(true)
      setIsFirstImageLoaded(true)
    }
  }

  useEffect(() => {
    // Fallback in case the first image never loads
    const timer = setTimeout(() => {
      if (!isFirstImageLoadedInternally) {
        setIsFirstImageLoadedInternally(true)
        setIsFirstImageLoaded(true)
      }
    }, 5000) // e.g., 5 seconds

    return () => clearTimeout(timer)
  }, [isFirstImageLoadedInternally, setIsFirstImageLoaded])

  const desktopShortHoldThreshold = 250
  const mobileShortHoldThreshold = 100
  const holdThreshold = 500
  const shortHoldThreshold = isMobile
    ? mobileShortHoldThreshold
    : desktopShortHoldThreshold
  const swipeThreshold = 50

  const getSlideDuration = () => content[active]?.duration ?? 5000
  const getTotalDuration = () =>
    content.reduce((sum, slide) => sum + (slide.duration ?? 5000), 0)

  const totalDuration = getTotalDuration()

  const startTimer = () => {
    if (!isPaused) {
      const currentDuration = getSlideDuration()
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
      }, 100)
    }
  }

  const pauseTimer = () => {
    setIsPaused(true)
    clearInterval(intervalRef.current)
  }

  const resumeTimer = () => {
    setIsPaused(false)
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(intervalRef.current)
  }, [active, isPaused])

  const debounceNavigation = (fn, delay) => {
    let timeout
    return (...args) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => fn(...args), delay)
    }
  }

  const handlePrev = () => {
    if (!isLocked) {
      setIsLocked(true)
      clearInterval(intervalRef.current)
      setActive((prev) => (prev > 0 ? prev - 1 : content.length - 1))
      setProgress(0)
      startTimer()
      setTimeout(() => setIsLocked(false), 300)
    }
  }

  const handleNext = () => {
    if (!isLocked) {
      setIsLocked(true)
      clearInterval(intervalRef.current)
      setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
      setProgress(0)
      startTimer()
      setTimeout(() => setIsLocked(false), 300)
    }
  }

  const handleMouseDown = () => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false
    isSwipingRef.current = false
    setWasHolding(false)
    pauseTimer()
  }

  const handleMouseUp = (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      // Ignore clicks on links
      return
    }

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
        clickX < screenWidth / 2 ? handlePrev() : handleNext()
      }
    }

    isHoldingRef.current = false
    setWasHolding(false)
    resumeTimer()
  }

  const handleTouchStart = (e) => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false
    isSwipingRef.current = false
    setWasHolding(false)
    pauseTimer()
    const startTouchX = e.touches[0].clientX
    e.target.dataset.startTouchX = startTouchX
  }

  const handleTouchMove = (e) => {
    const startTouchX = parseFloat(e.target.dataset.startTouchX || 0)
    const currentTouchX = e.touches[0].clientX

    if (Math.abs(currentTouchX - startTouchX) > swipeThreshold) {
      isSwipingRef.current = true
    }
  }

  const handleTouchEnd = (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      // Ignore touch events on links
      return
    }

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
        touchX < screenWidth / 2 ? handlePrev() : handleNext()
      } else if (isSwipingRef.current && !wasHolding) {
        touchX > startTouchX ? handlePrev() : handleNext()
      }
    }

    isHoldingRef.current = false
    setWasHolding(false)
    resumeTimer()
  }

  const shouldRenderSlide = (i) =>
    i === active ||
    i === (active + 1) % content.length ||
    i === (active + 2) % content.length ||
    i === (active - 1 + content.length) % content.length ||
    i === (active - 2 + content.length) % content.length

  return (
    <section
      className={'relative w-screen overflow-hidden select-none'}
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
                `slide-${i + 1}`,
                'absolute inset-0 transition-opacity duration-0',
                active === i ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div className="grid grid-cols-12 grid-rows-12 max-h-full h-full items-center">
                {item.assets.map((asset) => {
                  switch (asset.__typename) {
                    case 'Image':
                      const isFullWidthDefault =
                        asset.className.includes('object-cover')

                      const sizes =
                        '(max-width: 768px) 100vw, (min-width: 769px) and (max-width: 1200px) 100vw, 100vw'

                      const { width, height } =
                        asset.file.width && asset.file.height
                          ? calculateResizedDimensions(
                              asset.file.width,
                              asset.file.height,
                              1600,
                              1200
                            )
                          : { width: 1600, height: 1200 }

                      return (
                        <Image
                          key={asset.id}
                          src={asset.file.url}
                          width={width}
                          height={height}
                          alt={asset.file.alt ?? ''}
                          className={clsx(
                            'object-center h-full w-full object-contain pointer-events-none',
                            asset.className,
                            !isFullWidthDefault && 'max-h-[870px]',
                            !asset.className.includes('row-') &&
                              'row-span-full mb-4'
                          )}
                          sizes={sizes}
                          draggable="false"
                          loading={'eager'}
                          priority={true}
                          onLoad={i === 0 && handleFirstImageLoad}
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
                          preload={'auto'}
                        />
                      )
                    default:
                      return null
                  }
                })}
              </div>
              {item.caption?.raw && (
                <motion.div
                  className="fixed bottom-8 inset-x-4 text-center"
                  animate={{
                    y: isPaused ? '1rem' : 0
                  }}
                  transition={{
                    y: {
                      duration: isPaused ? 0.5 : 0.2, // Duration when going to 0
                      delay: isPaused ? 2.2 : 0 // Delay only when going to 0
                    }
                  }}
                >
                  <Caption content={item.caption} />
                </motion.div>
              )}
            </div>
          )
      )}

      <motion.div
        className="fixed top-0 left-0 p-4"
        animate={{
          opacity: isPaused ? 0 : 1
        }}
        transition={{
          opacity: {
            duration: isPaused ? 0.5 : 0.2, // Duration when going to 0
            delay: isPaused ? 2 : 0 // Delay only when going to 0
          }
        }}
      >
        <AnimatePresence mode="wait">
          {isPaused ? (
            <motion.div
              key="release"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: isPaused ? 0 : 0.2,
                duration: 0
              }}
            >
              {isSmallScreen ? '(Release)' : '(Release when ready)'}
            </motion.div>
          ) : (
            <motion.div
              key="hold"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0
              }}
            >
              {isSmallScreen ? '(Hold)' : '(Hold to pause)'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className={clsx(
          'fixed left-1/2 -translate-x-1/2 top-0 select-none z-10 p-4 uppercase'
        )}
        animate={
          {
            //y: isPaused ? '1rem' : 0
          }
        }
        transition={{
          y: {
            duration: isPaused ? 0.5 : 0.2, // Duration when going to 0
            delay: isPaused ? 2.2 : 0 // Delay only when going to 0
          }
        }}
      >
        {isSmallScreen ? 'Asso' : 'Asso Stockholm'}
      </motion.div>

      <motion.nav
        className={clsx('fixed right-0 top-0 z-10', 'select-none')}
        animate={{
          opacity: isPaused ? 0 : 1
        }}
        transition={{
          opacity: {
            duration: isPaused ? 0.5 : 0.2, // Duration when going to 0
            delay: isPaused ? 2 : 0 // Delay only when going to 0
          }
        }}
      >
        <Link href="/about" className="block p-4">
          {isSmallScreen ? 'About' : 'About the studio'}
        </Link>
      </motion.nav>

      <motion.div
        className={clsx('fixed bottom-0 left-0 right-0 flex gap-1 px-4 py-2')}
        animate={{
          opacity: isPaused ? 0 : 1
        }}
        transition={{
          opacity: {
            duration: isPaused ? 0.5 : 0.2, // Duration when going to 0
            delay: isPaused ? 2 : 0 // Delay only when going to 0
          }
        }}
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
      </motion.div>
    </section>
  )
}

const calculateResizedDimensions = (
  originalWidth,
  originalHeight,
  maxWidth,
  maxHeight
) => {
  const aspectRatio = originalWidth / originalHeight

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    if (originalWidth / maxWidth > originalHeight / maxHeight) {
      return { width: maxWidth, height: Math.round(maxWidth / aspectRatio) }
    } else {
      return { width: Math.round(maxHeight * aspectRatio), height: maxHeight }
    }
  }

  return { width: originalWidth, height: originalHeight } // No resizing needed
}
