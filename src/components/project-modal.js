'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectContent } from './project-content'

// Must match the key template.js checks for.
const SKIP_COVER_KEY = 'asso:skip-mega-cover'

/**
 * Overlay rendered by the intercepted (.)project/[slug] route: shows the
 * connected project's images on top of the feed without a full navigation.
 * Closing goes back to wherever the user came from (usually the home feed).
 */
export function ProjectModal({ title, items }) {
  const router = useRouter()

  function close() {
    // Closing this modal returns to the home feed - suppress the intro
    // cover overlay from flashing again on that return.
    window.sessionStorage.setItem(SKIP_COVER_KEY, '1')
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
      <div onClick={(event) => event.stopPropagation()} className="m-8 bg-red">
        <ProjectContent items={items} />
      </div>
    </div>
  )
}
