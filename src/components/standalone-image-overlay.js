'use client'

import Image from 'next/image'
import { useEffect } from 'react'

export function StandaloneImageOverlay({ item, pointerId, onClose }) {
  useEffect(() => {
    function handlePointerEnd(event) {
      if (event.pointerId === pointerId) {
        onClose()
      }
    }

    function handleKeyUp(event) {
      if (pointerId === null && (event.key === 'Enter' || event.key === ' ')) {
        onClose()
      }
    }

    window.addEventListener('pointerup', handlePointerEnd)
    window.addEventListener('pointercancel', handlePointerEnd)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', onClose)

    return () => {
      window.removeEventListener('pointerup', handlePointerEnd)
      window.removeEventListener('pointercancel', handlePointerEnd)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose, pointerId])

  if (!item) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 flex select-none items-center justify-center bg-black/95"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
        <Image
          src={item.image.url}
          alt=""
          fill
          draggable={false}
          className="select-none object-contain"
          sizes="90vw"
          quality={90}
        />
    </div>
  )
}
