'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import useScroll from '@/hooks/use-scroll'
import clsx from 'clsx'
import { useMedia } from 'use-media'
import { usePathname } from 'next/navigation'

import React, { useState, useEffect } from 'react'

export const Navigation = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const scrolled = useScroll()
  const isMobile = useMedia({ maxWidth: '638px' })

  return (
    <AnimatePresence>
      {isHome ? (
        <motion.div
          key={'adddCAPTION'}
          className={clsx('fixed left-0 bottom-4 select-none')}
          initial={{ y: 200, transition: { type: 'tween', duration: 0.5 } }}
          animate={{ y: 0, transition: { type: 'tween', duration: 0.5 } }}
          exit={{ y: 200, transition: { type: 'tween', duration: 0.5 } }}
        >
          <Link href="/" className={'block p-4'}>
            ADDD:
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key={'adddANNOUNCEMENT'}
          className={clsx(
            'relative inset-x-0 select-none top-0 flex gap-2 items-baseline justify-between p-4 bg-white'
          )}
          initial={{
            y: -200
          }}
          animate={{
            y: 0
          }}
          exit={{
            y: -200
          }}
          transition={{ type: 'tween', duration: 0.5 }}
        >
          <div className="flex gap-x-2 flex-col sm:flex-row grow">
            <Link href="/" className={'block'}>
              ADDD:
            </Link>
            <span>We can write something here, like an announcement</span>
          </div>
          <Link
            href="/"
            className={'whitespace-nowrap absolute right-4 sm:static shrink-0'}
          >
            Back to Images
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
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
