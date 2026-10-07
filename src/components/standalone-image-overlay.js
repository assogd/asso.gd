'use client'

import Image from 'next/image'
import { Caption } from './caption'
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

  const slideStyle = {
    transform:
      exitDirection === 'up'
        ? 'translateY(-100%)'
        : exitDirection === 'down'
          ? 'translateY(100%)'
          : 'none',
    transition: `transform ${EXIT_MS}ms ease-in`
  }

  return (
    <div
      role="dialog"
      aria-label="Enlarged image. Click anywhere or scroll to close."
      onClick={onClose}
      className="fixed inset-0 z-30 flex touch-none cursor-zoom-out select-none flex-col overscroll-contain"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="absolute inset-0 bg-black/95" style={slideStyle} />
      <div className="relative flex-1" style={slideStyle}>
        <Image
          src={item.image.url}
          alt=""
          fill
          draggable={false}
          className="select-none object-contain p-4"
          sizes="90vw"
          quality={90}
        />
      </div>
      {/* Stays put while the backdrop and image slide away. */}
      <div
        className="relative px-2 pb-4 text-center"
        style={{ visibility: captionHidden ? 'hidden' : 'visible' }}
      >
        <Caption onLinkClick={onClose}>{item.caption}</Caption>
      </div>
    </div>
  )
}
