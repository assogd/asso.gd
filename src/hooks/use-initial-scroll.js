'use client'
import { useState, useEffect } from 'react'

const useInitialScroll = () => {
  const [isAtTop, setIsAtTop] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const handleScrollPosition = () => {
      // Only check the scroll position on page load or first render
      if (!hasChecked) {
        if (window.scrollY === 0) {
          setIsAtTop(true)
        } else {
          setIsAtTop(false)
        }
        setHasChecked(true) // Mark that we've checked the scroll position
      }
    }

    handleScrollPosition()

    window.addEventListener('scroll', handleScrollPosition)

    return () => {
      window.removeEventListener('scroll', handleScrollPosition)
    }
  }, [hasChecked])

  return isAtTop
}

export default useInitialScroll
