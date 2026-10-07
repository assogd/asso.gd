'use client'

import { useState } from 'react'
import { ArenaImageWall } from './arena-image-wall'
import { StandaloneImageOverlay } from './standalone-image-overlay'

/**
 * Client wrapper around the home feed's image wall. Clicking a tile opens
 * a full-screen image overlay.
 */
export function HomeFeed({ items }) {
  const [preview, setPreview] = useState(null)

  function previewImage(item) {
    setPreview(item ? { item } : null)
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
        <StandaloneImageOverlay item={preview.item} onClose={closeOverlay} />
      )}
    </>
  )
}
