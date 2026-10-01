'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

// Set by ProjectModal right before it navigates back, so closing the modal
// doesn't retrigger this intro overlay. Any other navigation (including
// Home <-> About) should still show it, matching the original behavior.
const SKIP_COVER_KEY = 'asso:skip-mega-cover'

export default function Template({ children }) {
  const pathname = usePathname()
  const isProjectRoute = pathname?.startsWith('/project/')
  const [showOverlay, setShowOverlay] = useState(false)
  const skippedPathRef = useRef(null)

  useLayoutEffect(() => {
    if (isProjectRoute) {
      skippedPathRef.current = null
      setShowOverlay(false)
      return
    }

    const skipCover = window.sessionStorage.getItem(SKIP_COVER_KEY)
    if (skipCover || skippedPathRef.current === pathname) {
      if (skipCover) {
        window.setTimeout(() => {
          window.sessionStorage.removeItem(SKIP_COVER_KEY)
        }, 0)
      }
      skippedPathRef.current = pathname
      setShowOverlay(false)
      return
    }

    skippedPathRef.current = null
    setShowOverlay(true)
    const timer = setTimeout(() => {
      setShowOverlay(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isProjectRoute, pathname])

  return (
    <>
      {children}
      {showOverlay && !isProjectRoute && (
        <div
          className={clsx(
            'fixed inset-0 z-20 bg-black',
            'p-4 pb-8',
            'flex flex-col gap-[.25em] justify-center items-center text-center',
            'select-none pointer-events-none'
          )}
        >
          <div className="uppercase">Asso (DDD) 2019–</div>
          <div>
            <span className="hidden sm:inline-block">Office for&nbsp;</span>
            Direction, Design and Development
          </div>
          <div>Vita bergen, Stockholm</div>
        </div>
      )}
    </>
  )
}
