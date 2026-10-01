'use client'

import { useState } from 'react'
import { ArenaImageWall } from './arena-image-wall'
import { StandaloneImageOverlay } from './standalone-image-overlay'

/**
 * Client wrapper around the home feed's image wall. Adds a client-only
 * press-and-hold preview for images that aren't connected to a second
 * Are.na channel; project-connected tiles instead navigate via <Link>
 * (handled inside ArenaImageWall) so they open the project modal.
 */
export function HomeFeed({ items }) {
  const [preview, setPreview] = useState(null)

  function previewImage(item, pointerId = null) {
    setPreview(item ? { item, pointerId } : null)
  }

  function closeOverlay() {
    setPreview(null)
  }

  return (
    <>
      <ArenaImageWall
        items={items}
        onTilePointerDown={previewImage}
        previewActive={Boolean(preview)}
      />
      {preview && (
        <StandaloneImageOverlay
          item={preview.item}
          pointerId={preview.pointerId}
          onClose={closeOverlay}
        />
      )}
    </>
  )
}
