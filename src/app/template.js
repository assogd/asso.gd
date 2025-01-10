'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useFirstImageLoaded } from '@/hooks/use-first-image-loaded'

export default function Template({ children }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { isFirstImageLoaded } = useFirstImageLoaded()
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    if (pathname === '/about' && theme !== 'light') {
      setTheme('light')
    }

    // Minimum display time for overlay (1 second)
    const minDisplayTime = setTimeout(() => {
      if (pathname === '/') {
        // On `/`, also wait for `isFirstImageLoaded` to become true
        if (isFirstImageLoaded) {
          setShowOverlay(false)
        }
      } else {
        // On other routes, hide overlay after 1 second
        setShowOverlay(false)
      }
    }, 1000)

    // Handle delayed image loading on `/`
    if (pathname === '/' && isFirstImageLoaded) {
      const delayedHide = setTimeout(() => setShowOverlay(false), 1000)
      return () => clearTimeout(delayedHide)
    }

    return () => clearTimeout(minDisplayTime)
  }, [pathname, isFirstImageLoaded, theme, setTheme])

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className={clsx(
            'fixed inset-0 flex flex-col gap-[.25em] justify-center items-center select-none pointer-events-none z-20 p-4 pb-8 text-center transition-opacity duration-300',
            !showOverlay && 'opacity-0'
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

      {/* Main Content */}
      <div
        className={clsx(
          showOverlay && 'opacity-0',
          'transition-opacity duration-300'
        )}
      >
        {children}
      </div>
    </>
  )
}
