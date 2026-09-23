'use client'

import Image from 'next/image'
import { useEffect } from 'react'

/**
 * Instagram-style lightbox for feed images that aren't connected to a
 * second Are.na channel. This is purely client-side UI state (no URL
 * change, no deep link) - refreshing the page just drops back to the feed.
 */
export function StandaloneImageOverlay({ items, index, onClose, onNavigate }) {
  const item = items[index]

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate(1)
      if (event.key === 'ArrowLeft') onNavigate(-1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNavigate])

  if (!item) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 button-style"
        aria-label="Close"
      >
        Close
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNavigate(-1)
        }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 button-style"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNavigate(1)
        }}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 button-style"
        aria-label="Next image"
      >
        ›
      </button>
      <div
        className="relative h-[80vh] w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.image.url}
          alt={item.image.alt || item.title || 'Asso archive image'}
          fill
          className="object-contain"
          sizes="90vw"
          quality={90}
        />
      </div>
      {item.title && (
        <figcaption className="absolute inset-x-0 bottom-4 text-center">
          {item.title}
        </figcaption>
      )}
    </div>
  )
}
