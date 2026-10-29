'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

// How far outside the viewport (in viewport heights) an image starts loading.
const PRELOAD_MARGIN = '400% 0px'

/**
 * next/image that starts loading well before it scrolls into view and fades
 * in once loaded, showing a centered "..." until then. `priority` images load immediately and
 * `fade={false}` skips the placeholder and fade.
 */
export function FadeImage({
  priority = false,
  fade = true,
  className,
  alt,
  ...props
}) {
  const imageRef = useRef(null)
  const [near, setNear] = useState(priority)
  const [loaded, setLoaded] = useState(!fade)

  const setRef = useCallback((node) => {
    imageRef.current = node
    // Images that finished loading before hydration never fire onLoad.
    if (node?.complete && node.naturalWidth > 0) setLoaded(true)
  }, [])

  useEffect(() => {
    const node = imageRef.current
    if (near || !node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near])

  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          className="fade-image-placeholder pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          ...
        </span>
      )}
      <Image
        {...props}
        ref={setRef}
        alt={alt}
        priority={priority}
        loading={near ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={clsx(
          className,
          fade && 'fade-image',
          fade && loaded && 'fade-image-loaded'
        )}
      />
    </>
  )
}
