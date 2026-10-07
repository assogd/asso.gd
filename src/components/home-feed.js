'use client'

import { useState } from 'react'
import { ArenaImageWall } from './arena-image-wall'
import { StandaloneImageOverlay } from './standalone-image-overlay'

/**
 * Client wrapper around the home feed's image wall. Adds a client-only
 * click-to-open preview for images that don't link to a project; tiles
 * linking to a project (via a Markdown link in their Are.na description)
 * instead navigate via <Link>
 * (handled inside ArenaImageWall) so they open the project modal.
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
