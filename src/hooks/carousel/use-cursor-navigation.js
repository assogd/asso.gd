'use client'
import { useRef, useEffect, useState } from 'react'
import { useMedia } from 'use-media'

/**
 * Simplified cursor navigation hook for carousel
 * Handles mouse cursor changes and click-based navigation
 */
export const useCursorNavigation = (onPrev, onNext) => {
  const containerRef = useRef(null)
  const [isCursorEnabled, setIsCursorEnabled] = useState(false)
  const isTouchDevice = useMedia({ pointer: 'coarse' })

  // Enable cursor after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCursorEnabled(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleMouseDown = () => {
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default'
    }
  }

  const handleMouseUp = (e) => {
    // Ignore clicks on links or buttons
    if (
      e.target.tagName === 'A' ||
      e.target.closest('a') ||
      e.target.closest('button')
    ) {
      return
    }

    const screenWidth = window.innerWidth
    const clickX = e.clientX

    // Navigate based on click position
    if (clickX < screenWidth / 2) {
      onPrev()
    } else {
      onNext()
    }

    // Restore cursor after click
    if (containerRef.current && isCursorEnabled && !isTouchDevice) {
      containerRef.current.style.cursor =
        clickX < screenWidth / 2 ? 'w-resize' : 'e-resize'
    }
  }

  const handleTouchStart = (e) => {
    // Store initial touch position
    e.target.dataset.startTouchX = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    // Ignore touches on links or buttons
    if (
      e.target.tagName === 'A' ||
      e.target.closest('a') ||
      e.target.closest('button')
    ) {
      return
    }

    const touchX = e.changedTouches[0].clientX
    const screenWidth = window.innerWidth

    // Navigate based on touch position
    if (touchX < screenWidth / 2) {
      onPrev()
    } else {
      onNext()
    }
  }

  // Attach mouse move listener
  useEffect(() => {
    if (!isTouchDevice && containerRef.current && isCursorEnabled) {
      const container = containerRef.current
      const mouseMoveHandler = (e) => {
        if (!container || !isCursorEnabled) {
          return
        }

        const screenWidth = window.innerWidth
        const mouseX = e.clientX

        // Update cursor based on mouse position
        container.style.cursor =
          mouseX < screenWidth / 2 ? 'w-resize' : 'e-resize'
      }

      container.addEventListener('mousemove', mouseMoveHandler)

      return () => {
        container.removeEventListener('mousemove', mouseMoveHandler)
      }
    }
  }, [isTouchDevice, isCursorEnabled])

  return {
    containerRef,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchEnd
  }
}
