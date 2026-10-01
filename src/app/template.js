'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

// Set by ProjectModal right before it navigates back, so closing the modal
// doesn't retrigger this intro overlay. Any other navigation (including
// Home <-> About) should still show it, matching the original behavior.
const SKIP_COVER_KEY = 'asso:skip-mega-cover'

export default function Template({ children }) {
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(SKIP_COVER_KEY)) {
      window.sessionStorage.removeItem(SKIP_COVER_KEY)
      setShowOverlay(false)
      return
    }

    const timer = setTimeout(() => {
      setShowOverlay(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {children}
      {showOverlay && (
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
