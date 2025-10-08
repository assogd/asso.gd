'use client'
import { useState, useEffect } from 'react'

export function DevRevalidateButton() {
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isRevalidating, setIsRevalidating] = useState(false)

  useEffect(() => {
    // Get timestamp from the existing page data (already server-side rendered)
    const timestampElement = document.querySelector('[data-fetched-at]')
    if (timestampElement) {
      const timestamp = timestampElement.getAttribute('data-fetched-at')
      if (timestamp) {
        setLastUpdate(new Date(timestamp))
      }
    }
  }, [])


  const handleRevalidate = async () => {
    setIsRevalidating(true)
    try {
      const res = await fetch('/api/revalidate-arena?path=/arena&tag=arena-data')
      const data = await res.json()
      if (data.revalidated) setLastUpdate(new Date(data.timestamp))
    } finally {
      setIsRevalidating(false)
    }
  }

  const formatLastUpdate = (date) => {
    if (!date) return 'Never'
    
    // Format as exact date and time
    return date.toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="items-center justify-center flex flex-col gap-x-2 gap-y-1 py-16">
      <div className="">
        Last updated: {formatLastUpdate(lastUpdate)}
      </div>
      <button
        id="dev-revalidate-btn"
        onClick={handleRevalidate}
        disabled={isRevalidating}
        className=""
        title="Revalidate Are.na cache"
      >
        {isRevalidating ? (
          "Revalidating..."
        ) : (
          <span>[Revalidate]</span>
        )}
      </button>

    </div>
  )
}
