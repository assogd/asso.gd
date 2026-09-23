'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArenaImageWall } from './arena-image-wall'

/**
 * Overlay rendered by the intercepted (.)project/[slug] route: shows the
 * connected project's images on top of the feed without a full navigation.
 * Closing goes back to wherever the user came from (usually the home feed).
 */
export function ProjectModal({ title, items }) {
  const router = useRouter()

  function close() {
    router.back()
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-30 overflow-y-auto bg-black"
      onClick={close}
    >
      <button
        type="button"
        onClick={close}
        className="fixed right-4 top-4 z-10 button-style"
        aria-label="Close"
      >
        Close
      </button>
      <div onClick={(event) => event.stopPropagation()}>
        <h1 className="p-4 pt-24 text-center">{title}</h1>
        <ArenaImageWall items={items} loop={false} />
      </div>
    </div>
  )
}
