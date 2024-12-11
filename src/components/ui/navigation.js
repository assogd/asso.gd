'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useMedia } from 'use-media'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import Announcement from '@/components/announcement'

export const Navigation = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isSmallScreen = useMedia({ maxWidth: '640px' }) // Detect screens smaller than sm (640px)
  const [showNotice, setShowNotice] = useState(false)
  const [noticeText, setNoticeText] = useState(
    isSmallScreen ? '(Hold...)' : '(Hold to keep)'
  ) // Dynamic notice text
  const isHoldingRef = useRef(false) // Tracks if the user is still holding
  const holdStartTimeRef = useRef(null) // Tracks the start time of the hold
  const textTimeoutRef = useRef(null) // Tracks timeout for changing text
  const visibilityTimeoutRef = useRef(null) // Tracks timeout for hiding notice

  const handleHoldStart = () => {
    // Mark the start of the hold
    isHoldingRef.current = true
    holdStartTimeRef.current = Date.now()

    // Show the announcement immediately
    setShowNotice(true)
    setNoticeText(isSmallScreen ? '(Hold...)' : '(Hold to keep)') // Show initial text

    // Change to "Release..." after 1 second
    textTimeoutRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        setNoticeText(isSmallScreen ? '(Release)' : '(Release to exit)')
      }
    }, 2000)
  }

  const handleHoldEnd = () => {
    // Mark the end of the hold
    isHoldingRef.current = false

    // Clear any pending text change timeout
    clearTimeout(textTimeoutRef.current)

    // Calculate how long the announcement has been visible
    const holdDuration = Date.now() - holdStartTimeRef.current

    if (holdDuration >= 1000) {
      // If the minimum duration has passed, hide immediately
      setShowNotice(false)
      setNoticeText(isSmallScreen ? 'Hold...' : 'Hold to continue') // Reset text
    } else {
      // Otherwise, ensure it remains visible until 1 second has elapsed
      const remainingTime = 1000 - holdDuration
      visibilityTimeoutRef.current = setTimeout(() => {
        if (!isHoldingRef.current) {
          setShowNotice(false)
          setNoticeText(isSmallScreen ? 'Hold...' : 'Hold to continue') // Reset text
        }
      }, remainingTime)
    }
  }

  // Clear timeouts if the component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(textTimeoutRef.current)
      clearTimeout(visibilityTimeoutRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {isHome ? (
        <></>
      ) : (
        <>
          <motion.nav
            className="p-4 flex items-center relative z-0 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0, delay: 1 }}
          >
            {/* Hold-to-show "Notice" */}
            <div
              className="whitespace-nowrap absolute left-0 p-4 cursor-pointer"
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              {isSmallScreen ? 'Notice' : 'Announcement'}
            </div>

            <Link
              href="/"
              className={'block uppercase relative left-1/2 -translate-x-1/2'}
            >
              Association
            </Link>
            <Link href="/" className={'whitespace-nowrap absolute right-0 p-4'}>
              {isSmallScreen ? 'Images' : 'Back to images'}
            </Link>
          </motion.nav>
          <motion.div
            className={clsx(
              'fixed inset-0 z-10 bg-white text-black flex items-center justify-center pointer-events-none text-center p-4 sm:p-8 pb-12'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: showNotice ? 1 : 0 }}
            transition={{ duration: 0 }}
          >
            <div className="absolute left-0 top-0 p-4">{noticeText}</div>
            <div
              className={
                'absolute top-0 left-1/2 -translate-x-1/2 uppercase p-4'
              }
            >
              Association
            </div>
            <Announcement />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
