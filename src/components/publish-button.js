'use client'

import { useState } from 'react'

export function PublishButton({ isLocalhost = false }) {
  const [status, setStatus] = useState('idle')

  async function handlePublish() {
    setStatus('publishing')

    try {
      const endpoint = isLocalhost
        ? '/api/revalidate-arena?path=/&tag=arena-data'
        : '/api/publish'
      const response = await fetch(endpoint, {
        method: isLocalhost ? 'GET' : 'POST'
      })
      if (!response.ok) {
        throw new Error('Publishing failed')
      }
      setStatus('published')
    } catch (error) {
      console.error('Failed to publish preview:', error)
      setStatus('error')
    }
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={status === 'publishing'}
      className="fixed bottom-0 right-0 z-20 p-4 disabled:cursor-wait disabled:opacity-50"
    >
      {status === 'publishing'
        ? 'Publishing...'
        : status === 'published'
          ? 'Published'
          : status === 'error'
            ? `${isLocalhost ? 'Revalidate' : 'Publish'} failed`
            : isLocalhost
              ? 'Revalidate'
              : 'Publish'}
    </button>
  )
}
