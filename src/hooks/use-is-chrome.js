'use client'

import { useEffect, useState } from 'react'

export const useIsChrome = () => {
  const [isChrome, setIsChrome] = useState(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = navigator.userAgent
    const isChrome =
      /Chrome/.test(ua) &&
      !/Edg/.test(ua) && // Not Edge
      !/OPR/.test(ua) && // Not Opera
      !/Brave/.test(ua) && // Not Brave
      !/CriOS/.test(ua) // Not Chrome on iOS

    setIsChrome(isChrome)
  }, [])

  return isChrome
}
