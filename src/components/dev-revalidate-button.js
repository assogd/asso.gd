'use client'
import { useState, useEffect } from 'react'

export function DevRevalidateButton() {
  console.log('DevRevalidateButton component rendered!')
  const [isRevalidating, setIsRevalidating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  // Only show in development mode
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development'
    console.log('Dev button visibility:', isDev, 'NODE_ENV:', process.env.NODE_ENV)
    // Always show for now to test
    setIsVisible(true)
  }, [])

  // Fetch last update time on mount
  useEffect(() => {
    if (isVisible) {
      fetchLastUpdate()
    }
  }, [isVisible])

  const fetchLastUpdate = async () => {
    try {
      // Get cached data to check the _fetchedAt timestamp
      const response = await fetch('/api/arena?action=channel&channel=adddgd-about', {
        cache: 'force-cache' // Use cached data, don't trigger new fetch
      })
      const data = await response.json()
      if (data._fetchedAt) {
        setLastUpdate(new Date(data._fetchedAt))
      }
    } catch (error) {
      console.error('Failed to fetch last update:', error)
    }
  }

  const handleRevalidate = async () => {
    setIsRevalidating(true)
    try {
      const response = await fetch('/api/revalidate-arena?path=/arena&tag=arena-data', {
        method: 'GET'
      })
      const data = await response.json()
      
      if (data.revalidated) {
        // Update the last update time
        setLastUpdate(new Date(data.timestamp))
        
        // Show success feedback
        const button = document.getElementById('dev-revalidate-btn')
        if (button) {
          button.style.backgroundColor = '#10b981' // green
          setTimeout(() => {
            button.style.backgroundColor = '#3b82f6' // blue
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Revalidation failed:', error)
      // Show error feedback
      const button = document.getElementById('dev-revalidate-btn')
      if (button) {
        button.style.backgroundColor = '#ef4444' // red
        setTimeout(() => {
          button.style.backgroundColor = '#3b82f6' // blue
        }, 1000)
      }
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
