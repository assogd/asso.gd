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
      const response = await fetch('/api/arena-status')
      const data = await response.json()
      if (data.cacheInfo?.date) {
        setLastUpdate(new Date(data.cacheInfo.date))
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
    
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (!isVisible) {
    console.log('DevRevalidateButton not visible, returning null')
    return null
  }
  
  console.log('DevRevalidateButton is visible, rendering button')

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Last update time */}
      <div className="bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
        Last update: {formatLastUpdate(lastUpdate)}
      </div>
      
      {/* Revalidate button */}
      <button
        id="dev-revalidate-btn"
        onClick={handleRevalidate}
        disabled={isRevalidating}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
        title="Revalidate Are.na cache"
      >
        {isRevalidating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        )}
      </button>
    </div>
  )
}
