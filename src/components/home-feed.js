'use client'

import { useState } from 'react'
import { ArenaImageWall } from './arena-image-wall'
import { StandaloneImageOverlay } from './standalone-image-overlay'

/**
 * Client wrapper around the home feed's image wall. Adds a client-only
 * lightbox for images that aren't connected to a second Are.na channel;
 * project-connected tiles instead navigate via <Link> (handled inside
 * ArenaImageWall) so they open the intercepted /project/[slug] modal.
 */
export function HomeFeed({ items }) {
  const [overlayIndex, setOverlayIndex] = useState(null)

  function openOverlay(item) {
    const index = items.findIndex((candidate) => candidate.id === item.id)
    if (index !== -1) {
      setOverlayIndex(index)
    }
  }

  function closeOverlay() {
    setOverlayIndex(null)
  }

  // Prev/next only cycles through standalone images for now - crossing into
  // a project-connected image while inside the lightbox is an open UX
  // question, so those are skipped rather than left in a half-navigated state.
  function navigate(direction) {
    setOverlayIndex((current) => {
      if (current === null || items.length === 0) return current

      let next = current
      for (let step = 0; step < items.length; step++) {
        next = (next + direction + items.length) % items.length
        if (!items[next].project) {
          return next
        }
      }
      return current
    })
  }

  return (
    <>
      <ArenaImageWall items={items} onTileClick={openOverlay} />
      {overlayIndex !== null && (
        <StandaloneImageOverlay
          items={items}
          index={overlayIndex}
          onClose={closeOverlay}
          onNavigate={navigate}
        />
      )}
    </>
  )
}
