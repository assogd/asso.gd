'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const GATED_IMAGE_COUNT = 2
// Reveal anyway if the first images are slow, so the page never stays blank.
const MAX_WAIT_MS = 4000

/**
 * Keeps its children hidden (but laid out, so the priority images still
 * load) until the first images have loaded, then reveals them. `coverClassName`
 * styles the "..." overlay (e.g. an opaque background) and `revealedClassName`
 * is applied on reveal, e.g. to start an enter animation at that moment.
 */
export function ProjectRevealGate({
  children,
  revealedClassName,
  coverClassName
}) {
  const containerRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const images = Array.from(
      containerRef.current?.querySelectorAll('img') ?? []
    ).slice(0, GATED_IMAGE_COUNT)

    let pending = images.length
    const cleanups = []
    const reveal = () => setRevealed(true)
    const timeout = window.setTimeout(reveal, MAX_WAIT_MS)

    if (pending === 0) {
      reveal()
    }

    images.forEach((image) => {
      if (image.complete) {
        if (--pending === 0) reveal()
        return
      }

      const done = () => {
        if (--pending === 0) reveal()
      }
      image.addEventListener('load', done, { once: true })
      image.addEventListener('error', done, { once: true })
      cleanups.push(() => {
        image.removeEventListener('load', done)
        image.removeEventListener('error', done)
      })
    })

    return () => {
      window.clearTimeout(timeout)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <>
      {!revealed && (
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none fixed inset-0 z-30 flex items-center justify-center',
            coverClassName
          )}
        >
          ...
        </div>
      )}
      <div
        ref={containerRef}
        className={clsx(revealed ? revealedClassName : 'invisible')}
      >
        {children}
      </div>
    </>
  )
}
