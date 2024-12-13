'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useMedia } from 'use-media'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import Announcement from '@/components/announcement'

export const Navigation = ({ align }) => {
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
        setNoticeText(isSmallScreen ? '(Release)' : '(Release when ready)')
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
              className="whitespace-nowrap absolute left-0 p-4 cursor-pointer flex gap-1 items-baseline"
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              {isSmallScreen ? 'Notice' : 'Announcement'} <Notice />
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
              'fixed inset-0 z-10 bg-white text-black flex items-center justify-center pointer-events-none text-center p-4 pb-8 sm:p-8 sm:pb-12'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: showNotice ? 1 : 0 }}
            transition={{ duration: 0 }}
          >
            <div
              className={clsx(
                'absolute left-0 p-4',
                align === 'top' ? 'top-0' : 'bottom-0'
              )}
            >
              {noticeText}
            </div>
            <div
              className={clsx(
                'absolute left-1/2 -translate-x-1/2 uppercase p-4',
                align === 'top' ? 'top-0' : 'bottom-0'
              )}
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

const Notice = () => {
  return (
    <svg
      width="23"
      height="17"
      viewBox="0 0 23 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="translate-y-[.1em]"
    >
      <path
        d="M17.8142 0.427979C18.2102 0.427979 18.5582 0.493978 18.8582 0.625978C19.1702 0.745978 19.4642 0.955978 19.7402 1.25598L21.8462 3.50598C22.1942 3.86598 22.4162 4.20798 22.5122 4.53198C22.6202 4.84398 22.6742 5.31198 22.6742 5.93598V10.724C22.6742 11.348 22.6202 11.822 22.5122 12.146C22.4162 12.458 22.1942 12.794 21.8462 13.154L19.7402 15.404C19.4642 15.704 19.1702 15.914 18.8582 16.034C18.5582 16.166 18.2102 16.232 17.8142 16.232H17.0042C16.6922 16.232 16.4522 16.154 16.2842 15.998C16.1162 15.842 16.0322 15.62 16.0322 15.332V15.242C16.0322 14.954 16.1162 14.732 16.2842 14.576C16.4522 14.42 16.6922 14.342 17.0042 14.342H17.2742C17.5382 14.342 17.7422 14.318 17.8862 14.27C18.0422 14.222 18.1802 14.126 18.3002 13.982L18.5162 13.748C18.6842 13.568 18.7862 13.412 18.8222 13.28C18.8702 13.136 18.8942 12.914 18.8942 12.614V4.04598C18.8942 3.73398 18.8702 3.51198 18.8222 3.37998C18.7862 3.24798 18.6842 3.09198 18.5162 2.91198L18.3002 2.67798C18.1802 2.53398 18.0422 2.43798 17.8862 2.38998C17.7422 2.34198 17.5382 2.31798 17.2742 2.31798H17.0042C16.6922 2.31798 16.4522 2.23998 16.2842 2.08398C16.1162 1.92798 16.0322 1.70598 16.0322 1.41798V1.32798C16.0322 1.03998 16.1162 0.817978 16.2842 0.661978C16.4522 0.505978 16.6922 0.427979 17.0042 0.427979H17.8142Z"
        fill="black"
      />
      <path
        d="M12.9067 14.09C12.6067 14.09 12.3727 14.006 12.2047 13.838C12.0487 13.658 11.9707 13.406 11.9707 13.082V7.808C11.9707 7.628 11.9227 7.49 11.8267 7.394C11.7307 7.298 11.5927 7.25 11.4127 7.25H9.9727C9.4207 7.25 8.9947 7.118 8.6947 6.854C8.4067 6.59 8.2627 6.212 8.2627 5.72V5.45C8.2627 4.958 8.4067 4.58 8.6947 4.316C8.9947 4.052 9.4207 3.92 9.9727 3.92H11.4127C11.5927 3.92 11.7307 3.872 11.8267 3.776C11.9227 3.68 11.9707 3.542 11.9707 3.362V2.318C11.9707 1.994 12.0487 1.748 12.2047 1.58C12.3727 1.4 12.6067 1.31 12.9067 1.31H13.0867C13.3867 1.31 13.6147 1.4 13.7707 1.58C13.9387 1.748 14.0227 1.994 14.0227 2.318V13.082C14.0227 13.406 13.9387 13.658 13.7707 13.838C13.6147 14.006 13.3867 14.09 13.0867 14.09H12.9067Z"
        className="blinking-path"
        fill="black"
      />
      <path
        d="M5.21986 16.232C4.82386 16.232 4.46986 16.166 4.15786 16.034C3.85786 15.914 3.56986 15.704 3.29386 15.404L1.18786 13.154C0.839863 12.794 0.611863 12.458 0.503863 12.146C0.407863 11.822 0.359863 11.348 0.359863 10.724V5.93598C0.359863 5.31198 0.407863 4.84398 0.503863 4.53198C0.611863 4.20798 0.839863 3.86598 1.18786 3.50598L3.29386 1.25598C3.56986 0.955978 3.85786 0.745978 4.15786 0.625978C4.46986 0.493978 4.82386 0.427979 5.21986 0.427979H6.02986C6.34186 0.427979 6.58186 0.505978 6.74986 0.661978C6.91786 0.817978 7.00186 1.03998 7.00186 1.32798V1.41798C7.00186 1.70598 6.91786 1.92798 6.74986 2.08398C6.58186 2.23998 6.34186 2.31798 6.02986 2.31798H5.75986C5.49586 2.31798 5.28586 2.34198 5.12986 2.38998C4.98586 2.43798 4.85386 2.53398 4.73386 2.67798L4.51786 2.91198C4.36186 3.09198 4.25986 3.24798 4.21186 3.37998C4.16386 3.51198 4.13986 3.73398 4.13986 4.04598V12.614C4.13986 12.914 4.16386 13.136 4.21186 13.28C4.25986 13.412 4.36186 13.568 4.51786 13.748L4.73386 13.982C4.85386 14.126 4.98586 14.222 5.12986 14.27C5.28586 14.318 5.49586 14.342 5.75986 14.342H6.02986C6.34186 14.342 6.58186 14.42 6.74986 14.576C6.91786 14.732 7.00186 14.954 7.00186 15.242V15.332C7.00186 15.62 6.91786 15.842 6.74986 15.998C6.58186 16.154 6.34186 16.232 6.02986 16.232H5.21986Z"
        fill="black"
      />
    </svg>
  )
}
