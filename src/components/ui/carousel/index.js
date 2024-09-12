'use client'
import { Caption } from '@/components/ui/rich-texts'
import { StandardPlayer } from '@/components/ui/players'
import Image from 'next/image'
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from './progressBar'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { use100vh } from 'react-div-100vh'
import { throttle } from 'lodash'

export const MainCarousel = ({ content }) => {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const pauseTimeRef = useRef(null)
  const pressStartRef = useRef(null)
  const { theme, setTheme } = useTheme()
  const height = use100vh()

  useEffect(() => {
    const slideTheme = content[active]?.theme ?? 'light'
    const startThemeTransition = setTimeout(() => {
      if (theme !== slideTheme) {
        setTheme(slideTheme)
      }
    }, 50) // Debounce for theme switching

    return () => clearTimeout(startThemeTransition)
  }, [setTheme, active, theme])

  const totalDuration = 8000 // Total duration of each slide in milliseconds
  const holdThreshold = 500 // Duration in ms to consider a hold

  const startTimer = () => {
    if (!isPaused) {
      startTimeRef.current = Date.now() - progress * (totalDuration / 100)
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current
        setProgress((elapsedTime / totalDuration) * 100)

        if (elapsedTime >= totalDuration) {
          clearInterval(intervalRef.current)
          setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
          setProgress(0)
        }
      }, 16) // 16ms for smoother progress (roughly 60fps)
    }
  }

  const pauseTimer = () => {
    setIsPaused(true)
    clearInterval(intervalRef.current)
    pauseTimeRef.current = Date.now()
  }

  const resumeTimer = () => {
    setIsPaused(false)
    const pauseDuration = Date.now() - pauseTimeRef.current
    startTimeRef.current += pauseDuration // Adjust the start time by the pause duration
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(intervalRef.current)
  }, [active, isPaused])

  const handlePrev = () => {
    setActive((prev) => (prev > 0 ? prev - 1 : content.length - 1))
    setProgress(0)
  }

  const handleNext = () => {
    setActive((prev) => (prev < content.length - 1 ? prev + 1 : 0))
    setProgress(0)
  }

  const handleMouseDown = () => {
    pressStartRef.current = Date.now()
    pauseTimer()
  }

  const handleMouseUp = () => {
    const pressDuration = Date.now() - pressStartRef.current
    if (pressDuration >= holdThreshold) {
      resumeTimer()
    } else {
      resumeTimer()
      handleNext()
    }
  }

  const handleMouseLeave = () => {
    if (isPaused) resumeTimer()
  }

  const throttledMouseDown = useRef(throttle(handleMouseDown, 200)).current
  const throttledMouseUp = useRef(throttle(handleMouseUp, 200)).current

  const handleTouchStart = throttledMouseDown
  const handleTouchEnd = throttledMouseUp

  return (
    <section
      className={'relative w-screen overflow-hidden select-none'}
      style={{ height }}
      onMouseDown={throttledMouseDown}
      onMouseUp={throttledMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {content.map((item, i) => (
        <div
          key={item.id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-100',
            active === i ? 'opacity-100 visible' : 'opacity-0 invisible'
          )} // Only show the active item and hide others
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
                        'object-center h-full object-contain',
                        asset.className,
                        !asset.className.includes('row-') &&
                          'row-span-full mb-4'
                      )}
                      draggable="false"
                      loading={i === 0 ? 'eager' : 'lazy'} // lazy-load non-first images
                      priority={i === 0} // prioritize the first image for faster rendering
                    />
                  )
                case 'Video':
                  return (
                    <StandardPlayer
                      key={asset.id}
                      {...asset}
                      className={clsx(
                        'object-center h-full',
                        asset.className,
                        !asset.className.includes('row-') &&
                          'row-span-full mb-4'
                      )}
                      paused={isPaused}
                    />
                  )
                default: {
                  console.log(asset)
                  return null
                }
              }
            })}
          </div>
          {item.caption?.raw && (
            <div className="fixed bottom-8 left-16">
              <Caption content={item.caption} />
            </div>
          )}
        </div>
      ))}
      <AnimatePresence>
        {!isPaused && (
          <div className="fixed top-0 left-0 p-4">(Hold to Pause)</div>
        )}
      </AnimatePresence>

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
            onClick={() => {
              if (i !== active) {
                setActive(i)
                setProgress(0)
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}
