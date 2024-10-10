'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
            key={'adddCAPTION' + pathname}
            className={clsx('fixed left-0 bottom-4 select-none z-10')}
            initial={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            exit={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2 }
            }}
          >
            <Link href="/" className={'block p-4'}>
              ADDD:
            </Link>
          </motion.div>
          <motion.nav
            className={clsx('fixed right-0 top-0 z-10', 'select-none')}
            initial={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            exit={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2 }
            }}
          >
            <Link href="/about" className={'block p-4'}>
              About the Studio
            </Link>
          </motion.nav>
        </>
      ) : (
        <motion.div
          key={'adddANNOUNCEMENT' + pathname}
          className={clsx('relative inset-x-0 select-none z-10')}
          initial={{
            y: 0,
            opacity: 0,
            transition: { type: 'tween', duration: 0.2, delay: 1 }
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { type: 'tween', duration: 0.2, delay: 1 }
          }}
          exit={{
            y: 0,
            opacity: 0,
            transition: { type: 'tween', duration: 0.2 }
          }}
        >
          <motion.nav
            className={
              'inset-x-0 flex gap-2 items-baseline justify-between p-4 bg-white'
            }
            initial={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: 'tween', duration: 0.2, delay: 1 }
            }}
            exit={{
              y: 0,
              opacity: 0,
              transition: { type: 'tween', duration: 0.2 }
            }}
          >
            <Link href="/" className={'block'}>
              ADDD:
            </Link>
            <Link
              href="/"
              className={
                'whitespace-nowrap absolute right-4 sm:static shrink-0'
              }
            >
              Back to Images
            </Link>
          </motion.nav>
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
