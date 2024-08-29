'use client'
import { useState, useEffect } from 'react'

const useIdleTimer = (timeout = 3000) => {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    let timer

    const handleInteraction = () => {
      setIsIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => {
        setIsIdle(true)
      }, timeout)
    }

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    window.addEventListener('touchmove', handleInteraction)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('touchmove', handleInteraction)
    }
  }, [timeout])

  return isIdle
}

export default useIdleTimer
