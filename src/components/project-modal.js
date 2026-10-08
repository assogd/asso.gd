'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectContent } from './project-content'
import Link from 'next/link'

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

  useEffect(() => {
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const bodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    }
    const htmlOverflow = document.documentElement.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.setAttribute('data-scroll-locked', '')
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      Object.assign(document.body.style, bodyStyles)
      document.documentElement.style.overflow = htmlOverflow
      document.documentElement.removeAttribute('data-scroll-locked')
      window.scrollTo(scrollX, scrollY)
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-30 overflow-y-auto"
      onScroll={(event) => {
        const overlay = event.currentTarget
        const peek =
          parseFloat(getComputedStyle(document.documentElement).fontSize) * 3
        const progress = Math.min(overlay.scrollTop / peek, 1)
        const scale = 0.95 + progress * 0.05
        overlay.style.setProperty('--modal-scale', String(scale))
      }}
      style={{
        '--modal-scale': 0.95,
        backgroundColor: 'rgb(0 0 0 / 100%)'
      }}
    >
      <button
        type="button"
        onClick={close}
        className="block w-full cursor-default uppercase"
        style={{ height: '3rem' }}
        aria-label="Close project dialog"
      >Close</button>
      <div
        className="project-modal-panel relative min-h-dvh bg-black"
      >
        <div className="project-modal-enter">
          <ProjectContent items={items} />
          <footer className="px-4 pt-28 pb-16 text-center grid gap-4">
          <div className="italic">End of page.</div>
        <div>
        Would you like to <button
            type="button"
            onClick={close}
            className="link-underline"
          >
            continue browsing images at the homepage
          </button> or <Link href="/about">read texts about the studio</Link>?
        </div>
      </footer>
        </div>
      </div>

    </div>
  )
}

