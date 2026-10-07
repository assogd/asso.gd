'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const EXIT_MS = 300
const SWIPE_THRESHOLD = 24
const CAPTION_HIDE_MS = 100

export function StandaloneImageOverlay({ item, onClose }) {
  const [exitDirection, setExitDirection] = useState(null)
  const [captionHidden, setCaptionHidden] = useState(false)
  const exitingRef = useRef(false)

  useEffect(() => {
    let touchStartY = null
    let timeout = null
    let captionTimeout = null

    // Slide the overlay out in the direction of the scroll, then close.
    function slideOut(direction) {
      if (exitingRef.current) return
      exitingRef.current = true
      setExitDirection(direction)
      timeout = window.setTimeout(onClose, EXIT_MS)
      captionTimeout = window.setTimeout(
        () => setCaptionHidden(true),
        CAPTION_HIDE_MS
      )
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    function handleWheel(event) {
      if (event.deltaY !== 0) {
        slideOut(event.deltaY < 0 ? 'down' : 'up')
      }
    }

    function handleTouchStart(event) {
      touchStartY = event.touches[0].clientY
    }

    function handleTouchMove(event) {
      if (touchStartY === null) return
      const delta = event.touches[0].clientY - touchStartY
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        // Dragging the finger up scrolls the page down, and vice versa.
        slideOut(delta < 0 ? 'up' : 'down')
        touchStartY = null
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      document.body.style.overflow = overflow
      window.clearTimeout(timeout)
      window.clearTimeout(captionTimeout)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [onClose])

  if (!item) {
    return null
  }

  return (
    <>
      <div
        role="dialog"
        aria-label="Enlarged image. Click anywhere or scroll to close."
        onClick={onClose}
        style={{
          transform:
            exitDirection === 'up'
              ? 'translateY(-100%)'
              : exitDirection === 'down'
                ? 'translateY(100%)'
                : 'none',
          transition: `transform ${EXIT_MS}ms ease-in`
        }}
        className="fixed inset-0 touch-none overscroll-contain z-30 flex cursor-zoom-out select-none items-center justify-center bg-black/95"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      >
        <Image
          src={item.image.url}
          alt=""
          fill
          draggable={false}
          className="select-none object-contain p-4 pb-16"
          sizes="90vw"
          quality={90}
        />
      </div>
      {/* Sits outside the sliding overlay so it stays put until it is hidden. */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-center justify-center px-2 text-center"
        style={{
          height: '4rem',
          visibility: captionHidden ? 'hidden' : 'visible'
        }}
      >
        {item.title || 'Untitled'}
      </div>
    </>
  )
}
