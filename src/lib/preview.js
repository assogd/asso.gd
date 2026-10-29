import { connection } from 'next/server'

export const isPreviewMode = process.env.PREVIEW_MODE === 'true'

// The Publish button is shown in preview (unless hidden) and on localhost;
// the localhost part is decided client-side so pages stay cacheable.
export const showPublishInPreview =
  isPreviewMode && process.env.HIDE_PUBLISH_BUTTON !== 'true'

/**
 * Preview renders every request fresh; otherwise pages are cached until
 * the revalidate endpoint is called.
 */
export async function renderFreshInPreview() {
  if (isPreviewMode) {
    await connection()
  }
}
