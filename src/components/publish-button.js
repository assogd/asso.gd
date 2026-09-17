'use client'

import { useState } from 'react'

export function PublishButton() {
  const [status, setStatus] = useState('idle')

  async function handlePublish() {
    setStatus('publishing')

    try {
      const response = await fetch('/api/publish', { method: 'POST' })
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
      className="fixed underline bottom-0 right-0 z-20 p-4 disabled:cursor-wait disabled:opacity-50"
    >
      {status === 'publishing'
        ? 'Publishing...'
        : status === 'published'
          ? 'Published'
          : status === 'error'
            ? 'Publish failed'
            : 'Publish'}
    </button>
  )
}
