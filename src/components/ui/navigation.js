'use client'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useMedia } from 'use-media'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export const Navigation = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isMobile = useMedia({ maxWidth: '638px' })

  return (
    <AnimatePresence>
      {isHome ? (
        <>
          <motion.div
            key={'adddCAPTION'}
            className={clsx('fixed left-0 bottom-4 select-none z-10')}
            initial={{ y: 0, transition: { type: 'tween', duration: 0.5 } }}
            animate={{ y: 0, transition: { type: 'tween', duration: 0.5 } }}
            exit={{ y: 0, transition: { type: 'tween', duration: 0.5 } }}
          >
            <Link href="/" className={'block p-4'}>
              ADDD:
            </Link>
          </motion.div>
          <nav className={clsx('fixed right-0 top-0 z-10', 'select-none')}>
            <Link href="/about" className={'block p-4'}>
              About the Studio
            </Link>
          </nav>
        </>
      ) : (
        <motion.div
          key={'adddANNOUNCEMENT'}
          className={clsx('relative inset-x-0 select-none z-10 h-28')}
        >
          <nav
            className={
              'inset-x-0 flex gap-2 items-baseline justify-between px-4 py-2 bg-white'
            }
          >
            <Link href="/" className={'block'}>
              ADDD<span className="hidden md:block">:</span>
            </Link>
            <Link
              href="/"
              className={
                'whitespace-nowrap absolute right-4 sm:static shrink-0'
              }
            >
              Back to Images
            </Link>
          </nav>
          <Announcement />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Announcement = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const y = useTransform(scrollY, [0, 100], [0, -120])

  return (
    <motion.div
      className="fixed bg-white border border-black m-4 mt-9 p-4 text-center md:border-0 md:mt-0 md:p-0 md:text-left md:left-16 top-0"
      style={{ opacity, y }} // Bind opacity to the animated value
    >
      We can write something here, like an announcement
    </motion.div>
  )
}

const HackyMarquee = ({ text, speed, divider = ' | ' }) => {
  const [currentText, setCurrentText] = useState(
    text + divider + text + divider
  ) // Add divider to the text
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fullText = text + divider // Add divider to the full text
    const interval = setInterval(() => {
      setCurrentText((prevText) => {
        // Move one character at a time
        return prevText.slice(1) + prevText[0]
      })

      // Update index for next rotation
      setIndex((prevIndex) => (prevIndex + 1) % fullText.length)
    }, speed)

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [text, speed, divider])

  return (
    <div
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {currentText}
    </div>
  )
}
